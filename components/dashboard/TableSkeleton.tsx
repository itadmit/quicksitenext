export default function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="h-6 w-36 rounded-md bg-slate-200/70" />
        <div className="h-9 w-24 rounded-lg bg-slate-100" />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
        <div className="flex gap-12 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-3 w-16 rounded-md bg-slate-200/50" />
          ))}
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-12 border-b border-slate-50 px-4 py-3.5 last:border-b-0">
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="h-3.5 w-24 rounded-md bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
