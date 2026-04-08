export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-40 rounded bg-charcoal/10 mb-8" />
      <div className="border border-charcoal/10 bg-white p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 rounded bg-charcoal/10" />
              <div className="h-10 w-full rounded bg-charcoal/5" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 rounded bg-charcoal/10" />
              <div className="h-10 w-full rounded bg-charcoal/5" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-charcoal/10" />
          <div className="h-20 w-full rounded bg-charcoal/5" />
        </div>
        <div className="h-10 w-32 rounded bg-charcoal/10" />
      </div>
    </div>
  );
}
