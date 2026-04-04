import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Facturas — ProjectTrack",
}
import { ReceiptText, Plus, FileCheck2, FileX2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

interface Props {
  searchParams: Promise<{ tab?: string }>
}

export default async function InvoicesPage({ searchParams }: Props) {
  const { tab: rawTab } = await searchParams
  const tab = rawTab === "expenses" ? "expenses" : "income"

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const invoices = await prisma.invoice.findMany({
    where: {
      workspaceId: ctx.workspace.id,
      type: tab === "expenses" ? "EXPENSE" : "INCOME",
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

  const isIncome = tab === "income"

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Facturas</h1>
          <p className="text-sm text-muted-foreground">
            {invoices.length === 0
              ? isIncome
                ? "No hay facturas emitidas todavia."
                : "No hay gastos registrados todavia."
              : `${invoices.length} registro${invoices.length !== 1 ? "s" : ""} en total`}
          </p>
        </div>
        {isIncome ? (
          <Button size="sm" render={<Link href="/projects" />}>
            <Plus className="h-4 w-4 mr-1" />
            Nueva factura
          </Button>
        ) : (
          <Button size="sm" render={<Link href="/invoices/new-expense" />}>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo gasto
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        <Link
          href="/invoices?tab=income"
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "income"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Facturas emitidas
        </Link>
        <Link
          href="/invoices?tab=expenses"
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "expenses"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Gastos
        </Link>
      </div>

      {/* Resumen rapido */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">
              {isIncome ? "Total facturado" : "Total gastos"}
            </p>
            <p className="text-xl font-semibold">
              {formatCurrency(totalAmount, "EUR")}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-amber-600 dark:text-amber-400">Pendientes</p>
            <p className="text-xl font-semibold">
              {totalPending > 0 ? formatCurrency(totalPending, "EUR") : "\u2014"}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-xs text-destructive">Vencidas</p>
            <p className="text-xl font-semibold">
              {totalOverdue > 0 ? formatCurrency(totalOverdue, "EUR") : "\u2014"}
            </p>
          </div>
        </div>
      )}

      {/* Tabla o empty state */}
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ReceiptText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isIncome ? "Sin facturas emitidas" : "Sin gastos registrados"}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {isIncome
                ? "Las facturas se crean desde cada proyecto. Entra a un proyecto y crea la primera."
                : "Registra gastos desde la seccion de gastos."}
            </p>
          </div>
        </div>
      ) : isIncome ? (
        /* Tabla de facturas emitidas */
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">N.&#xba;</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proyecto</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Descripcion</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Fecha</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Importe</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">Declarada</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className={`hover:bg-muted/30 transition-colors ${!inv.isDeclared ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={inv.project ? `/projects/${inv.project.id}/invoices/${inv.id}` : "#"}
                      className="font-mono text-xs hover:text-primary transition-colors"
                    >
                      #{inv.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {inv.project ? (
                      <Link
                        href={`/projects/${inv.project!.id}`}
                        className="text-xs font-medium hover:text-primary transition-colors"
                      >
                        {inv.project!.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">\u2014</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                    {inv.description ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-sm">
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
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tabla de gastos */
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">N.&#xba;</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proveedor</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Categoria</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Descripcion</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Fecha</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Importe</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">Declarada</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className={`hover:bg-muted/30 transition-colors ${!inv.isDeclared ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3 font-mono text-xs">#{inv.number}</td>
                  <td className="px-4 py-3 text-xs font-medium">
                    {inv.vendorName ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                    {inv.category ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                    {inv.description ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-sm">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
