"use client"

import { useState } from "react"
import { Loader2, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SECTOR_LABELS: Record<string, string> = {
  reformas: "Reformas y construccion",
  instalaciones: "Instalaciones y mantenimiento",
  diseno: "Diseno y creatividad",
  fotografia: "Fotografia y eventos",
  consultoria: "Consultoria y formacion",
  tecnologia: "Tecnologia y desarrollo",
  hogar: "Proyectos personales / hogar",
  otro: "Otro sector",
  landing: "Landing (sin sector)",
}

type WaitlistEntry = {
  id: string
  email: string
  source: string | null
  invited: boolean
  createdAt: string
}

export function AdminWaitlistTable({ entries }: { entries: WaitlistEntry[] }) {
  const [inviting, setInviting] = useState<string | null>(null)
  const [invited, setInvited] = useState<Set<string>>(
    new Set(entries.filter((e) => e.invited).map((e) => e.id))
  )
  const [error, setError] = useState<string | null>(null)

  async function handleInvite(entry: WaitlistEntry) {
    setInviting(entry.id)
    setError(null)
    try {
      const res = await fetch("/api/waitlist/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: entry.email }),
      })
      if (res.ok || res.status === 207) {
        setInvited((prev) => new Set([...prev, entry.id]))
      } else {
        const data = await res.json()
        setError(data.error ?? "Error al invitar")
      }
    } catch {
      setError("Error de conexion")
    }
    setInviting(null)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">Waitlist</h2>
        <p className="text-[10px] text-muted-foreground">
          {entries.length} registros mas recientes
        </p>
      </div>
      {error && (
        <div className="px-4 py-2 text-xs text-destructive bg-destructive/10">
          {error}
        </div>
      )}
      <div className="max-h-[450px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b text-left text-[10px] text-muted-foreground">
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Sector</th>
              <th className="px-4 py-2 font-medium">Fecha</th>
              <th className="px-4 py-2 font-medium text-right">Accion</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground text-xs"
                >
                  Sin entradas
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-border/30 hover:bg-muted/30"
                >
                  <td className="px-4 py-2 text-xs truncate max-w-[180px]">
                    {entry.email}
                  </td>
                  <td className="px-4 py-2">
                    {entry.source && entry.source !== "landing" ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {SECTOR_LABELS[entry.source] ?? entry.source}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {invited.has(entry.id) ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" />
                        Invitado
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px] px-2"
                        disabled={inviting === entry.id}
                        onClick={() => handleInvite(entry)}
                      >
                        {inviting === entry.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Send className="h-3 w-3 mr-1" />
                            Invitar
                          </>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
