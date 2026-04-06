"use client"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  AreaChart, Area, ReferenceLine,
} from "recharts"
import { formatCurrency } from "@/lib/format"

// ─── Donut: En qué se gasta en este proyecto ────────────────────────────

export type CategoryItem = { category: string; total: number }

const CATEGORY_COLORS: Record<string, string> = {
  Material: "#3b82f6",
  Herramientas: "#f59e0b",
  "Mano de obra / Subcontrata": "#8b5cf6",
  Transporte: "#10b981",
  Alquiler: "#f43f5e",
  Suministros: "#06b6d4",
  Otros: "#6b7280",
  "Sin categoría": "#9ca3af",
}

export function ProjectExpenseDonut({ data, total }: { data: CategoryItem[]; total: number }) {
  const filtered = data.filter((d) => d.total > 0)

  if (filtered.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Sin gastos registrados en este proyecto.
      </div>
    )
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={filtered}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={80}
            dataKey="total"
            nameKey="category"
            paddingAngle={filtered.length > 1 ? 3 : 0}
          >
            {filtered.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? "#6b7280"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={50}
            formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: "50px" }}>
        <span className="text-lg font-bold">{formatCurrency(total)}</span>
        <span className="text-[10px] text-muted-foreground">total gastos</span>
      </div>
    </div>
  )
}

// ─── Barras: Cobros del proyecto (cuánto y cuándo) ──────────────────────

export type PaymentItem = { label: string; amount: number; status: "PAID" | "PENDING" | "OVERDUE" }

const STATUS_COLORS = { PAID: "#10b981", PENDING: "#f59e0b", OVERDUE: "#ef4444" }

export function ProjectPaymentsBar({ data }: { data: PaymentItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Sin cobros registrados.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} barSize={28}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={STATUS_COLORS[entry.status] ?? "#6b7280"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Área: Rentabilidad acumulada del proyecto ──────────────────────────

export type ProfitPoint = { label: string; cobrado: number; gastado: number; neto: number }

export function ProjectProfitArea({ data }: { data: ProfitPoint[] }) {
  if (data.length === 0 || data.every((d) => d.cobrado === 0 && d.gastado === 0)) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Sin datos suficientes.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="projProfitG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === "cobrado" ? "Cobrado" : name === "gastado" ? "Gastado" : "Beneficio neto",
          ]}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
        <Area
          type="monotone"
          dataKey="cobrado"
          stroke="#10b981"
          strokeWidth={2}
          fill="none"
          dot={{ r: 3, fill: "#10b981" }}
        />
        <Area
          type="monotone"
          dataKey="gastado"
          stroke="#f43f5e"
          strokeWidth={2}
          fill="none"
          dot={{ r: 3, fill: "#f43f5e" }}
          strokeDasharray="4 3"
        />
        <Area
          type="monotone"
          dataKey="neto"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#projProfitG)"
          dot={{ r: 3, fill: "#6366f1" }}
        />
        <Legend
          verticalAlign="bottom"
          height={30}
          formatter={(value: string) => (
            <span className="text-xs text-muted-foreground">
              {value === "cobrado" ? "Cobrado" : value === "gastado" ? "Gastado" : "Beneficio neto"}
            </span>
          )}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Barra de progreso del contrato ─────────────────────────────────────

export function ContractProgress({
  projectValue,
  cobrado,
  porCobrar,
  currency,
}: {
  projectValue: number
  cobrado: number
  porCobrar: number
  currency: string
}) {
  const pctCobrado = projectValue > 0 ? (cobrado / projectValue) * 100 : 0
  const pctPorCobrar = projectValue > 0 ? (porCobrar / projectValue) * 100 : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progreso de cobro</span>
        <span className="font-medium tabular-nums">{pctCobrado.toFixed(0)}% cobrado</span>
      </div>
      <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min(pctCobrado, 100)}%` }}
        />
        <div
          className="h-full bg-amber-500/50 transition-all"
          style={{ width: `${Math.min(pctPorCobrar, 100 - Math.min(pctCobrado, 100))}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Cobrado: {formatCurrency(cobrado, currency)}</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500/50" />Pendiente: {formatCurrency(porCobrar, currency)}</span>
        <span>Total: {formatCurrency(projectValue, currency)}</span>
      </div>
    </div>
  )
}
