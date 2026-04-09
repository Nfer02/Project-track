import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * Obtiene el workspace activo del usuario autenticado.
 * Memoizado con React cache() para deduplicar llamadas dentro del mismo request.
 */
export const getCurrentWorkspace = cache(async function getCurrentWorkspace() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: user.id, acceptedAt: { not: null } },
      include: { workspace: true },
      orderBy: { createdAt: "asc" },
    })

    return member
      ? { workspace: member.workspace, userId: user.id, role: member.role }
      : null
  } catch {
    return null
  }
})
