import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, backHref, backLabel, children }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
          >
            <ArrowRight className="h-[18px] w-[18px]" />
          </Link>
        )}
        <div>
          {(backLabel || subtitle) && (
            <p className="mb-0.5 text-[13px] text-slate-400">{backLabel || subtitle}</p>
          )}
          <h1 className="font-noto text-xl font-bold text-navy">{title}</h1>
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
