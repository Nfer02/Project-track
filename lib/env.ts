/**
 * Validates required environment variables at build/startup time.
 * Import this in lib/prisma.ts and lib/stripe.ts to ensure vars exist.
 */

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "DATABASE_URL",
] as const

const REQUIRED_FOR_FEATURES = {
  stripe: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_PRICE_ID"],
  ocr: ["ANTHROPIC_API_KEY"],
  email: ["RESEND_API_KEY"],
} as const

export function validateEnv() {
  const missing: string[] = []
  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key)
  }
  if (missing.length > 0) {
    console.warn(`⚠️ ProjectTrack: Variables de entorno faltantes: ${missing.join(", ")}`)
  }
  return missing.length === 0
}

export function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Variable de entorno requerida: ${key}`)
  }
  return value
}
