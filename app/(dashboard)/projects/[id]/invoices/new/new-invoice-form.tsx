"use client"

import { InvoiceForm } from "@/components/app/invoice-form"
import { createInvoice } from "@/app/(dashboard)/invoices/actions"

export function NewInvoiceForm({
  projectId,
  defaultValues,
}: {
  projectId: string
  defaultValues: { number: string; currency: string; isDeclared?: boolean }
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <InvoiceForm
        defaultValues={defaultValues}
        numberReadOnly
        onSubmit={(values) => createInvoice(projectId, values)}
        submitLabel="Crear factura"
      />
    </div>
  )
}
