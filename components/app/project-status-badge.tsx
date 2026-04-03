import { Badge } from "@/components/ui/badge"
import { type ProjectStatus } from "@/generated/prisma"

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Activo",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  COMPLETED: {
    label: "Completado",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  ARCHIVED: {
    label: "Archivado",
    className:
      "bg-muted text-muted-foreground border-border",
  },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
