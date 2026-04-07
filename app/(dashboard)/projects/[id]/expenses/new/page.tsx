import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { getNextInvoiceNumber } from "@/app/(dashboard)/invoices/actions"
import { NewProjectExpenseForm } from "./new-project-expense-form"

export default async function NewProjectExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId: ctx.workspace.id },
  })
  if (!project) redirect("/projects")

  const nextNumber = await getNextInvoiceNumber(ctx.workspace.id, "EXPENSE")

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      <Button variant="ghost" size="sm" className="-ml-1" render={<Link href={`/projects/${projectId}`} />}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        {project.name}
      </Button>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo gasto</h1>
        <p className="text-sm text-muted-foreground">
          Registra un gasto asignado a <span className="font-medium text-foreground">{project.name}</span>.
        </p>
      </div>
      <NewProjectExpenseForm
        projectId={projectId}
        projectName={project.name}
        nextNumber={nextNumber}
      />
    </div>
  )
}
