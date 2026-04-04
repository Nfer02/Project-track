import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Gastos / Compras — ProjectTrack",
}
import { ShoppingCart, Plus, FileCheck2, FileX2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function ExpensesPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const invoices = await prisma.invoice.findMany({
    where: {
      workspaceId: ctx.workspace.id,
      type: "EXPENSE",
    },
    include: {
      allocations: {
        include: { project: { select: { name: true } } },
      },
    },
    orderBy: { issueDate: "desc" },
  })

  const totalAmount = invoices.reduce((s, i) => s + Number(i.amount), 0)
  const totalPending = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((s, i) => s + Number(i.amount), 0)

  const totalAllocated = invoices.reduce(
    (s, i) => s + i.allocations.reduce((sa, a) => sa + Number(a.amount), 0),
    0
  )
  const generalExpenses = totalAmount - totalAllocated

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gastos / Compras</h1>
          <p className="text-sm text-muted-foreground">
            {invoices.length} gastos registrados
          </p>
        </div>
        <Button size="sm" render={<Link href="/expenses/new" />}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo gasto
        </Button>
      </div>

      {invoices.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-1">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total gastos</p>
            <p className="text-base sm:text-xl font-semibold">{formatCurrency(totalAmount, "EUR")}</p>
          </div>
          <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-1 border-l-4 border-l-violet-500">
            <p className="text-[10px] sm:text-xs text-violet-600 dark:text-violet-400">Gastos generales</p>
            <p className="text-base sm:text-xl font-semibold">{generalExpenses > 0 ? formatCurrency(generalExpenses, "EUR") : "—"}</p>
          </div>
          <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-1">
            <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">Pendientes</p>
            <p className="text-base sm:text-xl font-semibold">{totalPending > 0 ? formatCurrency(totalPending, "EUR") : "—"}</p>
          </div>
          <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-1">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Asignados</p>
            <p className="text-base sm:text-xl font-semibold">{totalAllocated > 0 ? formatCurrency(totalAllocated, "EUR") : "—"}</p>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Sin gastos registrados</p>
          <p className="text-sm text-muted-foreground">Registra compras de material, herramientas y otros gastos.</p>
          <Button size="sm" render={<Link href="/expenses/new" />}>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo gasto
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => {
            const projectNames = inv.allocations.map((a) => a.project.name)

            return (
              <Link
                key={inv.id}
                href={`/expenses/detail/${inv.id}`}
                className={`block rounded-xl border bg-card p-4 hover:bg-muted/30 transition-colors ${!inv.isDeclared ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground shrink-0">#{inv.number}</span>
                      <p className="text-sm font-medium truncate">{inv.vendorName ?? "Sin proveedor"}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {inv.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{inv.category}</span>
                      )}
                      {projectNames.length > 0 ? (
                        <span className="text-xs text-muted-foreground truncate">{projectNames.join(", ")}</span>
                      ) : (
                        <span className="text-xs text-violet-500 italic">Gasto general</span>
                      )}
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
            )
          })}
        </div>
      )}
    </div>
  )
}
