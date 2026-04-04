import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard — ProjectTrack",
}
import { TrendingUp, FolderOpen, ReceiptText, Clock, Plus, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/format"
import { buildMonthlyData, buildInvoiceSummary } from "@/lib/chart-data"
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart"
import { ProjectStatusBadge } from "@/components/app/project-status-badge"

async function getDashboardData(workspaceId: string) {
  const [activeProjects, recentProjects, allInvoices] = await Promise.all([
    prisma.project.count({ where: { workspaceId, status: "ACTIVE" } }),
    prisma.project.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { _count: { select: { invoices: true } } },
    }),
    prisma.invoice.findMany({
      where: { workspaceId },
      select: { status: true, amount: true, issueDate: true, currency: true, type: true },
      orderBy: { issueDate: "asc" },
    }),
  ])

  const incomeInvoices = allInvoices.filter((i) => i.type === "INCOME")
  const expenseInvoices = allInvoices.filter((i) => i.type === "EXPENSE")

  const { totalPaid, totalPending, totalOverdue } = buildInvoiceSummary(incomeInvoices)
  const monthlyData = buildMonthlyData(incomeInvoices, 6)

  // Ingresos del mes actual (solo INCOME)
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const revenueThisMonth = incomeInvoices
    .filter(
      (i) => i.status === "PAID" && new Date(i.issueDate) >= firstOfMonth
    )
    .reduce((s, i) => s + Number(i.amount), 0)

  // Gastos del mes actual
  const expensesThisMonth = expenseInvoices
    .filter((i) => new Date(i.issueDate) >= firstOfMonth)
    .reduce((s, i) => s + Number(i.amount), 0)

  return {
    activeProjects,
    recentProjects,
    pendingCount: incomeInvoices.filter((i) => i.status === "PENDING").length,
    overdueCount: incomeInvoices.filter((i) => i.status === "OVERDUE").length,
    revenueThisMonth,
    expensesThisMonth,
    totalPaid,
    totalPending,
    totalOverdue,
    monthlyData,
  }
}

export default async function DashboardPage() {
  const ctx = await getCurrentWorkspace()

  if (!ctx) {
    redirect("/onboarding")
  }

  const data = await getDashboardData(ctx.workspace.id)

  const STATS = [
    {
      label: "Ingresos del mes",
      value:
        data.revenueThisMonth > 0
          ? formatCurrency(data.revenueThisMonth, "EUR")
          : "0 €",
      sub:
        data.revenueThisMonth > 0
          ? "Facturas cobradas este mes"
          : "Sin cobros este mes",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      border: "border-l-4 border-l-emerald-500",
    },
    {
      label: "Gastos del mes",
      value:
        data.expensesThisMonth > 0
          ? formatCurrency(data.expensesThisMonth, "EUR")
          : "0 €",
      sub:
        data.expensesThisMonth > 0
          ? "Gastos registrados este mes"
          : "Sin gastos este mes",
      icon: ShoppingCart,
      color: "text-orange-600 dark:text-orange-400",
      border: "border-l-4 border-l-orange-500",
    },
    {
      label: "Proyectos activos",
      value: String(data.activeProjects),
      sub:
        data.activeProjects === 0
          ? "Crea tu primer proyecto"
          : `${data.activeProjects} en curso`,
      icon: FolderOpen,
      color: "text-primary",
      border: "border-l-4 border-l-blue-500",
    },
    {
      label: "Facturas pendientes",
      value: String(data.pendingCount),
      sub: data.pendingCount === 0 ? "Al día" : "Por cobrar",
      icon: ReceiptText,
      color: "text-amber-600 dark:text-amber-400",
      border: "border-l-4 border-l-amber-500",
    },
    {
      label: "Facturas vencidas",
      value: String(data.overdueCount),
      sub: data.overdueCount === 0 ? "Sin alertas" : "Requieren atención",
      icon: Clock,
      color: "text-destructive",
      border: "border-l-4 border-l-red-500",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Resumen financiero — {ctx.workspace.name}
          </p>
        </div>
        <Button size="sm" render={<Link href="/projects/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo proyecto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATS.map(({ label, value, sub, icon: Icon, color, border }) => (
          <Card key={label} className={border}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.activeProjects === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No hay proyectos todavía</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Crea tu primer proyecto para empezar a registrar ingresos y
              facturas.
            </p>
          </div>
          <Button size="sm" render={<Link href="/projects/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            Crear proyecto
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Gráfico de ingresos — 2/3 del ancho */}
          <div className="lg:col-span-2 rounded-xl border bg-card p-5">
            <div className="mb-4 space-y-0.5">
              <h2 className="text-sm font-semibold">Facturación mensual</h2>
              <p className="text-xs text-muted-foreground">
                Todos los proyectos — últimos 6 meses
              </p>
            </div>
            <RevenueBarChart data={data.monthlyData} currency="EUR" />
          </div>

          {/* Resumen financiero — 1/3 */}
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <h2 className="text-sm font-semibold">Resumen financiero</h2>
            <div className="space-y-3">
              {[
                {
                  label: "Cobrado",
                  value: data.totalPaid,
                  color: "bg-emerald-500",
                },
                {
                  label: "Pendiente",
                  value: data.totalPending,
                  color: "bg-amber-500",
                },
                {
                  label: "Vencido",
                  value: data.totalOverdue,
                  color: "bg-destructive",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <span className="text-muted-foreground">{label}</span>
                    </div>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(value, "EUR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Alerta de facturas vencidas */}
            {data.overdueCount > 0 && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs">
                <p className="font-medium text-destructive mb-1">
                  {data.overdueCount} factura{data.overdueCount !== 1 ? "s" : ""} vencida
                  {data.overdueCount !== 1 ? "s" : ""}
                </p>
                <Link
                  href="/invoices"
                  className="text-destructive/80 underline underline-offset-2 hover:text-destructive"
                >
                  Ver facturas →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proyectos recientes */}
      {data.recentProjects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Proyectos recientes</h2>
            <Link
              href="/projects"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          <div className="rounded-xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {data.recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {project.name}
                      </Link>
                      {project.clientName && (
                        <p className="text-xs text-muted-foreground">{project.clientName}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ProjectStatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                      {project._count.invoices} factura{project._count.invoices !== 1 ? "s" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
