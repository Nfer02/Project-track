"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, Mail } from "lucide-react"

const SECTORS = [
  { value: "reformas", label: "Reformas y construcción" },
  { value: "instalaciones", label: "Instalaciones y mantenimiento" },
  { value: "diseno", label: "Diseño y creatividad" },
  { value: "fotografia", label: "Fotografía y eventos" },
  { value: "consultoria", label: "Consultoría y formación" },
  { value: "tecnologia", label: "Tecnología y desarrollo" },
  { value: "hogar", label: "Proyectos personales / hogar" },
  { value: "otro", label: "Otro sector" },
]

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [sector, setSector] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: sector || "landing" }),
      })
      const data = await res.json()
      setStatus("success")
      setMessage(data.message || "¡Listo! Te avisaremos cuando esté disponible.")
    } catch {
      setStatus("error")
      setMessage("Ocurrió un error. Inténtalo de nuevo.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-6 py-4 text-sm text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-medium">¡Estás en la lista!</p>
          <p className="text-emerald-600/70 dark:text-emerald-400/70">Te avisaremos cuando ProjectTrack esté listo para ti.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3" id="waitlist">
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu email"
          required
          className="w-full rounded-full border border-input bg-background pl-11 pr-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <select
        value={sector}
        onChange={(e) => setSector(e.target.value)}
        className="w-full rounded-full border border-input bg-background px-4 py-3 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none"
      >
        <option value="">¿En qué sector trabajas? (opcional)</option>
        {SECTORS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
        ) : (
          "Quiero acceso anticipado"
        )}
      </button>
      {status === "error" && (
        <p className="text-xs text-destructive text-center">{message}</p>
      )}
    </form>
  )
}
