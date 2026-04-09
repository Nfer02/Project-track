"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

interface Testimonial {
  name: string
  role: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: "Carlos Martín",
    role: "Autónomo en reformas",
    quote:
      "Antes llevaba todo en Excel y siempre me perdía con los gastos de cada obra. Con ProjectTrack tengo claro cuánto gano en cada proyecto.",
  },
  {
    name: "Laura Sánchez",
    role: "Diseñadora gráfica freelance",
    quote:
      "Lo mejor es el reparto de gastos entre proyectos. Compro licencias que uso para varios clientes y ahora sé exactamente cuánto me cuesta cada uno.",
  },
  {
    name: "Miguel Ángel Torres",
    role: "Instalador eléctrico",
    quote:
      "La estimación fiscal me salvó. Ahora tengo una idea clara de cuánto reservar para Hacienda cada trimestre sin sorpresas.",
  },
  {
    name: "Ana Belén Ruiz",
    role: "Arquitecta",
    quote:
      "Gestiono 8 proyectos a la vez y el dashboard me da una visión clara de todo. Mis clientes notan que soy más organizada.",
  },
  {
    name: "Javier Hernández",
    role: "Empresa de pintura",
    quote:
      "El OCR es brutal. Hago foto al ticket de la ferretería y se carga solo. Me ahorro media hora al día.",
  },
  {
    name: "Patricia López",
    role: "Consultora de marketing",
    quote:
      "Por fin tengo todo en un solo sitio: proyectos, facturas y gastos. Antes perdía horas buscando datos entre hojas de cálculo.",
  },
]

function StarIcon() {
  return (
    <svg
      className="h-4 w-4 fill-amber-400 text-amber-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const total = testimonials.length

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  const goTo = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 8000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="w-full space-y-6">
      {/* Carousel container */}
      <div className="relative overflow-hidden">
        {/* Arrow left */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md border border-border backdrop-blur-sm hover:bg-background transition-colors"
          aria-label="Anterior"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Arrow right */}
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md border border-border backdrop-blur-sm hover:bg-background transition-colors"
          aria-label="Siguiente"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Cards track */}
        <div className="px-12">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * (100 / 3)}%)`,
            }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="w-full shrink-0 px-2 md:w-1/3">
                <div className="rounded-xl border border-border bg-card p-6 space-y-4 h-full">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random&size=80`}
                      alt={t.name}
                      className="h-12 w-12 rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <StarIcon key={j} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Testimonio ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === current
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
            )}
          />
        ))}
      </div>
    </div>
  )
}
