import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/format"
import { AdminTickets } from "@/components/app/admin-tickets"
import {
  Users,
  Package,
  Crown,
  TrendingUp,
  Clock,
  Activity,
  UserPlus,
  ArrowLeft,
  BarChart3,
  Star,
  MessageSquare,
} from "lucide-react"

const ADMIN_EMAILS = ["nelsonfernandez1002@gmail.com"]

const SECTOR_LABELS: Record<string, string> = {
  reformas: "Reformas y construcción",
  instalaciones: "Instalaciones y mantenimiento",
  diseno: "Diseño y creatividad",
  fotografia: "Fotografía y eventos",
  consultoria: "Consultoría y formación",
  tecnologia: "Tecnología y desarrollo",
  hogar: "Proyectos personales / hogar",
  otro: "Otro sector",
  landing: "Landing (sin sector)",
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/dashboard")
  }

  // Fecha de hace 7 días para "usuarios activos"
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekStart = new Date()
  lastWeekStart.setDate(lastWeekStart.getDate() - 14)

  const [
    totalUsers,
    freeWorkspaces,
    proWorkspaces,
    totalWaitlist,
    waitlistEntries,
    recentUsers,
    allSubscriptions,
    registrosEstaSemana,
    registrosSemanaAnterior,
    supportTickets,
    workspacesWithSector,
    betaFeedback,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count({ where: { plan: "FREE" } }),
    prisma.workspace.count({ where: { plan: "PRO" } }),
    prisma.waitlist.count(),
    prisma.waitlist.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        memberships: {
          include: { workspace: { select: { name: true, plan: true, sector: true } } },
          take: 1,
        },
      },
    }),
    prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { workspace: { select: { name: true } } },
    }),
    prisma.user.count({ where: { createdAt: { gte: thisWeekStart } } }),
    prisma.user.count({ where: { createdAt: { gte: lastWeekStart, lt: thisWeekStart } } }),
    prisma.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.workspace.findMany({
      where: { sector: { not: null } },
      select: { sector: true },
    }),
    prisma.betaFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  const totalWorkspaces = freeWorkspaces + proWorkspaces
  const mrr = proWorkspaces * 14.99
  const conversionRate = totalWorkspaces > 0 ? ((proWorkspaces / totalWorkspaces) * 100).toFixed(1) : "0"

  // Tendencia de registros
  const registrosTendencia = registrosEstaSemana - registrosSemanaAnterior
  const tendenciaTexto = registrosTendencia > 0
    ? `+${registrosTendencia} vs semana anterior`
    : registrosTendencia < 0
      ? `${registrosTendencia} vs semana anterior`
      : "Igual que la semana anterior"

  // Waitlist por sector
  const waitlistSectorCounts: Record<string, number> = {}
  for (const entry of waitlistEntries) {
    const sector = entry.source ?? "landing"
    waitlistSectorCounts[sector] = (waitlistSectorCounts[sector] ?? 0) + 1
  }
  const waitlistSectors = Object.entries(waitlistSectorCounts).sort(([, a], [, b]) => b - a)
  const maxWaitlistSector = waitlistSectors.length > 0 ? waitlistSectors[0][1] : 1

  // Usuarios registrados por sector
  const userSectorCounts: Record<string, number> = {}
  for (const ws of workspacesWithSector) {
    const sector = ws.sector ?? "otro"
    userSectorCounts[sector] = (userSectorCounts[sector] ?? 0) + 1
  }
  const userSectors = Object.entries(userSectorCounts).sort(([, a], [, b]) => b - a)
  const maxUserSector = userSectors.length > 0 ? userSectors[0][1] : 1

  const STATS = [
    { label: "Usuarios registrados", value: String(totalUsers), icon: Users, color: "border-l-blue-500" },
    { label: "Workspaces Free", value: String(freeWorkspaces), icon: Package, color: "border-l-slate-400" },
    { label: "Workspaces PRO", value: String(proWorkspaces), icon: Crown, color: "border-l-amber-500" },
    { label: "MRR (estimado)", value: formatCurrency(mrr), icon: TrendingUp, color: "border-l-emerald-500" },
    { label: "Waitlist", value: String(totalWaitlist), icon: Clock, color: "border-l-orange-500" },
    { label: "Registros esta semana", value: String(registrosEstaSemana), sub: tendenciaTexto, icon: UserPlus, color: "border-l-violet-500" },
    { label: "Tasa de conversión", value: `${conversionRate}%`, sub: "Free → PRO", icon: Activity, color: "border-l-cyan-500" },
  ]

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Panel de administración</h1>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className={`rounded-xl border bg-card p-4 border-l-4 ${stat.color}`}>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-medium">{stat.label}</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                {"sub" in stat && stat.sub && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Sectores — 2 columnas */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Waitlist por sector */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <h2 className="text-sm font-semibold">Waitlist por sector</h2>
              <span className="text-xs text-muted-foreground ml-auto">{totalWaitlist} total</span>
            </div>
            {waitlistSectors.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin datos</p>
            ) : (
              <div className="space-y-2.5">
                {waitlistSectors.map(([sector, count]) => (
                  <div key={sector} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-xs">{SECTOR_LABELS[sector] ?? sector}</span>
                    <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500/70 transition-all"
                        style={{ width: `${(count / maxWaitlistSector) * 100}%`, minWidth: "8px" }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usuarios registrados por sector */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm font-semibold">Usuarios por sector</h2>
              <span className="text-xs text-muted-foreground ml-auto">{workspacesWithSector.length} con sector</span>
            </div>
            {userSectors.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin datos todavía</p>
            ) : (
              <div className="space-y-2.5">
                {userSectors.map(([sector, count]) => (
                  <div key={sector} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-xs">{SECTOR_LABELS[sector] ?? sector}</span>
                    <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500/70 transition-all"
                        style={{ width: `${(count / maxUserSector) * 100}%`, minWidth: "8px" }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tablas — 2 columnas */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Waitlist */}
          <div className="rounded-xl border bg-card">
            <div className="border-b p-4">
              <h2 className="text-sm font-semibold">Waitlist</h2>
              <p className="text-[10px] text-muted-foreground">{waitlistEntries.length} registros más recientes</p>
            </div>
            <div className="max-h-[450px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b text-left text-[10px] text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Sector</th>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.length === 0 ? (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground text-xs">Sin entradas</td></tr>
                  ) : (
                    waitlistEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="px-4 py-2 text-xs truncate max-w-[180px]">{entry.email}</td>
                        <td className="px-4 py-2">
                          {entry.source && entry.source !== "landing" ? (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {SECTOR_LABELS[entry.source] ?? entry.source}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(entry.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Usuarios recientes */}
          <div className="rounded-xl border bg-card">
            <div className="border-b p-4">
              <h2 className="text-sm font-semibold">Últimos registros</h2>
              <p className="text-[10px] text-muted-foreground">{recentUsers.length} usuarios más recientes</p>
            </div>
            <div className="max-h-[450px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b text-left text-[10px] text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Nombre</th>
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Workspace</th>
                    <th className="px-4 py-2 font-medium">Plan</th>
                    <th className="px-4 py-2 font-medium">Sector</th>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => {
                    const m = u.memberships[0]
                    return (
                      <tr key={u.id} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="px-4 py-2 text-xs truncate max-w-[100px]">{u.name ?? "—"}</td>
                        <td className="px-4 py-2 text-xs truncate max-w-[150px]">{u.email}</td>
                        <td className="px-4 py-2 text-[10px] text-muted-foreground truncate max-w-[100px]">{m?.workspace.name ?? "—"}</td>
                        <td className="px-4 py-2">
                          {m?.workspace.plan === "PRO" ? (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">PRO</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-400">FREE</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {m?.workspace.sector ? (
                            <span className="text-[10px] text-muted-foreground">{SECTOR_LABELS[m.workspace.sector] ?? m.workspace.sector}</span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tickets de soporte */}
        <div className="mb-8">
          <AdminTickets
            tickets={supportTickets.map((t) => ({
              id: t.id,
              email: t.email,
              name: t.name,
              category: t.category,
              subject: t.subject,
              message: t.message,
              status: t.status,
              response: t.response,
              createdAt: t.createdAt.toISOString(),
              respondedAt: t.respondedAt?.toISOString() ?? null,
            }))}
          />
        </div>

        {/* Beta Feedback */}
        {betaFeedback.length > 0 && (() => {
          const avgRating = betaFeedback.reduce((s, f) => s + f.easeOfUse, 0) / betaFeedback.length
          const yesCount = betaFeedback.filter(f => f.wouldRecommend === "yes").length
          const maybeCount = betaFeedback.filter(f => f.wouldRecommend === "maybe").length
          const noCount = betaFeedback.filter(f => f.wouldRecommend === "no").length

          // Count features
          const featureCounts: Record<string, number> = {}
          for (const fb of betaFeedback) {
            if (fb.usefulFeatures) {
              for (const feat of fb.usefulFeatures.split(",")) {
                const trimmed = feat.trim()
                if (trimmed) featureCounts[trimmed] = (featureCounts[trimmed] ?? 0) + 1
              }
            }
          }
          const featureLabels: Record<string, string> = {
            dashboard: "Dashboard financiero",
            projects: "Gestion de proyectos",
            expenses: "Control de gastos",
            ocr: "Escaneo con IA (OCR)",
            reports: "Reportes trimestrales",
            fiscal: "Estimacion fiscal",
          }
          const sortedFeatures = Object.entries(featureCounts).sort(([, a], [, b]) => b - a)
          const maxFeatureCount = sortedFeatures.length > 0 ? sortedFeatures[0][1] : 1

          return (
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold">Beta Feedback</h2>
                <span className="text-xs text-muted-foreground ml-auto">{betaFeedback.length} respuestas</span>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Average rating */}
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">Valoracion media</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className={`h-5 w-5 ${n <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                      ))}
                    </div>
                    <span className="text-lg font-bold">{avgRating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Recommendation breakdown */}
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-2">Recomendarian?</p>
                  <div className="flex gap-3 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Si {yesCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      Tal vez {maybeCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      No {noCount}
                    </span>
                  </div>
                </div>

                {/* Most voted features */}
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-2">Funcionalidades mas votadas</p>
                  <div className="space-y-1.5">
                    {sortedFeatures.slice(0, 4).map(([feat, count]) => (
                      <div key={feat} className="flex items-center gap-2">
                        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary/60" style={{ width: `${(count / maxFeatureCount) * 100}%`, minWidth: "4px" }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-28 truncate">{featureLabels[feat] ?? feat}</span>
                        <span className="text-[10px] font-semibold w-4 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback table */}
              <div className="rounded-xl border bg-card">
                <div className="border-b p-4">
                  <h3 className="text-sm font-semibold">Respuestas de feedback</h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b text-left text-[10px] text-muted-foreground">
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Valoracion</th>
                        <th className="px-4 py-2 font-medium">Recomienda</th>
                        <th className="px-4 py-2 font-medium">Mejoras</th>
                        <th className="px-4 py-2 font-medium">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {betaFeedback.map((fb) => (
                        <tr key={fb.id} className="border-b border-border/30 hover:bg-muted/30">
                          <td className="px-4 py-2 text-xs truncate max-w-[180px]">{fb.email}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star key={n} className={`h-3 w-3 ${n <= fb.easeOfUse ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              fb.wouldRecommend === "yes" ? "bg-emerald-500/10 text-emerald-500" :
                              fb.wouldRecommend === "maybe" ? "bg-amber-500/10 text-amber-500" :
                              "bg-red-500/10 text-red-500"
                            }`}>
                              {fb.wouldRecommend === "yes" ? "Si" : fb.wouldRecommend === "maybe" ? "Tal vez" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-xs text-muted-foreground truncate max-w-[250px]">{fb.improvements ?? "—"}</td>
                          <td className="px-4 py-2 text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(fb.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Suscripciones activas */}
        {allSubscriptions.length > 0 && (
          <div className="rounded-xl border bg-card">
            <div className="border-b p-4">
              <h2 className="text-sm font-semibold">Suscripciones PRO activas</h2>
              <p className="text-[10px] text-muted-foreground">{allSubscriptions.length} suscripciones</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-[10px] text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Workspace</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 font-medium">Stripe ID</th>
                    <th className="px-4 py-2 font-medium">Fin de periodo</th>
                  </tr>
                </thead>
                <tbody>
                  {allSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="px-4 py-2 text-xs">{sub.workspace.name}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">Activa</span>
                      </td>
                      <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground">{sub.stripeSubId ?? "—"}</td>
                      <td className="px-4 py-2 text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(sub.currentPeriodEnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
