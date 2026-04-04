"use client"

import { ExpenseForm } from "@/components/app/expense-form"
import { createExpense } from "@/app/(dashboard)/invoices/actions"

interface NewExpenseFormProps {
  workspaceId: string
  nextNumber: string
  projects: { id: string; name: string }[]
}

export function NewExpenseForm({
  nextNumber,
  projects,
}: NewExpenseFormProps) {
  return (
    <ExpenseForm
      defaultValues={{ number: nextNumber, isDeclared: true }}
      projects={projects}
      onSubmit={(values) => createExpense(values)}
      submitLabel="Registrar gasto"
    />
  )
}
