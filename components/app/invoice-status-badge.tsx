import { Badge } from "@/components/ui/badge"
import { type InvoiceStatus } from "@/generated/prisma"

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Borrador",
    className: "bg-muted text-muted-foreground border-border",
  },
  PENDING: {
    label: "Pendiente",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  PAID: {
    label: "Pagada",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  OVERDUE: {
    label: "Vencida",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  CANCELLED: {
    label: "Cancelada",
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
