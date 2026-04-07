import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAILS = ["nelsonfernandez1002@gmail.com"]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    }

    // Update waitlist entry
    const entry = await prisma.waitlist.findUnique({ where: { email } })
    if (!entry) {
      return NextResponse.json({ error: "Email no encontrado en la waitlist" }, { status: 404 })
    }

    await prisma.waitlist.update({
      where: { email },
      data: { invited: true, invitedAt: new Date() },
    })

    // Send invitation email
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "ProjectTrack <hola@projecttrack.app>",
        replyTo: "nelsonfernandez1002@gmail.com",
        to: email,
        subject: "Tu acceso a ProjectTrack está listo",
        html: `
          <div style="max-width:500px;margin:0 auto;font-family:system-ui,-apple-system,sans-serif;color:#f9fafb;background-color:#0f172a;padding:40px 30px;border-radius:12px;">
            <div style="text-align:center;margin-bottom:30px;">
              <span style="display:inline-block;background-color:#3b82f6;color:white;font-weight:bold;font-size:14px;padding:6px 12px;border-radius:6px;">PT</span>
              <span style="font-size:18px;font-weight:bold;margin-left:8px;color:white;">ProjectTrack</span>
            </div>
            <h2 style="color:white;font-size:20px;margin-bottom:10px;text-align:center;">Tu acceso esta listo</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;text-align:center;">
              Te hemos seleccionado para probar ProjectTrack en su fase beta. Gestiona tus proyectos, controla ingresos y gastos, y ten una estimacion orientativa de tus obligaciones fiscales.
            </p>
            <div style="text-align:center;margin:30px 0;">
              <a href="https://projecttrack.app/register?email=${encodeURIComponent(email)}" style="display:inline-block;background-color:#3b82f6;color:white;font-weight:600;font-size:14px;padding:12px 32px;border-radius:50px;text-decoration:none;">
                Crear mi cuenta
              </a>
            </div>
            <div style="background-color:#1e293b;border-radius:8px;padding:16px;margin:20px 0;">
              <p style="color:#e2e8f0;font-size:13px;margin:0 0 8px 0;font-weight:600;">Que puedes hacer?</p>
              <ul style="color:#94a3b8;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
                <li>Organizar tus proyectos con presupuesto y cliente</li>
                <li>Registrar ingresos y gastos por proyecto</li>
                <li>Escanear tickets con IA (el OCR extrae los datos)</li>
                <li>Ver tu dashboard financiero con graficos</li>
                <li>Obtener una estimacion orientativa de IVA e IRPF</li>
              </ul>
            </div>
            <p style="color:#94a3b8;font-size:13px;line-height:1.6;text-align:center;">
              Tu cuenta empieza en el plan gratuito. Si despues de la prueba quieres continuar, puedes cambiar tu contrasena y seguir usando el mismo usuario. Es tuyo!
            </p>
            <p style="color:#64748b;font-size:12px;text-align:center;margin-top:20px;">
              Dentro de la app encontraras un boton de "Dar feedback". Tu opinion nos ayuda a mejorar.
            </p>
            <hr style="border:none;border-top:1px solid #1e293b;margin:25px 0;" />
            <p style="color:#475569;font-size:11px;text-align:center;">
              ProjectTrack — Gestion de proyectos y control financiero<br/>
              <a href="https://projecttrack.app" style="color:#3b82f6;text-decoration:none;">projecttrack.app</a>
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error("[Waitlist Invite] Email error:", emailErr)
      return NextResponse.json({ message: "Invitado pero no se pudo enviar el email" }, { status: 207 })
    }

    return NextResponse.json({ message: "Invitacion enviada" })
  } catch (err) {
    console.error("[Waitlist Invite] Error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
