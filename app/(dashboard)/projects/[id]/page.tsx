import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, ReceiptText, Plus, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { ProjectStatusBadge } from "@/components/app/project-status-badge"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"
import { deleteProject } from "../actions"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: ctx.workspace.id },
    include: {
      invoices: {
        orderBy: { issueDate: "desc" },
      },
    },
  })

  if (!project) notFound()

  const totalInvoiced = project.invoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  )
  const pendingInvoices = project.invoices.filter(
    (inv) => inv.status === "PENDING" || inv.status === "OVERDUE"
  )

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href="/projects" />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Proyectos
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
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

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" render={<Link href={`/projects/${project.id}/finances`} />}>
            <BarChart2 className="h-4 w-4 mr-1" />
            Finanzas
          </Button>
          <Button variant="outline" size="sm" render={<Link href={`/projects/${project.id}/edit`} />}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <form
            action={async () => {
              "use server"
              await deleteProject(project.id)
            }}
          >
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

      {/* Stats del proyecto */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Presupuesto</p>
          <p className="text-lg font-semibold">
            {project.budget
              ? formatCurrency(Number(project.budget), project.currency)
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
          <p className="text-xs text-muted-foreground">Inicio</p>
          <p className="text-lg font-semibold">{formatDate(project.startDate)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Fin estimado</p>
          <p className="text-lg font-semibold">{formatDate(project.endDate)}</p>
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
                Añadí facturas para registrar los ingresos de este proyecto.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
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
                    Monto
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
                      <Link href={`/projects/${project.id}/invoices/${inv.id}`} className="hover:text-primary">
                        #{inv.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.description ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(inv.issueDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
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
    </div>
  )
}
