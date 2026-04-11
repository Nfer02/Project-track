"use server"

import { revalidatePath } from "next/cache"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"

export async function updateWorkspaceFiscal(values: {
  name: string
  nif: string
  legalName: string
  legalForm: string
  vatRegime: string
  defaultVatRate: string
  defaultIrpfRate: string
  isIspApplicable: boolean
  employeeCount: string
  autonomoQuota: string
}) {
  const ctx = await getCurrentWorkspace()
  if (!ctx) return { error: "No autorizado" }
  if (ctx.role !== "OWNER" && ctx.role !== "ADMIN") return { error: "Sin permisos" }

  await prisma.workspace.update({
    where: { id: ctx.workspace.id },
    data: {
      name: values.name.trim() || ctx.workspace.name,
      nif: values.nif.trim() || null,
      legalName: values.legalName.trim() || null,
      legalForm: values.legalForm || null,
      vatRegime: values.vatRegime || "general",
      defaultVatRate: parseInt(values.defaultVatRate) || 21,
      defaultIrpfRate: parseInt(values.defaultIrpfRate) || 0,
      isIspApplicable: values.isIspApplicable,
      employeeCount: values.employeeCount ? parseInt(values.employeeCount) : null,
      autonomoQuota: values.autonomoQuota ? parseFloat(values.autonomoQuota) : null,
    },
  })

  revalidatePath("/settings/empresa")
  revalidatePath("/dashboard")
}
