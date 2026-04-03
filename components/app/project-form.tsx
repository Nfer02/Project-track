"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { ProjectFormValues } from "@/app/(dashboard)/projects/actions"

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  clientName: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]),
  budget: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\d+(\.\d{1,2})?$/.test(v),
      "Formato inválido (ej: 1500.00)"
    ),
  currency: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activo" },
  { value: "COMPLETED", label: "Completado" },
  { value: "ARCHIVED", label: "Archivado" },
]

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD — Dólar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "ARS", label: "ARS — Peso argentino" },
  { value: "GBP", label: "GBP — Libra esterlina" },
]

interface ProjectFormProps {
  defaultValues?: Partial<FormValues>
  onSubmit: (values: ProjectFormValues) => Promise<void | { error: string }>
  submitLabel?: string
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  submitLabel = "Guardar",
}: ProjectFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      clientName: "",
      description: "",
      status: "ACTIVE",
      budget: "",
      currency: "USD",
      startDate: "",
      endDate: "",
      ...defaultValues,
    },
  })

  const { isSubmitting } = form.formState

  async function handleSubmit(values: FormValues) {
    setServerError(null)
    try {
      const result = await onSubmit(values as ProjectFormValues)
      if (result && "error" in result) setServerError(result.error)
    } catch {
      setServerError("Ocurrió un error. Intentá de nuevo.")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5"
      >
        {/* Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del proyecto *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Rediseño web Empresa X" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cliente */}
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Empresa X S.A." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción opcional del proyecto..."
                  rows={3}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado + Moneda */}
        <div className="grid grid-cols-2 gap-4">
          {/* Estado */}
          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccioná estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-destructive text-sm">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />

          {/* Moneda */}
          <Controller
            control={form.control}
            name="currency"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-destructive text-sm">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Presupuesto */}
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presupuesto</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ej: 5000.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha inicio</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha fin</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  )
}
