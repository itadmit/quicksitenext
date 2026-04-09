export default function SiteLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-16 w-full bg-slate-100" />
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
        <div className="h-64 rounded-lg bg-slate-100" />
        <div className="space-y-3">
          <div className="h-6 w-3/4 rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-40 rounded-lg bg-slate-100" />
          <div className="h-40 rounded-lg bg-slate-100" />
          <div className="h-40 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
