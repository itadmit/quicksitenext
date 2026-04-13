import { SkeletonPageHeader, SkeletonCard } from '@/components/dashboard/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <SkeletonPageHeader />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 h-9 w-9 rounded-xl bg-slate-50" />
            <div className="h-7 w-10 rounded-md bg-slate-200/70" />
            <div className="mt-1.5 h-3 w-14 rounded-md bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <SkeletonCard lines={4} />
            <SkeletonCard lines={3} />
          </div>
          <SkeletonCard lines={5} />
        </div>
        <div className="space-y-5">
          <SkeletonCard lines={5} />
          <SkeletonCard lines={3} />
        </div>
      </div>
    </div>
  );
}
