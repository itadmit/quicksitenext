export function SkeletonBar({ className = '' }: { className?: string }) {
  return <div className={`rounded-md bg-slate-100 ${className}`} />;
}

export function SkeletonPageHeader({ hasButton = false }: { hasButton?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1.5">
        <div className="h-3 w-24 rounded-md bg-slate-100" />
        <div className="h-6 w-36 rounded-md bg-slate-200/70" />
      </div>
      {hasButton && <div className="h-9 w-28 rounded-lg bg-slate-100" />}
    </div>
  );
}

export function SkeletonSearch() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded bg-slate-100" />
        <div className="h-4 w-36 rounded-md bg-slate-100" />
      </div>
    </div>
  );
}

export function SkeletonTable({ cols = 4, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <div className="flex gap-8 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 w-16 rounded-md bg-slate-200/50" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-8 border-b border-slate-50 px-4 py-3.5 last:border-b-0">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`h-3.5 rounded-md bg-slate-100 ${j === 0 ? 'w-32' : 'w-20'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-white p-5 ${className}`}>
      <div className="mb-4 h-4 w-24 rounded-md bg-slate-200/60" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-3.5 rounded-md bg-slate-100 ${i === 0 ? 'w-full' : i === 1 ? 'w-3/4' : 'w-1/2'}`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <div className="mb-5 h-4 w-24 rounded-md bg-slate-200/60" />
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-16 rounded-md bg-slate-100" />
            <div className="h-10 w-full rounded-lg bg-slate-50" />
          </div>
        ))}
        <div className="h-9 w-24 rounded-lg bg-slate-200/50" />
      </div>
    </div>
  );
}
