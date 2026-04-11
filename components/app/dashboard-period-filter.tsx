"use client"

import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const QUARTER_MONTHS: Record<number, string> = {
  1: "Ene-Mar",
  2: "Abr-Jun",
  3: "Jul-Sep",
  4: "Oct-Dic",
}

function getQuarterOptions(count = 8) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3)

  const options: { value: string; label: string }[] = []

  for (let i = 0; i < count; i++) {
    let q = currentQuarter - i
    let y = currentYear
    while (q <= 0) {
      q += 4
      y -= 1
    }
    options.push({
      value: `${y}-Q${q}`,
      label: `T${q} ${y} (${QUARTER_MONTHS[q]})`,
    })
  }

  return options
}

interface Props {
  selected: string[]
}

export function DashboardPeriodFilter({ selected }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const options = getQuarterOptions(8)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function toggle(value: string) {
    let next: string[]
    if (selected.includes(value)) {
      if (selected.length === 1) return // no deselect all
      next = selected.filter((q) => q !== value)
    } else {
      next = [...selected, value]
    }
    router.push(`/dashboard?q=${next.join(",")}`)
  }

  // Etiqueta del botón
  const label =
    selected.length === 1
      ? options.find((o) => o.value === selected[0])?.label ?? selected[0]
      : `${selected.length} trimestres`

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium shrink-0">Período:</span>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 h-8 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span className="max-w-[200px] truncate">{label}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 min-w-[220px] rounded-md border bg-popover shadow-md">
            <div className="p-1">
              {options.map((opt) => {
                const checked = selected.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      checked ? "border-primary bg-primary" : "border-input"
                    )}>
                      {checked && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className={cn(checked && "font-medium")}>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
