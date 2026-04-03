import Stripe from "stripe"

const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined }

// Lazy getter — evita errores en build si STRIPE_SECRET_KEY no está disponible
export function getStripeClient(): Stripe {
  if (globalForStripe.stripe) return globalForStripe.stripe
  const client = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
    typescript: true,
  })
  if (process.env.NODE_ENV !== "production") globalForStripe.stripe = client
  return client
}

/** @deprecated Usar getStripeClient() en su lugar */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripeClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

/** Price ID del plan PRO (configurar en .env.local) */
export const PRO_PRICE_ID = process.env.STRIPE_PRICE_ID!

/** Status de Stripe que consideramos "activo" */
export function isActiveStripeStatus(status: string): boolean {
  return ["active", "trialing"].includes(status)
}
