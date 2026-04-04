"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  ShoppingCart,
  FolderKanban,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  Wallet,
  BarChart3,
  Clock,
} from "lucide-react"

interface Screen {
  id: string
  title: string
  description: string
}

const SCREENS: Screen[] = [
  {
    id: "dashboard",
    title: "Dashboard financiero completo",
    description: "Gráficos de ingresos vs gastos, beneficio neto, categorías de gasto y reserva fiscal del trimestre",
  },
  {
    id: "projects",
    title: "Gestión de proyectos",
    description: "Cada proyecto con valor de contrato, presupuesto, IVA configurable y rentabilidad en tiempo real",
  },
  {
    id: "expenses",
    title: "Control de gastos con reparto",
    description: "Reparte un gasto entre varios proyectos automáticamente y controla los gastos generales",
  },
  {
    id: "ocr",
    title: "OCR inteligente con IA",
    description: "Sube una foto del ticket y la inteligencia artificial extrae todos los datos en segundos",
  },
]

function DashboardMockup() {
  return (
    <div className="space-y-3">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Ingresos del mes", value: "18.750 €", icon: TrendingUp, color: "text-emerald-400", border: "border-l-emerald-500" },
          { label: "Gastos del mes", value: "6.320 €", icon: ShoppingCart, color: "text-orange-400", border: "border-l-orange-500" },
          { label: "Beneficio neto", value: "12.430 €", icon: TrendingUp, color: "text-blue-400", border: "border-l-blue-500" },
          { label: "Reserva fiscal", value: "4.815 €", icon: Wallet, color: "text-violet-400", border: "border-l-violet-500" },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg bg-slate-800/80 border border-slate-700/50 border-l-2 ${s.border} p-2`}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[7px] sm:text-[8px] text-slate-400 truncate">{s.label}</span>
              <s.icon className={`h-2.5 w-2.5 ${s.color} shrink-0`} />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Ingresos vs Gastos bar chart */}
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5">
          <p className="text-[8px] font-medium text-slate-400 mb-1.5">Ingresos vs Gastos — 6 meses</p>
          <div className="flex items-end gap-2 h-16">
            {[
              { i: 30, g: 15 }, { i: 45, g: 20 }, { i: 55, g: 25 },
              { i: 70, g: 30 }, { i: 85, g: 35 }, { i: 95, g: 40 },
            ].map((d, idx) => (
              <div key={idx} className="flex-1 flex gap-[2px] items-end">
                <div className="flex-1 rounded-t-sm bg-emerald-500" style={{ height: `${d.i}%` }} />
                <div className="flex-1 rounded-t-sm bg-rose-400/70" style={{ height: `${d.g}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["Nov", "Dic", "Ene", "Feb", "Mar", "Abr"].map((m) => (
              <span key={m} className="text-[6px] text-slate-500 flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>

        {/* Gastos por categoría donut */}
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5">
          <p className="text-[8px] font-medium text-slate-400 mb-1">Gastos por categoría</p>
          <div className="flex items-center justify-center h-16">
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="13" fill="none" stroke="#1e293b" strokeWidth="4" />
                <circle cx="18" cy="18" r="13" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="42 40" />
                <circle cx="18" cy="18" r="13" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="18 64" strokeDashoffset="-42" />
                <circle cx="18" cy="18" r="13" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="14 68" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="13" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 74" strokeDashoffset="-74" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[7px] font-bold text-white">6.320 €</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-center mt-0.5">
            {[
              { c: "bg-blue-500", l: "Material 52%" },
              { c: "bg-amber-500", l: "Herram. 22%" },
              { c: "bg-violet-500", l: "Subcontr. 17%" },
              { c: "bg-emerald-500", l: "Transp. 9%" },
            ].map((x) => (
              <span key={x.l} className="text-[6px] text-slate-400 flex items-center gap-0.5">
                <span className={`h-1 w-1 rounded-full ${x.c}`} />{x.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: beneficio neto + gauge fiscal */}
      <div className="grid grid-cols-2 gap-2">
        {/* Beneficio neto area chart */}
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5">
          <p className="text-[8px] font-medium text-slate-400 mb-1">Beneficio mensual</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <svg viewBox="0 0 120 40" className="w-full h-10">
                <defs>
                  <linearGradient id="profitG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 L20,28 L40,22 L60,18 L80,12 L100,8 L120,5 L120,40 L0,40Z" fill="url(#profitG)" />
                <polyline points="0,35 20,28 40,22 60,18 80,12 100,8 120,5" fill="none" stroke="#10b981" strokeWidth="1.5" />
                <polyline points="0,38 20,33 40,30 60,28 80,24 100,22 120,20" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" />
              </svg>
            </div>
          </div>
          <div className="flex gap-3 mt-0.5">
            <span className="text-[6px] text-slate-400 flex items-center gap-0.5"><span className="h-1 w-3 bg-emerald-500 rounded" />Bruto</span>
            <span className="text-[6px] text-slate-400 flex items-center gap-0.5"><span className="h-1 w-3 bg-indigo-500 rounded border-dashed" />Neto</span>
          </div>
        </div>

        {/* Gauge fiscal */}
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5">
          <p className="text-[8px] font-medium text-slate-400 mb-0.5">Reserva fiscal T2</p>
          <div className="flex items-center justify-center">
            <div className="relative h-12 w-20">
              <svg viewBox="0 0 100 55" className="w-full h-full">
                <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                <path d="M10,50 A40,40 0 0,1 66,14" fill="none" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <span className="text-[9px] font-bold text-white">4.815 €</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-0.5">
            <span className="text-[6px] text-slate-400 flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />IVA: 2.984 €</span>
            <span className="text-[6px] text-slate-400 flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-violet-400" />IRPF: 1.831 €</span>
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
        { name: "Reforma integral Piso Centro", client: "María López Fernández", value: "28.500 €", budget: "8.200 €", vat: "10%", status: "Activo", color: "bg-emerald-500", profit: "+62%", profitColor: "text-emerald-400" },
        { name: "Rehabilitación fachada Goya", client: "Comunidad Goya 45", value: "45.000 €", budget: "15.000 €", vat: "21%", status: "Activo", color: "bg-emerald-500", profit: "+48%", profitColor: "text-emerald-400" },
        { name: "Cocina completa Salamanca", client: "Javier Moreno", value: "12.800 €", budget: "4.500 €", vat: "10%", status: "Completado", color: "bg-blue-500", profit: "+55%", profitColor: "text-emerald-400" },
        { name: "Baño accesible Chamberí", client: "Rosa Martín Díaz", value: "7.200 €", budget: "2.100 €", vat: "10%", status: "Activo", color: "bg-emerald-500", profit: "+71%", profitColor: "text-emerald-400" },
      ].map((p) => (
        <div key={p.name} className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[10px] sm:text-xs font-semibold text-white truncate">{p.name}</p>
              <span className={`text-[7px] px-1 py-0.5 rounded-full ${p.color} text-white font-medium shrink-0`}>{p.status}</span>
            </div>
            <p className="text-[8px] text-slate-400">{p.client} · IVA {p.vat}</p>
          </div>
          <div className="text-right shrink-0 space-y-0.5">
            <p className="text-[10px] sm:text-xs font-bold text-white">{p.value}</p>
            <p className={`text-[8px] font-medium ${p.profitColor}`}>{p.profit} margen</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ExpensesMockup() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2 text-center">
          <p className="text-[7px] text-slate-400">Total gastos</p>
          <p className="text-[10px] sm:text-xs font-bold text-white">6.320 €</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 border-l-2 border-l-violet-500 p-2 text-center">
          <p className="text-[7px] text-violet-400">Generales</p>
          <p className="text-[10px] sm:text-xs font-bold text-white">890 €</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2 text-center">
          <p className="text-[7px] text-slate-400">En proyectos</p>
          <p className="text-[10px] sm:text-xs font-bold text-white">5.430 €</p>
        </div>
      </div>

      {/* Gasto repartido ejemplo */}
      <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] font-medium text-white">BigMat Materiales</p>
            <span className="text-[7px] px-1 py-0.5 rounded bg-slate-700 text-slate-300">Material</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white">1.200 €</p>
            <p className="text-[7px] text-emerald-400">Pagada</p>
          </div>
        </div>
        <p className="text-[7px] text-slate-400 mb-1.5">Repartido entre proyectos:</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-slate-300">Piso Centro</span>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-white font-medium">720 €</span>
              <span className="text-[7px] text-slate-500">60%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-slate-300">Fachada Goya</span>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-white font-medium">480 €</span>
              <span className="text-[7px] text-slate-500">40%</span>
            </div>
          </div>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: "100%" }} />
        </div>
        <p className="text-[6px] text-slate-500 mt-0.5">100% asignado</p>
      </div>

      <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-mono text-slate-500">#G-008</span>
            <span className="text-[7px] px-1 py-0.5 rounded bg-slate-700 text-slate-300">Herramientas</span>
          </div>
          <p className="text-[10px] font-medium text-white mt-0.5">Ferretería Industrial S.L.</p>
          <p className="text-[7px] text-violet-400 italic">Gasto general</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold text-white">89,50 €</p>
          <p className="text-[7px] text-amber-400">Pendiente</p>
        </div>
      </div>
    </div>
  )
}

function OcrMockup() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Upload zone */}
        <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 flex flex-col items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <p className="text-[9px] text-slate-300 text-center font-medium">Sube foto o PDF</p>
          <p className="text-[7px] text-slate-500 text-center">La IA analiza y extrae los datos</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] text-emerald-400">Analizado correctamente</span>
          </div>
        </div>

        {/* Extracted data */}
        <div className="rounded-lg bg-slate-800/80 border border-emerald-500/30 p-3 space-y-1.5">
          <p className="text-[8px] font-medium text-emerald-400 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Datos extraídos por IA
          </p>
          {[
            { label: "Proveedor", value: "Leroy Merlin" },
            { label: "Base imponible", value: "203,13 €" },
            { label: "IVA (21%)", value: "42,67 €" },
            { label: "Total", value: "245,80 €" },
            { label: "Fecha", value: "03/04/2026" },
            { label: "Descripción", value: "Cemento, ladrillos, yeso" },
          ].map((f) => (
            <div key={f.label} className="flex justify-between">
              <span className="text-[7px] text-slate-500">{f.label}</span>
              <span className="text-[8px] font-medium text-white">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow + result */}
      <div className="rounded-lg bg-slate-800/80 border border-slate-700/50 p-2.5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Check className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-medium text-white">Formulario auto-rellenado</p>
          <p className="text-[7px] text-slate-400">Todos los campos se han completado. Solo revisa y guarda.</p>
        </div>
      </div>
    </div>
  )
}

const MOCKUPS: Record<string, () => React.ReactElement> = {
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
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/50 bg-slate-900/90">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 mx-8">
            <div className="rounded-md bg-slate-800 px-3 py-1 text-center">
              <span className="text-[10px] text-slate-400">projecttrack.app/{screen.id}</span>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 min-h-[260px] sm:min-h-[300px]">
          <Mockup />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-4">
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

        <div className="text-center">
          <h3 className="text-base font-semibold">{screen.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{screen.description}</p>
        </div>
      </div>
    </div>
  )
}
