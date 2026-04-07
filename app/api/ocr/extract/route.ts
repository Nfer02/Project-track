import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAnthropicClient, isSupportedMimeType } from "@/lib/anthropic"

const MAX_SIZE_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 })
    }

    if (!isSupportedMimeType(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no soportado. Usa: PDF, JPEG, PNG o WEBP." },
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
    const base64 = buffer.toString("base64")

    const contentBlock =
      file.type === "application/pdf"
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
              media_type: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
              data: base64,
            },
          }

    const message = await getAnthropicClient().messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: `Analiza este documento de factura y extrae la siguiente información en formato JSON.
Si no encuentras algún dato, usa null para ese campo.

Responde ÚNICAMENTE con el JSON, sin texto adicional ni bloques de código:

{
  "invoiceNumber": "número de factura o null",
  "issueDate": "fecha de emisión en formato YYYY-MM-DD o null",
  "dueDate": "fecha de vencimiento en formato YYYY-MM-DD o null",
  "baseAmount": "importe base sin IVA como float o null",
  "vatRate": "porcentaje de IVA como int (21, 10, 4, 0) o null",
  "vatAmount": "importe del IVA como float o null",
  "amount": "importe TOTAL (base + IVA) como float o null",
  "currency": "código de moneda de 3 letras (EUR, USD, etc.) o null",
  "description": "descripción principal del servicio o bien o null",
  "vendorName": "nombre del emisor/proveedor o null",
  "clientName": "nombre del cliente/receptor o null",
  "nif": "NIF o CIF del emisor de la factura o null",
  "notes": "cualquier nota o condición de pago relevante o null"
}`,
            },
          ],
        },
      ],
    })

    const text = message.content[0]?.type === "text" ? message.content[0].text : ""
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    try {
      const parsed = JSON.parse(cleaned)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ error: "No se pudo interpretar la respuesta del análisis." }, { status: 500 })
    }
  } catch (err) {
    console.error("[OCR Extract] Error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
