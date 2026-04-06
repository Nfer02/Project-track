"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function login(values: {
  email: string
  password: string
  inviteToken?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (error) {
    return { error: "Email o contraseña incorrectos" }
  }

  // Si venía de una invitación, volver al link de aceptación
  if (values.inviteToken) {
    redirect(`/invite/${values.inviteToken}`)
  }

  redirect("/dashboard")
}

export async function register(values: { name: string; email: string; password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: { name: values.name },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function updateProfile(values: { name: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await prisma.user.update({
    where: { id: user.id },
    data: { name: values.name },
  })

  revalidatePath("/settings/profile")
  redirect("/settings/profile")
}
