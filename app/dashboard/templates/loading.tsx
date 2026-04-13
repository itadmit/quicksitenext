import { SkeletonBar } from '@/components/dashboard/Skeleton';

export default function TemplatesLoading() {
  return (
    <div className="space-y-6">
      <SkeletonBar className="h-10 w-48" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map(i => (
          <SkeletonBar key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
