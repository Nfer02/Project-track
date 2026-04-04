import Link from "next/link"
import { FileQuestion, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/app/back-button"

export default function NotFound() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-7xl font-black text-primary/20 tabular-nums leading-none">404</p>
          <h1 className="text-xl font-semibold tracking-tight">Página no encontrada</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La página que buscas no existe o fue movida a otra dirección.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button render={<Link href="/dashboard" />}>
            <Home className="mr-2 h-4 w-4" />
            Ir al dashboard
          </Button>
          <BackButton />
        </div>
      </div>
    </div>
  )
}
