"use client"

import { useState } from "react"
import { Send, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AdminWaitlistEmail({ totalWaitlist }: { totalWaitlist: number }) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = useState("")

  async function handleSend() {
    if (!subject || !body) return

    if (!confirm(`¿Enviar este email a ${totalWaitlist} personas de la waitlist?`)) return

    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus("success")
      setResult(data.message)
    } catch (err) {
      setStatus("error")
      setResult(err instanceof Error ? err.message : "Error al enviar")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-3">
        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
        <p className="text-sm font-medium">Email enviado</p>
        <p className="text-xs text-muted-foreground">{result}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Enviar email a la waitlist</h2>
          <p className="text-[10px] text-muted-foreground">Se enviará a {totalWaitlist} personas</p>
        </div>
        <Send className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Asunto</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ej: ¡ProjectTrack ya está listo para ti!"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Mensaje</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribe el mensaje que recibirán los usuarios de la waitlist..."
            rows={6}
            className="resize-none"
          />
          <p className="text-[10px] text-muted-foreground">Se envía desde hola@projecttrack.app con el diseño de ProjectTrack</p>
        </div>
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive">{result}</p>
      )}

      <Button
        onClick={handleSend}
        disabled={!subject || !body || status === "loading"}
        className="w-full"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
        Enviar a {totalWaitlist} personas
      </Button>
    </div>
  )
}
