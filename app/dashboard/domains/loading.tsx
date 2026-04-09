import { SkeletonPageHeader, SkeletonForm, SkeletonCard, SkeletonTable } from '@/components/dashboard/Skeleton';

export default function DomainsLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <SkeletonForm fields={1} />
      <SkeletonCard lines={3} />
      <SkeletonTable cols={4} rows={3} />
    </div>
  );
}
