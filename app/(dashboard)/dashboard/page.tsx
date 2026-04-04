import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard — ProjectTrack",
}
import {
  TrendingUp,
  TrendingDown,
  FolderOpen,
  ReceiptText,
  Clock,
  Plus,
  ShoppingCart,
  Wallet,
  Calculator,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/format"
import { buildMonthlyData, buildInvoiceSummary } from "@/lib/chart-data"
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart"
import { ProjectStatusBadge } from "@/components/app/project-status-badge"

/* ------------------------------------------------------------------ */
/*  Fiscal helpers                                                     */
/* ------------------------------------------------------------------ */

const QUARTER_LABELS: Record<number, string> = {
  1: "T1",
  2: "T2",
  3: "T3",
  4: "T4",
}

const QUARTER_MONTHS: Record<number, string> = {
  1: "Ene-Mar",
  2: "Abr-Jun",
  3: "Jul-Sep",
  4: "Oct-Dic",
}

function getFilingDeadline(quarter: number, year: number): Date {
  // Q1 → 20 abril, Q2 → 20 julio, Q3 → 20 octubre, Q4 → 30 enero (año siguiente)
  switch (quarter) {
    case 1:
      return new Date(year, 3, 20) // 20 abril
    case 2:
      return new Date(year, 6, 20) // 20 julio
    case 3:
      return new Date(year, 9, 20) // 20 octubre
    case 4:
      return new Date(year + 1, 0, 30) // 30 enero siguiente
    default:
      return new Date(year, 3, 20)
  }
}

function formatFilingDeadline(quarter: number, year: number): string {
  switch (quarter) {
    case 1:
      return `20 de abril de ${year}`
    case 2:
      return `20 de julio de ${year}`
    case 3:
      return `20 de octubre de ${year}`
    case 4:
      return `30 de enero de ${year + 1}`
    default:
      return ""
  }
}

const DEFAULT_VAT_RATE = 0.21
const DEFAULT_IRPF_RATE = 0.20

/* ------------------------------------------------------------------ */
/*  Data fetching                                                      */
/* ------------------------------------------------------------------ */

async function getDashboardData(workspaceId: string) {
  const [activeProjects, recentProjects, allInvoices, totalAllocated] = await Promise.all([
    prisma.project.count({ where: { workspaceId, status: "ACTIVE" } }),
    prisma.project.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { _count: { select: { invoices: true } } },
    }),
    prisma.invoice.findMany({
      where: { workspaceId },
      select: {
        status: true,
        amount: true,
        issueDate: true,
        currency: true,
        type: true,
        isDeclared: true,
        vatAmount: true,
      },
      orderBy: { issueDate: "asc" },
    }),
    prisma.expenseAllocation.aggregate({
      where: { project: { workspaceId } },
      _sum: { amount: true },
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

  // Gastos generales = total gastos - total asignado a proyectos
  const totalExpenses = expenseInvoices.reduce((s, i) => s + Number(i.amount), 0)
  const allocatedAmount = Number(totalAllocated._sum.amount ?? 0)
  const generalExpenses = totalExpenses - allocatedAmount

  // ---- Estimación fiscal del trimestre ----
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1
  const quarterStart = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1)
  const quarterEnd = new Date(now.getFullYear(), currentQuarter * 3, 0, 23, 59, 59)

  const quarterIncomes = allInvoices.filter((i) => {
    const d = new Date(i.issueDate)
    return d >= quarterStart && d <= quarterEnd && i.type === "INCOME" && i.isDeclared
  })

  const quarterExpenses = allInvoices.filter((i) => {
    const d = new Date(i.issueDate)
    return d >= quarterStart && d <= quarterEnd && i.type === "EXPENSE" && i.isDeclared
  })

  const quarterIncomesTotal = quarterIncomes.reduce((s, i) => s + Number(i.amount), 0)
  const quarterExpensesTotal = quarterExpenses.reduce((s, i) => s + Number(i.amount), 0)

  // IVA repercutido: use vatAmount from invoices when available, otherwise estimate at 21%
  const quarterVatRepercutido = quarterIncomes.reduce((s, i) => {
    if (i.vatAmount != null) return s + Number(i.vatAmount)
    return s + Number(i.amount) * DEFAULT_VAT_RATE
  }, 0)

  // IVA soportado: use vatAmount from expenses when available, otherwise estimate at 21%
  const quarterVatSoportado = quarterExpenses.reduce((s, i) => {
    if (i.vatAmount != null) return s + Number(i.vatAmount)
    return s + Number(i.amount) * DEFAULT_VAT_RATE
  }, 0)

  const quarterVatAPagar = quarterVatRepercutido - quarterVatSoportado
  const quarterIrpfBase = quarterIncomesTotal - quarterExpensesTotal
  const quarterPagoFraccionado = Math.max(0, quarterIrpfBase * DEFAULT_IRPF_RATE)
  const quarterTotalReservar = quarterVatAPagar + quarterPagoFraccionado

  const filingDeadline = getFilingDeadline(currentQuarter, now.getFullYear())
  const daysUntilDeadline = Math.ceil(
    (filingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    activeProjects,
    recentProjects,
    pendingCount: incomeInvoices.filter((i) => i.status === "PENDING").length,
    overdueCount: incomeInvoices.filter((i) => i.status === "OVERDUE").length,
    revenueThisMonth,
    expensesThisMonth,
    generalExpenses,
    totalPaid,
    totalPending,
    totalOverdue,
    monthlyData,
    // Fiscal
    fiscal: {
      quarter: currentQuarter,
      year: now.getFullYear(),
      quarterLabel: `${QUARTER_LABELS[currentQuarter]} ${now.getFullYear()} (${QUARTER_MONTHS[currentQuarter]})`,
      filingDeadlineLabel: formatFilingDeadline(currentQuarter, now.getFullYear()),
      daysUntilDeadline,
      incomesTotal: quarterIncomesTotal,
      expensesTotal: quarterExpensesTotal,
      vatRepercutido: quarterVatRepercutido,
      vatSoportado: quarterVatSoportado,
      vatAPagar: quarterVatAPagar,
      irpfBase: quarterIrpfBase,
      pagoFraccionado: quarterPagoFraccionado,
      totalReservar: quarterTotalReservar,
    },
  }
}

export default async function DashboardPage() {
  const ctx = await getCurrentWorkspace()

  if (!ctx) {
    redirect("/onboarding")
  }

  const data = await getDashboardData(ctx.workspace.id)

  const netProfit = data.revenueThisMonth - data.expensesThisMonth
  const isPositive = netProfit >= 0

  const STATS = [
    {
      label: "Ingresos del mes",
      value:
        data.revenueThisMonth > 0
          ? formatCurrency(data.revenueThisMonth, "EUR")
          : "0 \u20AC",
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
          : "0 \u20AC",
      sub:
        data.expensesThisMonth > 0
          ? "Gastos registrados este mes"
          : "Sin gastos este mes",
      icon: ShoppingCart,
      color: "text-orange-600 dark:text-orange-400",
      border: "border-l-4 border-l-orange-500",
    },
    {
      label: "Beneficio neto del mes",
      value: formatCurrency(netProfit, "EUR"),
      sub: isPositive ? "Ingresos superan gastos" : "Gastos superan ingresos",
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-destructive",
      border: isPositive
        ? "border-l-4 border-l-emerald-500"
        : "border-l-4 border-l-red-500",
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
      label: "Gastos generales",
      value:
        data.generalExpenses > 0
          ? formatCurrency(data.generalExpenses, "EUR")
          : "0 \u20AC",
      sub: "Sin asignar a proyectos",
      icon: Wallet,
      color: "text-violet-600 dark:text-violet-400",
      border: "border-l-4 border-l-violet-500",
    },
    {
      label: "Facturas pendientes",
      value: String(data.pendingCount),
      sub: data.pendingCount === 0 ? "Al d\u00EDa" : "Por cobrar",
      icon: ReceiptText,
      color: "text-amber-600 dark:text-amber-400",
      border: "border-l-4 border-l-amber-500",
    },
    {
      label: "Facturas vencidas",
      value: String(data.overdueCount),
      sub: data.overdueCount === 0 ? "Sin alertas" : "Requieren atenci\u00F3n",
      icon: Clock,
      color: "text-destructive",
      border: "border-l-4 border-l-red-500",
    },
  ]

  const f = data.fiscal

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-sm font-medium">No hay proyectos todav&iacute;a</p>
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
              <h2 className="text-sm font-semibold">Facturaci&oacute;n mensual</h2>
              <p className="text-xs text-muted-foreground">
                Todos los proyectos — &uacute;ltimos 6 meses
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

      {/* Estimación fiscal del trimestre */}
      <div className="rounded-xl border-l-4 border-l-indigo-500 border border-border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-500" />
            <div>
              <h2 className="text-sm font-semibold">
                Estimaci&oacute;n fiscal del trimestre
              </h2>
              <p className="text-xs text-muted-foreground">
                {f.quarterLabel} — Presentaci&oacute;n: {f.filingDeadlineLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Deadline alert */}
        {f.daysUntilDeadline > 0 && f.daysUntilDeadline <= 30 && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="font-medium text-amber-700 dark:text-amber-400">
              Tienes {f.daysUntilDeadline} d&iacute;a{f.daysUntilDeadline !== 1 ? "s" : ""} para
              presentar la declaraci&oacute;n trimestral
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {/* Columna izquierda: Ingresos y gastos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ingresos declarados</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(f.incomesTotal, "EUR")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gastos declarados</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(f.expensesTotal, "EUR")}
              </span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="text-muted-foreground">IVA repercutido (est.)</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(f.vatRepercutido, "EUR")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IVA soportado</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(f.vatSoportado, "EUR")}
              </span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span>IVA a pagar (est.)</span>
              <span className="tabular-nums">
                {formatCurrency(f.vatAPagar, "EUR")}
              </span>
            </div>
          </div>

          {/* Columna derecha: IRPF y total */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base IRPF</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(f.irpfBase, "EUR")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pago fraccionado (20%)</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(f.pagoFraccionado, "EUR")}
              </span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Total a reservar
              </span>
              <span className="font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
                {formatCurrency(f.totalReservar, "EUR")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/70 italic">
          Estimaci&oacute;n orientativa asumiendo IVA al 21% e IRPF al 20%. Consulta con tu asesor
          fiscal para el c&aacute;lculo exacto.
        </p>
      </div>

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
