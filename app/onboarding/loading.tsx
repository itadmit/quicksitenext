export default function OnboardingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-ocean" />
        <p className="text-sm text-slate-400">טוען...</p>
      </div>
    </div>
  );
}
