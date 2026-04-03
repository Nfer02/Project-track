"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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
  redirect("/login")
}
