"use client"

import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
} from "@/components/ui/tooltip"

interface HelpTooltipProps {
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function HelpTooltip({ content, side = "top", className }: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={`inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className ?? ""}`}
        aria-label="Ayuda"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipPositioner side={side}>
          <TooltipPopup>
            <TooltipArrow />
            {content}
          </TooltipPopup>
        </TooltipPositioner>
      </TooltipPortal>
    </Tooltip>
  )
}
