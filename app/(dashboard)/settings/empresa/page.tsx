import { redirect } from "next/navigation"
import { Building2 } from "lucide-react"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { EmpresaForm } from "./empresa-form"

export default async function EmpresaPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const workspace = await prisma.workspace.findUnique({
    where: { id: ctx.workspace.id },
    select: {
      name: true,
      nif: true,
      legalName: true,
      legalForm: true,
      vatRegime: true,
      defaultVatRate: true,
      defaultIrpfRate: true,
      isIspApplicable: true,
      employeeCount: true,
      autonomoQuota: true,
    },
  })

  if (!workspace) redirect("/dashboard")

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Mi empresa</h1>
          <p className="text-xs text-muted-foreground">
            Datos fiscales que mejoran la precisión de tus estimaciones de IVA e IRPF
          </p>
        </div>
      </div>

      <EmpresaForm
        workspace={{
          name: workspace.name,
          nif: workspace.nif,
          legalName: workspace.legalName,
          legalForm: workspace.legalForm,
          vatRegime: workspace.vatRegime,
          defaultVatRate: workspace.defaultVatRate,
          defaultIrpfRate: workspace.defaultIrpfRate,
          isIspApplicable: workspace.isIspApplicable,
          employeeCount: workspace.employeeCount,
          autonomoQuota: workspace.autonomoQuota ? Number(workspace.autonomoQuota) : null,
        }}
      />
    </div>
  )
}
