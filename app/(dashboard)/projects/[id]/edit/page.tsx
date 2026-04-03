import { redirect } from "next/navigation"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { EditForm } from "./edit-form"

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

  if (!project) redirect("/projects")

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Editar: {project.name}</h1>
      <EditForm projectId={project.id} name={project.name} />
    </div>
  )
}
