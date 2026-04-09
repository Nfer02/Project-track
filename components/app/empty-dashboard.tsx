"use client"

import Link from "next/link"
import { Plus, FolderKanban, ReceiptText, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/app/logo"

const STEPS = [
  {
    icon: FolderKanban,
    title: "Crea un proyecto",
    description: "Agrupa facturas y gastos por cliente o trabajo",
  },
  {
    icon: ReceiptText,
    title: "Registra ingresos",
    description: "Anade las facturas que emites a cada proyecto",
  },
  {
    icon: ShoppingCart,
    title: "Controla gastos",
    description: "Escanea tickets o registra compras y materiales",
  },
]

interface EmptyDashboardProps {
  workspaceName: string
}

export function EmptyDashboard({ workspaceName }: EmptyDashboardProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg space-y-8">
        {/* Logo + Bienvenida */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Logo size={64} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido a {workspaceName}
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Para empezar, crea tu primer proyecto. Un proyecto agrupa las
              facturas y gastos de cada cliente o trabajo.
            </p>
          </div>
        </div>

        {/* CTA principal */}
        <Button size="lg" render={<Link href="/projects/new" />}>
          <Plus className="mr-2 h-5 w-5" />
          Crear mi primer proyecto
        </Button>

        {/* Pasos */}
        <div className="grid gap-4 sm:grid-cols-3 pt-4">
          {STEPS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-4 text-left space-y-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
