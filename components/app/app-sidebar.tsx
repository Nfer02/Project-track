"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  ReceiptText,
  ShoppingCart,
  FileBarChart,
  LogOut,
  ChevronDown,
  Users,
  User,
  CreditCard,
  Shield,
  HelpCircle,
  CirclePlay,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/app/logo"
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
  { href: "/invoices", label: "Facturas emitidas", icon: ReceiptText },
  { href: "/expenses", label: "Gastos / Compras", icon: ShoppingCart },
]

const SETTINGS_ITEMS = [
  { href: "/reports", label: "Reportes", icon: FileBarChart },
  { href: "/settings/members", label: "Colaboradores", icon: Users },
  { href: "/settings/billing", label: "Mi plan", icon: CreditCard },
  { href: "/support", label: "Soporte", icon: HelpCircle },
]

interface AppSidebarProps {
  user?: { name?: string; email?: string }
  workspace?: { name?: string }
  onLinkClick?: () => void
}

export function AppSidebar({ user, workspace, onLinkClick }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "U"

  return (
    <aside
      className="flex h-full w-60 flex-col bg-slate-900"
      aria-label="Navegación principal"
    >
      {/* Workspace selector */}
      <div className="flex h-14 items-center gap-2 px-4 border-b border-white/10">
        <Logo size={26} className="shrink-0" />
        <span className="text-sm font-bold text-white truncate flex-1">
          {workspace?.name ?? "ProjectTrack"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" aria-hidden="true" />
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" aria-label="Menú">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-white/10 text-white border-l-2 border-primary"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}

        <Separator className="my-2 bg-white/10" />

        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Configuración
        </p>

        {SETTINGS_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              aria-current={isActive ? "page" : undefined}
              {...(href === "/reports" ? { "data-tour-step": "reports-link" } : {})}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-white/10 text-white border-l-2 border-primary"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Usuario */}
      <div className="border-t border-white/10 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Menú de usuario"
          >
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left overflow-hidden">
              <p className="truncate text-sm font-medium text-white leading-tight">
                {user?.name ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-slate-500 leading-tight">
                {workspace?.name ?? user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
              <User className="mr-2 h-4 w-4" aria-hidden="true" />
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/members")}>
              <Users className="mr-2 h-4 w-4" aria-hidden="true" />
              Colaboradores
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/billing")}>
              <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
              Mi plan
            </DropdownMenuItem>
            {user?.email === "nelsonfernandez1002@gmail.com" && (
              <DropdownMenuItem onClick={() => router.push("/admin")}>
                <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("product-tour-completed")
                window.dispatchEvent(new Event("restart-tour"))
              }}
            >
              <CirclePlay className="mr-2 h-4 w-4" aria-hidden="true" />
              Repetir tour
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => logout()}
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
