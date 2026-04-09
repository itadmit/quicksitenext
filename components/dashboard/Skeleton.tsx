export function SkeletonBar({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-slate-200/70 ${className}`} />;
}

export function SkeletonPageHeader({ hasButton = false }: { hasButton?: boolean }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div className="space-y-2">
        <div className="h-3 w-20 rounded bg-slate-200/50" />
        <div className="h-7 w-40 rounded bg-slate-200/70" />
      </div>
      {hasButton && <div className="h-10 w-28 rounded-full bg-slate-200/50" />}
    </div>
  );
}

export function SkeletonSearch() {
  return (
    <div className="mb-5 rounded-2xl bg-white px-5 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded bg-slate-100" />
        <div className="h-4 w-40 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function SkeletonTable({ cols = 4, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex gap-8 border-b border-slate-100 bg-slate-50/40 px-5 py-3.5">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 w-16 rounded bg-slate-200/50" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-8 border-b border-slate-100 px-5 py-3.5 last:border-b-0">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`h-4 rounded bg-slate-100 ${j === 0 ? 'w-32' : 'w-20'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}>
      <div className="mb-4 h-5 w-28 rounded bg-slate-200/50" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-4 rounded bg-slate-100 ${i === 0 ? 'w-full' : i === 1 ? 'w-3/4' : 'w-1/2'}`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-5 h-5 w-28 rounded bg-slate-200/50" />
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 rounded bg-slate-200/50" />
            <div className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
        ))}
        <div className="h-10 w-28 rounded-full bg-slate-200/50" />
      </div>
    </div>
  );
}
