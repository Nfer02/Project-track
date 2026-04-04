"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, type LucideIcon } from "lucide-react"

export interface FeatureTab {
  label: string
  icon: LucideIcon
  description: string
  highlights: string[]
}

interface FeatureTabsProps {
  tabs: FeatureTab[]
}

export function FeatureTabs({ tabs }: FeatureTabsProps) {
  const [active, setActive] = useState(0)
  const current = tabs[active]!

  return (
    <div className="w-full">
      {/* Tab buttons - pill style */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tabs.map((tab, i) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                i === active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Active tab content */}
      <div
        key={current.label}
        className="grid md:grid-cols-2 gap-6 items-start"
        style={{ animation: "fadeTab 0.3s ease-out" }}
      >
        {/* Description card */}
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const Icon = current.icon
              return (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              )
            })()}
            <h3 className="text-lg font-semibold">{current.label}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {current.description}
          </p>
        </div>

        {/* Highlights */}
        <ul className="space-y-3">
          {current.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm transition-shadow hover:shadow-sm"
            >
              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx global>{`
        @keyframes fadeTab {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
