import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Headset, MessageSquare, UserPlus, Zap } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { change } from "../format";
import { Card, Empty, Label, Notice, PageHeader, Segmented, StatCard } from "../ui";
import { unwrap, useAsync } from "../useAsync";

interface Analytics {
  unit: "hour" | "day";
  totals: {
    conversations: number; leads: number; handoffs: number; customer_messages: number; assistant_messages: number;
    instant_answers: number; opener_answers: number; engaged: number; with_products: number; converted: number;
  };
  previous: { conversations: number; leads: number; handoffs: number; assistant_messages: number; instant_answers: number };
  series: { t: string; conversations: number; leads: number; handoffs: number }[];
  by_hour: number[];
  by_weekday: number[];
  entry_paths: { path: string; n: number }[];
  top_products: { name: string; category: string; shown: number }[];
  top_faq: { question: string; instant: number; context: number }[];
}

const PERIODS = [
  { value: 24, label: "24 hours" },
  { value: 168, label: "7 days" },
  { value: 720, label: "30 days" },
];

const PATH_LABEL: Record<string, string> = {
  comfort: "Find your comfort",
  scent: "Discover your scent",
  furniture: "Find the right furniture",
  free: "Typed their own question",
};

const CATEGORY_LABEL: Record<string, string> = {
  diffuser_machine: "Diffuser", fragrance_oil: "Fragrance oil", mattress: "Mattress", pillow: "Pillow", bedset: "Bedset",
  duvet: "Duvet", room_spray: "Room spray", candle: "Candle", zen_set: "Gift set", reed_diffuser: "Reed diffuser",
};

const rate = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);

export default function AnalyticsPage() {
  const [hours, setHours] = useState(168);
  const q = useAsync(async () => unwrap(await supabase.rpc("admin_analytics", { p_hours: hours })) as Analytics, [hours], 120_000);
  const a = q.data;

  const t = a?.totals;
  const p = a?.previous;
  const instantNow = t ? t.instant_answers + t.opener_answers : 0;
  const leadRate = t ? rate(t.leads, t.conversations) : 0;
  const leadRatePrev = p ? rate(p.leads, p.conversations) : 0;
  const withoutAi = t ? rate(instantNow, t.assistant_messages) : 0;
  const withoutAiPrev = p ? rate(p.instant_answers, p.assistant_messages) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Performance"
        title="Analytics"
        subtitle="How customers use the assistant, what they ask for, and where they drop off."
        actions={<Segmented options={PERIODS} value={hours} onChange={setHours} />}
      />

      {q.error && <Notice>Couldn’t load analytics: {q.error}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          highlight
          icon={<MessageSquare size={18} />}
          label="Conversations"
          value={t ? t.conversations.toLocaleString() : "…"}
          delta={t && p ? change(t.conversations, p.conversations) : undefined}
          note={t ? `${t.customer_messages.toLocaleString()} customer messages` : undefined}
        />
        <StatCard
          icon={<UserPlus size={18} />}
          label="Lead conversion"
          value={t ? `${leadRate.toFixed(1)}%` : "…"}
          delta={t && p && p.conversations > 0 ? leadRate - leadRatePrev : undefined}
          deltaUnit=" pts"
          note={t ? `${t.leads} shared contact details` : undefined}
        />
        <StatCard
          icon={<Headset size={18} />}
          label="Handoff rate"
          value={t ? `${rate(t.handoffs, t.conversations).toFixed(1)}%` : "…"}
          aside={t ? `${t.handoffs} handoffs` : undefined}
          note="Asked for a person"
        />
        <StatCard
          icon={<Zap size={18} />}
          label="Answered without the AI"
          value={t ? `${withoutAi.toFixed(0)}%` : "…"}
          delta={t && p && p.assistant_messages > 0 ? withoutAi - withoutAiPrev : undefined}
          deltaUnit=" pts"
          note="Instant, near-zero wait"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <ActivityChart a={a} />
        <Funnel a={a} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnswerSplit a={a} />
        <BusyTimes a={a} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6">
          <Label>Where customers start</Label>
          <h2 className="mt-2 text-lg font-medium">Entry points</h2>
          <div className="mt-5 space-y-4">
            {a && a.entry_paths.length === 0 && <Empty>No conversations in this period.</Empty>}
            {a?.entry_paths.map((e) => (
              <Bar key={e.path} label={PATH_LABEL[e.path] ?? e.path} value={e.n} max={Math.max(...a.entry_paths.map((x) => x.n))} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Label>What they were shown</Label>
          <h2 className="mt-2 text-lg font-medium">Most recommended</h2>
          <div className="mt-5 space-y-4">
            {a && a.top_products.length === 0 && <Empty>No recommendations in this period.</Empty>}
            {a?.top_products.map((x) => (
              <Bar
                key={x.name}
                label={x.name}
                sub={CATEGORY_LABEL[x.category] ?? x.category}
                value={x.shown}
                max={Math.max(...a.top_products.map((y) => y.shown))}
                suffix={x.shown === 1 ? "chat" : "chats"}
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <Label>Knowledge base</Label>
              <h2 className="mt-2 text-lg font-medium">Most used answers</h2>
            </div>
            <Link to="/admin/knowledge" className="flex items-center gap-1 text-sm text-accent">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {a && a.top_faq.length === 0 && <Empty>No answers used yet.</Empty>}
            {a?.top_faq.map((x) => (
              <Bar
                key={x.question}
                label={x.question}
                value={x.instant + x.context}
                max={Math.max(...a.top_faq.map((y) => y.instant + y.context))}
                suffix={`uses · ${x.instant} instant`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

function Bar({ label, sub, value, max, suffix }: { label: string; sub?: string; value: number; max: number; suffix?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate">{label}</span>
        <span className="shrink-0 text-xs text-muted">
          {value}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
      <div className="mt-1.5 h-1.5 rounded-full bg-line">
        <div className="h-full rounded-full bg-accent" style={{ width: `${max > 0 ? Math.max(4, (value / max) * 100) : 0}%` }} />
      </div>
    </div>
  );
}

function ActivityChart({ a }: { a: Analytics | null }) {
  const series = a?.series ?? [];
  const max = Math.max(1, ...series.map((s) => Math.max(s.conversations, s.leads)));
  const top = Math.max(2, Math.ceil(max / 2) * 2);
  const label = (iso: string) =>
    a?.unit === "hour"
      ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric" })
      : new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const marks = new Set([0, Math.round((series.length - 1) / 3), Math.round(((series.length - 1) * 2) / 3), series.length - 1]);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Label>Activity</Label>
          <h2 className="mt-2 text-xl font-medium">Conversations and leads</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" />Conversations</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-ok" />Leads</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex h-52 flex-col justify-between text-right text-[11px] text-muted">
          <span>{top}</span>
          <span>{top / 2}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-0 flex h-52 flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border-t border-line" />
            ))}
          </div>
          <div className="relative flex h-52 items-end gap-1">
            {series.map((s) => (
              <div
                key={s.t}
                title={`${label(s.t)}: ${s.conversations} conversations, ${s.leads} leads, ${s.handoffs} handoffs`}
                className="flex h-full flex-1 items-end justify-center gap-[2px]"
              >
                <div className="w-1/3 max-w-3 rounded-t bg-accent" style={{ height: `${(s.conversations / top) * 100}%`, minHeight: s.conversations > 0 ? 2 : 0 }} />
                <div className="w-1/3 max-w-3 rounded-t bg-ok" style={{ height: `${(s.leads / top) * 100}%`, minHeight: s.leads > 0 ? 2 : 0 }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1 text-[11px] text-muted">
            {series.map((s, i) => (
              <span key={s.t} className="flex-1 text-center">{marks.has(i) ? label(s.t) : ""}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Funnel({ a }: { a: Analytics | null }) {
  const t = a?.totals;
  const steps = t
    ? [
        { label: "Started a conversation", n: t.conversations },
        { label: "Wrote back (2+ messages)", n: t.engaged },
        { label: "Were shown products", n: t.with_products },
        { label: "Shared contact details", n: t.leads },
        { label: "Became customers", n: t.converted },
      ]
    : [];
  const base = Math.max(1, t?.conversations ?? 1);

  return (
    <Card className="p-6">
      <Label>Where customers drop off</Label>
      <h2 className="mt-2 text-xl font-medium">Journey</h2>
      <div className="mt-5 space-y-4">
        {t && t.conversations === 0 && <Empty>No conversations in this period.</Empty>}
        {steps.map((s) => (
          <div key={s.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span>{s.label}</span>
              <span className="text-xs text-muted">
                {s.n} · {rate(s.n, base).toFixed(0)}%
              </span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-line">
              <div className="h-full rounded-full bg-accent" style={{ width: `${s.n > 0 ? Math.max(3, (s.n / base) * 100) : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted">“Became customers” counts leads you marked as converted.</p>
    </Card>
  );
}

function AnswerSplit({ a }: { a: Analytics | null }) {
  const t = a?.totals;
  const instant = t?.instant_answers ?? 0;
  const opener = t?.opener_answers ?? 0;
  const ai = Math.max(0, (t?.assistant_messages ?? 0) - instant - opener);
  const total = Math.max(1, instant + opener + ai);
  const parts = [
    { label: "Instant approved answers", n: instant, color: "bg-ok" },
    { label: "Opening replies to the home cards", n: opener, color: "bg-[#9fcbad]" },
    { label: "Written by the AI", n: ai, color: "bg-accent" },
  ];

  return (
    <Card className="p-6">
      <Label>How questions were answered</Label>
      <h2 className="mt-2 text-xl font-medium">Instant vs AI</h2>
      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-line">
        {parts.map((p) => (
          <div key={p.label} className={p.color} style={{ width: `${(p.n / total) * 100}%` }} />
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
              {p.label}
            </span>
            <span className="text-xs text-muted">
              {p.n} · {rate(p.n, total).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted">Instant answers skip the AI, so customers get them in a fraction of a second. Add more approved answers to raise this.</p>
    </Card>
  );
}

function BusyTimes({ a }: { a: Analytics | null }) {
  const hours = a?.by_hour ?? [];
  const days = a?.by_weekday ?? [];
  const maxH = Math.max(1, ...hours);
  const maxD = Math.max(1, ...days);
  const hourLabel = (h: number) => (h === 0 ? "12 am" : h === 12 ? "12 pm" : h < 12 ? `${h} am` : `${h - 12} pm`);
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card className="p-6">
      <Label>When customers write</Label>
      <h2 className="mt-2 text-xl font-medium">Busiest times</h2>

      <p className="mt-5 text-xs text-muted">By hour of the day (Lagos time)</p>
      <div className="mt-2 flex gap-[3px]">
        {hours.map((n, h) => (
          <div
            key={h}
            title={`${hourLabel(h)}: ${n} messages`}
            className="h-10 flex-1 rounded-sm bg-accent"
            style={{ opacity: n === 0 ? 0.08 : 0.2 + 0.8 * (n / maxH) }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>12 am</span><span>6 am</span><span>12 pm</span><span>6 pm</span><span>11 pm</span>
      </div>

      <p className="mt-6 text-xs text-muted">By day of the week</p>
      <div className="mt-2 flex h-20 items-end gap-2">
        {days.map((n, i) => (
          <div key={names[i]} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-14 w-full items-end">
              <div className="w-full rounded-t bg-accent" title={`${names[i]}: ${n} messages`} style={{ height: `${(n / maxD) * 100}%`, minHeight: n > 0 ? 3 : 0 }} />
            </div>
            <span className="text-[11px] text-muted">{names[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}