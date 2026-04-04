"use client"

import { ExpenseForm } from "@/components/app/expense-form"
import { createExpense } from "@/app/(dashboard)/invoices/actions"
import type { ExpenseFormValues } from "@/app/(dashboard)/invoices/actions"

export function NewProjectExpenseForm({
  projectId,
  projectName,
  nextNumber,
}: {
  projectId: string
  projectName: string
  nextNumber: string
}) {
  return (
    <ExpenseForm
      defaultValues={{ number: nextNumber, isDeclared: true }}
      projects={[{ id: projectId, name: projectName }]}
      preAssignedProjectId={projectId}
      onSubmit={(values: ExpenseFormValues) => createExpense(values)}
      submitLabel="Registrar gasto"
    />
  )
}
