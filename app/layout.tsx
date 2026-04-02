import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "ProjectTrack",
  description: "Gestión financiera de proyectos para autónomos",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${font.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
