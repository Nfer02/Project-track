import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { getAnthropicClient, isSupportedMimeType } from "@/lib/anthropic"

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const BUCKET = "invoice-files"

type OcrData = {
  invoiceNumber?: string
  issueDate?: string
  dueDate?: string
  amount?: number
  currency?: string
  description?: string
  vendorName?: string
  clientName?: string
  notes?: string
  rawText?: string
  error?: string
}

async function extractWithClaude(
  buffer: Buffer,
  mimeType: string
): Promise<OcrData> {
  try {
    const base64 = buffer.toString("base64")

    // Construir el bloque de contenido según el tipo de archivo
    const contentBlock =
      mimeType === "application/pdf"
        ? {
            type: "document" as const,
            source: {
              type: "base64" as const,
              media_type: "application/pdf" as const,
              data: base64,
            },
          }
        : {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: mimeType as
                | "image/jpeg"
                | "image/png"
                | "image/webp"
                | "image/gif",
              data: base64,
            },
          }

    const message = await getAnthropicClient().messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: `Analiza este documento de factura y extrae la siguiente información en formato JSON.
Si no encontrás algún dato, usá null para ese campo.

Responde ÚNICAMENTE con el JSON, sin texto adicional ni bloques de código:

{
  "invoiceNumber": "número de factura o null",
  "issueDate": "fecha de emisión en formato YYYY-MM-DD o null",
  "dueDate": "fecha de vencimiento en formato YYYY-MM-DD o null",
  "amount": número total como float o null,
  "currency": "código de moneda de 3 letras (USD, EUR, ARS, etc.) o null",
  "description": "descripción principal del servicio o bien o null",
  "vendorName": "nombre del emisor/proveedor o null",
  "clientName": "nombre del cliente/receptor o null",
  "notes": "cualquier nota o condición de pago relevante o null"
}`,
            },
          ],
        },
      ],
    })

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : ""

    // Limpiar posibles bloques de código markdown
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    const parsed = JSON.parse(cleaned) as OcrData
    return parsed
  } catch (err) {
    console.error("[OCR] Error de Claude:", err)
    return { error: "No se pudo extraer la información del documento." }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params

    // Autenticación
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la factura pertenece al workspace del usuario
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        workspace: {
          members: {
            some: { userId: user.id, acceptedAt: { not: null } },
          },
        },
      },
      select: { id: true, workspaceId: true, project: { select: { workspaceId: true } } },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      )
    }

    // Leer el archivo del FormData
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      )
    }

    if (!isSupportedMimeType(file.type)) {
      return NextResponse.json(
        {
          error: `Tipo de archivo no soportado. Usa: PDF, JPEG, PNG o WEBP.`,
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 10 MB" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split(".").pop() ?? "bin"
    const storagePath = `${invoice.workspaceId}/${invoiceId}/${Date.now()}.${ext}`

    // Subir a Supabase Storage (el bucket debe existir y tener RLS apropiado)
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("[Storage] Error al subir:", uploadError)
      // Continuar igualmente — el OCR puede funcionar sin storage
    }

    // OCR con Claude
    const ocrData = await extractWithClaude(buffer, file.type)

    // Guardar registro en DB
    const invoiceFile = await prisma.invoiceFile.create({
      data: {
        invoiceId,
        storagePath: uploadError ? "" : storagePath,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        ocrData: ocrData as object,
      },
    })

    return NextResponse.json({
      id: invoiceFile.id,
      filename: invoiceFile.filename,
      ocrData,
    })
  } catch (err) {
    console.error("[Upload] Error:", err)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const files = await prisma.invoiceFile.findMany({
      where: {
        invoiceId,
        invoice: {
          workspace: {
            members: { some: { userId: user.id, acceptedAt: { not: null } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(files)
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
