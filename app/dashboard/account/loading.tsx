export default function AccountLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-24 rounded bg-charcoal/10 mb-8" />
      <div className="space-y-6 max-w-xl">
        <div className="border border-charcoal/10 bg-white p-6 space-y-4">
          <div className="h-6 w-24 rounded bg-charcoal/10" />
          <div className="h-10 w-full rounded bg-charcoal/5" />
          <div className="h-10 w-full rounded bg-charcoal/5" />
          <div className="h-10 w-28 rounded bg-charcoal/10" />
        </div>
        <div className="border border-charcoal/10 bg-white p-6 space-y-4">
          <div className="h-6 w-32 rounded bg-charcoal/10" />
          <div className="h-10 w-full rounded bg-charcoal/5" />
          <div className="h-10 w-full rounded bg-charcoal/5" />
          <div className="h-10 w-full rounded bg-charcoal/5" />
          <div className="h-10 w-28 rounded bg-charcoal/10" />
        </div>
      </div>
    </div>
  );
}
