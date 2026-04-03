"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  ReceiptText,
  LogOut,
  ChevronDown,
  Users,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/app/(auth)/actions"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/invoices", label: "Facturas", icon: ReceiptText },
]

const SETTINGS_ITEMS = [
  { href: "/settings/members", label: "Colaboradores", icon: Users },
  { href: "/settings/billing", label: "Facturación", icon: CreditCard },
]

interface AppSidebarProps {
  user?: { name?: string; email?: string }
  workspace?: { name?: string }
}

export function AppSidebar({ user, workspace }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "U"

  return (
    <aside
      className="flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar"
      aria-label="Navegación principal"
    >
      {/* Workspace selector */}
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold"
          aria-hidden="true"
        >
          PT
        </div>
        <span className="text-sm font-semibold text-sidebar-foreground truncate flex-1">
          {workspace?.name ?? "ProjectTrack"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/50 shrink-0" aria-hidden="true" />
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" aria-label="Menú">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}

        <Separator className="my-2 bg-sidebar-border" />

        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Configuración
        </p>

        {SETTINGS_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Usuario */}
      <div className="border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Menú de usuario"
          >
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground leading-tight">
                {user?.name ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50 leading-tight">
                {user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem onSelect={() => router.push("/settings/members")}>
              <Users className="mr-2 h-4 w-4" aria-hidden="true" />
              Colaboradores
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/settings/billing")}>
              <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
              Facturación
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
