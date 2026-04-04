import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { getNextInvoiceNumber } from "@/app/(dashboard)/invoices/actions"
import { NewInvoiceForm } from "./new-invoice-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewInvoicePage({ params }: Props) {
  const { id: projectId } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId: ctx.workspace.id },
  })
  if (!project) notFound()

  const nextNumber = await getNextInvoiceNumber(ctx.workspace.id, "INCOME")

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href={`/projects/${projectId}`} />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {project.name}
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Nueva factura</h1>
        <p className="text-sm text-muted-foreground">
          Añade una factura al proyecto <span className="font-medium text-foreground">{project.name}</span>.
        </p>
      </div>

      <NewInvoiceForm
        projectId={projectId}
        defaultValues={{ number: nextNumber, currency: project.currency, isDeclared: project.isDeclared, paymentMethod: project.paymentMethod ?? "" }}
      />
    </div>
  )
}
