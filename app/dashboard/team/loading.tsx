import { SkeletonPageHeader, SkeletonForm, SkeletonTable } from '@/components/dashboard/Skeleton';

export default function TeamLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <div className="mx-auto max-w-4xl">
        <SkeletonForm fields={2} />
      </div>
      <div className="mx-auto max-w-4xl">
        <SkeletonTable cols={4} rows={3} />
      </div>
    </div>
  );
}
