import { formatCurrency } from "@/lib/format"

interface BudgetProgressProps {
  budget: number
  invoiced: number
  currency: string
}

export function BudgetProgress({ budget, invoiced, currency }: BudgetProgressProps) {
  const pct = budget > 0 ? Math.min((invoiced / budget) * 100, 100) : 0
  const overBudget = invoiced > budget

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Facturado vs presupuesto</span>
        <span className={`font-medium tabular-nums ${overBudget ? "text-destructive" : ""}`}>
          {pct.toFixed(0)}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            overBudget
              ? "bg-destructive"
              : pct >= 80
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Facturado:{" "}
          <span className="font-medium text-foreground">
            {formatCurrency(invoiced, currency)}
          </span>
        </span>
        <span>
          Presupuesto:{" "}
          <span className="font-medium text-foreground">
            {formatCurrency(budget, currency)}
          </span>
        </span>
      </div>

      {overBudget && (
        <p className="text-xs text-destructive font-medium">
          ⚠ Excediste el presupuesto por{" "}
          {formatCurrency(invoiced - budget, currency)}
        </p>
      )}
    </div>
  )
}
