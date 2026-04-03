"use server"

import { randomBytes } from "crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/lib/workspace"
import { resend, FROM_EMAIL } from "@/lib/resend"
import { buildInviteEmail } from "@/lib/email/invite-email"
import { MemberRole } from "@/generated/prisma"

async function requireOwnerOrAdmin() {
  const ctx = await getCurrentWorkspace()
  if (!ctx) redirect("/login")
  if (ctx.role === "MEMBER") redirect("/dashboard")
  return ctx
}

export async function inviteMember(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const role = (formData.get("role") as string) as MemberRole

  if (!email || !["ADMIN", "MEMBER"].includes(role)) {
    return { error: "Email o rol inválido" }
  }

  const ctx = await requireOwnerOrAdmin()
  const { workspace, userId } = ctx

  // Verificar que no esté ya en el workspace
  const existing = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: workspace.id,
      OR: [{ inviteEmail: email }, { user: { email } }],
    },
  })
  if (existing) return { error: "Este email ya tiene acceso o una invitación pendiente" }

  // Buscar si el usuario ya existe en nuestra DB
  const existingUser = await prisma.user.findUnique({ where: { email } })

  // Token único para la invitación (32 bytes hex)
  const inviteToken = randomBytes(32).toString("hex")

  // Crear registro de invitación
  await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: existingUser?.id ?? null,
      role,
      inviteEmail: email,
      inviteToken,
      acceptedAt: null,
    },
  })

  // Obtener nombre del invitador
  const inviter = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  })
  const inviterName = inviter?.name ?? inviter?.email ?? "Un miembro del equipo"

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const acceptUrl = `${baseUrl}/invite/${inviteToken}`

  const { subject, html, text } = buildInviteEmail({
    inviterName,
    workspaceName: workspace.name,
    role,
    acceptUrl,
  })

  // Enviar email (falla silenciosamente si no hay RESEND_API_KEY)
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
      text,
    })
  } catch (err) {
    console.error("[Resend] Error al enviar email:", err)
    // No fallar si el email no se envía — el admin puede compartir el link manualmente
  }

  revalidatePath("/settings/members")
  return { success: true, acceptUrl }
}

export async function removeMember(memberId: string) {
  const ctx = await requireOwnerOrAdmin()

  const member = await prisma.workspaceMember.findFirst({
    where: { id: memberId, workspaceId: ctx.workspace.id },
  })
  if (!member) return { error: "Miembro no encontrado" }
  if (member.role === "OWNER") return { error: "No podés eliminar al propietario" }
  if (member.userId === ctx.userId) return { error: "No podés eliminarte a vos mismo" }

  await prisma.workspaceMember.delete({ where: { id: memberId } })
  revalidatePath("/settings/members")
  return { success: true }
}

export async function changeMemberRole(memberId: string, newRole: MemberRole) {
  const ctx = await requireOwnerOrAdmin()
  if (ctx.role !== "OWNER") return { error: "Solo el propietario puede cambiar roles" }

  const member = await prisma.workspaceMember.findFirst({
    where: { id: memberId, workspaceId: ctx.workspace.id },
  })
  if (!member) return { error: "Miembro no encontrado" }
  if (member.role === "OWNER") return { error: "No podés cambiar el rol del propietario" }

  await prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role: newRole },
  })
  revalidatePath("/settings/members")
  return { success: true }
}
