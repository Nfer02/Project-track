import { redirect } from "next/navigation"
import { getCurrentWorkspace } from "@/lib/workspace"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { FeedbackForm } from "./feedback-form"

export default async function FeedbackPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Check if already submitted
  const existing = await prisma.betaFeedback.findFirst({
    where: { userId: user.id },
  })

  if (existing) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
        <div className="rounded-xl border bg-card p-8 text-center space-y-4">
          <div className="text-4xl">&#x1F64F;</div>
          <h1 className="text-xl font-semibold">Gracias por tu feedback</h1>
          <p className="text-sm text-muted-foreground">Ya has enviado tu opinion. La tendremos en cuenta para mejorar ProjectTrack.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Tu opinion cuenta</h1>
        <p className="text-sm text-muted-foreground">Estas probando la version beta de ProjectTrack. Tu feedback nos ayuda a crear un producto mejor.</p>
      </div>
      <FeedbackForm userEmail={user.email ?? ""} />
    </div>
  )
}
