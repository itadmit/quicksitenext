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
    <div className={`rounded-xl border border-slate-100 bg-white ${className}`}>
      {(title || description || headerAction) && (
        <div className="flex items-center justify-between px-5 pb-0 pt-4">
          <div>
            {title && <h2 className="text-[14px] font-semibold text-navy">{title}</h2>}
            {description && <p className="mt-0.5 text-[12px] text-slate-400">{description}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={noPadding ? '' : 'px-5 py-4'}>{children}</div>
    </div>
  );
}
