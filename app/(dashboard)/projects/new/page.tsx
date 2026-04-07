import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/app/project-form"
import { createProject } from "../actions"

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-1" render={<Link href="/projects" />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Proyectos
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo proyecto</h1>
        <p className="text-sm text-muted-foreground">
          Completa los datos del proyecto. Solo el nombre es obligatorio.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <ProjectForm
          onSubmit={createProject}
          submitLabel="Crear proyecto"
        />
      </div>
    </div>
  )
}
