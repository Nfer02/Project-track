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

  // Gastos generales
  const totalAllocated = invoices.reduce(
    (s, i) => s + i.allocations.reduce((sa, a) => sa + Number(a.amount), 0),
    0
  )
  const generalExpenses = totalAmount - totalAllocated

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gastos / Compras</h1>
          <p className="text-sm text-muted-foreground">
            {invoices.length} gastos registrados — Aquí gestionas todas tus facturas de compra
          </p>
        </div>
        <Button size="sm" render={<Link href="/invoices/new-expense" />}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo gasto
        </Button>
      </div>

      {invoices.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Total gastos</p>
            <p className="text-xl font-semibold">{formatCurrency(totalAmount, "EUR")}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-1 border-l-4 border-l-violet-500">
            <p className="text-xs text-violet-600 dark:text-violet-400">Gastos generales</p>
            <p className="text-xl font-semibold">{generalExpenses > 0 ? formatCurrency(generalExpenses, "EUR") : "—"}</p>
            <p className="text-[10px] text-muted-foreground">Sin asignar a proyectos</p>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-amber-600 dark:text-amber-400">Pendientes de pago</p>
            <p className="text-xl font-semibold">{totalPending > 0 ? formatCurrency(totalPending, "EUR") : "—"}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Gastos asignados</p>
            <p className="text-xl font-semibold">{totalAllocated > 0 ? formatCurrency(totalAllocated, "EUR") : "—"}</p>
            <p className="text-[10px] text-muted-foreground">Repartidos entre proyectos</p>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Sin gastos registrados</p>
            <p className="text-sm text-muted-foreground">
              Registra compras de material, herramientas, subcontratas y otros gastos.
            </p>
          </div>
          <Button size="sm" render={<Link href="/invoices/new-expense" />}>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo gasto
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">N.°</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proveedor</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Categoría</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Proyectos</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Fecha</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Importe</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">Declarada</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => {
                const projectNames = inv.allocations
                  .map((a) => a.project.name)
                  .join(", ")

                return (
                  <tr
                    key={inv.id}
                    className={`hover:bg-muted/30 transition-colors ${!inv.isDeclared ? "opacity-60" : ""}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/invoices/expense/${inv.id}`} className="hover:text-primary transition-colors">
                        #{inv.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium">
                      <Link href={`/invoices/expense/${inv.id}`} className="hover:text-primary transition-colors">
                        {inv.vendorName ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                      {inv.category ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs">
                      {projectNames ? (
                        <span className="text-xs text-muted-foreground">{projectNames}</span>
                      ) : (
                        <span className="text-xs text-violet-500 italic">Gasto general</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs whitespace-nowrap">
                      {formatDate(inv.issueDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm whitespace-nowrap">
                      {formatCurrency(Number(inv.amount), inv.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.isDeclared ? (
                        <FileCheck2 className="h-4 w-4 text-emerald-500 inline-block" />
                      ) : (
                        <FileX2 className="h-4 w-4 text-muted-foreground inline-block" />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
