import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Facturas — ProjectTrack",
}
import { ReceiptText } from "lucide-react"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function InvoicesPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const invoices = await prisma.invoice.findMany({
    where: { project: { workspaceId: ctx.workspace.id } },
    orderBy: { issueDate: "desc" },
    include: {
      project: { select: { id: true, name: true } },
    },
  })

  const totalPending = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((s, i) => s + Number(i.amount), 0)

  const totalOverdue = invoices
    .filter((i) => i.status === "OVERDUE")
    .reduce((s, i) => s + Number(i.amount), 0)

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Facturas</h1>
        <p className="text-sm text-muted-foreground">
          {invoices.length === 0
            ? "Todavía no hay facturas registradas."
            : `${invoices.length} factura${invoices.length !== 1 ? "s" : ""} en total`}
        </p>
      </div>

      {/* Resumen rápido */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Total facturas</p>
            <p className="text-xl font-semibold">{invoices.length}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-amber-600 dark:text-amber-400">Pendientes</p>
            <p className="text-xl font-semibold">
              {totalPending > 0 ? formatCurrency(totalPending, "USD") : "—"}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-destructive">Vencidas</p>
            <p className="text-xl font-semibold">
              {totalOverdue > 0 ? formatCurrency(totalOverdue, "USD") : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Lista o empty state */}
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ReceiptText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Sin facturas todavía</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Las facturas se crean desde cada proyecto.
              Ingresá a un proyecto y añadí la primera.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">N°</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proyecto</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Descripción</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Emisión</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Venc.</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Monto</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${inv.project.id}/invoices/${inv.id}`}
                      className="font-mono text-xs hover:text-primary transition-colors"
                    >
                      #{inv.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${inv.project.id}`}
                      className="text-xs font-medium hover:text-primary transition-colors"
                    >
                      {inv.project.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                    {inv.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-sm">
                    {formatCurrency(Number(inv.amount), inv.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
