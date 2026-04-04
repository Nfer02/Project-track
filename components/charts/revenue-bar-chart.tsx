"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

export type MonthlyData = {
  month: string   // "Ene", "Feb", ...
  paid: number
  pending: number
  overdue: number
}

interface RevenueBarChartProps {
  data: MonthlyData[]
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
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0)
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md space-y-1">
      <p className="font-medium">{label}</p>
      {payload.map((p) =>
        p.value > 0 ? (
          <p key={p.name} className="text-muted-foreground">
            <span style={{ color: p.fill }}>●</span>{" "}
            {p.name}:{" "}
            <span className="font-medium text-foreground">
              {currency} {p.value.toLocaleString("es-AR")}
            </span>
          </p>
        ) : null
      )}
      {payload.length > 1 && total > 0 && (
        <p className="border-t pt-1 font-medium">
          Total: {currency} {total.toLocaleString("es-AR")}
        </p>
      )}
    </div>
  )
}

export function RevenueBarChart({ data, currency = "EUR" }: RevenueBarChartProps) {
  if (data.every((d) => d.paid === 0 && d.pending === 0 && d.overdue === 0)) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Sin datos de facturación en este período.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={20} barGap={2}>
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
        <Bar dataKey="paid" name="Cobrada" stackId="a" fill="hsl(142 71% 45%)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="pending" name="Pendiente" stackId="a" fill="hsl(38 92% 50%)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="overdue" name="Vencida" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
