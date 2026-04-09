import { SkeletonPageHeader, SkeletonTable } from '@/components/dashboard/Skeleton';

export default function ActivityLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <SkeletonTable cols={5} rows={8} />
    </div>
  );
}
