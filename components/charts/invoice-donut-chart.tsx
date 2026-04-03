"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

export type StatusCount = {
  name: string
  value: number
  color: string
  status: string
}

interface InvoiceDonutChartProps {
  data: StatusCount[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: StatusCount }>
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{item.name}</p>
      <p className="text-muted-foreground">
        {item.value} factura{item.value !== 1 ? "s" : ""}
      </p>
    </div>
  )
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  )
}

export function InvoiceDonutChart({ data }: InvoiceDonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const filtered = data.filter((d) => d.value > 0)

  if (total === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Sin facturas todavía.
      </div>
    )
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={filtered}
            cx="50%"
            cy="45%"
            innerRadius={52}
            outerRadius={74}
            paddingAngle={filtered.length > 1 ? 3 : 0}
            dataKey="value"
            strokeWidth={0}
          >
            {filtered.map((entry) => (
              <Cell key={entry.status} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Total en el centro */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6">
        <span className="text-2xl font-bold">{total}</span>
        <span className="text-xs text-muted-foreground">facturas</span>
      </div>
    </div>
  )
}
