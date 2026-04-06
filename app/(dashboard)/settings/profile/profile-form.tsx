"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updateProfile, deleteAccount } from "@/app/(auth)/actions"
import { useState } from "react"

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
})

type Values = z.infer<typeof schema>

interface ProfileFormProps {
  defaultValues: {
    name: string
    email: string
  }
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultValues.name },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: Values) {
    setServerError(null)
    const result = await updateProfile(values).catch(() => ({
      error: "Ocurrió un error. Inténtalo de nuevo.",
    }))
    if (result && "error" in result) setServerError(result.error)
  }

  async function handleDelete() {
    if (deleteText !== "ELIMINAR") return
    setIsDeleting(true)
    try {
      await deleteAccount()
    } catch {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Correo electrónico</label>
            <Input value={defaultValues.email} disabled />
            <p className="text-xs text-muted-foreground">
              El correo electrónico no se puede cambiar.
            </p>
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </form>
      </Form>

      {/* Zona de peligro */}
      <div className="rounded-xl border border-destructive/30 p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-destructive">Eliminar cuenta</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Esta acción es irreversible. Se eliminarán todos tus datos: proyectos, facturas, gastos y configuración.
          </p>
        </div>

        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar mi cuenta
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-destructive font-medium">
              Escribe ELIMINAR para confirmar:
            </p>
            <Input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="ELIMINAR"
              className="max-w-xs border-destructive/30"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowDeleteConfirm(false); setDeleteText("") }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteText !== "ELIMINAR" || isDeleting}
                onClick={handleDelete}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar eliminación
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
