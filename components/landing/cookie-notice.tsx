"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function CookieNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("cookie-notice-dismissed")) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t px-4 py-3">
      <div className="mx-auto max-w-4xl flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>
          Este sitio utiliza únicamente cookies técnicas necesarias para el funcionamiento del servicio.{" "}
          <Link href="/privacy" className="underline hover:text-foreground">Más información</Link>
        </p>
        <button
          onClick={() => { localStorage.setItem("cookie-notice-dismissed", "1"); setShow(false) }}
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
