"use client"

import { ExpenseForm } from "@/components/app/expense-form"
import { updateExpense } from "@/app/(dashboard)/invoices/actions"
import type { ExpenseFormValues } from "@/app/(dashboard)/invoices/actions"

export function EditExpenseForm({
  expenseId,
  projects,
  defaultValues,
}: {
  expenseId: string
  projects: { id: string; name: string }[]
  defaultValues: Partial<ExpenseFormValues>
}) {
  return (
    <ExpenseForm
      defaultValues={defaultValues}
      projects={projects}
      onSubmit={(values) => updateExpense(expenseId, values)}
      submitLabel="Guardar cambios"
    />
  )
}
