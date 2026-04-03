import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/format"
import { buildMonthlyData, buildStatusCounts, buildInvoiceSummary } from "@/lib/chart-data"
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart"
import { InvoiceDonutChart } from "@/components/charts/invoice-donut-chart"
import { BudgetProgress } from "@/components/app/budget-progress"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectFinancesPage({ params }: Props) {
  const { id } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: ctx.workspace.id },
    include: {
      invoices: {
        select: { status: true, amount: true, issueDate: true, currency: true },
        orderBy: { issueDate: "asc" },
      },
    },
  })

  if (!project) notFound()

  const invoices = project.invoices
  const { totalInvoiced, totalPaid, totalPending, totalOverdue } =
    buildInvoiceSummary(invoices)
  const monthlyData = buildMonthlyData(invoices, 6)
  const statusCounts = buildStatusCounts(invoices)
  const budget = project.budget ? Number(project.budget) : null

  const SUMMARY_CARDS = [
    {
      label: "Total facturado",
      value: formatCurrency(totalInvoiced, project.currency),
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      label: "Cobrado",
      value: formatCurrency(totalPaid, project.currency),
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/5",
    },
    {
      label: "Por cobrar",
      value: formatCurrency(totalPending, project.currency),
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/5",
    },
    {
      label: "Vencido",
      value: formatCurrency(totalOverdue, project.currency),
      icon: AlertCircle,
      color: "text-destructive",
      bg: "bg-destructive/5",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-1"
          render={<Link href={`/projects/${id}`} />}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {project.name}
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Finanzas del proyecto</h1>
        <p className="text-sm text-muted-foreground">
          Resumen financiero de <span className="font-medium text-foreground">{project.name}</span>
        </p>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl border bg-card p-4 space-y-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-semibold tabular-nums">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Presupuesto */}
      {budget != null && budget > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Uso del presupuesto</h2>
          <BudgetProgress
            budget={budget}
            invoiced={totalInvoiced}
            currency={project.currency}
          />
        </div>
      )}

      {/* Gráficas */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Facturación mensual */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 space-y-0.5">
            <h2 className="text-sm font-semibold">Facturación mensual</h2>
            <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
          </div>
          <RevenueBarChart data={monthlyData} currency={project.currency} />
        </div>

        {/* Distribución de estados */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-2 space-y-0.5">
            <h2 className="text-sm font-semibold">Estado de facturas</h2>
            <p className="text-xs text-muted-foreground">
              {invoices.length} factura{invoices.length !== 1 ? "s" : ""} en total
            </p>
          </div>
          <InvoiceDonutChart data={statusCounts} />
        </div>
      </div>

      {/* Detalle por status */}
      {invoices.length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b">
            <h2 className="text-sm font-semibold">Desglose por estado</h2>
          </div>
          <div className="divide-y">
            {statusCounts
              .filter((s) => s.value > 0)
              .map((s) => {
                const amount = project.invoices
                  .filter((i) => i.status === s.status)
                  .reduce((sum, i) => sum + Number(i.amount), 0)
                return (
                  <div key={s.status} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-sm flex-1">{s.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {s.value} factura{s.value !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-medium tabular-nums">
                      {formatCurrency(amount, project.currency)}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
