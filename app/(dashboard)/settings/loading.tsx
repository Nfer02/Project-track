import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-28" />
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
