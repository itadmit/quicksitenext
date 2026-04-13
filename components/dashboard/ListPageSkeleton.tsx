import { SkeletonPageHeader, SkeletonSearch, SkeletonTable } from './Skeleton';

type Props = {
  hasButton?: boolean;
  hasSearch?: boolean;
  cols?: number;
  rows?: number;
};

export default function ListPageSkeleton({ hasButton = false, hasSearch = true, cols = 4, rows = 5 }: Props) {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader hasButton={hasButton} />
      {hasSearch && <SkeletonSearch />}
      <SkeletonTable cols={cols} rows={rows} />
    </div>
  );
}
