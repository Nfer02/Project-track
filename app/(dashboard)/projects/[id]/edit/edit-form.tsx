"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EditForm({ projectId, name }: { projectId: string; name: string }) {
  const [value, setValue] = useState(name)

  return (
    <div className="space-y-4 rounded-xl border bg-card p-6">
      <label className="text-sm font-medium">Nombre</label>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button>Guardar</Button>
      <p className="text-xs text-muted-foreground">Si ves esto, el client component básico funciona.</p>
    </div>
  )
}
