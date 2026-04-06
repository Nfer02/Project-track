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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { InvoiceFormValues } from "@/app/(dashboard)/invoices/actions"

const decimalRule = (v: string) => /^\d+(\.\d{1,2})?$/.test(v)

const schema = z.object({
  number: z.string().min(1, "El número es obligatorio"),
  counterpartNif: z.string().optional(),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, "La base imponible es obligatoria")
    .refine(decimalRule, "Formato inválido (ej: 1500.00)"),
  vatRate: z.string().min(1),
  currency: z.string().min(1),
  status: z.string().min(1),
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

const VAT_OPTIONS = [
  { value: "21", label: "21% (General)" },
  { value: "10", label: "10% (Reducido)" },
  { value: "4", label: "4% (Superreducido)" },
  { value: "0", label: "0% (Exento)" },
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
      counterpartNif: "",
      description: "",
      amount: "",
      vatRate: "21",
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
  const baseAmount = parseFloat(form.watch("amount") || "0") || 0
  const vatRate = parseInt(form.watch("vatRate") || "21") || 0
  const irpfRate = parseInt((defaultValues as Record<string, string>)?.irpfRate || "0") || 0

  // Cálculos fiscales en tiempo real
  const vatAmount = baseAmount * (vatRate / 100)
  const irpfAmount = baseAmount * (irpfRate / 100)
  const totalAmount = baseAmount + vatAmount - irpfAmount

  async function handleSubmit(values: FormValues) {
    setServerError(null)
    try {
      // Pasamos el total calculado como amount
      const result = await onSubmit({
        ...values,
        amount: totalAmount.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        counterpartNif: values.counterpartNif,
      } as InvoiceFormValues)
      if (result && "error" in result) setServerError(result.error)
    } catch (err) {
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
            if (data.baseAmount) form.setValue("amount", String(data.baseAmount))
            else if (data.amount) form.setValue("amount", String(data.amount))
            if (data.vatRate) form.setValue("vatRate", String(data.vatRate))
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
                <select
                  value={field.value}
                  onChange={field.onChange}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
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
                <Input placeholder="Ej: Reforma integral cocina — Primer pago" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NIF del cliente */}
        <FormField
          control={form.control}
          name="counterpartNif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIF del cliente</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 12345678A" {...field} />
              </FormControl>
              <FormDescription>Obligatorio para el libro registro de facturas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Base imponible + IVA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base imponible (€) *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej: 2500.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Importe sin IVA</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vatRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de IVA</FormLabel>
                <select
                  value={field.value}
                  onChange={field.onChange}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {VAT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Desglose fiscal calculado */}
        {baseAmount > 0 && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base imponible</span>
              <span className="font-medium">{baseAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA ({vatRate}%)</span>
              <span className="font-medium">+ {vatAmount.toFixed(2)} €</span>
            </div>
            {irpfRate > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retención IRPF ({irpfRate}%)</span>
                <span className="font-medium text-rose-500">- {irpfAmount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total factura</span>
              <span className="font-bold text-base">{totalAmount.toFixed(2)} €</span>
            </div>
          </div>
        )}

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

        {/* Fecha de cobro — solo si status es PAID */}
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
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

        {/* Declaración trimestral */}
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
                <FormLabel className="text-sm font-medium">Incluir en declaración trimestral</FormLabel>
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
