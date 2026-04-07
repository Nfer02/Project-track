"use client"

import { useState, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app/app-sidebar"

interface MobileSidebarProps {
  user?: { name?: string; email?: string }
  workspace?: { name?: string }
}

export function MobileSidebarToggle({ user, workspace }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay + Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
            aria-hidden="true"
          />
          {/* Sidebar drawer */}
          <div className="absolute inset-y-0 left-0 w-[75vw] max-w-[280px] shadow-xl animate-in slide-in-from-left duration-200">
            <div className="relative h-full">
              <AppSidebar
                user={user}
                workspace={workspace}
                onLinkClick={handleClose}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-slate-400 hover:text-white hover:bg-white/10"
                onClick={handleClose}
                aria-label="Cerrar menú"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
