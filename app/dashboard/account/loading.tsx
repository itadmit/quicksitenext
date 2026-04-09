import { SkeletonPageHeader, SkeletonForm, SkeletonCard, SkeletonBar } from '@/components/dashboard/Skeleton';

export default function AccountLoading() {
  return (
    <div className="max-w-4xl animate-pulse space-y-5">
      <SkeletonPageHeader />
      {/* Plan card skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <SkeletonBar className="h-4 w-28" />
          <SkeletonBar className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-slate-50 p-3 space-y-2">
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
