"use client"

import { useState, useTransition } from "react"
import { UserPlus, Loader2, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { inviteMember } from "../actions"

export function InviteForm() {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState<string>("MEMBER")
  const [error, setError] = useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setInviteUrl(null)

    const formData = new FormData(e.currentTarget)
    formData.set("role", role)

    startTransition(async () => {
      const result = await inviteMember(formData)
      if ("error" in result) {
        setError(result.error ?? "Error desconocido")
      } else {
        setInviteUrl(result.acceptUrl ?? "")
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  async function copyUrl() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Invitar colaborador</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="colaborador@ejemplo.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v ?? "MEMBER")} disabled={isPending}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Miembro</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs opacity-0 select-none">Acción</Label>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Invitar
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </form>

      {/* Link de invitación generado */}
      {inviteUrl && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Invitación creada
          </div>
          <p className="text-xs text-muted-foreground">
            Se envió un email con el link. También puedes compartir este link directamente:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-2 py-1 text-xs font-mono truncate">
              {inviteUrl}
            </code>
            <Button size="sm" variant="outline" onClick={copyUrl} type="button">
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
