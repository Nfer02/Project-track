import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"
import { deleteInvoice } from "../../actions"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}

export default async function ExpenseDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { from } = await searchParams

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const expense = await prisma.invoice.findFirst({
    where: { id, workspaceId: ctx.workspace.id, type: "EXPENSE" },
  })

  if (!expense) notFound()

  const allocations = await prisma.expenseAllocation.findMany({
    where: { invoiceId: id },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  })

  const allocTotal = allocations.reduce((s, a) => s + Number(a.amount), 0)
  const unallocated = Number(expense.amount) - allocTotal

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href={from ? `/projects/${from}` : "/invoices?tab=expenses"} />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {from ? "Volver al proyecto" : "Gastos"}
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Gasto #{expense.number}
            </h1>
            <InvoiceStatusBadge status={expense.status} />
          </div>
          {expense.vendorName && (
            <p className="text-sm text-muted-foreground">Proveedor: {expense.vendorName}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" render={<Link href={`/invoices/expense/${id}/edit${from ? `?from=${from}` : ""}`} />}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <form action={async () => { "use server"; await deleteInvoice(id, "") }}>
            <Button
              variant="outline"
              size="sm"
              type="submit"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </form>
        </div>
      </div>

      {/* Datos del gasto */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Importe</p>
          <p className="text-lg font-semibold">{formatCurrency(Number(expense.amount), expense.currency)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Categoría</p>
          <p className="text-base font-semibold">{expense.category ?? "—"}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Fecha</p>
          <p className="text-base font-semibold">{formatDate(expense.issueDate)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Declarada</p>
          <p className="text-base font-semibold">{expense.isDeclared ? "Sí" : "No (en negro)"}</p>
        </div>
      </div>

      {expense.description && (
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Descripción</p>
          <p className="text-sm">{expense.description}</p>
        </div>
      )}

      {expense.notes && (
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Notas internas</p>
          <p className="text-sm text-muted-foreground">{expense.notes}</p>
        </div>
      )}

      {/* Asignaciones a proyectos */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">Asignación a proyectos</h2>

        {allocations.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todo el importe es gasto general (sin asignar a proyectos).</p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proyecto</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{alloc.project.name}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(Number(alloc.amount), expense.currency)}</td>
                  </tr>
                ))}
                {unallocated > 0 && (
                  <tr className="bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground italic">Gasto general (sin proyecto)</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(unallocated, expense.currency)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
