"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/lib/workspace"
import { ProjectStatus } from "@/generated/prisma"

export type ProjectFormValues = {
  name: string
  clientName?: string
  description?: string
  status: ProjectStatus
  budget?: string
  currency: string
  startDate?: string
  endDate?: string
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
      description: values.description || null,
      status: values.status,
      budget: values.budget ? parseFloat(values.budget) : null,
      currency: values.currency,
      startDate: values.startDate ? new Date(values.startDate) : null,
      endDate: values.endDate ? new Date(values.endDate) : null,
    },
  })

  revalidatePath("/projects")
  redirect("/projects")
}

export async function updateProject(id: string, values: ProjectFormValues) {
  const { workspace } = await requireWorkspace()

  // Verificar que el proyecto pertenece al workspace
  const project = await prisma.project.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!project) redirect("/projects")

  await prisma.project.update({
    where: { id },
    data: {
      name: values.name,
      clientName: values.clientName || null,
      description: values.description || null,
      status: values.status,
      budget: values.budget ? parseFloat(values.budget) : null,
      currency: values.currency,
      startDate: values.startDate ? new Date(values.startDate) : null,
      endDate: values.endDate ? new Date(values.endDate) : null,
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
