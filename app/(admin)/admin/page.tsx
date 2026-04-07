import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/format"
import {
  Users,
  Package,
  Crown,
  TrendingUp,
  FolderKanban,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
} from "lucide-react"

const ADMIN_EMAILS = ["nelsonfernandez1002@gmail.com"]

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/dashboard")
  }

  const [
    totalUsers,
    totalWorkspaces,
    freeWorkspaces,
    proWorkspaces,
    totalProjects,
    totalIncomeInvoices,
    totalExpenseInvoices,
    totalWaitlist,
    waitlistEntries,
    recentUsers,
    allSubscriptions,
    totalInvoiceAmount,
    totalExpenseAmount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.workspace.count({ where: { plan: "FREE" } }),
    prisma.workspace.count({ where: { plan: "PRO" } }),
    prisma.project.count(),
    prisma.invoice.count({ where: { type: "INCOME" } }),
    prisma.invoice.count({ where: { type: "EXPENSE" } }),
    prisma.waitlist.count(),
    prisma.waitlist.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        memberships: {
          include: { workspace: { select: { name: true, plan: true } } },
          take: 1,
        },
      },
    }),
    prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { workspace: { select: { name: true } } },
    }),
    prisma.invoice.aggregate({
      where: { type: "INCOME", status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { type: "EXPENSE", status: "PAID" },
      _sum: { amount: true },
    }),
  ])

  // Derived metrics
  const mrr = proWorkspaces * 14.99
  const conversionRate =
    totalWorkspaces > 0
      ? ((proWorkspaces / totalWorkspaces) * 100).toFixed(1)
      : "0"

  // Waitlist grouped by sector
  const sectorCounts: Record<string, number> = {}
  for (const entry of waitlistEntries) {
    const sector = entry.source ?? "Sin especificar"
    sectorCounts[sector] = (sectorCounts[sector] ?? 0) + 1
  }
  const sectorEntries = Object.entries(sectorCounts).sort(
    ([, a], [, b]) => b - a
  )
  const maxSectorCount = sectorEntries.length > 0 ? sectorEntries[0][1] : 1

  const STATS = [
    {
      label: "Usuarios registrados",
      value: totalUsers,
      icon: Users,
      color: "border-l-blue-500",
    },
    {
      label: "Workspaces Free",
      value: freeWorkspaces,
      icon: Package,
      color: "border-l-slate-400",
    },
    {
      label: "Workspaces PRO",
      value: proWorkspaces,
      icon: Crown,
      color: "border-l-amber-500",
    },
    {
      label: "MRR (estimado)",
      value: formatCurrency(mrr),
      icon: TrendingUp,
      color: "border-l-emerald-500",
    },
    {
      label: "Proyectos totales",
      value: totalProjects,
      icon: FolderKanban,
      color: "border-l-violet-500",
    },
    {
      label: "Waitlist",
      value: totalWaitlist,
      icon: Clock,
      color: "border-l-orange-500",
    },
    {
      label: "Ingresos registrados",
      value: formatCurrency(Number(totalInvoiceAmount._sum.amount ?? 0)),
      icon: ArrowUpRight,
      color: "border-l-emerald-500",
    },
    {
      label: "Gastos registrados",
      value: formatCurrency(Number(totalExpenseAmount._sum.amount ?? 0)),
      icon: ArrowDownRight,
      color: "border-l-rose-500",
    },
  ]

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Panel de administraci&oacute;n
          </h1>
        </div>

        {/* Conversion rate banner */}
        <div className="mb-6 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Resumen:</span>{" "}
          {totalUsers} usuarios, {totalWorkspaces} workspaces,{" "}
          {totalIncomeInvoices} facturas emitidas, {totalExpenseInvoices} gastos.
          Tasa de conversi&oacute;n Free → PRO:{" "}
          <span className="font-semibold text-foreground">
            {conversionRate}%
          </span>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`rounded-lg border border-border bg-card p-4 border-l-4 ${stat.color}`}
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Two column: Waitlist + Recent users */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Waitlist table */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">
                Waitlist
              </h2>
              <p className="text-xs text-muted-foreground">
                &Uacute;ltimos {waitlistEntries.length} registros
              </p>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Sector</th>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-muted-foreground"
                      >
                        Sin entradas en la waitlist
                      </td>
                    </tr>
                  ) : (
                    waitlistEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-border/50 hover:bg-muted/50"
                      >
                        <td className="px-4 py-2 text-foreground truncate max-w-[200px]">
                          {entry.email}
                        </td>
                        <td className="px-4 py-2">
                          {entry.source ? (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {entry.source}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Sin especificar
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                          {formatDate(entry.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent users table */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">
                &Uacute;ltimos registros
              </h2>
              <p className="text-xs text-muted-foreground">
                {recentUsers.length} usuarios m&aacute;s recientes
              </p>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Nombre</th>
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Workspace</th>
                    <th className="px-4 py-2 font-medium">Plan</th>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => {
                    const membership = u.memberships[0]
                    return (
                      <tr
                        key={u.id}
                        className="border-b border-border/50 hover:bg-muted/50"
                      >
                        <td className="px-4 py-2 text-foreground truncate max-w-[120px]">
                          {u.name ?? "—"}
                        </td>
                        <td className="px-4 py-2 text-foreground truncate max-w-[180px]">
                          {u.email}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground truncate max-w-[120px]">
                          {membership?.workspace.name ?? "—"}
                        </td>
                        <td className="px-4 py-2">
                          {membership?.workspace.plan === "PRO" ? (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                              PRO
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2 py-0.5 text-xs font-medium text-slate-400">
                              FREE
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active subscriptions */}
        {allSubscriptions.length > 0 && (
          <div className="mb-8 rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">
                Suscripciones activas
              </h2>
              <p className="text-xs text-muted-foreground">
                {allSubscriptions.length} suscripciones PRO
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Workspace</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 font-medium">Stripe ID</th>
                    <th className="px-4 py-2 font-medium">
                      Fin de periodo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allSubscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-border/50 hover:bg-muted/50"
                    >
                      <td className="px-4 py-2 text-foreground">
                        {sub.workspace.name}
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                        {sub.stripeSubId ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                        {formatDate(sub.currentPeriodEnd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Waitlist by sector */}
        {sectorEntries.length > 0 && (
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">
                Waitlist por sector
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {sectorEntries.map(([sector, count]) => (
                <div key={sector} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-sm text-foreground">
                    {sector}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-6 rounded bg-primary/20"
                      style={{
                        width: `${(count / maxSectorCount) * 100}%`,
                        minWidth: "2rem",
                      }}
                    >
                      <div
                        className="h-full rounded bg-primary transition-all"
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-foreground">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
