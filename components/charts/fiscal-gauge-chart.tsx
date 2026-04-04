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
    <div className="flex flex-col items-center gap-2">
      {/* Gauge */}
      <div className="relative w-full" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={65}
              outerRadius={85}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="#6366f1" />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Importe total centrado */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">
          <span className="text-2xl font-bold text-foreground">{formatCurrency(totalReservar)}</span>
        </div>
      </div>

      {/* Desglose IVA + IRPF */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
          <span className="text-foreground font-medium">IVA: {formatCurrency(vatAmount)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-400 shrink-0" />
          <span className="text-foreground font-medium">IRPF: {formatCurrency(irpfAmount)}</span>
        </div>
      </div>

      {/* Porcentaje */}
      <p className="text-xs text-muted-foreground">
        {percentage.toFixed(1)}% de tus ingresos declarados
      </p>
    </div>
  )
}
