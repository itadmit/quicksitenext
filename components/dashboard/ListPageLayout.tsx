import Link from 'next/link';
import PageHeader from './PageHeader';
import TableSearch from './TableSearch';

type Filter = { name: string; label: string; options: { value: string; label: string }[] };

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryActions?: React.ReactNode;
  searchPlaceholder?: string;
  searchBasePath?: string;
  searchFilters?: Filter[];
  children: React.ReactNode;
};

export default function ListPageLayout({
  title,
  subtitle,
  backHref,
  actionHref,
  actionLabel,
  secondaryActions,
  searchPlaceholder,
  searchBasePath,
  searchFilters,
  children,
}: Props) {
  return (
    <div className="space-y-5">
      <PageHeader title={title} subtitle={subtitle} backHref={backHref}>
        {secondaryActions}
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="cursor-pointer rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-navy/85"
          >
            {actionLabel}
          </Link>
        )}
      </PageHeader>

      {searchBasePath && (
        <TableSearch
          placeholder={searchPlaceholder}
          basePath={searchBasePath}
          filters={searchFilters}
        />
      )}

      {children}
    </div>
  );
}
