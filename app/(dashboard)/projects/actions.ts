"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/lib/workspace"
import { ProjectStatus } from "@/generated/prisma"

export type ProjectFormValues = {
  name: string
  clientName?: string
  clientNif?: string
  description?: string
  status: ProjectStatus
  projectValue?: string
  budget?: string
  currency: string
  numberOfPayments?: string
  startDate?: string
  endDate?: string
  isDeclared: boolean
  vatRate: string
  irpfRate: string
}

async function requireWorkspace() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")
  return ctx
}

export async function createProject(values: ProjectFormValues) {
  const { workspace } = await requireWorkspace()

  await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: values.name,
      clientName: values.clientName || null,
      clientNif: values.clientNif || null,
      description: values.description || null,
      status: values.status,
      projectValue: values.projectValue ? parseFloat(values.projectValue) : null,
      budget: values.budget ? parseFloat(values.budget) : null,
      currency: values.currency,
      numberOfPayments: values.numberOfPayments ? parseInt(values.numberOfPayments) : null,
      startDate: values.startDate ? new Date(values.startDate) : null,
      endDate: values.endDate ? new Date(values.endDate) : null,
      isDeclared: values.isDeclared,
      vatRate: parseInt(values.vatRate),
      irpfRate: parseInt(values.irpfRate),
    },
  })

  revalidatePath("/projects")
  redirect("/projects")
}

export async function updateProject(id: string, values: ProjectFormValues) {
  const { workspace } = await requireWorkspace()

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!project) redirect("/projects")

  await prisma.project.update({
    where: { id },
    data: {
      name: values.name,
      clientName: values.clientName || null,
      clientNif: values.clientNif || null,
      description: values.description || null,
      status: values.status,
      projectValue: values.projectValue ? parseFloat(values.projectValue) : null,
      budget: values.budget ? parseFloat(values.budget) : null,
      currency: values.currency,
      numberOfPayments: values.numberOfPayments ? parseInt(values.numberOfPayments) : null,
      startDate: values.startDate ? new Date(values.startDate) : null,
      endDate: values.endDate ? new Date(values.endDate) : null,
      isDeclared: values.isDeclared,
      vatRate: parseInt(values.vatRate),
      irpfRate: parseInt(values.irpfRate),
    },
  })

  revalidatePath("/projects")
  revalidatePath(`/projects/${id}`)
  redirect(`/projects/${id}`)
}

export async function deleteProject(id: string) {
  const { workspace } = await requireWorkspace()

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!project) return { error: "Proyecto no encontrado" }

  await prisma.project.delete({ where: { id } })

  revalidatePath("/projects")
  redirect("/projects")
}
