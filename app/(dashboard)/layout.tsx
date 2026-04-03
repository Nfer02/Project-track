import { AppSidebar } from "@/components/app/app-sidebar"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

async function getSessionData() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { user: undefined, workspace: undefined }

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: user.id, acceptedAt: { not: null } },
      include: { workspace: true },
      orderBy: { createdAt: "asc" },
    })

    return {
      user: {
        name: user.user_metadata?.name,
        email: user.email,
      },
      workspace: member?.workspace,
    }
  } catch {
    // Sin Supabase/DB configurado
    return { user: undefined, workspace: undefined }
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, workspace } = await getSessionData()

  return (
    <div className="flex h-svh overflow-hidden">
      <AppSidebar user={user} workspace={workspace} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
