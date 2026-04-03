"use client"

import { InvoiceForm } from "@/components/app/invoice-form"
import { updateInvoice } from "@/app/(dashboard)/invoices/actions"
import type { InvoiceFormValues } from "@/app/(dashboard)/invoices/actions"

export function EditInvoiceForm({
  invoiceId,
  projectId,
  defaultValues,
}: {
  invoiceId: string
  projectId: string
  defaultValues: Partial<InvoiceFormValues>
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <InvoiceForm
        defaultValues={defaultValues}
        onSubmit={(values) => updateInvoice(invoiceId, projectId, values)}
        submitLabel="Guardar cambios"
      />
    </div>
  )
}
