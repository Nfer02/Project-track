"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowRight, Building2, User, FileText } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { createWorkspace } from "../actions"

const schema = z.object({
  name: z.string().min(2, "Introduce tu nombre completo"),
  sector: z.string().min(1, "Selecciona tu sector"),
  workspaceName: z.string().min(2, "Nombre del workspace muy corto"),
  // Paso 4 - fiscal (todos opcionales, se pueden omitir)
  nif: z.string().optional(),
  legalForm: z.string().optional(),
  vatRegime: z.string().optional(),
  employeeCount: z.string().optional(),
})

type Values = z.infer<typeof schema>

function slugPreview(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "mi-workspace"
  )
}

const STEPS = [
  { id: 1, label: "Tu perfil" },
  { id: 2, label: "Tu sector" },
  { id: 3, label: "Tu workspace" },
  { id: 4, label: "Datos fiscales" },
]

const SECTORS = [
  { value: "reformas", label: "Reformas y construcción", icon: "🏗️" },
  { value: "instalaciones", label: "Instalaciones y mantenimiento", icon: "🔧" },
  { value: "diseno", label: "Diseño y servicios profesionales", icon: "🎨" },
  { value: "fotografia", label: "Fotografía, vídeo y eventos", icon: "📷" },
  { value: "consultoria", label: "Consultoría y formación", icon: "💼" },
  { value: "tecnologia", label: "Desarrollo y tecnología", icon: "💻" },
  { value: "otro", label: "Otro sector", icon: "📦" },
]

const LEGAL_FORMS = [
  { value: "autonomo", label: "Autónomo / Freelance" },
  { value: "sl", label: "Sociedad Limitada (SL)" },
  { value: "sa", label: "Sociedad Anónima (SA)" },
  { value: "otro", label: "Otra forma jurídica" },
]

const VAT_REGIMES = [
  { value: "general", label: "Régimen general (21%)" },
  { value: "recargo", label: "Recargo de equivalencia" },
  { value: "exento", label: "Exento de IVA" },
]

export function OnboardingWizard({ defaultName }: { defaultName?: string }) {
  const [step, setStep] = useState(1)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultName ?? "",
      sector: "",
      workspaceName: "",
      nif: "",
      legalForm: "",
      vatRegime: "general",
      employeeCount: "",
    },
  })

  const { isSubmitting } = form.formState
  const workspaceName = form.watch("workspaceName")

  async function handleNext() {
    const valid = await form.trigger("name")
    if (valid) setStep(2)
  }

  async function handleNextStep3() {
    const valid = await form.trigger("workspaceName")
    if (valid) setStep(4)
  }

  async function onSubmit(values: Values) {
    setServerError(null)
    const result = await createWorkspace(values).catch(() => ({
      error: "Ocurrió un error. Inténtalo de nuevo.",
    }))
    if (result && "error" in result) setServerError(result.error)
  }

  // Omitir paso 4 y enviar con los datos ya completados
  async function handleSkipFiscal() {
    setServerError(null)
    const values = form.getValues()
    const result = await createWorkspace(values).catch(() => ({
      error: "Ocurrió un error. Inténtalo de nuevo.",
    }))
    if (result && "error" in result) setServerError(result.error)
  }

  return (
    <div className="w-full max-w-md">
      {/* Indicador de pasos */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors shrink-0 ${
                  step >= s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`text-xs font-medium transition-colors whitespace-nowrap ${
                  step >= s.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-3 sm:w-6 transition-colors shrink-0 ${
                  step > s.id ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Paso 1: Perfil */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paso 1 de 4</p>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Bienvenido a ProjectTrack</h1>
                <p className="text-sm text-muted-foreground">¿Cómo te llamas?</p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan García" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" className="w-full" onClick={handleNext}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Paso 2: Sector */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paso 2 de 4</p>
                <h1 className="text-2xl font-semibold tracking-tight">¿A qué te dedicas?</h1>
                <p className="text-sm text-muted-foreground">Personalizamos las categorías según tu sector</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SECTORS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      form.setValue("sector", s.value)
                      setStep(3)
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-all hover:border-primary/50",
                      form.watch("sector") === s.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border"
                    )}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-medium">{s.label}</span>
                  </button>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
            </div>
          )}

          {/* Paso 3: Workspace */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paso 3 de 4</p>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Crea tu workspace</h1>
                <p className="text-sm text-muted-foreground">
                  El espacio donde vas a gestionar tus proyectos y finanzas.
                </p>
              </div>

              <FormField
                control={form.control}
                name="workspaceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del workspace</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Estudio García" autoFocus {...field} />
                    </FormControl>
                    <FormDescription>
                      URL:{" "}
                      <span className="font-mono text-foreground">
                        projecttrack.app/{slugPreview(workspaceName)}
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Atrás
                </Button>
                <Button type="button" className="flex-1" onClick={handleNextStep3}>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Paso 4: Datos fiscales */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paso 4 de 4</p>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Datos fiscales</h1>
                <p className="text-sm text-muted-foreground">
                  Para calcular estimaciones de IVA e IRPF con mayor precisión.
                </p>
              </div>

              <div className="rounded-xl border border-muted bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                Todos los campos son opcionales. Puedes completarlos o editarlos después en{" "}
                <span className="font-medium text-foreground">Configuración → Mi empresa</span>.
              </div>

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
                    <FormLabel>Forma jurídica <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...field}
                      >
                        <option value="">Selecciona una opción</option>
                        {LEGAL_FORMS.map((lf) => (
                          <option key={lf.value} value={lf.value}>
                            {lf.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vatRegime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Régimen de IVA <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...field}
                      >
                        {VAT_REGIMES.map((vr) => (
                          <option key={vr.value} value={vr.value}>
                            {vr.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de empleados <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Ej: 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear workspace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  disabled={isSubmitting}
                  onClick={handleSkipFiscal}
                >
                  Omitir por ahora
                </Button>
              </div>

              <Button type="button" variant="outline" size="sm" onClick={() => setStep(3)} disabled={isSubmitting}>
                Atrás
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
