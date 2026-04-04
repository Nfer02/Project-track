"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/lib/workspace"
import { InvoiceStatus, InvoiceType } from "@/generated/prisma"

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type InvoiceFormValues = {
  number: string
  description?: string
  amount: string
  currency: string
  status: InvoiceStatus
  issueDate: string
  dueDate?: string
  paidDate?: string
  isDeclared: boolean
  notes?: string
}

export type ExpenseFormValues = {
  number: string
  description?: string
  amount: string
  currency: string
  status: InvoiceStatus // PENDING o PAID para gastos
  issueDate: string
  dueDate?: string
  paidDate?: string
  vendorName?: string
  category?: string
  vatAmount?: string
  isDeclared: boolean
  notes?: string
  allocations: { projectId: string; amount: string; notes?: string }[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireWorkspace() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")
  return ctx
}

/** Genera el siguiente numero de factura/gasto para el workspace */
export async function getNextInvoiceNumber(
  workspaceId: string,
  type: "INCOME" | "EXPENSE",
): Promise<string> {
  const prefix = type === "INCOME" ? "F" : "G" // F=Factura, G=Gasto
  const last = await prisma.invoice.findFirst({
    where: { workspaceId, type },
    orderBy: { createdAt: "desc" },
    select: { number: true },
  })
  if (!last) return `${prefix}-001`
  const num = parseInt(last.number.replace(/\D/g, ""), 10) || 0
  return `${prefix}-${String(num + 1).padStart(3, "0")}`
}

/** Devuelve los proyectos del workspace (id + nombre) */
export async function getWorkspaceProjects(workspaceId: string) {
  return prisma.project.findMany({
    where: { workspaceId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

// ─── Facturas de ingreso (INCOME) ───────────────────────────────────────────

export async function createInvoice(
  projectId: string,
  values: InvoiceFormValues,
): Promise<{ error: string } | void> {
  const { workspace } = await requireWorkspace()

  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId: workspace.id },
  })
  if (!project) return { error: "Proyecto no encontrado" }

  try {
    await prisma.invoice.create({
      data: {
        type: "INCOME" as InvoiceType,
        workspaceId: workspace.id,
        projectId,
        number: values.number,
        description: values.description || null,
        amount: parseFloat(values.amount),
        currency: values.currency,
        status: values.status,
        issueDate: new Date(values.issueDate),
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
        paidDate: values.paidDate ? new Date(values.paidDate) : null,
        isDeclared: values.isDeclared,
        notes: values.notes || null,
      },
    })
  } catch (err) {
    console.error("[createInvoice] Error de BD:", err)
    return { error: "No se pudo guardar la factura. Intentalo de nuevo." }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/invoices")
  redirect(`/projects/${projectId}`)
}

export async function updateInvoice(
  invoiceId: string,
  projectId: string,
  values: InvoiceFormValues,
): Promise<{ error: string } | void> {
  const { workspace } = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      workspaceId: workspace.id,
      type: "INCOME" as InvoiceType,
    },
  })
  if (!invoice) return { error: "Factura no encontrada" }

  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        number: values.number,
        description: values.description || null,
        amount: parseFloat(values.amount),
        currency: values.currency,
        status: values.status,
        issueDate: new Date(values.issueDate),
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
        paidDate: values.paidDate ? new Date(values.paidDate) : null,
        isDeclared: values.isDeclared,
        notes: values.notes || null,
      },
    })
  } catch (err) {
    console.error("[updateInvoice] Error de BD:", err)
    return { error: "No se pudo actualizar la factura. Intentalo de nuevo." }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/projects/${projectId}/invoices/${invoiceId}`)
  revalidatePath("/invoices")
  redirect(`/projects/${projectId}/invoices/${invoiceId}`)
}

export async function deleteInvoice(invoiceId: string, projectId?: string) {
  const { workspace } = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, workspaceId: workspace.id },
  })
  if (!invoice) return { error: "Factura no encontrada" }

  await prisma.invoice.delete({ where: { id: invoiceId } })

  if (projectId) revalidatePath(`/projects/${projectId}`)
  revalidatePath("/invoices")

  if (invoice.type === "EXPENSE" || !projectId) {
    redirect("/invoices?tab=expenses")
  } else {
    redirect(`/projects/${projectId}`)
  }
}

// ─── Gastos (EXPENSE) ───────────────────────────────────────────────────────

export async function createExpense(
  values: ExpenseFormValues,
  redirectTo?: string,
): Promise<{ error: string } | void> {
  const { workspace } = await requireWorkspace()

  // Validar que la suma de asignaciones no supere el importe total
  const totalAmount = parseFloat(values.amount)
  const allocTotal = values.allocations.reduce(
    (sum, a) => sum + parseFloat(a.amount || "0"),
    0,
  )
  if (allocTotal > totalAmount) {
    return {
      error: `La suma de las asignaciones (${allocTotal.toFixed(2)}) supera el importe total (${totalAmount.toFixed(2)}).`,
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const expense = await tx.invoice.create({
        data: {
          type: "EXPENSE" as InvoiceType,
          workspaceId: workspace.id,
          projectId: null,
          number: values.number,
          description: values.description || null,
          amount: totalAmount,
          currency: values.currency,
          status: values.status,
          issueDate: new Date(values.issueDate),
          dueDate: values.dueDate ? new Date(values.dueDate) : null,
          paidDate: values.paidDate ? new Date(values.paidDate) : null,
          vendorName: values.vendorName || null,
          category: values.category || null,
          vatAmount: values.vatAmount ? parseFloat(values.vatAmount) : null,
          isDeclared: values.isDeclared,
          notes: values.notes || null,
        },
      })

      if (values.allocations.length > 0) {
        await tx.expenseAllocation.createMany({
          data: values.allocations.map((a) => ({
            invoiceId: expense.id,
            projectId: a.projectId,
            amount: parseFloat(a.amount),
            notes: a.notes || null,
          })),
        })
      }
    })
  } catch (err) {
    console.error("[createExpense] Error de BD:", err)
    return { error: "No se pudo guardar el gasto. Intentalo de nuevo." }
  }

  revalidatePath("/invoices")
  redirect(redirectTo ?? "/invoices?tab=expenses")
}

export async function updateExpense(
  invoiceId: string,
  values: ExpenseFormValues,
  redirectTo?: string,
): Promise<{ error: string } | void> {
  const { workspace } = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      workspaceId: workspace.id,
      type: "EXPENSE" as InvoiceType,
    },
  })
  if (!invoice) return { error: "Gasto no encontrado" }

  // Validar que la suma de asignaciones no supere el importe total
  const totalAmount = parseFloat(values.amount)
  const allocTotal = values.allocations.reduce(
    (sum, a) => sum + parseFloat(a.amount || "0"),
    0,
  )
  if (allocTotal > totalAmount) {
    return {
      error: `La suma de las asignaciones (${allocTotal.toFixed(2)}) supera el importe total (${totalAmount.toFixed(2)}).`,
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          number: values.number,
          description: values.description || null,
          amount: totalAmount,
          currency: values.currency,
          status: values.status,
          issueDate: new Date(values.issueDate),
          dueDate: values.dueDate ? new Date(values.dueDate) : null,
          paidDate: values.paidDate ? new Date(values.paidDate) : null,
          vendorName: values.vendorName || null,
          category: values.category || null,
          vatAmount: values.vatAmount ? parseFloat(values.vatAmount) : null,
          isDeclared: values.isDeclared,
          notes: values.notes || null,
        },
      })

      // Eliminar asignaciones antiguas y crear las nuevas
      await tx.expenseAllocation.deleteMany({
        where: { invoiceId },
      })

      if (values.allocations.length > 0) {
        await tx.expenseAllocation.createMany({
          data: values.allocations.map((a) => ({
            invoiceId,
            projectId: a.projectId,
            amount: parseFloat(a.amount),
            notes: a.notes || null,
          })),
        })
      }
    })
  } catch (err) {
    console.error("[updateExpense] Error de BD:", err)
    return { error: "No se pudo actualizar el gasto. Inténtalo de nuevo." }
  }

  revalidatePath("/invoices")
  redirect(redirectTo ?? `/invoices/expense/${invoiceId}`)
}
