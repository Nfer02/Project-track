import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceForm } from "@/components/app/invoice-form"
import { updateInvoice } from "@/app/(dashboard)/invoices/actions"
import { toDateInputValue } from "@/lib/format"

interface Props {
  params: Promise<{ id: string; invoiceId: string }>
}

export default async function EditInvoicePage({ params }: Props) {
  const { id: projectId, invoiceId } = await params

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      projectId,
      project: { workspaceId: ctx.workspace.id },
    },
    include: {
      project: { select: { name: true } },
    },
  })

  if (!invoice) notFound()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-1"
          render={<Link href={`/projects/${projectId}/invoices/${invoiceId}`} />}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Factura #{invoice.number}
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Editar factura</h1>
        <p className="text-sm text-muted-foreground">
          Proyecto:{" "}
          <span className="font-medium text-foreground">{invoice.project.name}</span>
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <InvoiceForm
          defaultValues={{
            number: invoice.number,
            description: invoice.description ?? "",
            amount: String(Number(invoice.amount)),
            currency: invoice.currency,
            status: invoice.status,
            issueDate: toDateInputValue(invoice.issueDate),
            dueDate: toDateInputValue(invoice.dueDate),
            paidDate: toDateInputValue(invoice.paidDate),
            notes: invoice.notes ?? "",
          }}
          onSubmit={(values) => updateInvoice(invoiceId, projectId, values)}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}
