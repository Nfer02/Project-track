import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const ADMIN_EMAILS = ["nelsonfernandez1002@gmail.com"]

const schema = z.object({
  ticketId: z.string().min(1),
  response: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const { ticketId, response } = parsed.data

    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } })
    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 })
    }

    // Actualizar ticket
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        response,
        status: "resolved",
        respondedAt: new Date(),
      },
    })

    // Enviar email de respuesta al usuario
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "ProjectTrack Soporte <soporte@projecttrack.app>",
        replyTo: "nelsonfernandez1002@gmail.com",
        to: ticket.email,
        subject: `Re: ${ticket.subject} — ProjectTrack`,
        html: `
          <div style="max-width:500px;margin:0 auto;font-family:system-ui,-apple-system,sans-serif;color:#f9fafb;background-color:#0f172a;padding:40px 30px;border-radius:12px;">
            <div style="text-align:center;margin-bottom:30px;">
              <span style="display:inline-block;background-color:#3b82f6;color:white;font-weight:bold;font-size:14px;padding:6px 12px;border-radius:6px;">PT</span>
              <span style="font-size:18px;font-weight:bold;margin-left:8px;color:white;">ProjectTrack</span>
            </div>
            <h2 style="color:white;font-size:18px;margin-bottom:10px;">Respuesta a tu consulta</h2>
            <p style="color:#94a3b8;font-size:13px;margin-bottom:5px;"><strong>Tu consulta:</strong> ${ticket.subject}</p>
            <hr style="border:none;border-top:1px solid #1e293b;margin:15px 0;" />
            <div style="color:#e2e8f0;font-size:14px;line-height:1.7;">
              ${response.replace(/\n/g, "<br/>")}
            </div>
            <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
            <p style="color:#64748b;font-size:12px;text-align:center;">
              Si necesitas más ayuda, abre un nuevo ticket desde la aplicación.<br/>
              <a href="https://projecttrack.app/support" style="color:#3b82f6;text-decoration:none;">Ir a soporte</a>
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error("[Support Reply] Error sending email:", emailErr)
      return NextResponse.json({ error: "Ticket actualizado pero no se pudo enviar el email" }, { status: 207 })
    }

    return NextResponse.json({ message: "Respuesta enviada" })
  } catch (err) {
    console.error("[Support Reply] Error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
