"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Divide, Loader2, Plus, Trash2 } from "lucide-react"
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
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ExpenseFormValues } from "@/app/(dashboard)/invoices/actions"

const schema = z.object({
  number: z.string().min(1),
  externalNumber: z.string().optional(),
  counterpartNif: z.string().optional(),
  vendorName: z.string().min(1, "El proveedor es obligatorio"),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, "El importe es obligatorio")
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Formato inválido (ej: 1500.00)"),
  currency: z.string().min(1),
  category: z.string().optional(),
  vatAmount: z.string().optional(),
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

type Allocation = { projectId: string; amount: string; percentage?: string; notes?: string }

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormValues>
  projects: { id: string; name: string }[]
  onSubmit: (values: ExpenseFormValues) => Promise<void | { error: string }>
  submitLabel?: string
  preAssignedProjectId?: string
}

export function ExpenseForm({
  defaultValues,
  projects,
  onSubmit,
  submitLabel = "Guardar",
  preAssignedProjectId,
}: ExpenseFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [allocations, setAllocations] = useState<Allocation[]>(() => {
    if (preAssignedProjectId) return []
    const initial = (defaultValues?.allocations as Allocation[] | undefined) ?? []
    return initial.map((a) => ({ ...a, percentage: "" }))
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      number: "",
      externalNumber: "",
      counterpartNif: "",
      vendorName: "",
      description: "",
      amount: "",
      currency: "EUR",
      category: "",
      vatAmount: "",
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
  const allocPercent = totalAmount > 0 ? Math.min(100, (allocTotal / totalAmount) * 100) : 0

  function addAllocation() {
    setAllocations((prev) => [...prev, { projectId: "", amount: "", percentage: "" }])
  }

  function removeAllocation(index: number) {
    setAllocations((prev) => prev.filter((_, i) => i !== index))
  }

  function updateAllocation(index: number, patch: Partial<Allocation>) {
    setAllocations((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    )
  }

  function splitEvenly() {
    if (allocations.length === 0 || totalAmount <= 0) return
    const perProject = (totalAmount / allocations.length).toFixed(2)
    const pct = (100 / allocations.length).toFixed(1)
    setAllocations((prev) =>
      prev.map((a) => ({ ...a, amount: perProject, percentage: pct })),
    )
  }

  async function handleSubmit(values: FormValues) {
    setServerError(null)

    // Build allocations to send (strip percentage, it's UI-only)
    let validAllocations: { projectId: string; amount: string; notes?: string }[]

    if (preAssignedProjectId) {
      validAllocations = [{ projectId: preAssignedProjectId, amount: values.amount }]
    } else {
      validAllocations = allocations
        .filter((a) => a.projectId && parseFloat(a.amount || "0") > 0)
        .map(({ projectId, amount, notes }) => ({ projectId, amount, notes }))
    }

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
        externalNumber: values.externalNumber,
        counterpartNif: values.counterpartNif,
        allocations: validAllocations,
      } as ExpenseFormValues)
      if (result && "error" in result) setServerError(result.error)
    } catch (err) {
      if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT"))
        throw err
      setServerError("Ocurrió un error. Inténtalo de nuevo.")
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
            if (data.vatAmount) form.setValue("vatAmount", String(data.vatAmount))
            if (data.issueDate) form.setValue("issueDate", data.issueDate)
            if (data.dueDate) form.setValue("dueDate", data.dueDate)
            if (data.nif) form.setValue("counterpartNif", data.nif)
            if (data.invoiceNumber) form.setValue("externalNumber", data.invoiceNumber)
            if (data.notes) form.setValue("notes", data.notes)
          }}
        />

        {/* Numero (oculto) */}
        <input type="hidden" {...form.register("number")} />
        <input type="hidden" {...form.register("currency")} />

        {/* N.º factura del proveedor */}
        <FormField
          control={form.control}
          name="externalNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N.º factura del proveedor</FormLabel>
              <FormControl>
                <Input placeholder="Número que aparece en la factura de compra" {...field} />
              </FormControl>
              <FormDescription>El número de factura del proveedor</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* NIF del proveedor */}
        <FormField
          control={form.control}
          name="counterpartNif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIF del proveedor</FormLabel>
              <FormControl>
                <Input placeholder="Ej: B12345678" {...field} />
              </FormControl>
              <FormDescription>Obligatorio para el libro registro</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descripcion */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
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
            name="vatAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IVA incluido (EUR)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej: 43.68"
                    {...field}
                  />
                </FormControl>
                <FormDescription>IVA soportado en esta factura</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona categoría" />
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

        {/* ── Info: pre-assigned project ─────────────────────── */}
        {preAssignedProjectId && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-sm text-muted-foreground">
              Este gasto se asignará completo al proyecto{" "}
              <span className="font-medium text-foreground">
                {projects.find((p) => p.id === preAssignedProjectId)?.name ?? "seleccionado"}
              </span>.
            </p>
          </div>
        )}

        {/* ── Asignar a proyectos ─────────────────────────────── */}
        {!preAssignedProjectId && (
          <div className="space-y-3 pt-2 border-t">
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Asignar a proyectos
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Indica cuánto de este gasto corresponde a cada proyecto
              </p>
            </div>

            {/* Total amount reference */}
            {totalAmount > 0 && (
              <p className="text-sm font-medium">
                Importe total:{" "}
                <span className="text-primary">
                  {formatCurrency(totalAmount, "EUR")}
                </span>
              </p>
            )}

            {/* Allocation rows */}
            {allocations.map((alloc, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_7rem_5rem_auto] items-end gap-2">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs text-muted-foreground">Proyecto</label>
                  <select
                    value={alloc.projectId}
                    onChange={(e) =>
                      updateAllocation(idx, { projectId: e.target.value })
                    }
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
                <div>
                  <label className="text-xs text-muted-foreground">Importe</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={alloc.amount}
                    onChange={(e) => {
                      const amt = e.target.value
                      const pct =
                        totalAmount > 0
                          ? ((parseFloat(amt || "0") / totalAmount) * 100).toFixed(1)
                          : "0"
                      updateAllocation(idx, { amount: amt, percentage: pct })
                    }}
                  />
                </div>
                <div className="hidden sm:block">
                  <label className="text-xs text-muted-foreground">%</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={alloc.percentage ?? ""}
                    onChange={(e) => {
                      const pct = e.target.value
                      const amt =
                        totalAmount > 0
                          ? ((parseFloat(pct || "0") / 100) * totalAmount).toFixed(2)
                          : "0"
                      updateAllocation(idx, { amount: amt, percentage: pct })
                    }}
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

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAllocation}
                disabled={projects.length === 0}
              >
                <Plus className="mr-1 h-4 w-4" />
                Añadir proyecto
              </Button>

              {allocations.length >= 2 && totalAmount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={splitEvenly}
                >
                  <Divide className="mr-1 h-4 w-4" />
                  Repartir equitativamente
                </Button>
              )}
            </div>

            {/* Progress bar and summary */}
            {totalAmount > 0 && allocations.length > 0 && (
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      allocPercent >= 100
                        ? "bg-emerald-500"
                        : allocPercent >= 70
                          ? "bg-amber-500"
                          : "bg-primary",
                    )}
                    style={{ width: `${Math.min(100, allocPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Asignado: {formatCurrency(allocTotal, "EUR")} (
                    {allocPercent.toFixed(0)}%)
                  </span>
                  <span>
                    Sin asignar: {formatCurrency(unallocated, "EUR")} (gasto general)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

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
                  Incluir en declaración trimestral
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
