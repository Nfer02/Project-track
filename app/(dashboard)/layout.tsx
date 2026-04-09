import { AppSidebar } from "@/components/app/app-sidebar"
import { MobileSidebarToggle } from "@/components/app/mobile-sidebar"
import { ProductTour } from "@/components/app/product-tour"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

async function getSessionData() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { user: undefined, workspace: undefined }

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: user.id, acceptedAt: { not: null } },
      include: { workspace: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    })

    return {
      user: {
        name: member?.user?.name ?? user.user_metadata?.name,
        email: member?.user?.email ?? user.email,
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
      {/* Desktop sidebar */}
      <div className="hidden md:block" data-tour-step="sidebar">
        <AppSidebar user={user} workspace={workspace} />
      </div>

      <ProductTour />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center h-14 border-b px-4 gap-3">
          <MobileSidebarToggle user={user} workspace={workspace} />
          <span className="font-semibold text-sm">ProjectTrack</span>
        </div>

        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
