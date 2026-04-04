import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: Promise<{ token: string }>
}

async function acceptInvitation(token: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { inviteToken: token },
  })
  if (!member || member.acceptedAt) return { error: "already_used" }

  // Verificar que no haya otro member con este userId en el mismo workspace
  const conflict = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId: member.workspaceId } },
  })
  if (conflict) return { error: "already_member" }

  await prisma.workspaceMember.update({
    where: { id: member.id },
    data: {
      userId,
      acceptedAt: new Date(),
      inviteToken: null, // invalida el token después de usarlo
    },
  })

  // Upsert del usuario en nuestra tabla
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name ?? null,
      },
    })
  }

  return { success: true, workspaceId: member.workspaceId }
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params

  // Buscar la invitación
  const member = await prisma.workspaceMember.findUnique({
    where: { inviteToken: token },
    include: { workspace: { select: { name: true } } },
  })

  if (!member) notFound()

  // Si ya fue aceptada
  if (member.acceptedAt) {
    return (
      <InviteLayout>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <XCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Invitación ya utilizada</h1>
          <p className="text-sm text-muted-foreground">
            Este enlace de invitación ya fue usado o expiró.
          </p>
        </div>
        <Button render={<Link href="/dashboard" />}>
          Ir al dashboard
        </Button>
      </InviteLayout>
    )
  }

  // Verificar si el usuario está autenticado
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirigir al login con el token como param para retomar después
    redirect(`/login?invite=${token}`)
  }

  // Verificar que el email coincide (si hay inviteEmail)
  if (member.inviteEmail && member.inviteEmail !== user.email) {
    return (
      <InviteLayout>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Email incorrecto</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Esta invitación es para{" "}
            <span className="font-medium text-foreground">{member.inviteEmail}</span>.
            Estás autenticado con{" "}
            <span className="font-medium text-foreground">{user.email}</span>.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/login" />}>
          Iniciar sesión con otra cuenta
        </Button>
      </InviteLayout>
    )
  }

  // Aceptar la invitación
  const result = await acceptInvitation(token, user.id)

  if ("error" in result) {
    if (result.error === "already_member") {
      return (
        <InviteLayout>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold">Ya eres miembro</h1>
            <p className="text-sm text-muted-foreground">
              Ya tienes acceso a <span className="font-medium text-foreground">{member.workspace.name}</span>.
            </p>
          </div>
          <Button render={<Link href="/dashboard" />}>
            Ir al dashboard
          </Button>
        </InviteLayout>
      )
    }
  }

  // ✅ Invitación aceptada
  return (
    <InviteLayout>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">¡Bienvenido al equipo!</h1>
        <p className="text-sm text-muted-foreground">
          Te uniste a{" "}
          <span className="font-medium text-foreground">{member.workspace.name}</span>{" "}
          exitosamente.
        </p>
      </div>
      <Button render={<Link href="/dashboard" />}>
        Ir al dashboard
      </Button>
    </InviteLayout>
  )
}

function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              PT
            </div>
            <span className="font-semibold text-lg">ProjectTrack</span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-5">
          {children}
        </div>
      </div>
    </div>
  )
}
