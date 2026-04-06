import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { toDateInputValue } from "@/lib/format"
import { getWorkspaceProjects } from "@/app/(dashboard)/invoices/actions"
import { EditExpenseForm } from "./edit-expense-form"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}

export default async function EditExpensePage({ params, searchParams }: Props) {
  const { id } = await params
  const { from } = await searchParams

  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const expense = await prisma.invoice.findFirst({
    where: { id, workspaceId: ctx.workspace.id, type: "EXPENSE" },
  })
  if (!expense) notFound()

  const [projects, allocations] = await Promise.all([
    getWorkspaceProjects(ctx.workspace.id),
    prisma.expenseAllocation.findMany({
      where: { invoiceId: id },
      orderBy: { createdAt: "asc" },
    }),
  ])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href={`/expenses/detail/${id}${from ? `?from=${from}` : ""}`} />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Gasto #{expense.number}
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Editar gasto</h1>
        <p className="text-sm text-muted-foreground">Modifica los datos del gasto o reasigna a otros proyectos.</p>
      </div>

      <EditExpenseForm
        expenseId={id}
        projects={projects}
        redirectTo={from ? `/expenses/detail/${id}?from=${from}` : undefined}
        defaultValues={{
          number: expense.number,
          externalNumber: expense.externalNumber ?? "",
          counterpartNif: expense.counterpartNif ?? "",
          vendorName: expense.vendorName ?? "",
          description: expense.description ?? "",
          amount: String(Number(expense.amount)),
          currency: expense.currency,
          category: expense.category ?? "",
          vatAmount: expense.vatAmount ? String(Number(expense.vatAmount)) : "",
          status: expense.status as "PENDING" | "PAID",
          issueDate: toDateInputValue(expense.issueDate),
          dueDate: toDateInputValue(expense.dueDate),
          paidDate: toDateInputValue(expense.paidDate),
          isDeclared: expense.isDeclared,
          notes: expense.notes ?? "",
          allocations: allocations.map((a) => ({
            projectId: a.projectId,
            amount: String(Number(a.amount)),
            notes: a.notes ?? undefined,
          })),
        }}
      />
    </div>
  )
}
