"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/format"

export type IncomeExpenseData = {
  month: string
  income: number
  expenses: number
}

interface Props {
  data: IncomeExpenseData[]
}

function formatAmount(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
  return String(v)
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; dataKey: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const income = payload.find((p) => p.dataKey === "income")?.value ?? 0
  const expenses = payload.find((p) => p.dataKey === "expenses")?.value ?? 0
  const diff = income - expenses
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md space-y-1">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">
        <span className="text-emerald-500">●</span> Ingresos:{" "}
        <span className="font-medium text-foreground">{formatCurrency(income)}</span>
      </p>
      <p className="text-muted-foreground">
        <span className="text-rose-500">●</span> Gastos:{" "}
        <span className="font-medium text-foreground">{formatCurrency(expenses)}</span>
      </p>
      <p className="border-t pt-1 font-medium">
        Diferencia:{" "}
        <span className={diff >= 0 ? "text-emerald-600" : "text-rose-600"}>
          {formatCurrency(diff)}
        </span>
      </p>
    </div>
  )
}

export function IncomeExpenseBarChart({ data }: Props) {
  if (data.every((d) => d.income === 0 && d.expenses === 0)) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Sin datos de ingresos ni gastos en este período.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
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
          content={<CustomTooltip />}
          cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
        />
        <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
