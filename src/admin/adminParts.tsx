import type { ReactNode } from "react";
import { Search, X } from "lucide-react";

export function Drawer({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-lg flex-col bg-canvas shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-line p-6">
          <div>
            <h2 className="text-lg font-medium">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">{children}</div>
        {footer && <div className="border-t border-line p-6">{footer}</div>}
      </aside>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-40 ${
        checked ? "bg-accent" : "bg-[#d9d5ce]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm transition ${
            t.id === value ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="rounded-full bg-bubble px-2 py-0.5 text-[11px] text-muted">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm text-muted">
      <Search size={14} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-ink outline-none sm:w-48"
      />
    </label>
  );
}

export function Pager({
  page,
  pageCount,
  from,
  to,
  total,
  noun,
  onPage,
}: {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  noun: string;
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-line p-4 text-xs text-muted">
      <span>{total === 0 ? `No ${noun}` : `Showing ${from}–${to} of ${total} ${noun}`}</span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
          className="rounded-lg border border-line px-4 py-2 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= pageCount - 1}
          onClick={() => onPage(page + 1)}
          className="rounded-lg border border-line px-4 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none focus:border-accent/60";