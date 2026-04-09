import { SkeletonPageHeader, SkeletonSearch, SkeletonTable } from '@/components/dashboard/Skeleton';

export default function PostsLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader hasButton />
      <SkeletonSearch />
      <SkeletonTable cols={4} rows={5} />
    </div>
  );
}
