export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-9 w-48 rounded bg-charcoal/10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-charcoal/10 bg-white p-6 space-y-3">
            <div className="h-4 w-20 rounded bg-charcoal/10" />
            <div className="h-8 w-16 rounded bg-charcoal/10" />
          </div>
        ))}
      </div>
      <div className="border border-charcoal/10 bg-white p-6 space-y-3">
        <div className="h-5 w-32 rounded bg-charcoal/10" />
        <div className="h-4 w-full rounded bg-charcoal/5" />
        <div className="h-4 w-3/4 rounded bg-charcoal/5" />
        <div className="h-4 w-1/2 rounded bg-charcoal/5" />
      </div>
    </div>
  );
}
