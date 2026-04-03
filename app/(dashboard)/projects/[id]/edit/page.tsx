import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
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
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Editar: {project.name}</h1>
      <p>Proyecto cargado OK. Campos:</p>
      <ul className="text-sm space-y-1">
        <li>name: {project.name}</li>
        <li>clientName: {project.clientName ?? "null"}</li>
        <li>budget: {project.budget ? String(project.budget) : "null"}</li>
        <li>projectValue: {project.projectValue ? String(project.projectValue) : "null"}</li>
        <li>paymentMethod: {project.paymentMethod ?? "null"}</li>
        <li>numberOfPayments: {project.numberOfPayments ?? "null"}</li>
        <li>currency: {project.currency}</li>
      </ul>
      <p className="text-muted-foreground text-xs">Si ves esto, el error está en ProjectForm.</p>
    </div>
  )
}
