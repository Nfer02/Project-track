"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const CATEGORIES = [
  { value: "acceso", label: "Acceso a mi cuenta" },
  { value: "error", label: "Error en la aplicación" },
  { value: "duda", label: "Duda de uso" },
  { value: "facturacion", label: "Facturación y plan" },
  { value: "sugerencia", label: "Sugerencia" },
  { value: "otro", label: "Otro" },
]

export function SupportForm({ userEmail, userName }: { userEmail: string; userName: string }) {
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category || !subject || !message) return

    setStatus("loading")
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, name: userName, category, subject, message }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
      setErrorMsg("No se pudo enviar el ticket. Inténtalo de nuevo.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border bg-card p-8 text-center space-y-4">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
        <h2 className="text-lg font-semibold">Ticket enviado</h2>
        <p className="text-sm text-muted-foreground">Te responderemos lo antes posible a {userEmail}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Categoría *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Selecciona una categoría</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Asunto *</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Describe brevemente tu problema"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Mensaje *</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explica con detalle qué necesitas..."
          rows={5}
          required
          className="resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
        Enviar ticket
      </Button>
    </form>
  )
}
