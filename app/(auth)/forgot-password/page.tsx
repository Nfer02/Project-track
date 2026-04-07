import type { Metadata } from "next"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar contraseña — ProjectTrack",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
