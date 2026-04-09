import { NextRequest, NextResponse } from "next/server"
import { EMAIL_LOGO_SVG } from "@/lib/email/logo-svg"
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

    const { subject, body } = await request.json()
    if (!subject || !body) {
      return NextResponse.json({ error: "Asunto y mensaje son obligatorios" }, { status: 400 })
    }

    const waitlist = await prisma.waitlist.findMany()
    if (waitlist.length === 0) {
      return NextResponse.json({ error: "No hay registros en la waitlist" }, { status: 400 })
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    let sent = 0
    let failed = 0

    for (const entry of waitlist) {
      try {
        await resend.emails.send({
          from: "ProjectTrack <hola@projecttrack.app>",
          replyTo: "nelsonfernandez1002@gmail.com",
          to: entry.email,
          subject,
          html: `
            <div style="max-width:500px;margin:0 auto;font-family:system-ui,-apple-system,sans-serif;color:#f9fafb;background-color:#0f172a;padding:40px 30px;border-radius:12px;">
              <div style="text-align:center;margin-bottom:30px;">
                ${EMAIL_LOGO_SVG}
                <span style="font-size:18px;font-weight:bold;margin-left:8px;color:white;">ProjectTrack</span>
              </div>
              <div style="color:#e2e8f0;font-size:14px;line-height:1.7;">
                ${body.replace(/\n/g, "<br/>")}
              </div>
              <hr style="border:none;border-top:1px solid #1e293b;margin:30px 0;" />
              <p style="color:#475569;font-size:11px;text-align:center;">
                ProjectTrack — Gestión de proyectos y control financiero<br/>
                <a href="https://projecttrack.app" style="color:#3b82f6;text-decoration:none;">projecttrack.app</a>
              </p>
            </div>
          `,
        })
        sent++
      } catch {
        failed++
      }
    }

    return NextResponse.json({ message: `Enviados: ${sent}, Fallidos: ${failed}` })
  } catch (err) {
    console.error("[Waitlist Send] Error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
