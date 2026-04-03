import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { ProjectForm } from "@/components/app/project-form"
import { updateProject } from "../../actions"
import { toDateInputValue } from "@/lib/format"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  try {
    const { id } = await params

    const ctx = await getCurrentWorkspace()
    if (!ctx) redirect("/login")

    const project = await prisma.project.findFirst({
      where: { id, workspaceId: ctx.workspace.id },
    })

    if (!project) notFound()

    return (
      <div className="flex flex-col gap-6 p-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="-ml-1" render={<Link href={`/projects/${project.id}`} />}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {project.name}
          </Button>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Editar proyecto</h1>
          <p className="text-sm text-muted-foreground">
            Actualiza los datos del proyecto.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <ProjectForm
            defaultValues={{
              name: project.name,
              clientName: project.clientName ?? "",
              description: project.description ?? "",
              status: project.status,
              projectValue: project.projectValue ? String(Number(project.projectValue)) : "",
              budget: project.budget ? String(Number(project.budget)) : "",
              currency: project.currency,
              paymentMethod: project.paymentMethod ?? "",
              numberOfPayments: project.numberOfPayments ? String(project.numberOfPayments) : "",
              startDate: toDateInputValue(project.startDate),
              endDate: toDateInputValue(project.endDate),
            }}
            onSubmit={(values) => updateProject(project.id, values)}
            submitLabel="Guardar cambios"
          />
        </div>
      </div>
    )
  } catch (err) {
    // Re-lanzar errores de redirect/notFound de Next.js
    if (err && typeof err === "object" && "digest" in err) throw err
    const msg = err instanceof Error ? `${err.message}\n\n${err.stack}` : String(err)
    return (
      <div className="p-6 max-w-2xl">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-base font-medium text-destructive mb-2">Error al cargar la página:</p>
          <pre className="text-xs whitespace-pre-wrap break-all text-muted-foreground">{msg}</pre>
        </div>
      </div>
    )
  }
}
