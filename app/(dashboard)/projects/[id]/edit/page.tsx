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
  const { id } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: ctx.workspace.id },
  })

  if (!project) notFound()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href={`/projects/${project.id}`} />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {project.name}
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Editar proyecto</h1>
        <p className="text-sm text-muted-foreground">
          Actualizá los datos del proyecto.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <ProjectForm
          defaultValues={{
            name: project.name,
            clientName: project.clientName ?? "",
            description: project.description ?? "",
            status: project.status,
            budget: project.budget ? String(Number(project.budget)) : "",
            currency: project.currency,
            startDate: toDateInputValue(project.startDate),
            endDate: toDateInputValue(project.endDate),
          }}
          onSubmit={(values) => updateProject(project.id, values)}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}
