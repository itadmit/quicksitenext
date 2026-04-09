import { SkeletonPageHeader, SkeletonForm, SkeletonTable } from '@/components/dashboard/Skeleton';

export default function CptLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <SkeletonForm fields={2} />
      <SkeletonTable cols={3} rows={3} />
    </div>
  );
}
