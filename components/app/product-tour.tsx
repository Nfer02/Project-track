"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, ChevronRight } from "lucide-react"
import { DASHBOARD_TOUR_STEPS, type TourStep } from "@/lib/tour-steps"

const STORAGE_KEY = "product-tour-completed"

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
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [steps, setSteps] = useState<TourStep[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  // Initialize
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return

    const visibleSteps = getVisibleSteps(DASHBOARD_TOUR_STEPS)
    setSteps(visibleSteps)

    // Delay to let dashboard render
    const t = setTimeout(() => {
      setCurrentStep(0)
    }, 800)
    return () => clearTimeout(t)
  }, [])

  // Listen for restart event
  useEffect(() => {
    function handleRestart() {
      localStorage.removeItem(STORAGE_KEY)
      const visibleSteps = getVisibleSteps(DASHBOARD_TOUR_STEPS)
      setSteps(visibleSteps)
      setCurrentStep(0)
    }
    window.addEventListener("restart-tour", handleRestart)
    return () => window.removeEventListener("restart-tour", handleRestart)
  }, [])

  // Update target rect when step changes
  const updateRect = useCallback(() => {
    if (currentStep === null || !steps[currentStep]) return
    const step = steps[currentStep]
    const rect = getTargetRect(step.target)
    setTargetRect(rect)
  }, [currentStep, steps])

  useEffect(() => {
    if (currentStep === null || !steps[currentStep]) return

    scrollToTarget(steps[currentStep].target)
    // Wait for scroll to finish then update rect
    const t = setTimeout(updateRect, 400)
    return () => clearTimeout(t)
  }, [currentStep, steps, updateRect])

  // Recalculate on resize/scroll
  useEffect(() => {
    if (currentStep === null) return
    window.addEventListener("resize", updateRect)
    window.addEventListener("scroll", updateRect, true)
    return () => {
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect, true)
    }
  }, [currentStep, updateRect])

  // ESC to close
  useEffect(() => {
    if (currentStep === null) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") finish()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  function next() {
    if (currentStep === null) return
    if (currentStep >= steps.length - 1) {
      finish()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1")
    setCurrentStep(null)
    setTargetRect(null)
  }

  if (currentStep === null || !steps[currentStep]) return null

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1
  const padding = 8

  // Clip-path for spotlight cutout
  const clipPath = targetRect
    ? `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${targetRect.left - padding}px ${targetRect.top - padding}px, ${targetRect.left + targetRect.width + padding}px ${targetRect.top - padding}px, ${targetRect.left + targetRect.width + padding}px ${targetRect.top + targetRect.height + padding}px, ${targetRect.left - padding}px ${targetRect.top + targetRect.height + padding}px, ${targetRect.left - padding}px ${targetRect.top - padding}px)`
    : undefined

  // Card position
  let cardStyle: React.CSSProperties = {}
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  if (isMobile) {
    cardStyle = {
      position: "fixed",
      bottom: 16,
      left: 16,
      right: 16,
      zIndex: 10001,
    }
  } else if (targetRect) {
    const gap = 16
    switch (step.side) {
      case "bottom":
        cardStyle = {
          position: "fixed",
          top: targetRect.top + targetRect.height + padding + gap,
          left: Math.max(16, targetRect.left),
          zIndex: 10001,
        }
        break
      case "top":
        cardStyle = {
          position: "fixed",
          bottom:
            window.innerHeight -
            targetRect.top +
            padding +
            gap,
          left: Math.max(16, targetRect.left),
          zIndex: 10001,
        }
        break
      case "right":
        cardStyle = {
          position: "fixed",
          top: targetRect.top,
          left: targetRect.left + targetRect.width + padding + gap,
          zIndex: 10001,
        }
        break
      case "left":
        cardStyle = {
          position: "fixed",
          top: targetRect.top,
          right:
            window.innerWidth -
            targetRect.left +
            padding +
            gap,
          zIndex: 10001,
        }
        break
    }
  }

  return (
    <>
      {/* Dark overlay with spotlight cutout */}
      <div
        className="fixed inset-0 transition-all duration-300"
        style={{
          zIndex: 9998,
          background: "rgba(0,0,0,0.6)",
          clipPath,
        }}
        onClick={finish}
      />

      {/* Highlight ring around target */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-lg transition-all duration-300"
          style={{
            zIndex: 9999,
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 0 0 4px hsl(var(--primary) / 0.2)",
          }}
        />
      )}

      {/* Tour card */}
      <div
        ref={cardRef}
        className="w-80 rounded-xl bg-popover p-4 shadow-2xl ring-1 ring-foreground/10 animate-in fade-in-0 slide-in-from-bottom-2"
        style={cardStyle}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold">{step.title}</h3>
          <button
            onClick={finish}
            className="rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {step.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground/70">
            {currentStep + 1} de {steps.length}
          </span>
          <div className="flex items-center gap-2">
            {!isLast && (
              <button
                onClick={finish}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Saltar
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isLast ? "Finalizar" : "Siguiente"}
              {!isLast && <ChevronRight className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
