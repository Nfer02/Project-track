import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronDown, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Preguntas frecuentes — ProjectTrack",
  description:
    "Respuestas a las dudas más comunes sobre ProjectTrack, gestión de facturas, gastos e impuestos para autónomos en España.",
}

const FAQ_CATEGORIES = [
  {
    title: "General",
    items: [
      {
        question: "¿Qué es ProjectTrack?",
        answer:
          "ProjectTrack es una plataforma de gestión financiera diseñada para autónomos y pequeñas empresas en España. Te permite gestionar proyectos, emitir facturas, controlar gastos y calcular tus obligaciones fiscales trimestrales (IVA e IRPF), todo en un solo lugar.",
      },
      {
        question: "¿Para qué tipo de negocios sirve?",
        answer:
          "Para cualquier autónomo o pyme que trabaje por proyectos: reformas y construcción, diseño gráfico, arquitectura, fotografía, consultoría, desarrollo de software, instalaciones, jardinería, eventos, interiorismo, formación, y más.",
      },
      {
        question: "¿Necesito conocimientos de contabilidad?",
        answer:
          "No. ProjectTrack está diseñado para que cualquier persona pueda llevar el control de sus finanzas sin ser contable. La app calcula automáticamente las estimaciones de IVA e IRPF para que sepas cuánto reservar para Hacienda.",
      },
    ],
  },
  {
    title: "Facturación y gastos",
    items: [
      {
        question: "¿Cómo funciona el reparto de gastos entre proyectos?",
        answer:
          "Cuando compras material para varias obras, puedes subir la factura una sola vez y repartir el importe entre los proyectos correspondientes. Por ejemplo: compras 100\u00A0€ en tablas → asignas 50\u00A0€ al Proyecto A y 50\u00A0€ al Proyecto B. Para tu contador, la factura aparece una sola vez.",
      },
      {
        question: "¿Qué es el OCR inteligente?",
        answer:
          "Puedes hacer una foto o subir un PDF de cualquier factura de compra. Nuestra inteligencia artificial (Claude AI) analiza el documento y extrae automáticamente los datos: proveedor, importe, IVA, fecha, descripción. Te ahorras escribir todo a mano.",
      },
      {
        question: '¿Qué significa "incluir en declaración trimestral"?',
        answer:
          "Es un control que te permite marcar qué facturas deben aparecer en el informe que entregas a tu gestor para la declaración trimestral de impuestos. Las facturas no marcadas se excluyen del informe pero siguen siendo visibles para tu gestión interna.",
      },
    ],
  },
  {
    title: "Impuestos y fiscal",
    items: [
      {
        question: "¿Qué impuestos calcula ProjectTrack?",
        answer:
          "Calcula una estimación del IVA a pagar (IVA repercutido menos IVA soportado) y del pago fraccionado de IRPF (20% del beneficio neto). Estos son los modelos 303 y 130 que debes presentar trimestralmente. La estimación es orientativa — consulta siempre con tu asesor fiscal para el cálculo exacto.",
      },
      {
        question: "¿Puedo configurar diferentes tipos de IVA?",
        answer:
          "Sí. Cada proyecto puede tener su propio tipo de IVA (21% general, 10% reducido para reformas de vivienda, 4% superreducido, o exento). También puedes configurar la retención de IRPF por proyecto (0%, 7% para nuevos autónomos, o 15%).",
      },
      {
        question: "¿Cuándo debo presentar la declaración trimestral?",
        answer:
          "Los plazos son: T1 (enero-marzo) → antes del 20 de abril. T2 (abril-junio) → antes del 20 de julio. T3 (julio-septiembre) → antes del 20 de octubre. T4 (octubre-diciembre) → antes del 30 de enero del año siguiente. ProjectTrack te avisa cuando se acerca la fecha.",
      },
    ],
  },
  {
    title: "Planes y precios",
    items: [
      {
        question: "¿Puedo probar ProjectTrack gratis?",
        answer:
          "Sí. El plan Starter es gratuito para siempre e incluye hasta 3 proyectos, facturas, control de gastos y dashboard financiero. No necesitas tarjeta de crédito para registrarte.",
      },
      {
        question: "¿Qué incluye el plan PRO?",
        answer:
          "Proyectos ilimitados, OCR inteligente para facturas, reparto de gastos entre proyectos, estimación fiscal automática (IVA + IRPF), reportes para el contador, y hasta 3 usuarios. Todo por 14,99\u00A0€/mes.",
      },
      {
        question: "¿Puedo cancelar en cualquier momento?",
        answer:
          "Sí. No hay permanencia. Puedes cancelar tu suscripción PRO o Business en cualquier momento desde la sección de Facturación. Seguirás teniendo acceso hasta el final del período pagado.",
      },
    ],
  },
  {
    title: "Seguridad y datos",
    items: [
      {
        question: "¿Mis datos están seguros?",
        answer:
          "Sí. Tus datos se almacenan cifrados en servidores europeos (Supabase, Frankfurt). Solo tú y las personas que invites tienen acceso a tu información. Cumplimos con el RGPD.",
      },
      {
        question: "¿Puedo dar acceso a mi gestor o contador?",
        answer:
          "Sí. Puedes invitar a colaboradores con diferentes roles (administrador, miembro). Tu gestor puede acceder a los reportes trimestrales y ver las facturas que necesita para la declaración.",
      },
      {
        question: "¿Puedo exportar mis datos?",
        answer:
          "Sí. Desde la sección de Reportes puedes exportar todas tus facturas y gastos declarados en formato CSV, listo para enviar a tu gestor o importar en cualquier programa de contabilidad.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Resolvemos las dudas más comunes sobre ProjectTrack, facturación,
            gastos e impuestos para autónomos.
          </p>
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {FAQ_CATEGORIES.map((category) => (
            <section key={category.title}>
              <h2 className="mb-4 text-lg font-semibold">{category.title}</h2>
              <div className="rounded-lg border">
                {category.items.map((item, index) => (
                  <details
                    key={index}
                    className={`group ${index < category.items.length - 1 ? "border-b" : ""}`}
                  >
                    <summary className="flex cursor-pointer items-center justify-between px-4 py-4 text-sm font-medium transition-colors hover:bg-muted/50">
                      {item.question}
                      <ChevronDown className="ml-4 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-lg border bg-muted/30 p-6 text-center sm:p-8">
          <h3 className="text-lg font-semibold">¿Tienes más preguntas?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Nuestro equipo está encantado de ayudarte. Escríbenos y te
            respondemos lo antes posible.
          </p>
          <a
            href="mailto:soporte@projecttrack.es"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            soporte@projecttrack.es
          </a>
        </div>
      </div>
    </div>
  )
}
