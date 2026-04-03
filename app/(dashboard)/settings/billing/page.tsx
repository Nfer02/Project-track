import { redirect } from "next/navigation"
import {
  CheckCircle2,
  XCircle,
  CreditCard,
  Sparkles,
  Clock,
} from "lucide-react"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { PlanBadge } from "@/components/app/plan-badge"
import { BillingActions } from "./_components/billing-actions"
import { formatDate } from "@/lib/format"

const FREE_FEATURES = [
  { label: "Hasta 3 proyectos", included: true },
  { label: "Facturas ilimitadas", included: true },
  { label: "Dashboard financiero", included: true },
  { label: "Proyectos ilimitados", included: false },
  { label: "Upload de documentos + OCR", included: false },
  { label: "Colaboradores (hasta 5)", included: false },
  { label: "Soporte prioritario", included: false },
]

const PRO_FEATURES = [
  { label: "Proyectos ilimitados", included: true },
  { label: "Facturas ilimitadas", included: true },
  { label: "Dashboard financiero avanzado", included: true },
  { label: "Upload de documentos + OCR (Claude AI)", included: true },
  { label: "Colaboradores (hasta 10)", included: true },
  { label: "Soporte prioritario", included: true },
  { label: "Acceso anticipado a nuevas funciones", included: true },
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

  // Reload workspace for fresh plan data
  const freshWorkspace = await prisma.workspace.findUnique({
    where: { id: workspace.id },
    include: { subscription: true },
  })
  if (!freshWorkspace) redirect("/dashboard")

  const sub = freshWorkspace.subscription
  const isPro = freshWorkspace.plan === "PRO"
  const { success, cancelled } = await searchParams

  const features = isPro ? PRO_FEATURES : FREE_FEATURES

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
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

      {/* Alertas de resultado */}
      {success === "1" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              ¡Bienvenido a PRO!
            </p>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
              Tu suscripción está activa. Ya podés usar todas las funciones.
            </p>
          </div>
        </div>
      )}

      {cancelled === "1" && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Cancelaste el proceso de pago. Podés intentarlo de nuevo cuando quieras.
          </p>
        </div>
      )}

      {/* Plan actual */}
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

        {/* Detalles de suscripción */}
        {sub && (
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
        )}
      </div>

      {/* Features del plan */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div
          className={`px-5 py-4 flex items-center gap-2 ${
            isPro
              ? "bg-amber-500/5 border-b border-amber-500/20"
              : "bg-muted/30 border-b"
          }`}
        >
          {isPro && <Sparkles className="h-4 w-4 text-amber-500" />}
          <h2 className="text-sm font-semibold">
            {isPro ? "Incluido en tu plan PRO" : "Incluido en el plan gratuito"}
          </h2>
        </div>
        <div className="divide-y">
          {features.map(({ label, included }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-2.5">
              {included ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
              <span
                className={`text-sm ${
                  included ? "text-foreground" : "text-muted-foreground/60 line-through"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {!isPro && (
          <div className="border-t p-5 bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">ProjectTrack PRO</p>
                <p className="text-xs text-muted-foreground">
                  Todo lo que necesitás para gestionar tu negocio
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">$12</p>
                <p className="text-xs text-muted-foreground">/ mes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
