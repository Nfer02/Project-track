import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { RegisterForm } from "./_components/register-form"

const benefits = [
  "Configuración en menos de 2 minutos",
  "Sin tarjeta de crédito requerida",
  "Plan gratuito con proyectos ilimitados",
  "Soporte por email incluido",
]

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[520px_1fr]">
      {/* Panel izquierdo — marca */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
        style={{
          background: "oklch(0.1 0.01 264)",
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            PT
          </span>
          <span className="text-white font-semibold text-lg tracking-tight">ProjectTrack</span>
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">
              Empieza hoy, gratis
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-white">
              Todo lo que<br />
              necesitas para<br />
              <span style={{ color: "oklch(0.75 0.18 55)" }}>facturar mejor.</span>
            </h2>
          </div>

          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm" style={{ color: "oklch(0.75 0 0)" }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: "oklch(1 0 0 / 0.1)" }} />
          <span className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>
            projecttrack.app
          </span>
        </div>

        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "oklch(0.512 0.241 264 / 0.2)" }}
        />
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-background">
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            PT
          </span>
          <span className="font-semibold">ProjectTrack</span>
        </Link>

        <RegisterForm />
      </div>
    </div>
  )
}
