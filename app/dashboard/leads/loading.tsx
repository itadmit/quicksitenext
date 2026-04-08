export default function LeadsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-9 w-24 rounded bg-charcoal/10" />
        <div className="h-10 w-32 rounded bg-charcoal/10" />
      </div>
      <div className="space-y-4 max-w-3xl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-charcoal/10 bg-white p-5 space-y-3">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-5 w-32 rounded bg-charcoal/10" />
                <div className="h-3 w-48 rounded bg-charcoal/5" />
              </div>
              <div className="h-3 w-20 rounded bg-charcoal/5" />
            </div>
            <div className="h-16 w-full rounded bg-charcoal/[0.03]" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 rounded bg-charcoal/5" />
              <div className="h-10 rounded bg-charcoal/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
