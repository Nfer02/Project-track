import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Proyectos — ProjectTrack",
}
import { Plus, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProjectStatusBadge } from "@/components/app/project-status-badge"
import { formatCurrency } from "@/lib/format"

export default async function ProjectsPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const projects = await prisma.project.findMany({
    where: { workspaceId: ctx.workspace.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { invoices: true } },
    },
  })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length === 0
              ? "Todavía no tenés proyectos."
              : `${projects.length} proyecto${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button render={<Link href="/projects/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo proyecto
        </Button>
      </div>

      {/* Lista o empty state */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Sin proyectos todavía</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Creá tu primer proyecto para empezar a registrar ingresos y facturas.
            </p>
          </div>
          <Button size="sm" render={<Link href="/projects/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            Crear primer proyecto
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  {project.clientName && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {project.clientName}
                    </p>
                  )}
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>

              {project.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  {project._count.invoices} factura{project._count.invoices !== 1 ? "s" : ""}
                </span>
                {project.budget && (
                  <span className="text-xs font-medium">
                    {formatCurrency(Number(project.budget), project.currency)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
