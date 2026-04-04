import { redirect } from "next/navigation"
import { getCurrentWorkspace } from "@/lib/workspace"
import { getNextInvoiceNumber, getWorkspaceProjects } from "@/app/(dashboard)/invoices/actions"
import { NewExpenseForm } from "./new-expense-form"

export default async function NewExpensePage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const [nextNumber, projects] = await Promise.all([
    getNextInvoiceNumber(ctx.workspace.id, "EXPENSE"),
    getWorkspaceProjects(ctx.workspace.id),
  ])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo gasto</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registra una factura de compra o gasto del negocio.
        </p>
      </div>
      <NewExpenseForm
        workspaceId={ctx.workspace.id}
        nextNumber={nextNumber}
        projects={projects}
      />
    </div>
  )
}
