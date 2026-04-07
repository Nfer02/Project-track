import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { FileBarChart, TrendingUp, TrendingDown, Wallet, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/format"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { ReportExportButton } from "@/components/app/report-export-button"
import { QuarterSelector } from "@/components/app/quarter-selector"

export const metadata: Metadata = {
  title: "Reportes trimestrales — ProjectTrack",
}

const QUARTER_MONTHS: Record<number, string> = {
  1: "Ene-Mar",
  2: "Abr-Jun",
  3: "Jul-Sep",
  4: "Oct-Dic",
}

function getQuarterOptions() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3)

  const options: { value: string; label: string }[] = []

  for (let i = 0; i < 4; i++) {
    let q = currentQuarter - i
    let y = currentYear
    while (q <= 0) {
      q += 4
      y -= 1
    }
    options.push({
      value: `${y}-Q${q}`,
      label: `T${q} ${y} (${QUARTER_MONTHS[q]})`,
    })
  }

  return options
}

function parseQuarterParam(param: string | undefined): { year: number; quarter: number } {
  const now = new Date()
  const defaultYear = now.getFullYear()
  const defaultQuarter = Math.ceil((now.getMonth() + 1) / 3)

  if (!param) return { year: defaultYear, quarter: defaultQuarter }

  const match = param.match(/^(\d{4})-Q([1-4])$/)
  if (!match) return { year: defaultYear, quarter: defaultQuarter }

  return { year: parseInt(match[1]), quarter: parseInt(match[2]) }
}

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function ReportsPage({ searchParams }: Props) {
  const { q } = await searchParams
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const { year, quarter } = parseQuarterParam(q)
  const quarterStart = new Date(year, (quarter - 1) * 3, 1)
  const quarterEnd = new Date(year, quarter * 3, 0, 23, 59, 59)

  const declaredInvoices = await prisma.invoice.findMany({
    where: {
      workspaceId: ctx.workspace.id,
      isDeclared: true,
      issueDate: { gte: quarterStart, lte: quarterEnd },
    },
    include: { project: { select: { name: true } } },
    orderBy: { issueDate: "asc" },
  })

  const income = declaredInvoices.filter((i) => i.type === "INCOME")
  const expenses = declaredInvoices.filter((i) => i.type === "EXPENSE")

  const totalIncome = income.reduce((s, i) => s + Number(i.amount), 0)
  const totalExpenses = expenses.reduce((s, i) => s + Number(i.amount), 0)
  const netProfit = totalIncome - totalExpenses

  const quarterOptions = getQuarterOptions()
  const currentQValue = `${year}-Q${quarter}`

  const statusLabels: Record<string, string> = {
    DRAFT: "Borrador",
    PENDING: "Pendiente",
    PAID: "Pagada",
    OVERDUE: "Vencida",
    CANCELLED: "Cancelada",
  }

  // Calcular base imponible e IVA para cada factura
  const computeBase = (inv: (typeof declaredInvoices)[number]) => {
    const total = Number(inv.amount)
    const vat = inv.vatAmount ? Number(inv.vatAmount) : 0
    return total - vat
  }

  const csvRows = declaredInvoices.map((inv) => ({
    fecha: new Date(inv.issueDate).toLocaleDateString("es-ES"),
    tipo: inv.type === "INCOME" ? "Ingreso" : "Gasto",
    numero: inv.number,
    numeroFacturaProveedor: inv.externalNumber || "",
    nif: inv.counterpartNif || "",
    nombreClienteProveedor:
      inv.type === "INCOME"
        ? (inv.project?.name || "")
        : (inv.vendorName || ""),
    baseImponible: computeBase(inv).toFixed(2),
    iva: inv.vatAmount ? Number(inv.vatAmount).toFixed(2) : "0.00",
    total: Number(inv.amount).toFixed(2),
    estado: statusLabels[inv.status] || inv.status,
  }))

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Reportes trimestrales
          </h1>
          <p className="text-sm text-muted-foreground">
            Resumen informativo para preparar la declaración trimestral
          </p>
        </div>
        <ReportExportButton rows={csvRows} quarterLabel={currentQValue} />
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/50 border px-4 py-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Este informe es un resumen orientativo de los datos registrados en ProjectTrack. No constituye un documento fiscal oficial ni sustituye la revisión de un asesor fiscal cualificado. Los datos dependen de la información introducida por el usuario.</span>
      </div>

      {/* Quarter selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Trimestre:
        </span>
        <QuarterSelector options={quarterOptions} currentValue={currentQValue} />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total ingresos declarados
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-semibold tabular-nums">
              {formatCurrency(totalIncome, "EUR")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {income.length} factura{income.length !== 1 ? "s" : ""} emitida
              {income.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total gastos declarados
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-semibold tabular-nums">
              {formatCurrency(totalExpenses, "EUR")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} gasto{expenses.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Beneficio neto
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p
              className={`text-xl sm:text-2xl font-semibold tabular-nums ${
                netProfit < 0 ? "text-red-600" : ""
              }`}
            >
              {formatCurrency(netProfit, "EUR")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ingresos - Gastos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Facturas emitidas */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <FileBarChart className="h-4 w-4 text-emerald-600" />
          Ingresos registrados (declarados)
        </h2>
        {income.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-8 text-center">
            No hay facturas declaradas en este trimestre
          </p>
        ) : (
          <div className="rounded-xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                    N.&ordm;
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                    Proyecto
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                    NIF
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                    Descripci&oacute;n
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap hidden md:table-cell">
                    Fecha
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground whitespace-nowrap">
                    Importe
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {income.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      #{inv.number}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                      {inv.project?.name || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                      {inv.counterpartNif || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                      {inv.description || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs whitespace-nowrap">
                      {formatDate(inv.issueDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm whitespace-nowrap">
                      {formatCurrency(Number(inv.amount), inv.currency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="px-4 py-3 text-xs" colSpan={5}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                    {formatCurrency(totalIncome, "EUR")}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gastos */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <FileBarChart className="h-4 w-4 text-orange-600" />
          Gastos (declarados)
        </h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-8 text-center">
            No hay gastos declarados en este trimestre
          </p>
        ) : (
          <div className="rounded-xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                    N.&ordm;
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                    N.&ordm; Fra. Prov.
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                    Proveedor
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                    NIF
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                    Categor&iacute;a
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap hidden md:table-cell">
                    Fecha
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground whitespace-nowrap">
                    Importe
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenses.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      #{inv.number}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap hidden lg:table-cell">
                      {inv.externalNumber || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                      {inv.vendorName || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                      {inv.counterpartNif || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                      {inv.category || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs whitespace-nowrap">
                      {formatDate(inv.issueDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm whitespace-nowrap">
                      {formatCurrency(Number(inv.amount), inv.currency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="px-4 py-3 text-xs" colSpan={6}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                    {formatCurrency(totalExpenses, "EUR")}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
