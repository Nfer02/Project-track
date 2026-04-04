"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowRight, Building2, User } from "lucide-react"
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
import { createWorkspace } from "../actions"

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  workspaceName: z.string().min(2, "Nombre del workspace muy corto"),
})

type Values = z.infer<typeof schema>

function slugPreview(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "mi-workspace"
}

const STEPS = [
  { id: 1, label: "Tu perfil" },
  { id: 2, label: "Tu workspace" },
]

export function OnboardingWizard({ defaultName }: { defaultName?: string }) {
  const [step, setStep] = useState(1)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName ?? "", workspaceName: "" },
  })

  const { isSubmitting } = form.formState
  const workspaceName = form.watch("workspaceName")

  async function handleNext() {
    const valid = await form.trigger("name")
    if (valid) setStep(2)
  }

  async function onSubmit(values: Values) {
    setServerError(null)
    const result = await createWorkspace(values).catch(() => ({ error: "Ocurrió un error. Inténtalo de nuevo." }))
    if (result && "error" in result) setServerError(result.error)
  }

  return (
    <div className="w-full max-w-md">
      {/* Indicador de pasos */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  step >= s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  step >= s.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 transition-colors ${step > s.id ? "bg-primary" : "bg-border"}`} />
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paso 1 de 2</p>
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

          {/* Paso 2: Workspace */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paso 2 de 2</p>
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

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Atrás
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear workspace
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
