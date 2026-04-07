"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Loader2, Send, CheckCircle2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Ticket {
  id: string
  email: string
  name: string | null
  category: string
  subject: string
  message: string
  status: string
  response: string | null
  respondedAt: string | null
  createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  acceso: "Acceso",
  error: "Error",
  duda: "Duda",
  facturacion: "Facturación",
  sugerencia: "Sugerencia",
  otro: "Otro",
}

const CATEGORY_COLORS: Record<string, string> = {
  acceso: "bg-blue-500/10 text-blue-400",
  error: "bg-red-500/10 text-red-400",
  duda: "bg-amber-500/10 text-amber-400",
  facturacion: "bg-violet-500/10 text-violet-400",
  sugerencia: "bg-emerald-500/10 text-emerald-400",
  otro: "bg-slate-500/10 text-slate-400",
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function AdminTickets({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const [tickets, setTickets] = useState(initialTickets)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)

  async function handleReply(ticketId: string) {
    if (!replyText.trim()) return
    setSendingId(ticketId)

    try {
      const res = await fetch("/api/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, response: replyText }),
      })

      if (!res.ok) throw new Error()

      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: "resolved", response: replyText, respondedAt: new Date().toISOString() }
            : t
        )
      )
      setReplyText("")
      setSuccessId(ticketId)
      setTimeout(() => setSuccessId(null), 3000)
    } catch {
      alert("Error al enviar la respuesta")
    } finally {
      setSendingId(null)
    }
  }

  const openCount = tickets.filter((t) => t.status === "open").length

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-4 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-blue-500" />
        <h2 className="text-sm font-semibold">Tickets de soporte</h2>
        {openCount > 0 && (
          <span className="ml-auto inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
            {openCount} abierto{openCount !== 1 ? "s" : ""}
          </span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">{tickets.length} total</span>
      </div>

      {tickets.length === 0 ? (
        <div className="px-4 py-8 text-center text-muted-foreground text-xs">Sin tickets</div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto divide-y divide-border/30">
          {tickets.map((ticket) => {
            const isExpanded = expandedId === ticket.id
            const isOpen = ticket.status === "open"

            return (
              <div key={ticket.id}>
                {/* Row */}
                <button
                  onClick={() => {
                    setExpandedId(isExpanded ? null : ticket.id)
                    setReplyText("")
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[ticket.category] ?? CATEGORY_COLORS.otro}`}>
                        {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                      </span>
                      {isOpen ? (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                          Abierto
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          Resuelto
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium truncate">{ticket.subject}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {ticket.name || ticket.email} &middot; {formatDateShort(ticket.createdAt)}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">Mensaje del usuario:</p>
                      <p className="text-xs whitespace-pre-wrap">{ticket.message}</p>
                    </div>

                    {ticket.response ? (
                      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                        <p className="text-[10px] font-medium text-emerald-400 mb-1">
                          Respuesta enviada ({ticket.respondedAt ? formatDateShort(ticket.respondedAt) : ""}):
                        </p>
                        <p className="text-xs whitespace-pre-wrap">{ticket.response}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Escribe tu respuesta..."
                          rows={3}
                          className="resize-none text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReply(ticket.id)}
                            disabled={!replyText.trim() || sendingId === ticket.id}
                          >
                            {sendingId === ticket.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                            ) : (
                              <Send className="h-3.5 w-3.5 mr-1.5" />
                            )}
                            Enviar respuesta
                          </Button>
                          {successId === ticket.id && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Enviada
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
