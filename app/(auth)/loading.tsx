export default function AuthLoading() {
  return (
    <div className="relative min-h-screen bg-[#f6f7fb]" dir="rtl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-gradient-to-br from-ocean/5 to-purple-500/5" />
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/5 to-amber-500/5" />
      </div>

      <div className="relative flex min-h-screen">
        <div className="hidden flex-1 bg-white lg:block" />

        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-pulse space-y-6">
            <div className="mx-auto h-8 w-40 rounded-lg bg-slate-200" />
            <div className="mx-auto h-4 w-56 rounded bg-slate-100" />
            <div className="space-y-5 pt-4">
              <div>
                <div className="mb-2 h-4 w-16 rounded bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
              </div>
              <div>
                <div className="mb-2 h-4 w-12 rounded bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
              </div>
            </div>
            <div className="h-12 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
