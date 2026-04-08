"use client"

import { useState } from "react"
import { AlertTriangle, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminEndBeta({ betaProCount }: { betaProCount: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = useState("")

  async function handleEndBeta() {
    if (!confirm(
      `¿Finalizar la beta?\n\nEsto cambiará ${betaProCount} workspace(s) de beta testers de PRO a FREE.\n\nLos usuarios que tengan una suscripción de Stripe activa NO se verán afectados.`
    )) return

    setStatus("loading")
    try {
      const res = await fetch("/api/admin/end-beta", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus("success")
      setResult(data.message)
    } catch (err) {
      setStatus("error")
      setResult(err instanceof Error ? err.message : "Error al finalizar la beta")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center space-y-2">
        <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
        <p className="text-sm font-medium">Beta finalizada</p>
        <p className="text-xs text-muted-foreground">{result}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold">Finalizar beta</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Cambia todos los workspaces de beta testers de PRO a FREE.
        Los usuarios con suscripción de Stripe activa no se verán afectados.
      </p>
      {betaProCount > 0 ? (
        <p className="text-xs font-medium">
          {betaProCount} workspace(s) de beta testers con plan PRO actualmente
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">No hay beta testers con plan PRO activo</p>
      )}

      {status === "error" && (
        <p className="text-xs text-destructive">{result}</p>
      )}

      <Button
        onClick={handleEndBeta}
        disabled={betaProCount === 0 || status === "loading"}
        variant="outline"
        className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
        Finalizar beta ({betaProCount} workspaces)
      </Button>
    </div>
  )
}
