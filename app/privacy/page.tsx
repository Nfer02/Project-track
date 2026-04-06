import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de privacidad — ProjectTrack",
  description:
    "Política de privacidad de ProjectTrack. Información sobre el tratamiento de datos personales, derechos del usuario y cumplimiento del RGPD.",
}

const SECTIONS = [
  {
    title: "1. Responsable del tratamiento",
    content:
      "El responsable del tratamiento de los datos personales es ProjectTrack, con domicilio en España. Puedes contactar con nosotros en soporte@projecttrack.es para cualquier cuestión relacionada con la protección de tus datos.",
  },
  {
    title: "2. Datos que recopilamos",
    content:
      "Recopilamos los datos que el usuario proporciona al registrarse y utilizar el servicio: nombre, dirección de correo electrónico, y los datos de proyectos, facturas y gastos que introduce en la plataforma. No recopilamos datos de navegación, no utilizamos cookies de terceros ni realizamos seguimiento del comportamiento del usuario fuera de la plataforma.",
  },
  {
    title: "3. Finalidad",
    content:
      "Los datos recogidos se utilizan para la prestación del servicio contratado (gestión de proyectos y control financiero), la gestión y mantenimiento de la cuenta del usuario, y el envío de comunicaciones estrictamente relacionadas con el servicio (avisos de facturación, cambios en los términos, novedades relevantes de la plataforma).",
  },
  {
    title: "4. Base legal",
    content:
      "El tratamiento de datos se fundamenta en la ejecución del contrato entre el usuario y ProjectTrack (uso del servicio) y en el consentimiento del usuario para el envío de comunicaciones relacionadas con el servicio. El usuario puede retirar su consentimiento en cualquier momento.",
  },
  {
    title: "5. Almacenamiento",
    content:
      "Los datos del usuario se almacenan en servidores de Supabase ubicados en Frankfurt, Alemania, dentro de la Unión Europea. Todos los datos están cifrados en reposo y en tránsito mediante protocolos de seguridad estándar de la industria (TLS 1.3, AES-256).",
  },
  {
    title: "6. Procesamiento de documentos",
    content:
      "Los documentos subidos por el usuario (fotografías de facturas, tickets o albaranes) se procesan mediante Anthropic Claude para la extracción automática de datos (OCR). Los documentos se envían al servicio de procesamiento exclusivamente para su análisis y no se almacenan en los servidores de Anthropic más allá del tiempo estrictamente necesario para completar el procesamiento. Los datos extraídos se guardan en la cuenta del usuario dentro de la plataforma.",
  },
  {
    title: "7. Pagos",
    content:
      "Los pagos se procesan a través de Stripe, Inc., que actúa como encargado del tratamiento de los datos de pago. ProjectTrack no almacena, procesa ni tiene acceso a los datos de tarjetas de crédito o débito del usuario. Stripe cumple con el estándar PCI DSS Nivel 1. Puedes consultar la política de privacidad de Stripe en su sitio web.",
  },
  {
    title: "8. Derechos del usuario",
    content:
      "De acuerdo con el RGPD, el usuario tiene derecho de acceso a sus datos personales, rectificación de datos inexactos, supresión de sus datos (derecho al olvido), portabilidad de los datos en formato estructurado, oposición al tratamiento, y limitación del tratamiento. Para ejercer cualquiera de estos derechos, escríbenos a soporte@projecttrack.es. Responderemos en un plazo máximo de 30 días. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que tus derechos no han sido atendidos correctamente.",
  },
  {
    title: "9. Conservación",
    content:
      "Los datos personales se conservan mientras la cuenta del usuario permanezca activa. Tras la solicitud de eliminación de la cuenta, todos los datos personales y de uso se borrarán de forma definitiva en un plazo máximo de 30 días naturales. Se exceptúan aquellos datos que debamos conservar por obligación legal.",
  },
  {
    title: "10. Cookies",
    content:
      "ProjectTrack utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento del servicio, en particular la cookie de sesión de autenticación. No utilizamos cookies analíticas, publicitarias ni de seguimiento de terceros. Al ser cookies técnicas esenciales, no requieren consentimiento previo según la normativa vigente.",
  },
  {
    title: "11. Cambios en esta política",
    content:
      "Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios significativos se notificarán al usuario a través del correo electrónico asociado a su cuenta con la antelación suficiente para que pueda revisar las modificaciones. La fecha de la última actualización se indica al inicio de este documento.",
  },
]

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight mb-3">Política de privacidad</h1>
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
