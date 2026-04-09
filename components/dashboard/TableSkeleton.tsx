export default function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-9 w-36 rounded bg-slate-200" />
        <div className="h-10 w-24 rounded bg-slate-200" />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex gap-12">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-3 w-16 rounded bg-slate-200" />
          ))}
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="border-b border-slate-100 px-4 py-4 flex gap-12">
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="h-4 w-24 rounded bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
