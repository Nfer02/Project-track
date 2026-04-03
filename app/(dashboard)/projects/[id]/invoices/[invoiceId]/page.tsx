import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { InvoiceStatusBadge } from "@/components/app/invoice-status-badge"
import { formatCurrency, formatDate } from "@/lib/format"
import { deleteInvoice } from "@/app/(dashboard)/invoices/actions"
import { InvoiceFileUpload } from "@/components/app/invoice-file-upload"

interface Props {
  params: Promise<{ id: string; invoiceId: string }>
}

export default async function InvoiceDetailPage({ params }: Props) {
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
      project: { select: { id: true, name: true, currency: true } },
      files: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!invoice) notFound()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-1"
          render={<Link href={`/projects/${projectId}`} />}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {invoice.project.name}
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight font-mono">
              #{invoice.number}
            </h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          {invoice.description && (
            <p className="text-sm text-muted-foreground">{invoice.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/projects/${projectId}/invoices/${invoiceId}/edit`} />}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <form
            action={async () => {
              "use server"
              await deleteInvoice(invoiceId, projectId)
            }}
          >
            <Button
              variant="outline"
              size="sm"
              type="submit"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </form>
        </div>
      </div>

      {/* Datos principales */}
      <div className="rounded-xl border bg-card divide-y">
        <div className="grid grid-cols-2 divide-x sm:grid-cols-4">
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Monto</p>
            <p className="text-xl font-semibold">
              {formatCurrency(Number(invoice.amount), invoice.currency)}
            </p>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Moneda</p>
            <p className="text-xl font-semibold">{invoice.currency}</p>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Emisión</p>
            <p className="text-base font-medium">{formatDate(invoice.issueDate)}</p>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Vencimiento</p>
            <p className="text-base font-medium">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {invoice.paidDate && (
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Fecha de pago</p>
            <p className="text-base font-medium">{formatDate(invoice.paidDate)}</p>
          </div>
        )}

        {invoice.notes && (
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Notas internas</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </div>
        )}
      </div>

      {/* Archivos adjuntos + OCR */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Documentos adjuntos</h2>
          {invoice.files.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({invoice.files.length})
            </span>
          )}
        </div>

        {/* Archivos existentes */}
        {invoice.files.length > 0 && (
          <div className="rounded-xl border divide-y text-sm">
            {invoice.files.map((file) => {
              const ocr = file.ocrData as Record<string, unknown> | null
              return (
                <div key={file.id} className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{file.filename}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.sizeBytes / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  {ocr && !ocr.error && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      {ocr.invoiceNumber != null && (
                        <span>N° <span className="text-foreground font-medium">{String(ocr.invoiceNumber)}</span></span>
                      )}
                      {ocr.amount != null && (
                        <span>Monto <span className="text-foreground font-medium">{String(ocr.amount)} {String(ocr.currency ?? "")}</span></span>
                      )}
                      {ocr.issueDate != null && (
                        <span>Emisión <span className="text-foreground font-medium">{String(ocr.issueDate)}</span></span>
                      )}
                      {ocr.vendorName != null && (
                        <span>Emisor <span className="text-foreground font-medium">{String(ocr.vendorName)}</span></span>
                      )}
                    </div>
                  )}
                  {ocr?.error != null && (
                    <p className="text-xs text-muted-foreground">{String(ocr.error)}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Nuevo upload */}
        <InvoiceFileUpload invoiceId={invoice.id} />
      </div>

      {/* Proyecto */}
      <div className="text-xs text-muted-foreground">
        Proyecto:{" "}
        <Link
          href={`/projects/${projectId}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {invoice.project.name}
        </Link>
      </div>
    </div>
  )
}
