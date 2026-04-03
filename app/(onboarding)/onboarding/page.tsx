import { OnboardingWizard } from "./_components/onboarding-wizard"
import { createClient } from "@/lib/supabase/server"

export default async function OnboardingPage() {
  let defaultName: string | undefined

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    defaultName = user?.user_metadata?.name ?? user?.email?.split("@")[0]
  } catch {
    // Sin Supabase configurado — mostrar wizard igual
  }

  return <OnboardingWizard defaultName={defaultName} />
}
