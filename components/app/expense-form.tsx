"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, Trash2 } from "lucide-react"
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
import type { ExpenseFormValues } from "@/app/(dashboard)/invoices/actions"

const schema = z.object({
  number: z.string().min(1),
  vendorName: z.string().min(1, "El proveedor es obligatorio"),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, "El importe es obligatorio")
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Formato invalido (ej: 1500.00)"),
  currency: z.string().min(1),
  category: z.string().optional(),
  status: z.enum(["PENDING", "PAID"]),
  issueDate: z.string().min(1, "La fecha es obligatoria"),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  isDeclared: z.boolean(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const CATEGORY_OPTIONS = [
  { value: "Material", label: "Material" },
  { value: "Herramientas", label: "Herramientas" },
  { value: "Mano de obra / Subcontrata", label: "Mano de obra / Subcontrata" },
  { value: "Transporte", label: "Transporte" },
  { value: "Alquiler", label: "Alquiler" },
  { value: "Suministros", label: "Suministros" },
  { value: "Otros", label: "Otros" },
]

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "PAID", label: "Pagado" },
]

type Allocation = { projectId: string; amount: string; notes?: string }

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormValues>
  projects: { id: string; name: string }[]
  onSubmit: (values: ExpenseFormValues) => Promise<void | { error: string }>
  submitLabel?: string
}

export function ExpenseForm({
  defaultValues,
  projects,
  onSubmit,
  submitLabel = "Guardar",
}: ExpenseFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [allocations, setAllocations] = useState<Allocation[]>(
    (defaultValues?.allocations as Allocation[] | undefined) ?? [],
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      number: "",
      vendorName: "",
      description: "",
      amount: "",
      currency: "EUR",
      category: "",
      status: "PENDING" as const,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      paidDate: "",
      isDeclared: true,
      notes: "",
      ...(defaultValues as Partial<FormValues>),
    },
  })

  const { isSubmitting } = form.formState
  const status = form.watch("status")
  const totalAmount = parseFloat(form.watch("amount") || "0") || 0

  const allocTotal = allocations.reduce(
    (sum, a) => sum + (parseFloat(a.amount || "0") || 0),
    0,
  )
  const unallocated = Math.max(0, totalAmount - allocTotal)

  function addAllocation() {
    setAllocations((prev) => [...prev, { projectId: "", amount: "" }])
  }

  function removeAllocation(index: number) {
    setAllocations((prev) => prev.filter((_, i) => i !== index))
  }

  function updateAllocation(index: number, patch: Partial<Allocation>) {
    setAllocations((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    )
  }

  async function handleSubmit(values: FormValues) {
    setServerError(null)

    // Validar asignaciones
    const validAllocations = allocations.filter(
      (a) => a.projectId && parseFloat(a.amount || "0") > 0,
    )
    const sumAlloc = validAllocations.reduce(
      (s, a) => s + parseFloat(a.amount || "0"),
      0,
    )
    if (sumAlloc > parseFloat(values.amount || "0")) {
      setServerError(
        `La suma de las asignaciones (${sumAlloc.toFixed(2)}) supera el importe total.`,
      )
      return
    }

    try {
      const result = await onSubmit({
        ...values,
        allocations: validAllocations,
      } as ExpenseFormValues)
      if (result && "error" in result) setServerError(result.error)
    } catch (err) {
      if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT"))
        throw err
      setServerError("Ocurrio un error. Intentalo de nuevo.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* OCR Upload */}
        <OcrUpload
          onExtracted={(data: OcrData) => {
            if (data.vendorName) form.setValue("vendorName", data.vendorName)
            if (data.description) form.setValue("description", data.description)
            if (data.amount) form.setValue("amount", String(data.amount))
            if (data.issueDate) form.setValue("issueDate", data.issueDate)
            if (data.dueDate) form.setValue("dueDate", data.dueDate)
            if (data.notes) form.setValue("notes", data.notes)
          }}
        />

        {/* Numero (oculto) */}
        <input type="hidden" {...form.register("number")} />
        <input type="hidden" {...form.register("currency")} />

        {/* Proveedor + Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vendorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Leroy Merlin" {...field} />
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

        {/* Descripcion */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Materiales para obra calle Mayor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Importe + Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Importe (EUR) *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej: 250.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((o) => (
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

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de factura *</FormLabel>
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
                <FormLabel>Fecha de pago</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* ── Asignar a proyectos ─────────────────────────────── */}
        <div className="space-y-3 pt-2 border-t">
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Asignar a proyectos
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Indica cuanto de este gasto corresponde a cada proyecto
            </p>
          </div>

          {allocations.map((alloc, idx) => (
            <div key={idx} className="flex items-end gap-2">
              <div className="flex-1">
                <select
                  value={alloc.projectId}
                  onChange={(e) => updateAllocation(idx, { projectId: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Selecciona proyecto</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Importe"
                  value={alloc.amount}
                  onChange={(e) =>
                    updateAllocation(idx, { amount: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAllocation(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAllocation}
            disabled={projects.length === 0}
          >
            <Plus className="mr-1 h-4 w-4" />
            Anadir proyecto
          </Button>

          {totalAmount > 0 && (
            <p className="text-xs text-muted-foreground">
              Asignado: EUR{allocTotal.toFixed(2)} / EUR{totalAmount.toFixed(2)} —{" "}
              Sin asignar: EUR{unallocated.toFixed(2)} (gasto general)
            </p>
          )}
        </div>

        {/* isDeclared */}
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
                <FormLabel className="text-sm font-medium">
                  Incluir en declaracion trimestral
                </FormLabel>
                <FormDescription className="text-xs">
                  Desactiva si este gasto no se va a declarar
                </FormDescription>
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
                  placeholder="Notas opcionales..."
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
