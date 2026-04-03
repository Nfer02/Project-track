import { NextRequest, NextResponse } from "next/server"
import { stripe, isActiveStripeStatus } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

// Necesitamos el raw body para verificar la firma de Stripe
export const dynamic = "force-dynamic"

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const workspaceId = session.metadata?.workspaceId
  if (!workspaceId || !session.subscription) return

  const stripeSubId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription.id

  const sub = await stripe.subscriptions.retrieve(stripeSubId)

  await prisma.$transaction([
    prisma.subscription.update({
      where: { workspaceId },
      data: {
        stripeSubId,
        stripePriceId: sub.items.data[0]?.price.id ?? null,
        status: isActiveStripeStatus(sub.status) ? "ACTIVE" : "INACTIVE",
        currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
      },
    }),
    prisma.workspace.update({
      where: { id: workspaceId },
      data: { plan: "PRO" },
    }),
  ])
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const existing = await prisma.subscription.findFirst({
    where: { stripeSubId: sub.id },
  })
  if (!existing) return

  const isActive = isActiveStripeStatus(sub.status)
  const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end

  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: existing.id },
      data: {
        status: isActive ? "ACTIVE" : sub.status === "past_due" ? "PAST_DUE" : "INACTIVE",
        stripePriceId: sub.items.data[0]?.price.id ?? null,
        currentPeriodEnd: new Date(periodEnd * 1000),
      },
    }),
    // Si no está activa, bajar a FREE
    ...(isActive
      ? []
      : [
          prisma.workspace.update({
            where: { id: existing.workspaceId },
            data: { plan: "FREE" },
          }),
        ]),
  ])
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const existing = await prisma.subscription.findFirst({
    where: { stripeSubId: sub.id },
  })
  if (!existing) return

  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: existing.id },
      data: { status: "CANCELLED", stripeSubId: null },
    }),
    prisma.workspace.update({
      where: { id: existing.workspaceId },
      data: { plan: "FREE" },
    }),
  ])
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error("[Webhook] Firma inválida:", err)
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        // En Stripe v21 la suscripción está en invoice.parent.subscription_details.subscription
        const subRef = invoice.parent?.subscription_details?.subscription
        if (subRef) {
          const stripeSubId = typeof subRef === "string" ? subRef : subRef.id
          await prisma.subscription.updateMany({
            where: { stripeSubId },
            data: { status: "PAST_DUE" },
          })
        }
        break
      }

      default:
        // Evento no manejado — OK
        break
    }
  } catch (err) {
    console.error(`[Webhook] Error procesando ${event.type}:`, err)
    return NextResponse.json({ error: "Error al procesar el evento" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
