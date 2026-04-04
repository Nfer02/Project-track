import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock,
  ShoppingCart,
  TrendingUp,
  Wallet,
  Percent,
  Landmark,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/format"
import { buildMonthlyData } from "@/lib/chart-data"
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectFinancesPage({ params }: Props) {
  const { id } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: ctx.workspace.id },
    include: {
      invoices: {
        where: { type: "INCOME" },
        select: { status: true, amount: true, issueDate: true, currency: true, isDeclared: true },
        orderBy: { issueDate: "asc" },
      },
    },
  })
  if (!project) notFound()

  const expenseAllocations = await prisma.expenseAllocation.findMany({
    where: { projectId: id },
    include: { invoice: { select: { status: true, amount: true, isDeclared: true, vatAmount: true } } },
  })

  // ---------------------------------------------------------------------------
  // Cálculos
  // ---------------------------------------------------------------------------
  const incomeInvoices = project.invoices
  const currency = project.currency

  const cobrado = incomeInvoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + Number(i.amount), 0)

  const porCobrar = incomeInvoices
    .filter((i) => i.status === "PENDING")
    .reduce((s, i) => s + Number(i.amount), 0)

  const totalGastosAsignados = expenseAllocations.reduce(
    (s, a) => s + Number(a.amount),
    0,
  )

  const gastosPagados = expenseAllocations
    .filter((a) => a.invoice.status === "PAID")
    .reduce((s, a) => s + Number(a.amount), 0)

  const gananciaReal = cobrado - gastosPagados
  const margen = cobrado > 0 ? (gananciaReal / cobrado) * 100 : 0

  const projectValue = project.projectValue ? Number(project.projectValue) : null
  const budget = project.budget ? Number(project.budget) : null

  // ---------------------------------------------------------------------------
  // Datos mensuales para gráfico ingreso vs gasto
  // ---------------------------------------------------------------------------
  const monthlyIncome = buildMonthlyData(incomeInvoices, 6)

  // Calcular gastos por mes manualmente desde allocations
  const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const now = new Date()
  const monthlyExpenseMap = new Map<string, number>()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthlyExpenseMap.set(MONTH_LABELS[d.getMonth()], 0)
  }
  for (const alloc of expenseAllocations) {
    // Usamos createdAt de la allocation como fecha de referencia
    const dt = new Date(alloc.createdAt)
    const label = MONTH_LABELS[dt.getMonth()]
    if (monthlyExpenseMap.has(label)) {
      monthlyExpenseMap.set(label, (monthlyExpenseMap.get(label) ?? 0) + Number(alloc.amount))
    }
  }

  // Combinar datos: reutilizamos paid/pending/overdue del chart original y añadimos expenses
  const chartData = monthlyIncome.map((m) => ({
    ...m,
    expenses: Math.round(monthlyExpenseMap.get(m.month) ?? 0),
  }))

  // ---------------------------------------------------------------------------
  // Fiscal: solo si el proyecto se declara
  // ---------------------------------------------------------------------------
  const declaredIncomePaid = incomeInvoices
    .filter((i) => i.status === "PAID" && i.isDeclared)
    .reduce((s, i) => s + Number(i.amount), 0)

  const ivaSoportado = expenseAllocations
    .filter((a) => a.invoice.isDeclared)
    .reduce((s, a) => s + Number(a.invoice.vatAmount ?? 0), 0)

  const declaredExpenses = expenseAllocations
    .filter((a) => a.invoice.isDeclared)
    .reduce((s, a) => s + Number(a.amount), 0)

  const vatRate = project.vatRate ?? 21
  const irpfRate = project.irpfRate ?? 0

  const ivaRepercutido = declaredIncomePaid * (vatRate / 100)
  const ivaAPagar = ivaRepercutido - ivaSoportado
  const irpfBase = declaredIncomePaid - declaredExpenses
  const irpfBruto = irpfBase * 0.2
  const retenciones = declaredIncomePaid * (irpfRate / 100)
  const irpfAPagar = Math.max(irpfBruto - retenciones, 0)
  const totalReserva = Math.max(ivaAPagar, 0) + irpfAPagar

  // ---------------------------------------------------------------------------
  // Presupuesto
  // ---------------------------------------------------------------------------
  const budgetUsed = budget != null && budget > 0 ? totalGastosAsignados : 0
  const budgetPct = budget != null && budget > 0 ? (budgetUsed / budget) * 100 : 0
  const budgetOverflow = budget != null && budget > 0 ? budgetUsed - budget : 0

  // ---------------------------------------------------------------------------
  // Tarjetas resumen
  // ---------------------------------------------------------------------------
  const SUMMARY_CARDS = [
    {
      label: "Valor del contrato",
      value: projectValue != null ? formatCurrency(projectValue, currency) : "No definido",
      icon: Banknote,
      color: "text-primary",
      bg: "bg-primary/5",
      muted: projectValue == null,
    },
    {
      label: "Cobrado",
      value: formatCurrency(cobrado, currency),
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/5",
      muted: false,
    },
    {
      label: "Por cobrar",
      value: formatCurrency(porCobrar, currency),
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/5",
      muted: false,
    },
    {
      label: "Gastos asignados",
      value: formatCurrency(totalGastosAsignados, currency),
      icon: ShoppingCart,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/5",
      muted: false,
    },
    {
      label: "Ganancia real",
      value: formatCurrency(gananciaReal, currency),
      icon: Wallet,
      color: gananciaReal >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
      bg: gananciaReal >= 0 ? "bg-emerald-500/5" : "bg-destructive/5",
      muted: false,
      bold: true,
    },
    {
      label: "Margen",
      value: cobrado > 0 ? `${margen.toFixed(0)}%` : "—",
      icon: Percent,
      color: margen >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
      bg: margen >= 0 ? "bg-emerald-500/5" : "bg-destructive/5",
      muted: cobrado === 0,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
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
          Resumen financiero de{" "}
          <span className="font-medium text-foreground">{project.name}</span>
        </p>
      </div>

      {/* ================================================================= */}
      {/* Sección 1: Tarjetas resumen                                       */}
      {/* ================================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, color, bg, muted, bold }) => (
          <div key={label} className="rounded-xl border bg-card p-4 space-y-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p
                className={`text-lg tabular-nums ${
                  muted
                    ? "text-muted-foreground text-sm"
                    : bold
                      ? "font-bold"
                      : "font-semibold"
                }`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================= */}
      {/* Sección 2: Barra de presupuesto                                   */}
      {/* ================================================================= */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Presupuesto de materiales</h2>

        {budget != null && budget > 0 ? (
          <>
            {/* Alert banners */}
            {budgetPct > 100 && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-700 dark:text-red-400">
                <XCircle className="h-4 w-4 shrink-0" />
                Presupuesto excedido en {formatCurrency(budgetOverflow, currency)}
              </div>
            )}
            {budgetPct > 90 && budgetPct <= 100 && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Presupuesto casi agotado
              </div>
            )}
            {budgetPct >= 70 && budgetPct <= 90 && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Te acercas al limite del presupuesto
              </div>
            )}

            {/* Barra */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatCurrency(budgetUsed, currency)} / {formatCurrency(budget, currency)}
                </span>
                <span
                  className={`font-medium tabular-nums ${
                    budgetPct > 100
                      ? "text-red-600 dark:text-red-400"
                      : budgetPct > 90
                        ? "text-red-600 dark:text-red-400"
                        : budgetPct >= 70
                          ? "text-amber-600 dark:text-amber-400"
                          : ""
                  }`}
                >
                  {budgetPct.toFixed(0)}%
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetPct > 90
                      ? "bg-red-500"
                      : budgetPct >= 70
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(budgetPct, 100)}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Sin presupuesto definido</p>
        )}
      </div>

      {/* ================================================================= */}
      {/* Sección 3: Gráfico Ingresos vs Gastos                             */}
      {/* ================================================================= */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 space-y-0.5">
          <h2 className="text-sm font-semibold">Ingresos vs Gastos</h2>
          <p className="text-xs text-muted-foreground">Ultimos 6 meses</p>
        </div>
        <IncomeExpenseChart data={chartData} currency={currency} />
      </div>

      {/* ================================================================= */}
      {/* Sección 4: Estimación fiscal                                      */}
      {/* ================================================================= */}
      {project.isDeclared && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Estimacion fiscal del proyecto</h2>
          </div>

          <div className="space-y-1 text-sm font-mono">
            {/* IVA */}
            <FiscalRow
              label={`IVA repercutido (${vatRate}%)`}
              value={formatCurrency(ivaRepercutido, currency)}
            />
            <FiscalRow
              label="IVA soportado (gastos)"
              value={`-${formatCurrency(ivaSoportado, currency)}`}
              muted
            />
            <FiscalRow
              label="IVA a pagar"
              value={formatCurrency(Math.max(ivaAPagar, 0), currency)}
              highlight
            />

            <div className="border-t my-2" />

            {/* IRPF */}
            <FiscalRow
              label="Base imponible IRPF"
              value={`${formatCurrency(declaredIncomePaid, currency)} - ${formatCurrency(declaredExpenses, currency)} = ${formatCurrency(irpfBase, currency)}`}
              muted
            />
            <FiscalRow
              label="IRPF estimado (20%)"
              value={formatCurrency(irpfBruto, currency)}
            />
            {irpfRate > 0 && (
              <FiscalRow
                label={`Retenciones (${irpfRate}%)`}
                value={`-${formatCurrency(retenciones, currency)}`}
                muted
              />
            )}
            <FiscalRow
              label="IRPF a pagar"
              value={formatCurrency(irpfAPagar, currency)}
              highlight
            />

            <div className="border-t my-2" />

            {/* Total */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-foreground">Total a reservar para Hacienda</span>
              <span className="font-bold text-foreground text-base">
                {formatCurrency(totalReserva, currency)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              Estimacion orientativa basada en los datos del proyecto. Consulta con tu asesor fiscal
              para calculos definitivos.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Componentes auxiliares (server components, sin "use client")
// =============================================================================

function FiscalRow({
  label,
  value,
  muted,
  highlight,
}: {
  label: string
  value: string
  muted?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
      <span
        className={`tabular-nums ${
          highlight ? "font-semibold text-foreground" : muted ? "text-muted-foreground" : ""
        }`}
      >
        {value}
      </span>
    </div>
  )
}

// =============================================================================
// Gráfico Ingresos vs Gastos (client island)
// =============================================================================

// Inline client chart that wraps recharts to show income (green) vs expenses (red)
// We import the chart dynamically to keep the page as a server component.

import { IncomeExpenseChart } from "./income-expense-chart"
