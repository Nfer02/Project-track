import { Skeleton } from "@/components/ui/skeleton"

export default function BillingLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-3xl">
      <div className="space-y-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
          ))}
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
    </div>
  )
}
