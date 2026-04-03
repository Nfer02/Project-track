import { redirect } from "next/navigation"

// /settings redirige a /settings/members por defecto
export default function SettingsPage() {
  redirect("/settings/members")
}
