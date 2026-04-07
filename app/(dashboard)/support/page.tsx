import { redirect } from "next/navigation"
import { getCurrentWorkspace } from "@/lib/workspace"
import { createClient } from "@/lib/supabase/server"
import { SupportForm } from "./support-form"

export default async function SupportPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Soporte</h1>
        <p className="text-sm text-muted-foreground">¿Necesitas ayuda? Antes de enviar un ticket, revisa las <a href="/faq" className="underline hover:text-foreground">preguntas frecuentes</a>.</p>
      </div>
      <SupportForm userEmail={user?.email ?? ""} userName={user?.user_metadata?.name ?? ""} />
    </div>
  )
}
