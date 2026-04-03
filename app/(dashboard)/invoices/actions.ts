"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/lib/workspace"
import { InvoiceStatus } from "@/generated/prisma"

export type InvoiceFormValues = {
  number: string
  description?: string
  amount: string
  currency: string
  status: InvoiceStatus
  issueDate: string
  dueDate?: string
  paidDate?: string
  notes?: string
}

async function requireWorkspace() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")
  return ctx
}

/** Genera el siguiente número de factura para el proyecto (001, 002, ...) */
export async function getNextInvoiceNumber(projectId: string): Promise<string> {
  const last = await prisma.invoice.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    select: { number: true },
  })
  if (!last) return "001"
  const num = parseInt(last.number.replace(/\D/g, ""), 10) || 0
  return String(num + 1).padStart(3, "0")
}

export async function createInvoice(
  projectId: string,
  values: InvoiceFormValues
): Promise<{ error: string } | void> {
  const { workspace } = await requireWorkspace()

  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId: workspace.id },
  })
  if (!project) return { error: "Proyecto no encontrado" }

  try {
    await prisma.invoice.create({
      data: {
        projectId,
        number: values.number,
        description: values.description || null,
        amount: parseFloat(values.amount),
        currency: values.currency,
        status: values.status,
        issueDate: new Date(values.issueDate),
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
        paidDate: values.paidDate ? new Date(values.paidDate) : null,
        notes: values.notes || null,
      },
    })
  } catch (err) {
    console.error("[createInvoice] DB error:", err)
    return { error: "No se pudo guardar la factura. Inténtalo de nuevo." }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/invoices")
  redirect(`/projects/${projectId}`)
}

export async function updateInvoice(
  invoiceId: string,
  projectId: string,
  values: InvoiceFormValues
): Promise<{ error: string } | void> {
  const { workspace } = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, project: { workspaceId: workspace.id } },
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
        notes: values.notes || null,
      },
    })
  } catch (err) {
    console.error("[updateInvoice] DB error:", err)
    return { error: "No se pudo actualizar la factura. Inténtalo de nuevo." }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/projects/${projectId}/invoices/${invoiceId}`)
  revalidatePath("/invoices")
  redirect(`/projects/${projectId}/invoices/${invoiceId}`)
}

export async function deleteInvoice(invoiceId: string, projectId: string) {
  const { workspace } = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, project: { workspaceId: workspace.id } },
  })
  if (!invoice) return { error: "Factura no encontrada" }

  await prisma.invoice.delete({ where: { id: invoiceId } })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/invoices")
  redirect(`/projects/${projectId}`)
}
