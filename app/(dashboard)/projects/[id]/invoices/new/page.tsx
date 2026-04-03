import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceForm } from "@/components/app/invoice-form"
import {
  createInvoice,
  getNextInvoiceNumber,
} from "@/app/(dashboard)/invoices/actions"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewInvoicePage({ params }: Props) {
  const { id: projectId } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  let project
  let nextNumber
  try {
    project = await prisma.project.findFirst({
      where: { id: projectId, workspaceId: ctx.workspace.id },
    })
    if (!project) notFound()
    nextNumber = await getNextInvoiceNumber(projectId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return (
      <div className="p-6 max-w-2xl">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Error al cargar:</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap break-all">{msg}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-1"
          render={<Link href={`/projects/${projectId}`} />}
        >
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

      <div className="rounded-xl border bg-card p-6">
        <InvoiceForm
          defaultValues={{
            number: nextNumber,
            currency: project.currency,
          }}
          numberReadOnly
          onSubmit={(values) => createInvoice(projectId, values)}
          submitLabel="Crear factura"
        />
      </div>
    </div>
  )
}
