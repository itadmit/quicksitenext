export default function MediaLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-36 rounded bg-charcoal/10 mb-8" />
      <div className="border border-charcoal/10 bg-white p-6 mb-6 max-w-xl space-y-3">
        <div className="h-6 w-32 rounded bg-charcoal/10" />
        <div className="h-10 w-full rounded bg-charcoal/5" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded bg-charcoal/5" />
        ))}
      </div>
    </div>
  );
}
