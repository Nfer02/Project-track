"use client"

import { ProjectForm } from "@/components/app/project-form"

export function EditForm({ projectId, name }: { projectId: string; name: string }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <ProjectForm
        defaultValues={{ name }}
        onSubmit={async () => {}}
        submitLabel="Guardar cambios"
      />
    </div>
  )
}
