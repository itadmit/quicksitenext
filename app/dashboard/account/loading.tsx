import { SkeletonPageHeader, SkeletonForm, SkeletonCard, SkeletonBar } from '@/components/dashboard/Skeleton';

export default function AccountLoading() {
  return (
    <div className="max-w-4xl animate-pulse space-y-5">
      <SkeletonPageHeader />

      {/* Plan card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <SkeletonBar className="h-4 w-28" />
          <SkeletonBar className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg bg-slate-50/70 p-3">
              <SkeletonBar className="h-3 w-14" />
              <SkeletonBar className="h-5 w-20" />
              <SkeletonBar className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <SkeletonForm fields={2} />
      <SkeletonForm fields={3} />
      <SkeletonCard lines={4} />
    </div>
  );
}
