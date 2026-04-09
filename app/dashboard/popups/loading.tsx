import { SkeletonPageHeader, SkeletonTable } from '@/components/dashboard/Skeleton';

export default function PopupsLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader hasButton />
      <SkeletonTable cols={6} rows={3} />
    </div>
  );
}
