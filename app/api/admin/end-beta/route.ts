import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAILS = ["nelsonfernandez1002@gmail.com"]

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Buscar beta testers: usuarios cuyo email está en waitlist como invitado
    // y cuyo workspace tiene plan PRO (sin suscripción de Stripe activa)
    const betaTesters = await prisma.waitlist.findMany({
      where: { invited: true },
      select: { email: true },
    })

    if (betaTesters.length === 0) {
      return NextResponse.json({ error: "No hay beta testers invitados" }, { status: 400 })
    }

    const betaEmails = betaTesters.map((bt) => bt.email)

    // Buscar workspaces PRO de beta testers que NO tengan suscripción Stripe activa
    const workspacesToDowngrade = await prisma.workspace.findMany({
      where: {
        plan: "PRO",
        members: {
          some: {
            role: "OWNER",
            user: { email: { in: betaEmails } },
          },
        },
        subscription: {
          OR: [
            { status: { not: "ACTIVE" } },
            { stripeSubId: null },
          ],
        },
      },
      select: { id: true, name: true },
    })

    if (workspacesToDowngrade.length === 0) {
      return NextResponse.json({
        message: "No hay workspaces de beta testers para cambiar a FREE",
        changed: 0,
      })
    }

    // Cambiar a FREE
    await prisma.workspace.updateMany({
      where: { id: { in: workspacesToDowngrade.map((w) => w.id) } },
      data: { plan: "FREE" },
    })

    return NextResponse.json({
      message: `${workspacesToDowngrade.length} workspace(s) cambiados a FREE`,
      changed: workspacesToDowngrade.length,
      workspaces: workspacesToDowngrade.map((w) => w.name),
    })
  } catch (err) {
    console.error("[Admin End Beta] Error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
