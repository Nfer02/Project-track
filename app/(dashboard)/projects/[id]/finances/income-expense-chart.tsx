"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export type IncomeExpenseData = {
  month: string
  paid: number
  pending: number
  overdue: number
  expenses: number
}

interface Props {
  data: IncomeExpenseData[]
  currency?: string
}

function formatAmount(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
  return String(v)
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; fill: string }>
  label?: string
  currency?: string
}

function CustomTooltip({ active, payload, label, currency = "EUR" }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md space-y-1">
      <p className="font-medium">{label}</p>
      {payload.map((p) =>
        p.value > 0 ? (
          <p key={p.name} className="text-muted-foreground">
            <span style={{ color: p.fill }}>●</span>{" "}
            {p.name}:{" "}
            <span className="font-medium text-foreground">
              {currency} {p.value.toLocaleString("es-ES")}
            </span>
          </p>
        ) : null,
      )}
    </div>
  )
}

export function IncomeExpenseChart({ data, currency = "EUR" }: Props) {
  const hasData = data.some((d) => d.paid > 0 || d.pending > 0 || d.expenses > 0)

  if (!hasData) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Sin datos en este periodo.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barSize={16} barGap={4}>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatAmount}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          content={<CustomTooltip currency={currency} />}
          cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
        />
        <Legend
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar
          dataKey="paid"
          name="Ingresos cobrados"
          fill="hsl(142 71% 45%)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="pending"
          name="Ingresos pendientes"
          fill="hsl(38 92% 50%)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          name="Gastos"
          fill="hsl(0 72% 51%)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
