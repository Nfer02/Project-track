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
import { Badge } from "@/components/ui/badge"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/format"
import {
  buildInvoiceSummary,
  buildIncomeExpenseMonthly,
  buildNetProfitMonthly,
  buildCategorySummary,
} from "@/lib/chart-data"
import { IncomeExpenseBarChart } from "@/components/charts/income-expense-bar-chart"
import { ExpenseCategoryChart } from "@/components/charts/expense-category-chart"
import { NetProfitChart } from "@/components/charts/net-profit-chart"
import { FiscalGaugeChart } from "@/components/charts/fiscal-gauge-chart"
import { ProjectStatusBadge } from "@/components/app/project-status-badge"
import { EmptyDashboard } from "@/components/app/empty-dashboard"
import { HelpTooltip } from "@/components/app/help-tooltip"
import { DashboardPeriodFilter } from "@/components/app/dashboard-period-filter"

/* ------------------------------------------------------------------ */
/*  Quarter helpers                                                     */
/* ------------------------------------------------------------------ */

const QUARTER_LABELS: Record<number, string> = { 1: "T1", 2: "T2", 3: "T3", 4: "T4" }
const QUARTER_MONTHS: Record<number, string> = {
  1: "Ene-Mar", 2: "Abr-Jun", 3: "Jul-Sep", 4: "Oct-Dic",
}

function getFilingDeadline(quarter: number, year: number): Date {
  switch (quarter) {
    case 1: return new Date(year, 3, 20)
    case 2: return new Date(year, 6, 20)
    case 3: return new Date(year, 9, 20)
    case 4: return new Date(year + 1, 0, 30)
    default: return new Date(year, 3, 20)
  }
}

function formatFilingDeadline(quarter: number, year: number): string {
  switch (quarter) {
    case 1: return `20 de abril de ${year}`
    case 2: return `20 de julio de ${year}`
    case 3: return `20 de octubre de ${year}`
    case 4: return `30 de enero de ${year + 1}`
    default: return ""
  }
}

/** Parse "2025-Q3,2025-Q2" → [{year:2025,quarter:3},{year:2025,quarter:2}] */
function parseQuarterParams(param: string | undefined): { year: number; quarter: number }[] {
  const now = new Date()
  const defaultQ = Math.ceil((now.getMonth() + 1) / 3)
  const defaultEntry = { year: now.getFullYear(), quarter: defaultQ }

  if (!param) return [defaultEntry]

  const parsed = param
    .split(",")
    .map((s) => {
      const m = s.trim().match(/^(\d{4})-Q([1-4])$/)
      if (!m) return null
      return { year: parseInt(m[1]), quarter: parseInt(m[2]) }
    })
    .filter(Boolean) as { year: number; quarter: number }[]

  return parsed.length > 0 ? parsed : [defaultEntry]
}

function quarterRange(year: number, quarter: number) {
  return {
    start: new Date(year, (quarter - 1) * 3, 1),
    end: new Date(year, quarter * 3, 0, 23, 59, 59),
  }
}

function inAnySelectedQuarter(
  date: Date,
  ranges: { start: Date; end: Date }[]
): boolean {
  return ranges.some(({ start, end }) => date >= start && date <= end)
}

function buildPeriodLabel(quarters: { year: number; quarter: number }[]): string {
  if (quarters.length === 1) {
    const { year, quarter } = quarters[0]
    return `${QUARTER_LABELS[quarter]} ${year} (${QUARTER_MONTHS[quarter]})`
  }
  return quarters
    .map(({ year, quarter }) => `T${quarter} ${year}`)
    .join(" + ")
}

const DEFAULT_VAT_RATE = 0.21
const DEFAULT_IRPF_RATE = 0.20

/* ------------------------------------------------------------------ */
/*  Days remaining helper                                              */
/* ------------------------------------------------------------------ */

function getDaysRemaining(dueDate: Date | null) {
  if (!dueDate) return null
  const now = new Date()
  return Math.ceil((new Date(dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/* ------------------------------------------------------------------ */
/*  Data fetching                                                      */
/* ------------------------------------------------------------------ */

async function getDashboardData(
  workspaceId: string,
  selectedQuarters: { year: number; quarter: number }[]
) {
  const [activeProjects, totalProjects, recentProjects, allInvoices, totalAllocated, upcomingPayments] =
    await Promise.all([
      prisma.project.count({ where: { workspaceId, status: "ACTIVE" } }),
      prisma.project.count({ where: { workspaceId } }),
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
          dueDate: true,
          currency: true,
          type: true,
          isDeclared: true,
          vatAmount: true,
          category: true,
          projectId: true,
        },
        orderBy: { issueDate: "asc" },
      }),
      prisma.expenseAllocation.aggregate({
        where: { project: { workspaceId } },
        _sum: { amount: true },
      }),
      prisma.invoice.findMany({
        where: {
          workspaceId,
          type: "INCOME",
          status: { in: ["PENDING", "OVERDUE"] },
        },
        include: { project: { select: { name: true } } },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
    ])

  // Auto-detectar facturas vencidas
  const now_detect = new Date()
  const processedInvoices = allInvoices.map((i) => {
    if (i.status === "PENDING" && i.dueDate && new Date(i.dueDate) < now_detect) {
      return { ...i, status: "OVERDUE" as typeof i.status }
    }
    return i
  })

  const incomeInvoices = processedInvoices.filter((i) => i.type === "INCOME")
  const expenseInvoices = processedInvoices.filter((i) => i.type === "EXPENSE")

  const { totalPaid, totalPending, totalOverdue } = buildInvoiceSummary(incomeInvoices)
  const incomeExpenseMonthly = buildIncomeExpenseMonthly(processedInvoices, 6)
  const netProfitMonthly = buildNetProfitMonthly(processedInvoices, 6)
  const categoryData = buildCategorySummary(expenseInvoices)
  const totalExpensesAll = expenseInvoices.reduce((s, i) => s + Number(i.amount), 0)

  // ---- Período seleccionado ----
  const periodRanges = selectedQuarters.map(({ year, quarter }) => quarterRange(year, quarter))

  const revenueInPeriod = incomeInvoices
    .filter((i) => i.status === "PAID" && inAnySelectedQuarter(new Date(i.issueDate), periodRanges))
    .reduce((s, i) => s + Number(i.amount), 0)

  const expensesInPeriod = expenseInvoices
    .filter((i) => inAnySelectedQuarter(new Date(i.issueDate), periodRanges))
    .reduce((s, i) => s + Number(i.amount), 0)

  // Gastos generales del período = gastos sin proyecto asignado
  const generalExpensesInPeriod = expenseInvoices
    .filter((i) => !i.projectId && inAnySelectedQuarter(new Date(i.issueDate), periodRanges))
    .reduce((s, i) => s + Number(i.amount), 0)

  // All-time gastos generales (para fallback si no hay datos en período)
  const totalExpenses = expenseInvoices.reduce((s, i) => s + Number(i.amount), 0)
  const allocatedAmount = Number(totalAllocated._sum.amount ?? 0)
  const generalExpensesAllTime = totalExpenses - allocatedAmount

  // ---- Estimación fiscal: usar el trimestre más reciente seleccionado ----
  const fiscalQ = selectedQuarters[0] // ya viene ordenado: más reciente primero
  const fiscalRange = quarterRange(fiscalQ.year, fiscalQ.quarter)

  const quarterIncomes = allInvoices.filter((i) => {
    const d = new Date(i.issueDate)
    return d >= fiscalRange.start && d <= fiscalRange.end && i.type === "INCOME" && i.isDeclared
  })
  const quarterExpenses = allInvoices.filter((i) => {
    const d = new Date(i.issueDate)
    return d >= fiscalRange.start && d <= fiscalRange.end && i.type === "EXPENSE" && i.isDeclared
  })

  const quarterIncomesTotal = quarterIncomes.reduce((s, i) => s + Number(i.amount), 0)
  const quarterExpensesTotal = quarterExpenses.reduce((s, i) => s + Number(i.amount), 0)
  const quarterVatRepercutido = quarterIncomes.reduce((s, i) => {
    return s + (i.vatAmount != null ? Number(i.vatAmount) : Number(i.amount) * DEFAULT_VAT_RATE)
  }, 0)
  const quarterVatSoportado = quarterExpenses.reduce((s, i) => {
    return s + (i.vatAmount != null ? Number(i.vatAmount) : Number(i.amount) * DEFAULT_VAT_RATE)
  }, 0)
  const quarterVatAPagar = quarterVatRepercutido - quarterVatSoportado
  const quarterIrpfBase = quarterIncomesTotal - quarterExpensesTotal
  const quarterPagoFraccionado = Math.max(0, quarterIrpfBase * DEFAULT_IRPF_RATE)
  const quarterTotalReservar = quarterVatAPagar + quarterPagoFraccionado

  const filingDeadline = getFilingDeadline(fiscalQ.quarter, fiscalQ.year)
  const now = new Date()
  const daysUntilDeadline = Math.ceil((filingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return {
    activeProjects,
    totalProjects,
    recentProjects,
    pendingCount: incomeInvoices.filter((i) => i.status === "PENDING").length,
    overdueCount: incomeInvoices.filter((i) => i.status === "OVERDUE").length,
    revenueInPeriod,
    expensesInPeriod,
    generalExpensesInPeriod,
    generalExpensesAllTime,
    totalPaid,
    totalPending,
    totalOverdue,
    incomeExpenseMonthly,
    netProfitMonthly,
    categoryData,
    totalExpensesAll,
    upcomingPayments,
    fiscal: {
      quarter: fiscalQ.quarter,
      year: fiscalQ.year,
      quarterLabel: `${QUARTER_LABELS[fiscalQ.quarter]} ${fiscalQ.year} (${QUARTER_MONTHS[fiscalQ.quarter]})`,
      filingDeadlineLabel: formatFilingDeadline(fiscalQ.quarter, fiscalQ.year),
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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const { q } = await searchParams
  const selectedQuarters = parseQuarterParams(q)
  const selectedValues = selectedQuarters.map(({ year, quarter }) => `${year}-Q${quarter}`)
  const periodLabel = buildPeriodLabel(selectedQuarters)

  const data = await getDashboardData(ctx.workspace.id, selectedQuarters)

  if (data.totalProjects === 0) {
    return <EmptyDashboard workspaceName={ctx.workspace.name} />
  }

  const netProfit = data.revenueInPeriod - data.expensesInPeriod
  const isPositive = netProfit >= 0

  const STATS = [
    {
      label: "Ingresos del período",
      value: data.revenueInPeriod > 0 ? formatCurrency(data.revenueInPeriod, "EUR") : "0 €",
      sub: data.revenueInPeriod > 0 ? "Facturas cobradas" : "Sin cobros en este período",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      border: "border-l-4 border-l-emerald-500",
    },
    {
      label: "Gastos del período",
      value: data.expensesInPeriod > 0 ? formatCurrency(data.expensesInPeriod, "EUR") : "0 €",
      sub: data.expensesInPeriod > 0 ? "Gastos registrados" : "Sin gastos en este período",
      icon: ShoppingCart,
      color: "text-orange-600 dark:text-orange-400",
      border: "border-l-4 border-l-orange-500",
    },
    {
      label: "Beneficio neto",
      value: formatCurrency(netProfit, "EUR"),
      sub: isPositive ? "Ingresos superan gastos" : "Gastos superan ingresos",
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
      border: isPositive ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500",
    },
    {
      label: "Proyectos activos",
      value: String(data.activeProjects),
      sub: data.activeProjects === 0 ? "Crea tu primer proyecto" : `${data.activeProjects} en curso`,
      icon: FolderOpen,
      color: "text-primary",
      border: "border-l-4 border-l-blue-500",
    },
    {
      label: "Gastos generales",
      value: data.generalExpensesInPeriod > 0 ? formatCurrency(data.generalExpensesInPeriod, "EUR") : "0 €",
      sub: "Sin asignar a proyectos",
      icon: Wallet,
      color: "text-violet-600 dark:text-violet-400",
      border: "border-l-4 border-l-violet-500",
    },
    {
      label: "Cobros pendientes",
      value: String(data.pendingCount),
      sub: data.pendingCount === 0 ? "Al día" : "Por cobrar",
      icon: ReceiptText,
      color: "text-amber-600 dark:text-amber-400",
      border: "border-l-4 border-l-amber-500",
    },
    {
      label: "Cobros vencidos",
      value: String(data.overdueCount),
      sub: data.overdueCount === 0 ? "Sin alertas" : "Requieren atención",
      icon: Clock,
      color: "text-destructive",
      border: "border-l-4 border-l-red-500",
    },
  ]

  const f = data.fiscal

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3" data-tour-step="welcome-final">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Resumen financiero — {ctx.workspace.name}
            </p>
          </div>
          <Button size="sm" render={<Link href="/projects/new" />} data-tour-step="new-project-btn">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo proyecto
          </Button>
        </div>
        {/* Filtro de trimestres */}
        <DashboardPeriodFilter selected={selectedValues} />
      </div>

      {/* Beta feedback banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🧪</span>
          <div>
            <p className="text-sm font-medium">Estas en la version beta</p>
            <p className="text-xs text-muted-foreground">Tu opinion nos ayuda a mejorar. Nos das tu feedback?</p>
          </div>
        </div>
        <Button size="sm" variant="outline" render={<Link href="/feedback" />}>
          Dar feedback
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-tour-step="stats-cards">
        {STATS.map(({ label, value, sub, icon: Icon, color, border }) => (
          <Card key={label} className={border}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-2xl font-semibold tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overdue alert */}
      {data.overdueCount > 0 && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
          <p className="font-medium text-destructive">
            {data.overdueCount} factura{data.overdueCount !== 1 ? "s" : ""} vencida
            {data.overdueCount !== 1 ? "s" : ""}
          </p>
          <Link
            href="/invoices"
            className="ml-auto text-destructive/80 underline underline-offset-2 hover:text-destructive text-xs"
          >
            Ver facturas
          </Link>
        </div>
      )}

      {/* Upcoming payments */}
      {data.upcomingPayments.length > 0 && (
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="mb-4 space-y-0.5">
            <h2 className="text-sm font-semibold">Próximos cobros</h2>
          </div>
          <div className="divide-y">
            {data.upcomingPayments.map((inv) => {
              const days = getDaysRemaining(inv.dueDate)
              let badgeText: string
              let badgeVariant: "destructive" | "secondary" | "outline" | "default"

              if (days === null) {
                badgeText = "Sin vencimiento"
                badgeVariant = "secondary"
              } else if (days < 0) {
                badgeText = `Vencida hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? "s" : ""}`
                badgeVariant = "destructive"
              } else if (days === 0) {
                badgeText = "Vence hoy"
                badgeVariant = "destructive"
              } else if (days <= 7) {
                badgeText = `Vence en ${days} día${days !== 1 ? "s" : ""}`
                badgeVariant = "outline"
              } else if (days <= 30) {
                badgeText = `Vence en ${days} días`
                badgeVariant = "default"
              } else {
                badgeText = `Vence en ${days} días`
                badgeVariant = "secondary"
              }

              return (
                <div key={inv.id} className="flex items-center justify-between py-3 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground shrink-0">#{inv.number}</span>
                    <span className="text-sm truncate">{inv.project?.name ?? "Sin proyecto"}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(Number(inv.amount), "EUR")}
                    </span>
                    <Badge
                      variant={badgeVariant}
                      className={
                        days !== null && days <= 7 && days >= 0
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          : undefined
                      }
                    >
                      {badgeText}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 sm:p-5" data-tour-step="income-expense-chart">
          <div className="mb-4 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold">Ingresos vs Gastos</h2>
              <HelpTooltip content="Compara tus ingresos facturados con tus gastos registrados en los ultimos 6 meses." />
            </div>
            <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
          </div>
          <IncomeExpenseBarChart data={data.incomeExpenseMonthly} />
        </div>
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="mb-4 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold">Gastos por categoria</h2>
              <HelpTooltip content="Desglose de tus gastos por tipo: material, subcontratas, suministros, etc." />
            </div>
          </div>
          <ExpenseCategoryChart data={data.categoryData} totalExpenses={data.totalExpensesAll} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="mb-4 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold">Beneficio mensual</h2>
              <HelpTooltip content="Beneficio bruto (antes de impuestos) frente al neto estimado tras IVA e IRPF." />
            </div>
            <p className="text-xs text-muted-foreground">
              Bruto (antes de impuestos) vs Neto real (tras IVA + IRPF)
            </p>
          </div>
          <NetProfitChart data={data.netProfitMonthly} />
        </div>
        <div className="rounded-xl border bg-card p-4 sm:p-5" data-tour-step="fiscal-gauge">
          <div className="mb-4 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold">Reserva fiscal</h2>
              <HelpTooltip content="Porcentaje de tus ingresos que deberias reservar para impuestos trimestrales." />
            </div>
            <p className="text-xs text-muted-foreground">{f.quarterLabel}</p>
          </div>
          <FiscalGaugeChart
            totalReservar={f.totalReservar}
            vatAmount={f.vatAPagar}
            irpfAmount={f.pagoFraccionado}
            incomesTotal={f.incomesTotal}
          />
        </div>
      </div>

      {/* Estimacion fiscal */}
      <div className="rounded-xl border-l-4 border-l-indigo-500 border border-border bg-card p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-500" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-semibold">Estimacion fiscal del trimestre</h2>
                <HelpTooltip content="Calculo orientativo basado en IVA al 21% e IRPF al 20%. No sustituye el asesoramiento de un profesional fiscal." />
              </div>
              <p className="text-xs text-muted-foreground">
                {f.quarterLabel} — Presentación: {f.filingDeadlineLabel}
              </p>
            </div>
          </div>
        </div>

        {f.daysUntilDeadline > 0 && f.daysUntilDeadline <= 30 && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="font-medium text-amber-700 dark:text-amber-400">
              Faltan {f.daysUntilDeadline} día{f.daysUntilDeadline !== 1 ? "s" : ""} para la fecha límite de presentación (orientativo)
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ingresos declarados</span>
              <span className="font-medium tabular-nums">{formatCurrency(f.incomesTotal, "EUR")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gastos declarados</span>
              <span className="font-medium tabular-nums">{formatCurrency(f.expensesTotal, "EUR")}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="text-muted-foreground">IVA repercutido (est.)</span>
              <span className="font-medium tabular-nums">{formatCurrency(f.vatRepercutido, "EUR")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IVA soportado</span>
              <span className="font-medium tabular-nums">{formatCurrency(f.vatSoportado, "EUR")}</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span>IVA a pagar (est.)</span>
              <span className="tabular-nums">{formatCurrency(f.vatAPagar, "EUR")}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base IRPF</span>
              <span className="font-medium tabular-nums">{formatCurrency(f.irpfBase, "EUR")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pago fraccionado (20%)</span>
              <span className="font-medium tabular-nums">{formatCurrency(f.pagoFraccionado, "EUR")}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Total a reservar</span>
              <span className="font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
                {formatCurrency(f.totalReservar, "EUR")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/70 italic">
          Estimación orientativa asumiendo IVA al 21% e IRPF al 20%. Consulta con tu asesor fiscal para el cálculo definitivo.
        </p>
      </div>

      {/* Proyectos recientes */}
      {data.recentProjects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Proyectos recientes</h2>
            <Link href="/projects" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="rounded-xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {data.recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/projects/${project.id}`} className="font-medium hover:text-primary transition-colors">
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
