import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { getCurrentWorkspace } from "@/lib/workspace"

export async function POST(_request: NextRequest) {
  try {
    const ctx = await getCurrentWorkspace()
    if (!ctx) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { workspaceId: ctx.workspace.id },
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No tenés una suscripción activa" },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${baseUrl}/settings/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    console.error("[Stripe Portal] Error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
