"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipPortal({ ...props }: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />
}

function TooltipPositioner({
  className,
  sideOffset = 8,
  ...props
}: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner
      data-slot="tooltip-positioner"
      sideOffset={sideOffset}
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

function TooltipPopup({
  className,
  ...props
}: TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Popup
      data-slot="tooltip-popup"
      className={cn(
        "z-50 max-w-xs rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

function TooltipArrow({
  className,
  ...props
}: TooltipPrimitive.Arrow.Props) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        "fill-popover [&>path]:stroke-foreground/10 [&>path]:stroke-1",
        className
      )}
      {...props}
    />
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
}
