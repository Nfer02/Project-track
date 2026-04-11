"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function createWorkspace(values: {
  name: string
  sector: string
  workspaceName: string
  nif?: string
  legalForm?: string
  vatRegime?: string
  employeeCount?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Upsert del usuario en nuestra tabla
  await prisma.user.upsert({
    where: { id: user.id },
    update: { name: values.name },
    create: { id: user.id, email: user.email!, name: values.name },
  })

  // Generar slug único
  const baseSlug = slugify(values.workspaceName)
  let slug = baseSlug
  let attempt = 0

  while (await prisma.workspace.findUnique({ where: { slug } })) {
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  // Verificar si es beta tester invitado → asignar plan PRO
  const isBetaTester = await prisma.waitlist.findFirst({
    where: { email: user.email!, invited: true },
  })

  // Crear workspace y asignar al usuario como OWNER
  const workspace = await prisma.workspace.create({
    data: {
      name: values.workspaceName,
      slug,
      plan: isBetaTester ? "PRO" : "FREE",
      sector: values.sector,
      nif: values.nif || null,
      legalForm: values.legalForm || null,
      vatRegime: values.vatRegime || "general",
      employeeCount: values.employeeCount ? parseInt(values.employeeCount) : null,
      members: {
        create: { userId: user.id, role: "OWNER", acceptedAt: new Date() },
      },
    },
  })

  redirect(`/dashboard?workspace=${workspace.id}`)
}
