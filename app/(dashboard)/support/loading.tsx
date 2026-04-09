import { Skeleton } from "@/components/ui/skeleton"

export default function SupportLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  )
}
