export default function PagesLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-9 w-32 rounded bg-charcoal/10" />
        <div className="h-10 w-28 rounded bg-charcoal/10" />
      </div>
      <div className="border border-charcoal/10 bg-white overflow-hidden">
        <div className="border-b border-charcoal/10 bg-charcoal/[0.02] px-4 py-3 flex gap-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-16 rounded bg-charcoal/10" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-charcoal/5 px-4 py-4 flex gap-16">
            <div className="h-4 w-32 rounded bg-charcoal/8" />
            <div className="h-4 w-20 rounded bg-charcoal/5" />
            <div className="h-4 w-14 rounded bg-charcoal/5" />
            <div className="h-4 w-16 rounded bg-charcoal/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
