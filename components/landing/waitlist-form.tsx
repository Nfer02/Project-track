"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, Mail } from "lucide-react"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
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
        body: JSON.stringify({ email, source: "landing" }),
      })
      const data = await res.json()
      setStatus("success")
      setMessage(data.message)
    } catch {
      setStatus("error")
      setMessage("Ocurrió un error. Inténtalo de nuevo.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 text-sm text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        {message}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="w-full rounded-full border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Únete a la lista"
        )}
      </button>
      {status === "error" && (
        <p className="text-xs text-destructive mt-1">{message}</p>
      )}
    </form>
  )
}
