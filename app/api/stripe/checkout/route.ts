import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { stripe, PRO_PRICE_ID } from "@/lib/stripe"
import { getCurrentWorkspace } from "@/lib/workspace"

export async function POST(_request: NextRequest) {
  try {
    const ctx = await getCurrentWorkspace()
    if (!ctx) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { workspace } = ctx

    // Si ya es PRO, redirigir al portal
    if (workspace.plan === "PRO") {
      return NextResponse.json({ error: "Ya tenés el plan PRO" }, { status: 400 })
    }

    // Obtener o crear customer de Stripe
    let subscription = await prisma.subscription.findUnique({
      where: { workspaceId: workspace.id },
    })

    let customerId = subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: workspace.name,
        metadata: {
          workspaceId: workspace.id,
          userId: user.id,
        },
      })
      customerId = customer.id

      // Crear o actualizar subscription record
      subscription = await prisma.subscription.upsert({
        where: { workspaceId: workspace.id },
        update: { stripeCustomerId: customerId },
        create: {
          workspaceId: workspace.id,
          stripeCustomerId: customerId,
          status: "INACTIVE",
        },
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    // Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/settings/billing?success=1`,
      cancel_url: `${baseUrl}/settings/billing?cancelled=1`,
      allow_promotion_codes: true,
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Suscripcion ProjectTrack PRO",
        },
      },
      metadata: {
        workspaceId: workspace.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[Stripe Checkout] Error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
