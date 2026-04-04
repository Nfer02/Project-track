"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  FolderKanban,
  ShoppingCart,
  FileText,
  TrendingUp,
  TrendingDown,
  Check,
  Clock,
  AlertCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Screen {
  id: string
  title: string
  description: string
}

const SCREENS: Screen[] = [
  {
    id: "dashboard",
    title: "Dashboard financiero",
    description: "Visión completa de tu negocio: ingresos, gastos, beneficio neto y reserva fiscal",
  },
  {
    id: "projects",
    title: "Gestión de proyectos",
    description: "Cada proyecto con su presupuesto, cliente, estado y rentabilidad en tiempo real",
  },
  {
    id: "expenses",
    title: "Control de gastos",
    description: "Reparte gastos entre proyectos y controla cuánto gastas en cada obra",
  },
  {
    id: "ocr",
    title: "OCR inteligente",
    description: "Sube una foto del ticket y la IA extrae proveedor, importe e IVA automáticamente",
  },
]

function DashboardMockup() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Ingresos", value: "4.500 €", color: "border-l-emerald-500", icon: TrendingUp, iconColor: "text-emerald-500" },
          { label: "Gastos", value: "1.850 €", color: "border-l-orange-500", icon: ShoppingCart, iconColor: "text-orange-500" },
          { label: "Beneficio", value: "2.650 €", color: "border-l-blue-500", icon: TrendingUp, iconColor: "text-blue-500" },
          { label: "Proyectos", value: "5", color: "border-l-violet-500", icon: FolderKanban, iconColor: "text-violet-500" },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg bg-slate-800/80 border border-slate-700/50 border-l-2 ${s.color} p-2.5`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-slate-400">{s.label}</span>
              <s.icon className={`h-3 w-3 ${s.iconColor}`} />
            </div>
            <p className="text-sm font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-3">
          <p className="text-[9px] font-medium text-slate-400 mb-2">Ingresos vs Gastos</p>
          <div className="flex items-end gap-1.5 h-20">
            {[
              { income: 15, expense: 8 },
              { income: 25, expense: 12 },
              { income: 40, expense: 18 },
              { income: 60, expense: 22 },
              { income: 75, expense: 30 },
              { income: 90, expense: 35 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex gap-0.5 items-end">
                <div className="flex-1 rounded-t bg-emerald-500/80" style={{ height: `${d.income}%` }} />
                <div className="flex-1 rounded-t bg-rose-500/60" style={{ height: `${d.expense}%` }} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-1.5">
            <span className="text-[8px] text-slate-500 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Ingresos</span>
            <span className="text-[8px] text-slate-500 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />Gastos</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-3">
          <p className="text-[9px] font-medium text-slate-400 mb-2">Gastos por categoría</p>
          <div className="flex items-center justify-center h-20">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#334155" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="55 33" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="15 73" strokeDashoffset="-55" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="10 78" strokeDashoffset="-70" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">1.850 €</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-1 justify-center">
            <span className="text-[8px] text-slate-500 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />Material</span>
            <span className="text-[8px] text-slate-500 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Herram.</span>
            <span className="text-[8px] text-slate-500 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />Subcontr.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectsMockup() {
  return (
    <div className="space-y-2">
      {[
        { name: "CALLE SUCRE 6", client: "Marisol García", value: "4.500 €", status: "Activo", statusColor: "bg-emerald-500", progress: 80 },
        { name: "ALMAGRO 37", client: "Juliarly", value: "12.000 €", status: "Activo", statusColor: "bg-emerald-500", progress: 45 },
        { name: "SAN MODESTO 44", client: "Pedro Ruiz", value: "8.500 €", status: "Activo", statusColor: "bg-emerald-500", progress: 60 },
        { name: "RÍO TAJO 124", client: "Ana López", value: "22.000 €", status: "Completado", statusColor: "bg-blue-500", progress: 100 },
      ].map((p) => (
        <div key={p.name} className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-xs font-semibold text-white truncate">{p.name}</p>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${p.statusColor} text-white font-medium`}>{p.status}</span>
            </div>
            <p className="text-[9px] text-slate-400">{p.client}</p>
            <div className="mt-1.5 h-1 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-white">{p.value}</p>
            <p className="text-[8px] text-slate-500">contrato</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ExpensesMockup() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 mb-1">
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2 text-center">
          <p className="text-[8px] text-slate-400">Total gastos</p>
          <p className="text-xs font-bold text-white">9.150 €</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 border-l-2 border-l-violet-500 p-2 text-center">
          <p className="text-[8px] text-violet-400">Generales</p>
          <p className="text-xs font-bold text-white">2,90 €</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2 text-center">
          <p className="text-[8px] text-slate-400">Asignados</p>
          <p className="text-xs font-bold text-white">9.147 €</p>
        </div>
      </div>
      {[
        { number: "G-001", vendor: "Leroy Merlin", category: "Material", amount: "1.000 €", projects: "CALLE SUCRE 6", status: "Pagada" },
        { number: "G-002", vendor: "MAXI CHINA", category: "Herramientas", amount: "9,95 €", projects: "3 proyectos", status: "Pagada" },
        { number: "G-003", vendor: "ElectroStock", category: "Material", amount: "450 €", projects: "ALMAGRO 37", status: "Pendiente" },
      ].map((e) => (
        <div key={e.number} className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-500">#{e.number}</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{e.category}</span>
            </div>
            <p className="text-xs font-medium text-white mt-0.5">{e.vendor}</p>
            <p className="text-[8px] text-slate-400">{e.projects}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-bold text-white">{e.amount}</p>
            <span className={`text-[8px] ${e.status === "Pagada" ? "text-emerald-400" : "text-amber-400"}`}>{e.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function OcrMockup() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-3 flex flex-col items-center justify-center gap-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <p className="text-[9px] text-slate-400 text-center">Sube foto o PDF</p>
        <div className="w-full h-px bg-slate-700 my-1" />
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] text-emerald-400">Analizando con IA...</span>
        </div>
      </div>
      <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-3 space-y-1.5">
        <p className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
          <Check className="h-3 w-3 text-emerald-500" />
          Datos extraídos
        </p>
        {[
          { label: "Proveedor", value: "Leroy Merlin" },
          { label: "Importe", value: "245,80 €" },
          { label: "IVA (21%)", value: "42,67 €" },
          { label: "Base", value: "203,13 €" },
          { label: "Fecha", value: "04/04/2026" },
        ].map((f) => (
          <div key={f.label} className="flex justify-between">
            <span className="text-[8px] text-slate-500">{f.label}</span>
            <span className="text-[9px] font-medium text-white">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const MOCKUPS: Record<string, () => JSX.Element> = {
  dashboard: DashboardMockup,
  projects: ProjectsMockup,
  expenses: ExpensesMockup,
  ocr: OcrMockup,
}

export function AppShowcase() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SCREENS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const screen = SCREENS[active]!
  const Mockup = MOCKUPS[screen.id]!

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Browser frame */}
      <div className="rounded-xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/50 bg-slate-900">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 mx-8">
            <div className="rounded-md bg-slate-800 px-3 py-1 text-center">
              <span className="text-[10px] text-slate-400">projecttrack.app/dashboard</span>
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="p-4 min-h-[280px] sm:min-h-[320px]">
          <Mockup />
        </div>
      </div>

      {/* Controls below */}
      <div className="mt-6 flex flex-col items-center gap-4">
        {/* Navigation dots + arrows */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActive((prev) => (prev - 1 + SCREENS.length) % SCREENS.length)}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {SCREENS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === active ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setActive((prev) => (prev + 1) % SCREENS.length)}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Title + description */}
        <div className="text-center">
          <h3 className="text-base font-semibold">{screen.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{screen.description}</p>
        </div>
      </div>
    </div>
  )
}
