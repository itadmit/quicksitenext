import { SkeletonPageHeader, SkeletonSearch, SkeletonCard } from '@/components/dashboard/Skeleton';

export default function MediaLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <SkeletonSearch />
      <SkeletonCard lines={2} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
