import { Skeleton } from "@/components/ui/skeleton"

export default function MembersLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="rounded-xl border overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b last:border-0">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
