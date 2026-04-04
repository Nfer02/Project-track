"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface QuarterSelectorProps {
  options: { value: string; label: string }[]
  currentValue: string
}

export function QuarterSelector({ options, currentValue }: QuarterSelectorProps) {
  const router = useRouter()

  return (
    <Select
      value={currentValue}
      onValueChange={(v) => router.push(`/reports?q=${v}`)}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Selecciona trimestre" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
