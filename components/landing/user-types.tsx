import Link from "next/link"
import { Building2, Palette, Wrench, Camera } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface UserType {
  Icon: LucideIcon
  title: string
  description: string
  color: string
}

const userTypes: UserType[] = [
  {
    Icon: Building2,
    title: "Reformas y construcción",
    description:
      "Controla materiales, subcontratas y presupuestos por obra. Sabe cuánto ganas en cada reforma.",
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    Icon: Palette,
    title: "Diseño y servicios profesionales",
    description:
      "Gestiona proyectos por cliente, reparte gastos compartidos y ten siempre claro tu rentabilidad.",
    color: "text-violet-600 bg-violet-500/10",
  },
  {
    Icon: Wrench,
    title: "Instalaciones y mantenimiento",
    description:
      "Registra gastos sobre la marcha, escanea tickets con el móvil y llega preparado al trimestre.",
    color: "text-blue-600 bg-blue-500/10",
  },
  {
    Icon: Camera,
    title: "Fotografía, vídeo y eventos",
    description:
      "Cada evento es un proyecto. Controla equipo, desplazamientos y proveedores con visión clara de lo que ganas.",
    color: "text-rose-600 bg-rose-500/10",
  },
]

export function UserTypes() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {userTypes.map(({ Icon, title, description, color }) => (
        <Link
          key={title}
          href="/register"
          className="group rounded-2xl border bg-card p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/30"
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
            Empezar gratis
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  )
}
