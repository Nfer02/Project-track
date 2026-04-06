import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Términos y condiciones — ProjectTrack",
  description:
    "Términos y condiciones de uso de ProjectTrack, herramienta de gestión de proyectos y control financiero para autónomos y pymes.",
}

const SECTIONS = [
  {
    title: "1. Objeto",
    content:
      "ProjectTrack es una herramienta de gestión de proyectos y control financiero dirigida a autónomos y pequeñas empresas. Su finalidad es facilitar la organización de proyectos, el registro de ingresos y gastos, y la estimación orientativa de obligaciones fiscales. ProjectTrack no es un programa de facturación oficial, no emite facturas con validez legal ni sustituye a ningún software de facturación homologado.",
  },
  {
    title: "2. Uso del servicio",
    content:
      "El usuario es el único responsable de la veracidad, exactitud y legalidad de los datos que introduce en la plataforma. ProjectTrack proporciona estimaciones fiscales orientativas (IVA, IRPF) que tienen carácter meramente informativo y en ningún caso sustituyen el asesoramiento de un profesional fiscal o contable. El usuario se compromete a utilizar el servicio de forma lícita y conforme a estos términos.",
  },
  {
    title: "3. Planes y precios",
    content:
      "ProjectTrack ofrece un plan Starter gratuito con funcionalidades limitadas y un plan PRO de pago mediante suscripción mensual. Los precios vigentes se publican en la página de precios de la plataforma. Nos reservamos el derecho de modificar los precios con un aviso previo mínimo de 30 días naturales. Los cambios de precio no afectarán al período de suscripción ya pagado.",
  },
  {
    title: "4. Pagos",
    content:
      "Los pagos se procesan de forma segura a través de Stripe. ProjectTrack no almacena datos de tarjetas de crédito ni información bancaria del usuario. La suscripción al plan PRO se renueva automáticamente cada mes en la fecha de contratación. El usuario recibirá un recibo por cada cobro realizado.",
  },
  {
    title: "5. Cancelación",
    content:
      "El usuario puede cancelar su suscripción en cualquier momento desde la sección de Facturación de su cuenta. Tras la cancelación, el acceso a las funcionalidades del plan PRO se mantendrá hasta el final del período de facturación ya pagado. Una vez finalizado dicho período, la cuenta pasará automáticamente al plan Starter gratuito, conservando todos los datos del usuario.",
  },
  {
    title: "6. Propiedad intelectual",
    content:
      "El software, el diseño, el código fuente, los gráficos y la marca ProjectTrack son propiedad exclusiva de ProjectTrack. Queda prohibida su reproducción, distribución o modificación sin autorización expresa. Los datos introducidos por el usuario en la plataforma son propiedad del usuario en todo momento. El usuario puede exportar sus datos en cualquier momento.",
  },
  {
    title: "7. Protección de datos",
    content:
      "ProjectTrack cumple con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos y garantía de los derechos digitales (LOPDGDD). Los datos del usuario se almacenan en servidores ubicados en la Unión Europea (Frankfurt, Alemania), cifrados tanto en reposo como en tránsito. Para más información, consulta nuestra Política de privacidad.",
  },
  {
    title: "8. Limitación de responsabilidad",
    content:
      "ProjectTrack no se responsabiliza de las decisiones fiscales, financieras o empresariales que el usuario tome basándose en las estimaciones, cálculos o datos mostrados en la plataforma. Las estimaciones fiscales son orientativas y no constituyen asesoramiento profesional. El usuario debe consultar siempre con un asesor fiscal cualificado antes de presentar declaraciones o tomar decisiones financieras relevantes. ProjectTrack no garantiza la disponibilidad ininterrumpida del servicio, aunque se compromete a mantener un nivel de disponibilidad razonable.",
  },
  {
    title: "9. Modificaciones",
    content:
      "Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios significativos se comunicarán al usuario con una antelación mínima de 30 días a través del correo electrónico asociado a su cuenta. El uso continuado del servicio tras la entrada en vigor de los nuevos términos implica su aceptación.",
  },
  {
    title: "10. Contacto",
    content:
      "Para cualquier consulta relacionada con estos términos y condiciones, puedes escribirnos a soporte@projecttrack.es.",
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Términos y condiciones</h1>
          <p className="text-sm text-muted-foreground">
            Última actualización: abril de 2026
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
