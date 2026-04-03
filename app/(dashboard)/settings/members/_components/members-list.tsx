"use client"

import { useTransition } from "react"
import { Trash2, Shield, User, Crown, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { removeMember, changeMemberRole } from "../actions"
import type { MemberRole } from "@/generated/prisma"

type Member = {
  id: string
  role: MemberRole
  acceptedAt: Date | null
  inviteEmail: string | null
  user: { name: string | null; email: string } | null
}

interface MembersListProps {
  members: Member[]
  currentUserId: string
  currentRole: MemberRole
}

const ROLE_ICON: Record<MemberRole, React.ElementType> = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: User,
}

const ROLE_LABEL: Record<MemberRole, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  MEMBER: "Miembro",
}

const ROLE_CLASS: Record<MemberRole, string> = {
  OWNER: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  ADMIN: "bg-primary/10 text-primary border-primary/20",
  MEMBER: "bg-muted text-muted-foreground border-border",
}

export function MembersList({ members, currentUserId, currentRole }: MembersListProps) {
  const [isPending, startTransition] = useTransition()

  function handleRemove(memberId: string) {
    startTransition(async () => {
      await removeMember(memberId)
    })
  }

  function handleRoleChange(memberId: string, newRole: MemberRole) {
    startTransition(async () => {
      await changeMemberRole(memberId, newRole)
    })
  }

  const canManage = currentRole === "OWNER" || currentRole === "ADMIN"

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/30">
        <h2 className="text-sm font-semibold">Miembros del workspace</h2>
      </div>
      <div className="divide-y">
        {members.map((member) => {
          const RoleIcon = ROLE_ICON[member.role]
          const displayName = member.user?.name ?? member.user?.email ?? member.inviteEmail ?? "—"
          const displayEmail = member.user?.email ?? member.inviteEmail
          const isPending_ = !member.acceptedAt
          const isCurrentUser = member.user && member.user.email === currentUserId // currentUserId is actually email in this context... need rethink

          return (
            <div
              key={member.id}
              className={`flex items-center gap-3 px-5 py-3.5 ${isPending ? "opacity-60" : ""}`}
            >
              {/* Avatar */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase">
                {(displayName[0] ?? "?").toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  {isPending_ && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Pendiente
                    </div>
                  )}
                </div>
                {displayEmail && displayEmail !== displayName && (
                  <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                )}
              </div>

              {/* Role badge */}
              <Badge variant="outline" className={ROLE_CLASS[member.role]}>
                <RoleIcon className="h-3 w-3 mr-1" />
                {ROLE_LABEL[member.role]}
              </Badge>

              {/* Acciones — solo OWNER puede cambiar roles, OWNER/ADMIN pueden eliminar */}
              {canManage && member.role !== "OWNER" && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {currentRole === "OWNER" && !isPending_ && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground"
                      disabled={isPending}
                      onClick={() =>
                        handleRoleChange(
                          member.id,
                          member.role === "ADMIN" ? "MEMBER" : "ADMIN"
                        )
                      }
                    >
                      {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : member.role === "ADMIN" ? (
                        "↓ Miembro"
                      ) : (
                        "↑ Admin"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isPending}
                    onClick={() => handleRemove(member.id)}
                  >
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
