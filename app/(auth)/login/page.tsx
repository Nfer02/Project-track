import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { LoginForm } from "./_components/login-form"
import { Logo } from "@/components/app/logo"

const features = [
  "Proyectos y clientes en un solo lugar",
  "Registro de ingresos y gastos por proyecto",
  "Carga de facturas con lectura automática (IA)",
  "Dashboard financiero en tiempo real",
]

interface Props {
  searchParams: Promise<{ invite?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { invite } = await searchParams
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
        {/* Logotipo */}
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <Logo size={30} />
          <span className="text-white font-semibold text-lg tracking-tight">ProjectTrack</span>
        </Link>

        {/* Claim principal */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">
              Para profesionales y negocios con proyectos
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-white">
              Tus proyectos,<br />
              tus finanzas,<br />
              <span style={{ color: "#60a5fa", textShadow: "0 0 20px rgba(96,165,250,0.6)" }}>bajo control.</span>
            </h2>
          </div>

          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm" style={{ color: "oklch(0.75 0 0)" }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Barra inferior decorativa */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: "oklch(1 0 0 / 0.1)" }} />
          <span className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>
            projecttrack.app
          </span>
        </div>

        {/* Acento de color en la esquina */}
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "oklch(0.512 0.241 264 / 0.2)" }}
        />
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Logo solo en mobile */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <Logo size={26} />
          <span className="font-semibold">ProjectTrack</span>
        </Link>

        <LoginForm inviteToken={invite} />
      </div>
    </div>
  )
}
