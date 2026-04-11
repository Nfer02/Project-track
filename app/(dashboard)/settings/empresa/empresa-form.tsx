"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { updateWorkspaceFiscal } from "./actions"

const schema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  nif: z.string(),
  legalName: z.string(),
  legalForm: z.string(),
  vatRegime: z.string(),
  defaultVatRate: z.string(),
  defaultIrpfRate: z.string(),
  isIspApplicable: z.boolean(),
  employeeCount: z.string(),
  autonomoQuota: z.string(),
})

type Values = z.infer<typeof schema>

interface Props {
  workspace: {
    name: string
    nif: string | null
    legalName: string | null
    legalForm: string | null
    vatRegime: string | null
    defaultVatRate: number
    defaultIrpfRate: number
    isIspApplicable: boolean
    employeeCount: number | null
    autonomoQuota: number | null
  }
}

const LEGAL_FORMS = [
  { value: "autonomo", label: "Autónomo / Freelance" },
  { value: "sl", label: "Sociedad Limitada (SL)" },
  { value: "sa", label: "Sociedad Anónima (SA)" },
  { value: "otro", label: "Otra forma jurídica" },
]

const VAT_REGIMES = [
  { value: "general", label: "Régimen general" },
  { value: "recargo", label: "Recargo de equivalencia" },
  { value: "exento", label: "Exento de IVA" },
]

export function EmpresaForm({ workspace }: Props) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: workspace.name,
      nif: workspace.nif ?? "",
      legalName: workspace.legalName ?? "",
      legalForm: workspace.legalForm ?? "",
      vatRegime: workspace.vatRegime ?? "general",
      defaultVatRate: String(workspace.defaultVatRate ?? 21),
      defaultIrpfRate: String(workspace.defaultIrpfRate ?? 0),
      isIspApplicable: workspace.isIspApplicable ?? false,
      employeeCount: workspace.employeeCount != null ? String(workspace.employeeCount) : "",
      autonomoQuota: workspace.autonomoQuota != null ? String(workspace.autonomoQuota) : "",
    },
  })

  const { isSubmitting } = form.formState
  const legalForm = form.watch("legalForm")

  async function onSubmit(values: Values) {
    setServerError(null)
    setSaved(false)
    const result = await updateWorkspaceFiscal(values).catch(() => ({
      error: "Ocurrió un error. Inténtalo de nuevo.",
    }))
    if (result && "error" in result) {
      setServerError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Datos generales */}
        <section className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">Datos generales</h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del workspace</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Estudio García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón social <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ej: García Reformas SL" {...field} />
                </FormControl>
                <FormDescription>Nombre oficial registrado. Si está vacío, se usa el nombre del workspace.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIF / CIF <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 12345678A o B12345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalForm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma jurídica</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...field}
                  >
                    <option value="">Sin especificar</option>
                    {LEGAL_FORMS.map((lf) => (
                      <option key={lf.value} value={lf.value}>{lf.label}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Configuración fiscal */}
        <section className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">Configuración fiscal</h2>

          <FormField
            control={form.control}
            name="vatRegime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Régimen de IVA</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...field}
                  >
                    {VAT_REGIMES.map((vr) => (
                      <option key={vr.value} value={vr.value}>{vr.label}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="defaultVatRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>% IVA por defecto</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...field}
                    >
                      <option value="0">0%</option>
                      <option value="4">4% (superreducido)</option>
                      <option value="10">10% (reducido)</option>
                      <option value="21">21% (general)</option>
                    </select>
                  </FormControl>
                  <FormDescription>Para nuevas facturas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultIrpfRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>% IRPF por defecto</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...field}
                    >
                      <option value="0">0%</option>
                      <option value="7">7% (nuevos autónomos)</option>
                      <option value="15">15% (general)</option>
                      <option value="19">19%</option>
                    </select>
                  </FormControl>
                  <FormDescription>Retención en facturas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isIspApplicable"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3">
                <FormControl>
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel className="cursor-pointer">
                    Aplica Inversión Sujeto Pasivo (art. 84.1.2º LIVA)
                  </FormLabel>
                  <FormDescription>
                    Activa si emites o recibes facturas sin IVA por ISP (habitual en construcción y reformas con empresas).
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </section>

        {/* Empleados y autónomo */}
        <section className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">Empleados y Seguridad Social</h2>

          <FormField
            control={form.control}
            name="employeeCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de empleados <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Ej: 2" {...field} />
                </FormControl>
                <FormDescription>
                  Empleados en plantilla. Necesario para estimar retenciones del Modelo 111.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {(legalForm === "autonomo" || legalForm === "") && (
            <FormField
              control={form.control}
              name="autonomoQuota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuota autónomo mensual (€) <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="Ej: 294.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cuota mensual de Seguridad Social como autónomo. Se incluye como gasto deducible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </section>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {saved && <p className="text-sm text-emerald-600">Cambios guardados correctamente.</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
      </form>
    </Form>
  )
}
