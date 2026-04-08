export default function MenuLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-40 rounded bg-charcoal/10 mb-8" />
      <div className="space-y-6 max-w-3xl">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border border-charcoal/10 bg-white p-6 space-y-4">
            <div className="h-6 w-48 rounded bg-charcoal/10" />
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex gap-3">
                <div className="h-10 flex-1 rounded bg-charcoal/5" />
                <div className="h-10 flex-1 rounded bg-charcoal/5" />
                <div className="h-10 w-20 rounded bg-charcoal/5" />
              </div>
            ))}
            <div className="h-10 w-28 rounded bg-charcoal/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
