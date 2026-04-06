"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
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
import { updateProfile } from "@/app/(auth)/actions"
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

  return (
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
  )
}
