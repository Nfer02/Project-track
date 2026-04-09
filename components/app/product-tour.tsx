"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { DASHBOARD_TOUR_STEPS, type TourStep } from "@/lib/tour-steps"

const STORAGE_KEY = "product-tour-completed"
const RESTART_KEY = "product-tour-restart"

function getVisibleSteps(steps: TourStep[]): TourStep[] {
  if (typeof window === "undefined") return steps
  const isMobile = window.innerWidth < 768
  return isMobile ? steps.filter((s) => !s.desktopOnly) : steps
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

function getTargetRect(selector: string): Rect | null {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function scrollToTarget(selector: string) {
  const el = document.querySelector(selector)
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "center" })
}

export function ProductTour() {
  const pathname = usePathname()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [steps, setSteps] = useState<TourStep[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  // Initialize on first load (when no projects yet done tour)
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const visibleSteps = getVisibleSteps(DASHBOARD_TOUR_STEPS)
    setSteps(visibleSteps)
    const t = setTimeout(() => setCurrentStep(0), 900)
    return () => clearTimeout(t)
  }, [])

  // Handle restart via localStorage flag (set by sidebar, triggers after navigation to /dashboard)
  useEffect(() => {
    if (!pathname.startsWith("/dashboard")) return
    const pending = localStorage.getItem(RESTART_KEY)
    if (!pending) return
    localStorage.removeItem(RESTART_KEY)
    const visibleSteps = getVisibleSteps(DASHBOARD_TOUR_STEPS)
    setSteps(visibleSteps)
    setCurrentStep(null)
    const t = setTimeout(() => setCurrentStep(0), 700)
    return () => clearTimeout(t)
  }, [pathname])

  // Restart via event (fired by sidebar, works when already on /dashboard)
  useEffect(() => {
    function handleRestart() {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(RESTART_KEY)
      const visibleSteps = getVisibleSteps(DASHBOARD_TOUR_STEPS)
      setSteps(visibleSteps)
      setCurrentStep(null)
      setTimeout(() => setCurrentStep(0), 400)
    }
    window.addEventListener("restart-tour", handleRestart)
    return () => window.removeEventListener("restart-tour", handleRestart)
  }, [])

  const updateRect = useCallback(() => {
    if (currentStep === null || !steps[currentStep]) return
    const step = steps[currentStep]
    const rect = getTargetRect(step.target)
    setTargetRect(rect)
  }, [currentStep, steps])

  useEffect(() => {
    if (currentStep === null || !steps[currentStep]) return
    scrollToTarget(steps[currentStep].target)
    const t = setTimeout(updateRect, 220)
    return () => clearTimeout(t)
  }, [currentStep, steps, updateRect])

  useEffect(() => {
    if (currentStep === null) return
    window.addEventListener("resize", updateRect)
    window.addEventListener("scroll", updateRect, true)
    return () => {
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect, true)
    }
  }, [currentStep, updateRect])

  useEffect(() => {
    if (currentStep === null) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") finish()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  function next() {
    if (currentStep === null) return
    if (currentStep >= steps.length - 1) finish()
    else setCurrentStep(currentStep + 1)
  }

  function prev() {
    if (currentStep === null || currentStep === 0) return
    setCurrentStep(currentStep - 1)
  }

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1")
    setCurrentStep(null)
    setTargetRect(null)
  }

  if (currentStep === null || !steps[currentStep]) return null

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1
  const isFirst = currentStep === 0
  const padding = 10
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  const clipPath = targetRect
    ? `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${targetRect.left - padding}px ${targetRect.top - padding}px, ${targetRect.left + targetRect.width + padding}px ${targetRect.top - padding}px, ${targetRect.left + targetRect.width + padding}px ${targetRect.top + targetRect.height + padding}px, ${targetRect.left - padding}px ${targetRect.top + targetRect.height + padding}px, ${targetRect.left - padding}px ${targetRect.top - padding}px)`
    : undefined

  let cardStyle: React.CSSProperties = {}

  if (isMobile) {
    cardStyle = {
      position: "fixed",
      bottom: 24,
      left: 16,
      right: 16,
      zIndex: 10001,
    }
  } else if (targetRect) {
    const CARD_WIDTH = 340
    const CARD_HEIGHT = 160
    const gap = 16
    const vw = window.innerWidth
    const vh = window.innerHeight

    switch (step.side) {
      case "bottom": {
        let left = targetRect.left
        if (left + CARD_WIDTH > vw - 16) left = vw - CARD_WIDTH - 16
        if (left < 16) left = 16
        cardStyle = {
          position: "fixed",
          top: Math.min(targetRect.top + targetRect.height + padding + gap, vh - CARD_HEIGHT - 16),
          left,
          zIndex: 10001,
        }
        break
      }
      case "top": {
        let left = targetRect.left
        if (left + CARD_WIDTH > vw - 16) left = vw - CARD_WIDTH - 16
        if (left < 16) left = 16
        cardStyle = {
          position: "fixed",
          bottom: vh - targetRect.top + padding + gap,
          left,
          zIndex: 10001,
        }
        break
      }
      case "right": {
        let top = targetRect.top
        if (top + CARD_HEIGHT > vh - 16) top = vh - CARD_HEIGHT - 16
        cardStyle = {
          position: "fixed",
          top,
          left: Math.min(targetRect.left + targetRect.width + padding + gap, vw - CARD_WIDTH - 16),
          zIndex: 10001,
        }
        break
      }
      case "left": {
        let top = targetRect.top
        if (top + CARD_HEIGHT > vh - 16) top = vh - CARD_HEIGHT - 16
        cardStyle = {
          position: "fixed",
          top,
          right: vw - targetRect.left + padding + gap,
          zIndex: 10001,
        }
        break
      }
    }
  } else {
    // No target rect: center card
    cardStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 10001,
    }
  }

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 9998,
          background: "rgba(0,0,0,0.82)",
          clipPath,
          transition: "clip-path 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
        onClick={finish}
      />

      {/* Spotlight ring */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-lg"
          style={{
            zIndex: 9999,
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 0 0 4px hsl(var(--primary) / 0.25), 0 0 24px hsl(var(--primary) / 0.2)",
            transition: "top 0.35s cubic-bezier(0.4,0,0.2,1), left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      )}

      {/* Tour card */}
      <div
        ref={cardRef}
        className="rounded-2xl bg-popover shadow-2xl ring-1 ring-foreground/10 overflow-hidden"
        style={{
          ...cardStyle,
          width: isMobile ? undefined : 340,
          transition: "top 0.35s cubic-bezier(0.4,0,0.2,1), left 0.35s cubic-bezier(0.4,0,0.2,1), right 0.35s cubic-bezier(0.4,0,0.2,1), bottom 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#60a5fa] to-[#3b82f6]" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary text-[11px] font-bold shrink-0">
                {currentStep + 1}
              </span>
              <h3 className="text-sm font-semibold leading-tight">{step.title}</h3>
            </div>
            <button
              onClick={finish}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
              aria-label="Cerrar tour"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className="transition-all duration-200 rounded-full"
                style={{
                  width: i === currentStep ? 20 : 6,
                  height: 6,
                  backgroundColor: i === currentStep
                    ? "hsl(var(--primary))"
                    : i < currentStep
                    ? "hsl(var(--primary) / 0.4)"
                    : "hsl(var(--muted-foreground) / 0.3)",
                }}
                aria-label={`Ir al paso ${i + 1}`}
              />
            ))}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={prev}
              disabled={isFirst}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </button>

            <div className="flex items-center gap-2">
              {!isLast && (
                <button
                  onClick={finish}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
                >
                  Saltar
                </button>
              )}
              <button
                onClick={next}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isLast ? "Finalizar" : "Siguiente"}
                {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { RESTART_KEY }
