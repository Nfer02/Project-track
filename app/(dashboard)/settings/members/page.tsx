import { redirect } from "next/navigation"
import { Users } from "lucide-react"
import { getCurrentWorkspace } from "@/lib/workspace"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { InviteForm } from "./_components/invite-form"
import { MembersList } from "./_components/members-list"

export default async function MembersPage() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: ctx.workspace.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: [
      { role: "asc" },   // OWNER primero (A<M<O, por string sort... no ideal)
      { createdAt: "asc" },
    ],
  })

  // Ordenar manualmente: OWNER → ADMIN → MEMBER → pending
  const ORDER: Record<string, number> = { OWNER: 0, ADMIN: 1, MEMBER: 2 }
  const sorted = [...members].sort((a, b) => {
    const accepted = (b.acceptedAt ? 1 : 0) - (a.acceptedAt ? 1 : 0)
    if (accepted !== 0) return accepted
    return (ORDER[a.role] ?? 3) - (ORDER[b.role] ?? 3)
  })

  const canInvite = ctx.role === "OWNER" || ctx.role === "ADMIN"

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Colaboradores</h1>
          <p className="text-xs text-muted-foreground">
            Gestiona quién tiene acceso a <span className="font-medium text-foreground">{ctx.workspace.name}</span>
          </p>
        </div>
      </div>

      {/* Formulario de invitación */}
      {canInvite && <InviteForm />}

      {/* Lista de miembros */}
      <MembersList
        members={sorted}
        currentUserId={user.email ?? ""}
        currentRole={ctx.role}
      />
    </div>
  )
}
