"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { ProjectFormValues } from "@/app/(dashboard)/projects/actions"

const decimalRule = (v?: string) => !v || /^\d+(\.\d{1,2})?$/.test(v)

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  clientName: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]),
  projectValue: z.string().optional().refine(decimalRule, "Formato inválido (ej: 5000.00)"),
  budget: z.string().optional().refine(decimalRule, "Formato inválido (ej: 1500.00)"),
  currency: z.string().min(1),
  paymentMethod: z.string().optional(),
  numberOfPayments: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), "Debe ser un número entero"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isDeclared: z.boolean(),
  vatRate: z.string().min(1),
  irpfRate: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activo" },
  { value: "COMPLETED", label: "Completado" },
  { value: "ARCHIVED", label: "Archivado" },
]

const PAYMENT_METHOD_OPTIONS = [
  { value: "Transferencia bancaria", label: "Transferencia bancaria" },
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta de crédito/débito", label: "Tarjeta de crédito/débito" },
  { value: "Bizum", label: "Bizum" },
  { value: "PayPal", label: "PayPal" },
  { value: "Otro", label: "Otro" },
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
      projectValue: "",
      budget: "",
      currency: "EUR",
      paymentMethod: "",
      numberOfPayments: "",
      startDate: "",
      endDate: "",
      isDeclared: true,
      vatRate: "21",
      irpfRate: "0",
      ...defaultValues,
    },
  })

  const { isSubmitting } = form.formState

  async function handleSubmit(values: FormValues) {
    setServerError(null)
    try {
      const result = await onSubmit(values as ProjectFormValues)
      if (result && "error" in result) setServerError(result.error)
    } catch (err) {
      if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw err
      setServerError("Ocurrió un error. Inténtalo de nuevo.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* ── Información básica ───────────────────────────────── */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Información básica
          </p>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {/* Proyecto declarado */}
          <FormField
            control={form.control}
            name="isDeclared"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium">Proyecto declarado</FormLabel>
                  <FormDescription className="text-xs">Desactiva si este proyecto no se incluye en la declaración trimestral</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* ── Información económica ─────────────────────────────── */}
        <div className="space-y-4 pt-2 border-t">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground pt-2">
            Información económica
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="projectValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor del contrato (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Ej: 5000.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Lo que cobras al cliente</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presupuesto de materiales (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Ej: 800.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Lo que prevés gastar</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vatRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IVA del proyecto (%)</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona IVA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="21">21% (General)</SelectItem>
                      <SelectItem value="10">10% (Reducido)</SelectItem>
                      <SelectItem value="4">4% (Superreducido)</SelectItem>
                      <SelectItem value="0">0% (Exento)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="irpfRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retención IRPF (%)</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona IRPF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% (Sin retención)</SelectItem>
                      <SelectItem value="7">7% (Nuevos autónomos)</SelectItem>
                      <SelectItem value="15">15% (General)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Condiciones de pago ───────────────────────────────── */}
        <div className="space-y-4 pt-2 border-t">
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Condiciones de pago
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Cada pago acordado será una factura. La fecha de vencimiento de cada factura determina cuándo se marca como vencida.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de pago</FormLabel>
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona forma de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfPayments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de pagos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="36"
                      placeholder="Ej: 3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Cuántos pagos acordados</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
