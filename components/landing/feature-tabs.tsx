"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Check,
  FolderKanban,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Calculator,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface FeatureTab {
  label: string
  icon: LucideIcon
  description: string
  highlights: string[]
}

const TABS: FeatureTab[] = [
  {
    label: "Proyectos",
    icon: FolderKanban,
    description:
      "Organiza tus proyectos con presupuesto, cliente, fechas y estado. Visualiza la rentabilidad de cada uno en tiempo real.",
    highlights: [
      "Valor del contrato y presupuesto de materiales",
      "Estado del proyecto (activo, completado, archivado)",
      "Forma de pago y número de cobros acordados",
      "IVA e IRPF configurables por proyecto",
    ],
  },
  {
    label: "Ingresos",
    icon: TrendingUp,
    description:
      "Registra lo que cobras a cada cliente. Controla pagos pendientes, marca cobros y recibe alertas de vencimiento.",
    highlights: [
      "Control de cobros pendientes y vencidos",
      "Forma de pago por ingreso",
      "Alerta cuando se acerca el vencimiento",
      "Marcado de cobros declarables",
    ],
  },
  {
    label: "Gastos",
    icon: ShoppingCart,
    description:
      "Registra compras y gastos del negocio. Reparte un gasto entre varios proyectos para saber cuánto te cuesta cada obra.",
    highlights: [
      "Reparto inteligente entre proyectos",
      "Categorías: material, herramientas, subcontrata...",
      "OCR: escanea el ticket y se rellena solo",
      "Gastos generales del negocio separados",
    ],
  },
  {
    label: "Dashboard",
    icon: BarChart3,
    description:
      "Gráficos profesionales de ingresos vs gastos, beneficio neto, gastos por categoría y reserva fiscal del trimestre.",
    highlights: [
      "Ingresos vs gastos mensual",
      "Beneficio bruto y neto tras impuestos",
      "Gastos por categoría (donut)",
      "Gauge de reserva fiscal (IVA + IRPF)",
    ],
  },
  {
    label: "Fiscal",
    icon: Calculator,
    description:
      "Estimación automática de IVA e IRPF trimestral. Estima cuánto reservar para Hacienda y cuándo toca presentar.",
    highlights: [
      "IVA repercutido y soportado",
      "Pago fraccionado IRPF (20%)",
      "Alerta de fecha de presentación",
      "Reportes exportables para el contador",
    ],
  },
]

export function FeatureTabs() {
  const [active, setActive] = useState(0)
  const current = TABS[active]!
  const Icon = current.icon

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {TABS.map((tab, i) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                i === active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <TabIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div key={current.label} className="grid md:grid-cols-2 gap-6 items-start">
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{current.label}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {current.description}
          </p>
        </div>

        <ul className="space-y-3">
          {current.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm transition-shadow hover:shadow-sm"
            >
              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
