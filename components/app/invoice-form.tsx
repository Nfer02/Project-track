"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { OcrUpload, type OcrData } from "@/components/app/ocr-upload"
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
import type { InvoiceFormValues } from "@/app/(dashboard)/invoices/actions"

const schema = z.object({
  number: z.string().min(1, "El número es obligatorio"),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, "El importe es obligatorio")
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Formato inválido (ej: 1500.00)"),
  currency: z.string().min(1),
  status: z.enum(["DRAFT", "PENDING", "PAID", "OVERDUE", "CANCELLED"]),
  issueDate: z.string().min(1, "La fecha de emisión es obligatoria"),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  isDeclared: z.boolean(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PENDING", label: "Pendiente" },
  { value: "PAID", label: "Pagada" },
  { value: "OVERDUE", label: "Vencida" },
  { value: "CANCELLED", label: "Cancelada" },
]

interface InvoiceFormProps {
  defaultValues?: Partial<FormValues>
  onSubmit: (values: InvoiceFormValues) => Promise<void | { error: string }>
  submitLabel?: string
  numberReadOnly?: boolean
}

export function InvoiceForm({
  defaultValues,
  onSubmit,
  submitLabel = "Guardar",
  numberReadOnly = false,
}: InvoiceFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      number: "",
      description: "",
      amount: "",
      currency: "EUR",
      status: "PENDING",
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      paidDate: "",
      paymentMethod: "",
      isDeclared: true,
      notes: "",
      ...defaultValues,
    },
  })

  const { isSubmitting } = form.formState
  const status = form.watch("status")

  async function handleSubmit(values: FormValues) {
    setServerError(null)
    try {
      const result = await onSubmit(values as InvoiceFormValues)
      if (result && "error" in result) setServerError(result.error)
    } catch (err) {
      // redirect() en Next.js lanza un error especial — no interceptar
      if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw err
      setServerError("Ocurrió un error. Inténtalo de nuevo.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">

        {/* OCR Upload */}
        <OcrUpload
          onExtracted={(data: OcrData) => {
            if (data.description) form.setValue("description", data.description)
            if (data.amount) form.setValue("amount", String(data.amount))
            if (data.issueDate) form.setValue("issueDate", data.issueDate)
            if (data.dueDate) form.setValue("dueDate", data.dueDate)
            if (data.notes) form.setValue("notes", data.notes)
          }}
        />

        {/* Número + Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de factura *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="001"
                    readOnly={numberReadOnly}
                    className={numberReadOnly ? "bg-muted text-muted-foreground" : ""}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Estado" />
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
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Desarrollo frontend — Sprint 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Importe (EUR fijo) */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Importe (€) *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ej: 2500.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de emisión *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de vencimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fecha de pago — solo si status es PAID */}
        {status === "PAID" && (
          <FormField
            control={form.control}
            name="paidDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de cobro</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Forma de pago */}
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de pago</FormLabel>
              <select
                value={field.value ?? ""}
                onChange={field.onChange}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Sin especificar</option>
                <option value="Transferencia bancaria">Transferencia bancaria</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta de crédito/débito">Tarjeta de crédito/débito</option>
                <option value="Bizum">Bizum</option>
                <option value="PayPal">PayPal</option>
                <option value="Otro">Otro</option>
              </select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Declaracion trimestral */}
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
                <FormLabel className="text-sm font-medium">Incluir en declaracion trimestral</FormLabel>
                <FormDescription className="text-xs">Desactiva si este ingreso no se va a declarar</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Notas */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas internas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas opcionales (no visibles en la factura)..."
                  rows={3}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
