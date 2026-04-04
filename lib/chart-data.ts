import type { MonthlyData } from "@/components/charts/revenue-bar-chart"
import type { StatusCount } from "@/components/charts/invoice-donut-chart"

type InvoiceForChart = {
  status: string
  amount: { toString(): string } | number | string
  issueDate: Date
  type?: string // "INCOME" | "EXPENSE"
  category?: string | null
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

/**
 * Agrupa facturas por mes (últimos N meses) y status.
 */
export function buildMonthlyData(invoices: InvoiceForChart[], months = 6): MonthlyData[] {
  const now = new Date()
  const result: MonthlyData[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()

    const monthInvoices = invoices.filter((inv) => {
      const issued = new Date(inv.issueDate)
      return issued.getFullYear() === year && issued.getMonth() === month
    })

    const paid = monthInvoices
      .filter((i) => i.status === "PAID")
      .reduce((s, i) => s + Number(i.amount), 0)

    const pending = monthInvoices
      .filter((i) => i.status === "PENDING")
      .reduce((s, i) => s + Number(i.amount), 0)

    const overdue = monthInvoices
      .filter((i) => i.status === "OVERDUE")
      .reduce((s, i) => s + Number(i.amount), 0)

    result.push({
      month: MONTH_LABELS[month],
      paid: Math.round(paid),
      pending: Math.round(pending),
      overdue: Math.round(overdue),
    })
  }

  return result
}

const STATUS_CONFIG: Record<string, { name: string; color: string }> = {
  PAID: { name: "Cobrada", color: "hsl(142 71% 45%)" },
  PENDING: { name: "Pendiente", color: "hsl(38 92% 50%)" },
  OVERDUE: { name: "Vencida", color: "hsl(0 72% 51%)" },
  DRAFT: { name: "Borrador", color: "hsl(215 20% 65%)" },
  CANCELLED: { name: "Cancelada", color: "hsl(215 20% 80%)" },
}

/**
 * Cuenta facturas por status para el donut chart.
 */
export function buildStatusCounts(invoices: InvoiceForChart[]): StatusCount[] {
  const counts: Record<string, number> = {}

  for (const inv of invoices) {
    counts[inv.status] = (counts[inv.status] ?? 0) + 1
  }

  return Object.entries(STATUS_CONFIG).map(([status, { name, color }]) => ({
    status,
    name,
    color,
    value: counts[status] ?? 0,
  }))
}

/**
 * Suma el total facturado y cobrado de una lista de invoices.
 */
export function buildInvoiceSummary(invoices: InvoiceForChart[]) {
  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount), 0)
  const totalPaid = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + Number(i.amount), 0)
  const totalPending = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((s, i) => s + Number(i.amount), 0)
  const totalOverdue = invoices
    .filter((i) => i.status === "OVERDUE")
    .reduce((s, i) => s + Number(i.amount), 0)

  return { totalInvoiced, totalPaid, totalPending, totalOverdue }
}

// ---------------------------------------------------------------------------
// New utility functions for income/expense refactor
// ---------------------------------------------------------------------------

/**
 * Filtra facturas por tipo (INCOME o EXPENSE).
 */
export function filterByType(invoices: InvoiceForChart[], type: "INCOME" | "EXPENSE"): InvoiceForChart[] {
  return invoices.filter((i) => i.type === type)
}

/**
 * Resumen de gastos: total, pagados y pendientes.
 */
export function buildExpenseSummary(invoices: InvoiceForChart[]) {
  const expenses = invoices.filter((i) => i.type === "EXPENSE")
  const totalExpenses = expenses.reduce((s, i) => s + Number(i.amount), 0)
  const totalPaidExpenses = expenses
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + Number(i.amount), 0)
  const totalPendingExpenses = expenses
    .filter((i) => i.status === "PENDING")
    .reduce((s, i) => s + Number(i.amount), 0)
  return { totalExpenses, totalPaidExpenses, totalPendingExpenses }
}

/**
 * Calcula ganancia neta: ingresos cobrados - gastos pagados.
 */
export function buildNetProfit(invoices: InvoiceForChart[]) {
  const income = invoices
    .filter((i) => i.type === "INCOME" && i.status === "PAID")
    .reduce((s, i) => s + Number(i.amount), 0)
  const expenses = invoices
    .filter((i) => i.type === "EXPENSE" && i.status === "PAID")
    .reduce((s, i) => s + Number(i.amount), 0)
  return income - expenses
}

/**
 * Agrupa facturas por mes incluyendo campo de gastos.
 * Retorna: { month, paid, pending, overdue, expenses }[]
 */
export function buildMonthlyDataWithExpenses(invoices: InvoiceForChart[], months = 6) {
  const now = new Date()
  const result: { month: string; paid: number; pending: number; overdue: number; expenses: number }[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()

    const monthInvoices = invoices.filter((inv) => {
      const issued = new Date(inv.issueDate)
      return issued.getFullYear() === year && issued.getMonth() === month
    })

    const incomeInvoices = monthInvoices.filter((inv) => inv.type !== "EXPENSE")
    const expenseInvoices = monthInvoices.filter((inv) => inv.type === "EXPENSE")

    const paid = incomeInvoices
      .filter((i) => i.status === "PAID")
      .reduce((s, i) => s + Number(i.amount), 0)

    const pending = incomeInvoices
      .filter((i) => i.status === "PENDING")
      .reduce((s, i) => s + Number(i.amount), 0)

    const overdue = incomeInvoices
      .filter((i) => i.status === "OVERDUE")
      .reduce((s, i) => s + Number(i.amount), 0)

    const expenses = expenseInvoices.reduce((s, i) => s + Number(i.amount), 0)

    result.push({
      month: MONTH_LABELS[month],
      paid: Math.round(paid),
      pending: Math.round(pending),
      overdue: Math.round(overdue),
      expenses: Math.round(expenses),
    })
  }

  return result
}

/**
 * Agrupa gastos por categoría.
 * Retorna: { category, total, count }[]
 */
export function buildCategorySummary(invoices: InvoiceForChart[]) {
  const expenses = invoices.filter((i) => i.type === "EXPENSE")
  const map = new Map<string, { total: number; count: number }>()

  for (const inv of expenses) {
    const cat = inv.category ?? "Sin categoría"
    const entry = map.get(cat) ?? { total: 0, count: 0 }
    entry.total += Number(inv.amount)
    entry.count += 1
    map.set(cat, entry)
  }

  return Array.from(map.entries()).map(([category, { total, count }]) => ({
    category,
    total: Math.round(total),
    count,
  }))
}
