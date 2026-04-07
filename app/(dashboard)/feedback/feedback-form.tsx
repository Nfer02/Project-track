"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const FEATURES = [
  { value: "dashboard", label: "Dashboard financiero" },
  { value: "projects", label: "Gestion de proyectos" },
  { value: "expenses", label: "Control de gastos" },
  { value: "ocr", label: "Escaneo con IA (OCR)" },
  { value: "reports", label: "Reportes trimestrales" },
  { value: "fiscal", label: "Estimacion fiscal" },
]

export function FeedbackForm({ userEmail }: { userEmail: string }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [features, setFeatures] = useState<string[]>([])
  const [improvements, setImprovements] = useState("")
  const [recommend, setRecommend] = useState("")
  const [comments, setComments] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  function toggleFeature(value: string) {
    setFeatures(prev => prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !recommend) return

    setStatus("loading")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          easeOfUse: rating,
          usefulFeatures: features.join(","),
          improvements,
          wouldRecommend: recommend,
          comments,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border bg-card p-8 text-center space-y-4">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
        <h2 className="text-lg font-semibold">Gracias por tu feedback</h2>
        <p className="text-sm text-muted-foreground">Tu opinion nos ayuda a mejorar ProjectTrack.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-6">

      {/* 1. Rating */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Que tan facil te resulto usar ProjectTrack? *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  n <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {rating === 1 ? "Muy dificil" : rating === 2 ? "Dificil" : rating === 3 ? "Normal" : rating === 4 ? "Facil" : rating === 5 ? "Muy facil" : "Selecciona una puntuacion"}
        </p>
      </div>

      {/* 2. Useful features */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Que funcionalidades te parecieron mas utiles?</label>
        <div className="grid grid-cols-2 gap-2">
          {FEATURES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => toggleFeature(f.value)}
              className={`rounded-lg border px-3 py-2 text-sm text-left transition-colors ${
                features.includes(f.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Improvements */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Que mejorarias o que te falta?</label>
        <Textarea
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          placeholder="Cuentanos que podriamos mejorar..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* 4. Would recommend */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Recomendarias ProjectTrack? *</label>
        <div className="flex gap-2">
          {[
            { value: "yes", label: "Si", color: "border-emerald-500 bg-emerald-500/10 text-emerald-500" },
            { value: "maybe", label: "Tal vez", color: "border-amber-500 bg-amber-500/10 text-amber-500" },
            { value: "no", label: "No", color: "border-red-500 bg-red-500/10 text-red-500" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRecommend(opt.value)}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                recommend === opt.value ? opt.color : "border-border text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Comments */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Comentarios adicionales</label>
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Cualquier cosa que quieras decirnos..."
          rows={3}
          className="resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">No se pudo enviar. Intentalo de nuevo.</p>
      )}

      <Button type="submit" className="w-full" disabled={status === "loading" || !rating || !recommend}>
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Enviar feedback
      </Button>
    </form>
  )
}
