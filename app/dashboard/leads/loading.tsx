import { SkeletonPageHeader, SkeletonSearch, SkeletonCard } from '@/components/dashboard/Skeleton';

export default function LeadsLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <SkeletonSearch />
      <div className="mx-auto max-w-4xl space-y-4">
        {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={4} />)}
      </div>
    </div>
  );
}
