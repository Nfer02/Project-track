import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 })
    }

    const { email, name, source } = parsed.data

    // Check if already registered
    const existing = await prisma.waitlist.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: "Ya estás en la lista" })
    }

    await prisma.waitlist.create({
      data: { email, name, source: source ?? "landing" },
    })

    return NextResponse.json({ message: "Te has registrado correctamente" })
  } catch (err) {
    console.error("[Waitlist] Error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
