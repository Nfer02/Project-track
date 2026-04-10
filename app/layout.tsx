import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/sonner"

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "ProjectTrack",
  description: "Controla tus proyectos, ingresos y gastos en un solo lugar. Para freelancers, negocios y cualquier persona que trabaje por proyectos.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <Script id="scroll-restore" strategy="beforeInteractive">{`history.scrollRestoration='manual'`}</Script>
      {/* JSON-LD: ayuda a Google a identificar el logo oficial */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ProjectTrack",
            url: "https://projecttrack.app",
            logo: "https://projecttrack.app/opengraph-image",
          }),
        }}
      />
      <body className={`${font.variable} font-sans antialiased`}>
        {/* Skip to main content — accesibilidad teclado */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
        >
          Ir al contenido principal
        </a>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
