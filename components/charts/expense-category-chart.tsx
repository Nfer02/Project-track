"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/format"

export type CategoryData = {
  category: string
  total: number
  count: number
}

interface Props {
  data: CategoryData[]
  totalExpenses: number
}

const CATEGORY_COLORS: Record<string, string> = {
  Material: "#3b82f6",
  Herramientas: "#f59e0b",
  "Mano de obra": "#8b5cf6",
  Subcontrata: "#8b5cf6",
  Transporte: "#10b981",
  Alquiler: "#f43f5e",
  Suministros: "#06b6d4",
  Otros: "#6b7280",
  "Sin categoría": "#9ca3af",
}

function getCategoryColor(category: string): string {
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category]
  const lower = category.toLowerCase()
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key.toLowerCase())) return color
  }
  return "#6b7280"
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: CategoryData & { fill: string } }>
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md space-y-1">
      <p className="font-medium">{item.payload.category}</p>
      <p className="text-muted-foreground">
        {formatCurrency(item.value)} · {item.payload.count} gasto{item.payload.count !== 1 ? "s" : ""}
      </p>
    </div>
  )
}

export function ExpenseCategoryChart({ data, totalExpenses }: Props) {
  const filtered = data.filter((d) => d.total > 0)

  if (filtered.length === 0 || totalExpenses === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Sin gastos registrados.
      </div>
    )
  }

  const chartData = filtered.map((d) => ({
    ...d,
    name: d.category,
    value: d.total,
  }))

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="40%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={filtered.length > 1 ? 3 : 0}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={getCategoryColor(entry.category)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Total en el centro */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center" style={{ top: "22%" }}>
        <div className="flex flex-col items-center justify-center h-[110px]">
          <span className="text-lg font-bold">{formatCurrency(totalExpenses)}</span>
          <span className="text-xs text-muted-foreground">total gastos</span>
        </div>
      </div>

      {/* Leyenda personalizada */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 -mt-4 px-2">
        {chartData.map((entry) => {
          const pct = totalExpenses > 0 ? ((entry.total / totalExpenses) * 100).toFixed(1) : "0"
          return (
            <div key={entry.category} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getCategoryColor(entry.category) }}
              />
              <span>{entry.category}</span>
              <span className="font-medium text-foreground">{pct}%</span>
              <span>({formatCurrency(entry.total)})</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
