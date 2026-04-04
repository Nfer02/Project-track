import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Facturas emitidas — ProjectTrack",
}
import { ReceiptText, FileCheck2, FileX2 } from "lucide-react"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function InvoicesPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const invoices = await prisma.invoice.findMany({
    where: {
      workspaceId: ctx.workspace.id,
      type: "INCOME",
    },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { issueDate: "desc" },
  })

  const totalAmount = invoices.reduce((s, i) => s + Number(i.amount), 0)
  const totalPending = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((s, i) => s + Number(i.amount), 0)
  const totalOverdue = invoices
    .filter((i) => i.status === "OVERDUE")
    .reduce((s, i) => s + Number(i.amount), 0)

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Facturas emitidas</h1>
        <p className="text-sm text-muted-foreground">{invoices.length} facturas en total</p>
      </div>

      {invoices.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-1">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total facturado</p>
            <p className="text-base sm:text-xl font-semibold">{formatCurrency(totalAmount, "EUR")}</p>
          </div>
          <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-1">
            <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">Pendientes</p>
            <p className="text-base sm:text-xl font-semibold">{totalPending > 0 ? formatCurrency(totalPending, "EUR") : "—"}</p>
          </div>
          <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-1">
            <p className="text-[10px] sm:text-xs text-destructive">Vencidas</p>
            <p className="text-base sm:text-xl font-semibold">{totalOverdue > 0 ? formatCurrency(totalOverdue, "EUR") : "—"}</p>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ReceiptText className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Sin facturas emitidas</p>
          <p className="text-sm text-muted-foreground">Crea facturas desde los proyectos.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={inv.project ? `/projects/${inv.project.id}/invoices/${inv.id}` : "#"}
              className={`block rounded-xl border bg-card p-4 hover:bg-muted/30 transition-colors ${!inv.isDeclared ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-muted-foreground shrink-0">#{inv.number}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {inv.project?.name ?? "Sin proyecto"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {inv.description ?? "Sin descripción"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(Number(inv.amount), inv.currency)}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(inv.issueDate)}</p>
                  </div>
                  <InvoiceStatusBadge status={inv.status} />
                  {inv.isDeclared ? (
                    <FileCheck2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <FileX2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
