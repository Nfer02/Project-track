import Anthropic from "@anthropic-ai/sdk"

const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined
}

// Lazy getter — no lanza error durante el build si no hay ANTHROPIC_API_KEY
export function getAnthropicClient(): Anthropic {
  if (globalForAnthropic.anthropic) return globalForAnthropic.anthropic
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  if (process.env.NODE_ENV !== "production") globalForAnthropic.anthropic = client
  return client
}


// Tipos de archivo soportados para OCR
export const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const

export type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number]

export function isSupportedMimeType(mime: string): mime is SupportedMimeType {
  return (SUPPORTED_MIME_TYPES as readonly string[]).includes(mime)
}
