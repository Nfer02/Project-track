import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  easeOfUse: z.number().min(1).max(5),
  usefulFeatures: z.string(),
  improvements: z.string().optional(),
  wouldRecommend: z.enum(["yes", "no", "maybe"]),
  comments: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 })
    }

    await prisma.betaFeedback.create({
      data: {
        userId: user?.id ?? null,
        email: parsed.data.email,
        easeOfUse: parsed.data.easeOfUse,
        usefulFeatures: parsed.data.usefulFeatures,
        improvements: parsed.data.improvements || null,
        wouldRecommend: parsed.data.wouldRecommend,
        comments: parsed.data.comments || null,
      },
    })

    return NextResponse.json({ message: "Feedback guardado" })
  } catch (err) {
    console.error("[Feedback] Error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
