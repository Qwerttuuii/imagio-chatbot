import type { ReactNode } from "react";
import { LoaderCircle, TrendingDown, TrendingUp } from "lucide-react";
import { initials } from "./format";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-card ${className}`}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{children}</p>;
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-[15px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  /** Change versus the previous period. null shows "New". */
  delta?: number | null;
  deltaUnit?: string;
  /** Plain text shown top right instead of a change figure. */
  aside?: string;
  note?: string;
  highlight?: boolean;
}

export function StatCard({ icon, label, value, delta, deltaUnit = "%", aside, note, highlight }: StatCardProps) {
  let right: ReactNode = aside ? <span className="text-xs text-muted">{aside}</span> : null;
  if (!aside && delta !== undefined) {
    if (delta === null) {
      right = <span className="text-xs text-ok">New</span>;
    } else {
      const up = delta >= 0;
      const Icon = up ? TrendingUp : TrendingDown;
      right = (
        <span className={`flex items-center gap-1 text-xs ${up ? "text-ok" : "text-accent"}`}>
          <Icon size={12} />
          {up ? "+" : "−"}
          {Math.abs(delta).toFixed(1)}
          {deltaUnit}
        </span>
      );
    }
  }

  return (
    <Card className={`p-5 ${highlight ? "border-accent/60" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-accent">
          {icon}
        </div>
        {right}
      </div>
      <p className="mt-6 text-sm text-muted">{label}</p>
      <p className="mt-1 text-4xl font-medium tracking-tight">{value}</p>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </Card>
  );
}

interface SegmentedProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string | number>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-[#f1efea] p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-4 py-2 text-sm transition ${
            o.value === value ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

type Tone = "accent" | "green" | "amber" | "neutral";
const TONES: Record<Tone, string> = {
  accent: "bg-[#fdeee8] text-accent",
  green: "bg-[#e6f2ea] text-ok",
  amber: "bg-[#fdf1d9] text-[#b7791f]",
  neutral: "bg-bubble text-muted",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${TONES[tone]}`}>{children}</span>;
}

const TINTS = ["bg-[#f3e4e0]", "bg-[#efe6d6]", "bg-[#e1ece4]", "bg-[#e6e3ee]"];

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const tint = TINTS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TINTS.length];
  const dims = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full text-muted ${dims} ${tint}`}>
      {initials(name)}
    </span>
  );
}

export function Spinner() {
  return <LoaderCircle size={22} className="animate-spin text-accent" />;
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-accent/30 bg-[#fdf1ec] px-4 py-3 text-sm text-ink">{children}</p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm text-muted">{children}</p>;
}