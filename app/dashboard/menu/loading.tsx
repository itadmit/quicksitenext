import { SkeletonPageHeader, SkeletonForm } from '@/components/dashboard/Skeleton';

export default function MenuLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <div className="mx-auto max-w-4xl space-y-5">
        {[...Array(3)].map((_, i) => <SkeletonForm key={i} fields={3} />)}
      </div>
    </div>
  );
}
