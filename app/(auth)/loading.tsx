export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md animate-pulse space-y-6 px-4">
        <div className="mx-auto h-10 w-32 rounded-lg bg-slate-200" />
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="mb-6 h-7 w-24 rounded bg-slate-200" />
          <div className="space-y-4">
            <div className="h-10 rounded-lg bg-slate-100" />
            <div className="h-10 rounded-lg bg-slate-100" />
            <div className="h-10 rounded-lg bg-slate-100" />
          </div>
          <div className="mt-6 h-11 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
