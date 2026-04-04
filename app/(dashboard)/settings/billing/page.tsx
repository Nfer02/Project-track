import { redirect } from "next/navigation"
import {
  CheckCircle2,
  XCircle,
  CreditCard,
  Sparkles,
  Clock,
  Check,
  X,
  Building2,
  Mail,
} from "lucide-react"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { PlanBadge } from "@/components/app/plan-badge"
import { BillingActions } from "./_components/billing-actions"
import { formatDate } from "@/lib/format"

const STARTER_FEATURES = [
  "1 usuario",
  "Hasta 3 proyectos",
  "20 facturas/mes",
  "Control de gastos básico",
  "Dashboard financiero",
  "Reportes trimestrales",
]

const STARTER_NOT_INCLUDED = [
  "OCR inteligente",
  "Estimación fiscal",
  "Colaboradores",
  "Soporte prioritario",
]

const PRO_FEATURES = [
  "Hasta 3 usuarios",
  "Proyectos ilimitados",
  "Facturas ilimitadas",
  "OCR inteligente (subir facturas con IA)",
  "Reparto de gastos entre proyectos",
  "Dashboard financiero avanzado",
  "Estimación fiscal automática (IVA + IRPF)",
  "Reportes para el contador",
  "Soporte por email",
]

const BUSINESS_FEATURES = [
  "Usuarios ilimitados",
  "Todo lo de PRO",
  "Presupuestos de obra con partidas",
  "Control de costes por partida",
  "Certificaciones parciales",
  "Integraciones bancarias",
  "Soporte prioritario",
]

const BUSINESS_COMING_SOON = [
  "Presupuestos de obra con partidas",
  "Control de costes por partida",
  "Certificaciones parciales",
  "Integraciones bancarias",
]

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Activa",
  INACTIVE: "Inactiva",
  PAST_DUE: "Pago pendiente",
  CANCELLED: "Cancelada",
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>
}) {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const { workspace } = ctx

  const freshWorkspace = await prisma.workspace.findUnique({
    where: { id: workspace.id },
    include: { subscription: true },
  })
  if (!freshWorkspace) redirect("/dashboard")

  const sub = freshWorkspace.subscription
  const isPro = freshWorkspace.plan === "PRO"
  const isFree = freshWorkspace.plan === "FREE"
  const { success, cancelled } = await searchParams

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Facturación</h1>
          <p className="text-xs text-muted-foreground">
            Plan y suscripción de{" "}
            <span className="font-medium text-foreground">{freshWorkspace.name}</span>
          </p>
        </div>
      </div>

      {/* Alertas */}
      {success === "1" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Bienvenido a PRO
            </p>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
              Tu suscripción está activa. Ya puedes usar todas las funciones.
            </p>
          </div>
        </div>
      )}

      {cancelled === "1" && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Cancelaste el proceso de pago. Puedes intentarlo de nuevo cuando quieras.
          </p>
        </div>
      )}

      {/* Estado de suscripción (si tiene) */}
      {sub && (
        <div className="rounded-xl border bg-card">
          <div className="flex items-start justify-between p-5 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Plan actual
              </p>
              <PlanBadge plan={freshWorkspace.plan} />
            </div>
            <BillingActions isPro={isPro} hasCustomer={!!sub?.stripeCustomerId} />
          </div>
          <div className="border-t divide-y text-sm">
            {sub.status && (
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-muted-foreground">Estado</span>
                <span
                  className={`font-medium ${
                    sub.status === "ACTIVE"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : sub.status === "PAST_DUE"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {STATUS_LABEL[sub.status] ?? sub.status}
                </span>
              </div>
            )}
            {sub.currentPeriodEnd && (
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {isPro ? "Próxima renovación" : "Suscripción finaliza"}
                </span>
                <span className="font-medium">{formatDate(sub.currentPeriodEnd)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Planes — tres cards lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plan Starter */}
        <div
          className={`rounded-xl border-2 bg-card overflow-hidden flex flex-col ${
            isFree ? "border-primary ring-2 ring-primary/20" : "border-border"
          }`}
        >
          <div className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Starter</h2>
              {isFree && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Plan actual
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">0 &euro;</span>
              <span className="text-sm text-muted-foreground">/ mes</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Para empezar a gestionar tus proyectos
            </p>
          </div>

          <div className="border-t p-5 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Incluido
            </p>
            <div className="space-y-2.5">
              {STARTER_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-5">
              No incluido
            </p>
            <div className="space-y-2.5">
              {STARTER_NOT_INCLUDED.map((f) => (
                <div key={f} className="flex items-center gap-2 opacity-50">
                  <X className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm line-through">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan PRO */}
        <div
          className="rounded-xl border-2 border-primary ring-2 ring-primary/20 bg-card overflow-hidden flex flex-col"
        >
          <div className="p-5 space-y-2 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-bold">PRO</h2>
              </div>
              {isPro ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Plan actual
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Más popular
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">14,99 &euro;</span>
              <span className="text-sm text-muted-foreground">/ mes</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Todo lo que necesitas para tu negocio
            </p>
          </div>

          <div className="border-t p-5 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Todo incluido
            </p>
            <div className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {!isPro && (
            <div className="border-t p-4">
              <BillingActions isPro={false} hasCustomer={!!sub?.stripeCustomerId} />
            </div>
          )}
        </div>

        {/* Plan Business */}
        <div className="rounded-xl border-2 border-amber-500/50 bg-card overflow-hidden flex flex-col">
          <div className="p-5 space-y-2 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-bold">Business</h2>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">29,99 &euro;</span>
              <span className="text-sm text-muted-foreground">/ mes</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Para profesionales y estudios
            </p>
          </div>

          <div className="border-t p-5 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Todo incluido
            </p>
            <div className="space-y-2.5">
              {BUSINESS_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-sm">
                    {f}
                    {BUSINESS_COMING_SOON.includes(f) && (
                      <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                        Próximamente
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t p-4">
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm font-medium cursor-not-allowed opacity-70"
            >
              <Mail className="h-4 w-4" />
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
