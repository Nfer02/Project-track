import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  category: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const { email, name, category, subject, message } = parsed.data

    await prisma.supportTicket.create({
      data: {
        userId: user?.id ?? null,
        email,
        name: name || null,
        category,
        subject,
        message,
      },
    })

    // Enviar email de notificación al admin
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "ProjectTrack <noreply@projecttrack.app>",
        to: "nelsonfernandez1002@gmail.com",
        subject: `[Soporte] ${category}: ${subject}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:500px;">
            <h2 style="color:#3b82f6;">Nuevo ticket de soporte</h2>
            <p><strong>De:</strong> ${name || "Sin nombre"} (${email})</p>
            <p><strong>Categoría:</strong> ${category}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
            <p>${message.replace(/\n/g, "<br/>")}</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
            <p style="color:#94a3b8;font-size:12px;">Responde desde el panel de admin: <a href="https://projecttrack.app/admin">projecttrack.app/admin</a></p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error("[Support] Error sending notification:", emailErr)
    }

    return NextResponse.json({ message: "Ticket creado" })
  } catch (err) {
    console.error("[Support] Error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
