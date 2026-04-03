"use client"

import { ProjectForm } from "@/components/app/project-form"
import { updateProject } from "../../actions"
import type { ProjectFormValues } from "../../actions"

export function EditForm({
  projectId,
  defaultValues,
}: {
  projectId: string
  defaultValues: Partial<ProjectFormValues>
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <ProjectForm
        defaultValues={defaultValues}
        onSubmit={(values) => updateProject(projectId, values)}
        submitLabel="Guardar cambios"
      />
    </div>
  )
}
