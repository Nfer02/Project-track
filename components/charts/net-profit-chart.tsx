"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"
import { formatCurrency } from "@/lib/format"

export type NetProfitData = {
  month: string
  income: number
  expenses: number
  net: number        // bruto: income - expenses
  netAfterTax: number // neto real: income - expenses - IVA - IRPF estimado
}

interface Props {
  data: NetProfitData[]
}

function formatAmount(v: number): string {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`
  return String(v)
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: NetProfitData }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md space-y-1">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">
        <span className="text-emerald-500">●</span> Ingresos:{" "}
        <span className="font-medium text-foreground">{formatCurrency(d.income)}</span>
      </p>
      <p className="text-muted-foreground">
        <span className="text-rose-500">●</span> Gastos:{" "}
        <span className="font-medium text-foreground">{formatCurrency(d.expenses)}</span>
      </p>
      <p className="border-t pt-1">
        <span className="text-emerald-500">●</span> Beneficio bruto:{" "}
        <span className={`font-medium ${d.net >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {formatCurrency(d.net)}
        </span>
      </p>
      <p>
        <span className="text-indigo-500">●</span> Neto tras impuestos:{" "}
        <span className={`font-medium ${d.netAfterTax >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
          {formatCurrency(d.netAfterTax)}
        </span>
      </p>
    </div>
  )
}

export function NetProfitChart({ data }: Props) {
  if (data.every((d) => d.income === 0 && d.expenses === 0)) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Sin datos de beneficio en este período.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="netProfitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="netAfterTaxGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          width={45}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "4 4" }}
        />
        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
        <Area
          type="monotone"
          dataKey="net"
          name="Beneficio bruto"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#netProfitGradient)"
          dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
        />
        <Area
          type="monotone"
          dataKey="netAfterTax"
          name="Neto tras impuestos"
          stroke="#6366f1"
          strokeWidth={2}
          strokeDasharray="6 3"
          fill="url(#netAfterTaxGradient)"
          dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
        />
        <Legend
          verticalAlign="bottom"
          height={30}
          formatter={(value: string) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
