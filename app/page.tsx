import Link from "next/link"
import { redirect } from "next/navigation"
import {
  BarChart3,
  FileText,
  FolderKanban,
  Users,
  Zap,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "ProjectTrack — Gestión financiera para autónomos y freelancers",
  description:
    "Lleva el control de tus proyectos, facturas e ingresos en un solo lugar. Diseñado para freelancers y autónomos en España y Latinoamérica.",
}

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Proyectos organizados",
    description:
      "Creá proyectos, asigná presupuestos y seguí el estado de cada uno. Nunca más perdés el hilo de tu trabajo.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: FileText,
    title: "Facturas sin burocracia",
    description:
      "Generá y gestioná facturas en segundos. Numeración automática, seguimiento de cobros y alertas de vencimiento.",
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Dashboard financiero",
    description:
      "Visualizá tus ingresos mensuales, pendientes y vencidos en un gráfico claro. Tomá decisiones con datos reales.",
    color: "text-violet-600 bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "OCR con IA (PRO)",
    description:
      "Subí una foto o PDF de una factura recibida y Claude AI extrae automáticamente todos los datos relevantes.",
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Colaboradores (PRO)",
    description:
      "Invitá a tu equipo, asistente o contador. Cada uno con su propio rol y permisos sobre el workspace.",
    color: "text-rose-600 bg-rose-500/10",
  },
  {
    icon: Shield,
    title: "Seguro y privado",
    description:
      "Tus datos se almacenan con cifrado en Supabase. Solo vos (y quien invites) tenés acceso a tu información.",
    color: "text-slate-600 bg-slate-500/10",
  },
]

const FREE_FEATURES = [
  { label: "1 proyecto activo", included: true },
  { label: "Hasta 10 facturas/mes", included: true },
  { label: "Dashboard básico", included: true },
  { label: "Proyectos ilimitados", included: false },
  { label: "Upload + OCR con IA", included: false },
  { label: "Colaboradores", included: false },
  { label: "Soporte prioritario", included: false },
]

const PRO_FEATURES = [
  { label: "Proyectos ilimitados", included: true },
  { label: "Facturas ilimitadas", included: true },
  { label: "Dashboard financiero avanzado", included: true },
  { label: "Upload + OCR con IA (Claude)", included: true },
  { label: "Colaboradores (hasta 10)", included: true },
  { label: "Exportación a PDF", included: true },
  { label: "Soporte prioritario", included: true },
]

const STEPS = [
  {
    step: "01",
    title: "Creá tu workspace",
    description: "Registrate gratis y configurá tu espacio de trabajo en menos de 2 minutos.",
  },
  {
    step: "02",
    title: "Agregá tus proyectos",
    description: "Cargá los proyectos activos con su cliente, presupuesto y fechas estimadas.",
  },
  {
    step: "03",
    title: "Gestioná tus facturas",
    description:
      "Emitís facturas, marcás cobros y el dashboard muestra todo en tiempo real.",
  },
]

export default async function LandingPage() {
  // Si el usuario ya está autenticado, mandarlo al dashboard
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-base">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-extrabold">
              PT
            </span>
            ProjectTrack
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Funciones
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Precios
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Iniciar sesión
            </Button>
            <Button size="sm" render={<Link href="/register" />}>
              Empezar gratis
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── Hero ───────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          {/* Gradiente decorativo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Diseñado para freelancers y autónomos
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Tu negocio freelance,{" "}
              <span className="text-primary">bajo control</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              ProjectTrack te ayuda a gestionar proyectos, facturas e ingresos en un
              solo lugar. Diseñado para autónomos y freelancers en España y Latinoamérica.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/register" />} className="w-full sm:w-auto">
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/login" />}
                className="w-full sm:w-auto"
              >
                Ya tengo cuenta
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Sin tarjeta de crédito · Plan gratuito para siempre
            </p>
          </div>
        </section>

        {/* ─── Stats strip ────────────────────────────────────────────── */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 grid grid-cols-3 gap-6 text-center">
            {[
              { value: "3 min", label: "para configurar tu workspace" },
              { value: "100%", label: "datos cifrados y privados" },
              { value: "$0", label: "para empezar" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                  {value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── How it works ───────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Empezá en 3 pasos
              </h2>
              <p className="text-muted-foreground">
                Sin setup complicado. En minutos tenés todo funcionando.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map(({ step, title, description }) => (
                <div key={step} className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl font-black text-primary/20 tabular-nums leading-none">
                      {step}
                    </span>
                    <h3 className="font-semibold text-base">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ───────────────────────────────────────────────── */}
        <section id="features" className="py-20 sm:py-24 bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Todo lo que necesitás
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Desde gestionar proyectos hasta cobrar facturas, ProjectTrack
                centraliza todo tu negocio freelance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="rounded-xl border bg-card p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Planes simples y transparentes
              </h2>
              <p className="text-muted-foreground">
                Empezá gratis. Upgradéate cuando lo necesites.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Plan FREE */}
              <div className="rounded-2xl border bg-card p-6 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Free
                    </span>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black">$0</span>
                    <span className="text-muted-foreground text-sm mb-1">/ mes</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Para empezar y probar</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {FREE_FEATURES.map(({ label, included }) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      {included ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                      )}
                      <span className={included ? "" : "text-muted-foreground/50 line-through"}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" render={<Link href="/register" />}>
                  Empezar gratis
                </Button>
              </div>

              {/* Plan PRO */}
              <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col relative overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-primary/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"
                />
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                      Pro
                    </span>
                    <Badge className="ml-auto text-xs">Recomendado</Badge>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black">€13,99</span>
                    <span className="text-muted-foreground text-sm mb-1">/ mes</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Para profesionales y equipos</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {PRO_FEATURES.map(({ label, included }) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      {included ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                      )}
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>

                <Button render={<Link href="/register" />}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Empezar con PRO
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA final ──────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-primary/5 border-t">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold mx-auto mb-6">
              PT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              ¿Listo para ordenar tu negocio?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Sumate a los freelancers que ya gestionan sus proyectos y finanzas
              con ProjectTrack. Es gratis para empezar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/register" />}>
                Crear cuenta gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" render={<Link href="/login" />}>
                Iniciar sesión
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-extrabold">
                PT
              </span>
              ProjectTrack
            </div>

            <div className="flex items-center gap-6 text-xs">
              <Link href="/login" className="hover:text-foreground transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Registrarse
              </Link>
            </div>

            <p className="text-xs">
              © {new Date().getFullYear()} ProjectTrack · Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
