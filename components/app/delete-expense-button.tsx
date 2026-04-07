"use client"

import { useState } from "react"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteInvoice } from "@/app/(dashboard)/invoices/actions"

export function DeleteExpenseButton({ expenseId, expenseNumber }: { expenseId: string; expenseNumber: string }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    await deleteInvoice(expenseId, "")
  }

  if (!showConfirm) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        onClick={() => setShowConfirm(true)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Eliminar
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Eliminar gasto</h3>
            <p className="text-sm text-muted-foreground">#{expenseNumber}</p>
          </div>
        </div>

        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-sm text-destructive space-y-1">
          <p className="font-medium">Esta accion es irreversible. Se eliminaran:</p>
          <ul className="list-disc list-inside text-xs space-y-0.5">
            <li>Todos los datos del gasto</li>
            <li>Las asignaciones a proyectos</li>
            <li>Los archivos y documentos adjuntos</li>
          </ul>
          <p className="text-xs font-medium mt-2">Los datos no se podran recuperar.</p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Trash2 className="h-4 w-4 mr-1" />
            )}
            Si, eliminar gasto
          </Button>
        </div>
      </div>
    </div>
  )
}
