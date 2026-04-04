"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/format"

interface Props {
  totalReservar: number
  vatAmount: number
  irpfAmount: number
  incomesTotal: number
}

export function FiscalGaugeChart({ totalReservar, vatAmount, irpfAmount, incomesTotal }: Props) {
  if (incomesTotal <= 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Sin datos de ingresos.
      </div>
    )
  }

  const percentage = Math.min((totalReservar / incomesTotal) * 100, 100)
  const filled = percentage
  const remaining = 100 - percentage

  const gaugeData = [
    { name: "Reservado", value: filled },
    { name: "Restante", value: remaining },
  ]

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill="#6366f1" />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Texto central */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -mt-4">
        <span className="text-xl font-bold">{formatCurrency(totalReservar)}</span>
        <span className="text-[11px] text-muted-foreground mt-0.5">
          IVA: {formatCurrency(vatAmount)} + IRPF: {formatCurrency(irpfAmount)}
        </span>
      </div>

      {/* Porcentaje debajo */}
      <div className="text-center -mt-6">
        <span className="text-sm font-medium text-muted-foreground">
          {percentage.toFixed(1)}% de tus ingresos
        </span>
      </div>
    </div>
  )
}
