"use client"

import { useState } from "react"
import { Loader2, Sparkles, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BillingActionsProps {
  isPro: boolean
  hasCustomer: boolean
}

export function BillingActions({ isPro, hasCustomer }: BillingActionsProps) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null)

  async function handleCheckout() {
    setLoading("checkout")
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? "Error al iniciar el pago")
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading("portal")
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? "Error al abrir el portal")
    } finally {
      setLoading(null)
    }
  }

  if (isPro && hasCustomer) {
    return (
      <Button
        variant="outline"
        onClick={handlePortal}
        disabled={loading !== null}
      >
        {loading === "portal" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Settings2 className="mr-2 h-4 w-4" />
        )}
        Gestionar suscripción
      </Button>
    )
  }

  return (
    <Button onClick={handleCheckout} disabled={loading !== null}>
      {loading === "checkout" ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Actualizar a PRO
    </Button>
  )
}
