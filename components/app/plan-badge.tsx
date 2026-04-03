import { Sparkles, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Plan } from "@/generated/prisma"

const CONFIG: Record<Plan, { label: string; icon: React.ElementType; className: string }> = {
  FREE: {
    label: "Plan Gratuito",
    icon: Zap,
    className: "bg-muted text-muted-foreground border-border",
  },
  PRO: {
    label: "Plan PRO",
    icon: Sparkles,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
}

export function PlanBadge({ plan }: { plan: Plan }) {
  const { label, icon: Icon, className } = CONFIG[plan]
  return (
    <Badge variant="outline" className={`${className} gap-1.5 px-2.5 py-1 text-xs font-medium`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
