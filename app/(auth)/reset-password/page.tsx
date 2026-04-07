import type { Metadata } from "next"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = {
  title: "Nueva contraseña — ProjectTrack",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Nueva contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Introduce tu nueva contraseña.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
