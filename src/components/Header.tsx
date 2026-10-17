import Logo from "./Logo";
import type { Status } from "../types";

const STATUS = {
  ready: { label: "Imagio customer care", dot: "bg-ok" },
  thinking: { label: "Preparing your answer", dot: "bg-ok" },
  offline: { label: "Connection lost", dot: "bg-muted" },
} as const;

export default function Header({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-2">
      <Logo className="max-w-[45%]" />
      <div className="flex min-w-0 items-center gap-2 text-right text-xs leading-tight text-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
        <span>{s.label}</span>
      </div>
    </header>
  );
}
