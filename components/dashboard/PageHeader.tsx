import Link from 'next/link';

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, backHref, backLabel, children }: Props) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">arrow_forward</span>
          </Link>
        )}
        <div>
          {(backLabel || subtitle) && (
            <p className="mb-1 text-[13px] font-medium text-slate-400">{backLabel || subtitle}</p>
          )}
          <h1 className="font-noto text-2xl font-bold tracking-tight text-navy">{title}</h1>
        </div>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
