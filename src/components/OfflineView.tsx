import { RotateCcw, WifiOff } from "lucide-react";

export default function OfflineView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-10 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-bubble">
        <WifiOff size={36} className="text-muted" />
      </div>

      <p className="mt-10 text-sm text-muted">Just a little interruption.</p>
      <h2 className="mt-3 text-4xl font-medium tracking-tight">You’re not connected</h2>
      <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
        Check your internet connection. We’ll be here when you’re back.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-8 inline-flex items-center gap-2 rounded-xl border border-line bg-card px-5 py-3 text-[15px] shadow-sm transition hover:border-accent/50"
      >
        <RotateCcw size={16} />
        Try again
      </button>

      <p className="mt-8 text-xs text-muted">
        Your conversation stays here while this page is open.
      </p>
    </div>
  );
}