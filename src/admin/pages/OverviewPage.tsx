import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Headset, MessageSquare, Sparkles, UserPlus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/auth-context";
import { change, greeting, naira, nameFromSession, timeAgo, todayLabel } from "../format";
import type { LeadRow } from "../leadTypes";
import { Avatar, Badge, Card, Empty, Label, Notice, PageHeader, Segmented, StatCard } from "../ui";
import { unwrap, useAsync } from "../useAsync";

interface Overview {
  unit: "hour" | "day";
  conversations: { current: number; previous: number; visitors: number };
  leads: { current: number; previous: number };
  handoffs: { current: number; previous: number; pending: number };
  resolution: { current: number | null; previous: number | null };
  knowledge_score: number | null;
  series: { t: string; current: number; previous: number }[];
}

const PERIODS = [
  { value: 24, label: "24 hours" },
  { value: 168, label: "7 days" },
  { value: 720, label: "30 days" },
];

export default function OverviewPage() {
  const { session } = useAuth();
  const [hours, setHours] = useState(168);
  const overview = useAsync(
    async () => unwrap(await supabase.rpc("admin_overview", { p_hours: hours })) as Overview,
    [hours],
    60_000,
  );

  const o = overview.data;
  const conv = o?.conversations.current ?? 0;
  const pct = (n: number) => (conv > 0 ? ((n / conv) * 100).toFixed(1) : "0");
  const res = o?.resolution;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={todayLabel()}
        title={`${greeting()}, ${nameFromSession(session)}.`}
        subtitle="Here’s what your customers need today."
        actions={<Segmented options={PERIODS} value={hours} onChange={setHours} />}
      />

      {overview.error && <Notice>Couldn’t load the numbers: {overview.error}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          highlight
          icon={<MessageSquare size={18} />}
          label="AI conversations"
          value={o ? conv.toLocaleString() : "…"}
          delta={o ? change(conv, o.conversations.previous) : undefined}
          note={o ? `Across ${o.conversations.visitors.toLocaleString()} visitors` : undefined}
        />
        <StatCard
          icon={<UserPlus size={18} />}
          label="Qualified leads"
          value={o ? o.leads.current.toLocaleString() : "…"}
          delta={o ? change(o.leads.current, o.leads.previous) : undefined}
          note={o ? `${pct(o.leads.current)}% of conversations` : undefined}
        />
        <StatCard
          icon={<Headset size={18} />}
          label="Human handoffs"
          value={o ? o.handoffs.current.toLocaleString() : "…"}
          aside={o ? `${pct(o.handoffs.current)}% of chats` : undefined}
          note={o ? `${o.handoffs.pending} waiting right now` : undefined}
        />
        <StatCard
          icon={<Sparkles size={18} />}
          label="Resolution rate"
          value={res?.current != null ? `${res.current.toFixed(1)}%` : "—"}
          delta={res?.current != null && res.previous != null ? res.current - res.previous : undefined}
          deltaUnit=" pts"
          note="Resolved by AI, no handoff"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <VolumeChart overview={o} />
        <LiveHandoffs />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <LatestLeads />
        <KnowledgeHealth score={o?.knowledge_score ?? null} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- volume chart */

function VolumeChart({ overview }: { overview: Overview | null }) {
  const series = overview?.series ?? [];
  const max = Math.max(1, ...series.flatMap((s) => [s.current, s.previous]));
  const top = Math.max(2, Math.ceil(max / 2) * 2);
  const label = (iso: string) =>
    overview?.unit === "hour"
      ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric" })
      : new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const marks = new Set([0, Math.round((series.length - 1) / 3), Math.round(((series.length - 1) * 2) / 3), series.length - 1]);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <Label>Customer activity</Label>
          <h2 className="mt-2 text-xl font-medium">Conversation volume</h2>
        </div>
        <Link to="/admin/analytics" className="flex items-center gap-1 text-sm text-accent">
          View analytics <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-3xl font-medium tracking-tight">{(overview?.conversations.current ?? 0).toLocaleString()}</p>
          <p className="text-xs text-muted">Total conversations</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            This period
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#dedad3]" />
            Previous
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex h-48 flex-col justify-between text-right text-[11px] text-muted">
          <span>{top}</span>
          <span>{top / 2}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-0 flex h-48 flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border-t border-line" />
            ))}
          </div>
          <div className="relative flex h-48 items-end gap-1">
            {series.map((s) => (
              <div
                key={s.t}
                title={`${label(s.t)}: ${s.current} (previous: ${s.previous})`}
                className="flex h-full flex-1 items-end justify-center gap-[2px]"
              >
                <div
                  className="w-1/3 max-w-3 rounded-t bg-[#dedad3]"
                  style={{ height: `${(s.previous / top) * 100}%`, minHeight: s.previous > 0 ? 2 : 0 }}
                />
                <div
                  className="w-1/3 max-w-3 rounded-t bg-accent"
                  style={{ height: `${(s.current / top) * 100}%`, minHeight: s.current > 0 ? 2 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1 text-[11px] text-muted">
            {series.map((s, i) => (
              <span key={s.t} className="flex-1 text-center">
                {marks.has(i) ? label(s.t) : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------- live handoffs */

interface LiveHandoff {
  id: string;
  name: string;
  reason: string;
  created_at: string;
}

function LiveHandoffs() {
  const { data, error } = useAsync(
    async () => {
      const rows = unwrap(
        await supabase
          .from("handoffs")
          .select("id, reason, created_at, conversation_id")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(3),
      ) as { id: string; reason: string | null; created_at: string; conversation_id: string }[];
      const ids = rows.map((r) => r.conversation_id);
      const leads = ids.length
        ? (unwrap(await supabase.from("leads").select("conversation_id, name").in("conversation_id", ids)) as {
            conversation_id: string;
            name: string | null;
          }[])
        : [];
      return rows.map<LiveHandoff>((r) => ({
        id: r.id,
        name: leads.find((l) => l.conversation_id === r.conversation_id)?.name ?? `Visitor ${r.conversation_id.slice(0, 4)}`,
        reason: r.reason ?? "Asked for a person",
        created_at: r.created_at,
      }));
    },
    [],
    30_000,
  );

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-start justify-between">
        <div>
          <Label>Needs attention</Label>
          <h2 className="mt-2 text-xl font-medium">Live handoffs</h2>
        </div>
        {data && data.length > 0 && <Badge tone="accent">{data.length} live</Badge>}
      </div>

      <div className="mt-4 flex-1 divide-y divide-line">
        {error && <Notice>{error}</Notice>}
        {data?.length === 0 && <Empty>Nothing waiting right now.</Empty>}
        {data?.map((h) => (
          <Link key={h.id} to="/admin/handoffs" className="flex items-center gap-3 py-4">
            <Avatar name={h.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{h.name}</p>
              <p className="truncate text-xs text-muted">{h.reason}</p>
            </div>
            <span className="text-xs text-muted">{timeAgo(h.created_at)}</span>
            <ChevronRight size={16} className="text-muted" />
          </Link>
        ))}
      </div>

      <Link
        to="/admin/handoffs"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-medium text-white"
      >
        Open handoff queue <ArrowRight size={16} />
      </Link>
    </Card>
  );
}

/* ----------------------------------------------------------- latest leads */

function statusBadge(lead: LeadRow) {
  if (lead.status === "new" && lead.intent_score >= 70) return <Badge tone="accent">High intent</Badge>;
  if (lead.status === "new") return <Badge tone="green">New lead</Badge>;
  if (lead.status === "contacted") return <Badge tone="amber">Contacted</Badge>;
  if (lead.status === "converted") return <Badge tone="green">Converted</Badge>;
  return <Badge>Lost</Badge>;
}

function LatestLeads() {
  const { data, error } = useAsync(
    async () =>
      unwrap(
        await supabase.from("admin_leads_view").select("*").order("created_at", { ascending: false }).limit(5),
      ) as LeadRow[],
    [],
    60_000,
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <Label>Sales opportunities</Label>
          <h2 className="mt-2 text-xl font-medium">Latest qualified leads</h2>
        </div>
        <Link to="/admin/leads" className="flex items-center gap-1 text-sm text-accent">
          View all leads <ArrowRight size={14} />
        </Link>
      </div>

      {error && <div className="px-6 pb-6"><Notice>{error}</Notice></div>}
      {data?.length === 0 && <Empty>No leads yet. They appear when a customer shares their contact details.</Empty>}

      {data && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-y border-line text-left text-[11px] uppercase tracking-[0.14em] text-muted">
                <th className="px-6 py-3 font-normal">Customer</th>
                <th className="px-3 py-3 font-normal">Interest</th>
                <th className="px-3 py-3 font-normal">Est. value</th>
                <th className="px-3 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((l) => (
                <tr key={l.id}>
                  <td className="px-6 py-4">
                    <Link to="/admin/leads" className="flex items-center gap-3">
                      <Avatar name={l.name ?? "?"} size="sm" />
                      <span className="font-medium">{l.name ?? "Unknown"}</span>
                    </Link>
                  </td>
                  <td className="max-w-[220px] truncate px-3 py-4 text-muted">{l.interest ?? "—"}</td>
                  <td className="px-3 py-4">{Number(l.est_value) > 0 ? naira(Number(l.est_value)) : "—"}</td>
                  <td className="px-3 py-4">{statusBadge(l)}</td>
                  <td className="px-6 py-4 text-xs text-muted">{timeAgo(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------- knowledge health */

function KnowledgeHealth({ score }: { score: number | null }) {
  const { data } = useAsync(
    async () => {
      const rows = unwrap(
        await supabase
          .from("unanswered_questions")
          .select("question, created_at")
          .eq("resolved", false)
          .order("created_at", { ascending: false })
          .limit(200),
      ) as { question: string; created_at: string }[];
      const groups = new Map<string, { question: string; count: number }>();
      for (const r of rows) {
        const key = r.question.trim().toLowerCase();
        const g = groups.get(key);
        if (g) g.count += 1;
        else groups.set(key, { question: r.question.trim(), count: 1 });
      }
      return [...groups.values()].sort((a, b) => b.count - a.count);
    },
    [],
    60_000,
  );

  const label = score === null ? "No data yet" : score >= 90 ? "Excellent coverage" : score >= 75 ? "Good coverage" : "Needs attention";
  const circumference = 2 * Math.PI * 26;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <Label>Knowledge health</Label>
          <h2 className="mt-2 text-xl font-medium">Questions to review</h2>
        </div>
        {data && data.length > 0 && <Badge tone="amber">{data.length}</Badge>}
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-canvas p-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#e8e5df" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#4f9a63"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${((score ?? 0) / 100) * circumference} ${circumference}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">{score ?? "–"}</span>
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted">
            {score === null ? "No conversations in this period." : `The assistant knew the answer in ${score}% of conversations.`}
          </p>
        </div>
      </div>

      <div className="mt-2 divide-y divide-line">
        {data?.length === 0 && <Empty>No open questions. Nice.</Empty>}
        {data?.slice(0, 3).map((q) => (
          <Link key={q.question} to="/admin/knowledge" className="flex items-center gap-3 py-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fdf1d9] text-sm text-[#b7791f]">
              ?
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">“{q.question}”</p>
              <p className="text-xs text-muted">Asked {q.count} {q.count === 1 ? "time" : "times"}</p>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </Link>
        ))}
      </div>
    </Card>
  );
}