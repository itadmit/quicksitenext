type Props = {
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function DashboardCard({ title, description, headerAction, noPadding, children, className = '' }: Props) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white ${className}`}>
      {(title || description || headerAction) && (
        <div className="flex items-center justify-between px-6 pb-0 pt-5">
          <div>
            {title && <h2 className="text-sm font-bold text-navy">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={noPadding ? '' : 'px-6 py-5'}>{children}</div>
    </div>
  );
}
