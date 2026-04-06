import { redirect } from "next/navigation"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/onboarding")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Mi perfil</h1>
      <ProfileForm
        defaultValues={{
          name: dbUser?.name ?? "",
          email: user.email ?? "",
        }}
      />
    </div>
  )
}
