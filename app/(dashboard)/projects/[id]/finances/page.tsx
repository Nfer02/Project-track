import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock,
  ShoppingCart,
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
import {
  ProjectExpenseDonut,
  ProjectMonthlyBars,
  ContractProgress,
  type CategoryItem,
} from "./project-charts"

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
        select: { id: true, number: true, description: true, status: true, amount: true, issueDate: true, dueDate: true, paidDate: true, currency: true, isDeclared: true, paymentMethod: true },
        orderBy: { issueDate: "asc" },
      },
    },
  })
  if (!project) notFound()

  const expenseAllocations = await prisma.expenseAllocation.findMany({
    where: { projectId: id },
    include: {
      invoice: {
        select: { status: true, amount: true, isDeclared: true, vatAmount: true, category: true, issueDate: true, vendorName: true },
      },
    },
  })

  const currency = project.currency
  const incomeInvoices = project.invoices

  // Auto-detect overdue
  const now = new Date()
  const processedIncome = incomeInvoices.map((i) => {
    if (i.status === "PENDING" && i.dueDate && new Date(i.dueDate) < now) {
      return { ...i, status: "OVERDUE" as typeof i.status }
    }
    return i
  })

  // ─── Cálculos principales ──────────────────────────────────────────────
  const cobrado = processedIncome.filter((i) => i.status === "PAID").reduce((s, i) => s + Number(i.amount), 0)
  const porCobrar = processedIncome.filter((i) => i.status === "PENDING").reduce((s, i) => s + Number(i.amount), 0)
  const vencido = processedIncome.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + Number(i.amount), 0)

  const totalGastosAsignados = expenseAllocations.reduce((s, a) => s + Number(a.amount), 0)
  const gastosPagados = expenseAllocations.filter((a) => a.invoice.status === "PAID").reduce((s, a) => s + Number(a.amount), 0)

  const gananciaReal = cobrado - gastosPagados
  const margen = cobrado > 0 ? (gananciaReal / cobrado) * 100 : 0
  const projectValue = project.projectValue ? Number(project.projectValue) : null
  const budget = project.budget ? Number(project.budget) : null

  // ─── Gráfico 1: Donut de gastos por categoría ─────────────────────────
  const categoryMap = new Map<string, number>()
  for (const alloc of expenseAllocations) {
    const cat = alloc.invoice.category ?? "Sin categoría"
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + Number(alloc.amount))
  }
  const categoryData: CategoryItem[] = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  // ─── Gráfico 2: Cobros vs Gastos por mes (solo meses con movimiento) ──
  const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const monthlyMap = new Map<string, { income: number; expense: number }>()

  for (const inv of processedIncome.filter((i) => i.status === "PAID")) {
    const d = new Date(inv.issueDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const existing = monthlyMap.get(key) ?? { income: 0, expense: 0 }
    existing.income += Number(inv.amount)
    monthlyMap.set(key, existing)
  }

  for (const alloc of expenseAllocations.filter((a) => a.invoice.status === "PAID")) {
    const d = new Date(alloc.invoice.issueDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const existing = monthlyMap.get(key) ?? { income: 0, expense: 0 }
    existing.expense += Number(alloc.amount)
    monthlyMap.set(key, existing)
  }

  // Ordenar por fecha y construir datos
  const monthlyEntries = Array.from(monthlyMap.entries()).sort(([a], [b]) => a.localeCompare(b))

  const monthlyData = monthlyEntries.map(([key, val]) => {
    const m = parseInt(key.split("-")[1])
    return {
      label: MONTH_LABELS[m],
      income: Math.round(val.income),
      expense: Math.round(val.expense),
    }
  })

  // ─── Presupuesto ──────────────────────────────────────────────────────
  const budgetUsed = budget != null && budget > 0 ? totalGastosAsignados : 0
  const budgetPct = budget != null && budget > 0 ? (budgetUsed / budget) * 100 : 0
  const budgetOverflow = budget != null && budget > 0 ? budgetUsed - budget : 0

  // ─── Fiscal ───────────────────────────────────────────────────────────
  const declaredIncomePaid = processedIncome.filter((i) => i.status === "PAID" && i.isDeclared).reduce((s, i) => s + Number(i.amount), 0)
  const ivaSoportado = expenseAllocations.filter((a) => a.invoice.isDeclared).reduce((s, a) => s + Number(a.invoice.vatAmount ?? 0), 0)
  const declaredExpenses = expenseAllocations.filter((a) => a.invoice.isDeclared).reduce((s, a) => s + Number(a.amount), 0)
  const vatRate = project.vatRate ?? 21
  const irpfRate = project.irpfRate ?? 0
  const ivaRepercutido = declaredIncomePaid * (vatRate / 100)
  const ivaAPagar = ivaRepercutido - ivaSoportado
  const irpfBase = declaredIncomePaid - declaredExpenses
  const irpfBruto = irpfBase * 0.2
  const retenciones = declaredIncomePaid * (irpfRate / 100)
  const irpfAPagar = Math.max(irpfBruto - retenciones, 0)
  const totalReserva = Math.max(ivaAPagar, 0) + irpfAPagar

  // ─── Cards de resumen ─────────────────────────────────────────────────
  const SUMMARY_CARDS = [
    { label: "Cobrado", value: formatCurrency(cobrado, currency), icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", border: "border-l-emerald-500" },
    { label: "Por cobrar", value: formatCurrency(porCobrar, currency), icon: Clock, color: "text-amber-600 dark:text-amber-400", border: "border-l-amber-500" },
    { label: "Vencido", value: vencido > 0 ? formatCurrency(vencido, currency) : "—", icon: XCircle, color: "text-destructive", border: "border-l-red-500" },
    { label: "Gastos", value: formatCurrency(totalGastosAsignados, currency), icon: ShoppingCart, color: "text-orange-600 dark:text-orange-400", border: "border-l-orange-500" },
    { label: "Ganancia real", value: formatCurrency(gananciaReal, currency), icon: Wallet, color: gananciaReal >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive", border: gananciaReal >= 0 ? "border-l-emerald-500" : "border-l-red-500", bold: true },
    { label: "Margen", value: cobrado > 0 ? `${margen.toFixed(0)}%` : "—", icon: Percent, color: margen >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive", border: margen >= 0 ? "border-l-emerald-500" : "border-l-red-500" },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href={`/projects/${id}`} />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {project.name}
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Finanzas del proyecto</h1>
        <p className="text-sm text-muted-foreground">
          Análisis financiero de <span className="font-medium text-foreground">{project.name}</span>
        </p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, color, border, bold }) => (
          <div key={label} className={`rounded-xl border bg-card border-l-4 ${border} p-4 space-y-1`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>
            <p className={`text-lg tabular-nums ${bold ? "font-bold" : "font-semibold"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Progreso del contrato */}
      {projectValue != null && projectValue > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Progreso de cobro del contrato</h2>
          <ContractProgress
            projectValue={projectValue}
            cobrado={cobrado}
            porCobrar={porCobrar}
            currency={currency}
          />
        </div>
      )}

      {/* Gráficos — 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cobros vs Gastos por mes + línea de ganancia */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 space-y-0.5">
            <h2 className="text-sm font-semibold">Cobros vs Gastos por mes</h2>
            <p className="text-xs text-muted-foreground">Barras + línea de ganancia neta</p>
          </div>
          <ProjectMonthlyBars data={monthlyData} />
        </div>

        {/* Gastos por categoría */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 space-y-0.5">
            <h2 className="text-sm font-semibold">¿En qué se gasta este proyecto?</h2>
            <p className="text-xs text-muted-foreground">Distribución de gastos asignados por categoría</p>
          </div>
          <ProjectExpenseDonut data={categoryData} total={totalGastosAsignados} />
        </div>
      </div>

      {/* (Cobros por factura eliminado — la info ya está en las cards) */}
      {false && (
      )}

      {/* Presupuesto de materiales */}
      {budget != null && budget > 0 && (
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold">Presupuesto de materiales</h2>
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
              Te acercas al límite del presupuesto
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(budgetUsed, currency)} / {formatCurrency(budget, currency)}
              </span>
              <span className={`font-medium tabular-nums ${budgetPct > 90 ? "text-red-600 dark:text-red-400" : budgetPct >= 70 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                {budgetPct.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${budgetPct > 90 ? "bg-red-500" : budgetPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(budgetPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Estimación fiscal */}
      {project.isDeclared && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Estimación fiscal del proyecto</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1 font-mono">
              <FiscalRow label={`IVA repercutido (${vatRate}%)`} value={formatCurrency(ivaRepercutido, currency)} />
              <FiscalRow label="IVA soportado" value={`-${formatCurrency(ivaSoportado, currency)}`} muted />
              <FiscalRow label="IVA a pagar" value={formatCurrency(Math.max(ivaAPagar, 0), currency)} highlight />
            </div>
            <div className="space-y-1 font-mono">
              <FiscalRow label="IRPF estimado (20%)" value={formatCurrency(irpfBruto, currency)} />
              {irpfRate > 0 && <FiscalRow label={`Retenciones (${irpfRate}%)`} value={`-${formatCurrency(retenciones, currency)}`} muted />}
              <FiscalRow label="IRPF a pagar" value={formatCurrency(irpfAPagar, currency)} highlight />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="font-semibold">Total a reservar para Hacienda</span>
            <span className="font-bold text-lg">{formatCurrency(totalReserva, currency)}</span>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>Estimación orientativa. Consulta con tu asesor fiscal para cálculos definitivos.</span>
          </div>
        </div>
      )}
    </div>
  )
}

function FiscalRow({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
      <span className={`tabular-nums ${highlight ? "font-semibold text-foreground" : muted ? "text-muted-foreground" : ""}`}>{value}</span>
    </div>
  )
}
