import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Sparkles,
  Check,
  X,
  Zap,
  TrendingUp,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Typewriter } from "@/components/landing/typewriter"
import { FadeIn } from "@/components/landing/fade-in"
import { FeatureTabs } from "@/components/landing/feature-tabs"
import { Testimonials } from "@/components/landing/testimonials"
import { CookieNotice } from "@/components/landing/cookie-notice"
import { WaitlistForm } from "@/components/landing/waitlist-form"
import { UserTypes } from "@/components/landing/user-types"
// import { AppShowcase } from "@/components/landing/app-showcase"  // Se reemplazará por vídeo

export const metadata = {
  title: "ProjectTrack — Gestiona tus proyectos y finanzas",
  description:
    "Controla tus proyectos, ingresos, gastos y estimaciones fiscales en un solo lugar. Para freelancers, negocios y cualquier persona con proyectos.",
  openGraph: {
    title: "ProjectTrack — Gestiona tus proyectos y finanzas",
    description: "Controla proyectos, ingresos y gastos. Para freelancers, negocios y cualquier persona que trabaje por proyectos.",
    url: "https://projecttrack.app",
    siteName: "ProjectTrack",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ProjectTrack — Gestiona tus proyectos y finanzas",
    description: "Controla proyectos, ingresos y gastos. Para freelancers, negocios y cualquier persona que trabaje por proyectos.",
  },
}

const STARTER_FEATURES = [
  { label: "1 usuario", included: true },
  { label: "Hasta 3 proyectos", included: true },
  { label: "20 registros/mes", included: true },
  { label: "Control de gastos básico", included: true },
  { label: "Dashboard financiero", included: true },
  { label: "OCR inteligente", included: false },
  { label: "Estimación fiscal", included: false },
  { label: "Reparto de gastos entre proyectos", included: false },
]

const PRO_FEATURES = [
  { label: "Hasta 5 usuarios", included: true },
  { label: "Proyectos ilimitados", included: true },
  { label: "Registros ilimitados", included: true },
  { label: "OCR inteligente (escanear gastos con IA)", included: true },
  { label: "Reparto de gastos entre proyectos", included: true },
  { label: "Dashboard financiero avanzado", included: true },
  { label: "Estimación fiscal orientativa (IVA + IRPF)", included: true },
  { label: "Reportes para el contador", included: true },
  { label: "Soporte por email", included: true },
]

export default async function LandingPage() {
  // Si el usuario ya esta autenticado, mandarlo al dashboard
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg transition-colors">
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
            <Link href="/faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Iniciar sesión
            </Button>
            <Button size="sm" className="rounded-full" render={<a href="#waitlist" />}>
              Acceso anticipado
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --------------------------------------------------------------- */}
        {/* Hero                                                            */}
        {/* --------------------------------------------------------------- */}
        <section id="waitlist" className="relative overflow-hidden py-20 sm:py-28 scroll-mt-16">
          {/* Radial gradient background */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-primary/6 blur-3xl" />
            <div className="absolute left-1/4 bottom-0 h-[300px] w-[500px] rounded-full bg-primary/4 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Para profesionales y negocios que trabajan por proyectos
            </Badge>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Tus proyectos y finanzas,{" "}
              <span className="text-primary">
                <Typewriter
                  words={[
                    "bajo control",
                    "organizados",
                    "sin sorpresas",
                    "en un solo lugar",
                  ]}
                />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Gestiona tus proyectos, controla ingresos y gastos, y ten una
              estimación de cuánto reservar para Hacienda. Para freelancers,
              negocios y cualquier persona con proyectos.
            </p>

            <div className="flex flex-col items-center gap-4">
              <WaitlistForm />
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
                render={<a href="#features" />}
              >
                Ver funciones &darr;
              </Button>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Stats strip                                                     */}
        {/* --------------------------------------------------------------- */}
        <section className="border-y bg-muted/20">
          <FadeIn>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { value: "3 min", label: "para configurar" },
                { value: "+2M", label: "profesionales en España" },
                { value: "0 \u20AC", label: "para empezar" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Video Demo — deshabilitado hasta tener el video final
        <section className="py-16 sm:py-24 bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Mira cómo funciona
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  En menos de un minuto, todo lo que ProjectTrack hace por tu negocio
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="rounded-2xl border border-border/60 bg-black shadow-2xl overflow-hidden ring-1 ring-white/5">
                <video
                  className="w-full aspect-video"
                  controls
                  preload="metadata"
                  poster="/projecttrack-promo-poster.jpg"
                  playsInline
                >
                  <source src="/projecttrack-promo-v2.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de vídeo.
                </video>
              </div>
            </FadeIn>
          </div>
        </section>
        */}

        {/* --------------------------------------------------------------- */}
        {/* Feature Tabs                                                    */}
        {/* --------------------------------------------------------------- */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Todo lo que puedes hacer con ProjectTrack
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Desde controlar proyectos hasta preparar el trimestre
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <FeatureTabs />
            </FadeIn>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* User Types                                                      */}
        {/* --------------------------------------------------------------- */}
        <section className="py-20 sm:py-28 bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Diseñado para tu sector
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Da igual a qué te dediques. Si gestionas proyectos y necesitas
                  controlar tus finanzas, ProjectTrack es para ti.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <UserTypes />
            </FadeIn>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Testimonials                                                    */}
        {/* --------------------------------------------------------------- */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Lo que dicen nuestros usuarios
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Profesionales y negocios que ya controlan sus proyectos y finanzas
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <Testimonials />
            </FadeIn>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* How it works                                                    */}
        {/* --------------------------------------------------------------- */}
        <section className="py-20 sm:py-28 bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Empieza en 3 pasos
                </h2>
                <p className="text-muted-foreground">
                  Sin setup complicado. En minutos tienes todo funcionando.
                </p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Crea tu workspace",
                  description:
                    "Regístrate gratis y configura tu espacio de trabajo en menos de 2 minutos.",
                },
                {
                  step: "02",
                  title: "Agrega tus proyectos",
                  description:
                    "Carga los proyectos activos con su cliente, presupuesto y fechas estimadas.",
                },
                {
                  step: "03",
                  title: "Controla tus finanzas",
                  description:
                    "Registra ingresos, gastos y cobros. El dashboard te muestra la rentabilidad en tiempo real.",
                },
              ].map(({ step, title, description }, i) => (
                <FadeIn key={step} delay={i * 200}>
                  <div className="relative">
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
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Pricing                                                         */}
        {/* --------------------------------------------------------------- */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Planes y precios
                </h2>
                <p className="text-muted-foreground">
                  Empieza gratis. Mejora cuando lo necesites.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Plan Starter */}
              <FadeIn delay={0}>
                <div className="rounded-2xl border bg-card p-6 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Starter
                      </span>
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black">0 &euro;</span>
                      <span className="text-muted-foreground text-sm mb-1">/ mes</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Para empezar a gestionar tus proyectos
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {STARTER_FEATURES.map(({ label, included }) => (
                      <li key={label} className="flex items-center gap-2.5 text-sm">
                        {included ? (
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                        )}
                        <span
                          className={
                            included ? "" : "text-muted-foreground/50 line-through"
                          }
                        >
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    className="rounded-full"
                    render={<a href="#waitlist" />}
                  >
                    Solicitar acceso
                  </Button>
                </div>
              </FadeIn>

              {/* Plan PRO */}
              <FadeIn delay={150}>
                <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col relative overflow-hidden h-full">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-primary/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"
                  />
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                        Pro
                      </span>
                      <Badge className="ml-auto text-xs">Recomendado</Badge>
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black">14,99 &euro;</span>
                      <span className="text-muted-foreground text-sm mb-1">/ mes</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Todo lo que necesitas para tu negocio
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {PRO_FEATURES.map(({ label }) => (
                      <li key={label} className="flex items-center gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="rounded-full" render={<a href="#waitlist" />}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Solicitar acceso
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* CTA Final                                                       */}
        {/* --------------------------------------------------------------- */}
        <section className="relative overflow-hidden py-20 sm:py-28 border-t">
          {/* Gradient bg */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-primary/6 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
            <FadeIn>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold mx-auto mb-6">
                PT
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Estamos preparando algo grande
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Sé de los primeros en probarlo. Déjanos tu email y tu sector, y te
                avisaremos cuando esté listo.
              </p>
              <div className="flex justify-center">
                <WaitlistForm />
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ----------------------------------------------------------------- */}
      {/* Footer                                                            */}
      {/* ----------------------------------------------------------------- */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-extrabold">
                PT
              </span>
              ProjectTrack
            </div>

            <nav className="flex items-center gap-4 sm:gap-6 text-xs flex-wrap justify-center">
              <a href="#features" className="hover:text-foreground transition-colors">
                Funciones
              </a>
              <a href="#pricing" className="hover:text-foreground transition-colors">
                Precios
              </a>
              <Link href="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
            </nav>

            <div className="text-center sm:text-right">
              <p className="text-xs">
                &copy; 2026 ProjectTrack. Todos los derechos reservados.
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">
                Hecho en España 🇪🇸 · <Link href="/terms" className="hover:text-foreground">Aviso legal</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>

      <CookieNotice />
    </div>
  )
}
