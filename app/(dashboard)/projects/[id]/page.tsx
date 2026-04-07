import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Pencil, ReceiptText, Plus, BarChart2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { ProjectStatusBadge } from "@/components/app/project-status-badge"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"
import { DeleteProjectButton } from "@/components/app/delete-project-button"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: ctx.workspace.id },
    include: {
      invoices: {
        orderBy: { issueDate: "desc" },
      },
    },
  })

  if (!project) notFound()

  const expenseAllocations = await prisma.expenseAllocation.findMany({
    where: { projectId: id },
    include: {
      invoice: { select: { number: true, vendorName: true, category: true, issueDate: true, status: true, currency: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const totalInvoiced = project.invoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  )
  const totalExpenses = expenseAllocations.reduce((s, a) => s + Number(a.amount), 0)
  const pendingInvoices = project.invoices.filter(
    (inv) => inv.status === "PENDING" || inv.status === "OVERDUE"
  )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href="/projects" />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Proyectos
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          {project.clientName && (
            <p className="text-sm text-muted-foreground">{project.clientName}</p>
          )}
          {project.description && (
            <p className="text-sm text-muted-foreground max-w-lg">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button variant="outline" size="sm" render={<Link href={`/projects/${project.id}/finances`} />}>
            <BarChart2 className="h-4 w-4 mr-1" />
            Finanzas
          </Button>
          <Button variant="outline" size="sm" render={<Link href={`/projects/${project.id}/edit`} />}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {/* Stats del proyecto */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Valor del contrato</p>
          <p className="text-lg font-semibold">
            {project.projectValue
              ? formatCurrency(Number(project.projectValue), project.currency)
              : "—"}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Facturado</p>
          <p className="text-lg font-semibold">
            {formatCurrency(totalInvoiced, project.currency)}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Presup. materiales</p>
          <p className="text-lg font-semibold">
            {project.budget
              ? formatCurrency(Number(project.budget), project.currency)
              : "—"}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Gastos asignados</p>
          <p className="text-lg font-semibold">
            {totalExpenses > 0
              ? formatCurrency(totalExpenses, project.currency)
              : "\u2014"}
          </p>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 -mt-2">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Inicio</p>
          <p className="text-base font-semibold">{formatDate(project.startDate)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Fin estimado</p>
          <p className="text-base font-semibold">{formatDate(project.endDate)}</p>
        </div>
      </div>

      {/* Facturas del proyecto */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Facturas
            {project.invoices.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({project.invoices.length})
              </span>
            )}
          </h2>
          <Button size="sm" render={<Link href={`/projects/${project.id}/invoices/new`} />}>
            <Plus className="h-4 w-4 mr-1" />
            Nueva factura
          </Button>
        </div>

        {project.invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <ReceiptText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Sin facturas</p>
              <p className="text-sm text-muted-foreground">
                Añade facturas para registrar los ingresos de este proyecto.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    N°
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Descripción
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                    Importe
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {project.invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/projects/${project.id}/invoices/${inv.id}`} className="hover:text-primary block">
                        #{inv.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <Link href={`/projects/${project.id}/invoices/${inv.id}`} className="hover:text-primary block">
                        {inv.description ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <Link href={`/projects/${project.id}/invoices/${inv.id}`} className="hover:text-primary block">
                        {formatDate(inv.issueDate)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      <Link href={`/projects/${project.id}/invoices/${inv.id}`} className="hover:text-primary block">
                        {formatCurrency(Number(inv.amount), inv.currency)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/projects/${project.id}/invoices/${inv.id}`} className="block">
                        <InvoiceStatusBadge status={inv.status} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gastos asignados a este proyecto */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Gastos asignados a este proyecto
            {expenseAllocations.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({expenseAllocations.length})
              </span>
            )}
          </h2>
          <Button size="sm" render={<Link href={`/projects/${project.id}/expenses/new`} />}>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo gasto
          </Button>
        </div>

        {expenseAllocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Sin gastos asignados</p>
              <p className="text-sm text-muted-foreground">
                Los gastos se asignan desde las facturas de tipo gasto.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">N.&#xba; Factura</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proveedor</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Categoría</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Fecha</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Importe asignado</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenseAllocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/expenses/detail/${alloc.invoiceId}?from=${project.id}`} className="hover:text-primary transition-colors">
                        #{alloc.invoice.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium">
                      <Link href={`/expenses/detail/${alloc.invoiceId}?from=${project.id}`} className="hover:text-primary transition-colors">
                        {alloc.invoice.vendorName ?? "\u2014"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">{alloc.invoice.category ?? "\u2014"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{formatDate(alloc.invoice.issueDate)}</td>
                    <td className="px-4 py-3 text-right font-medium text-sm">{formatCurrency(Number(alloc.amount), project.currency)}</td>
                    <td className="px-4 py-3">
                      <InvoiceStatusBadge status={alloc.invoice.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
