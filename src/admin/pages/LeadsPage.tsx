import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, MessageCircle, Phone, Search, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { naira, timeAgo, whatsappUrl } from "../format";
import type { LeadRow, LeadStatus } from "../leadTypes";
import { Avatar, Badge, Card, Empty, Label, Notice, PageHeader } from "../ui";
import { unwrap, useAsync } from "../useAsync";

const PAGE_SIZE = 8;
const HIGH_INTENT = 70;

type Tab = "all" | "high" | "follow" | "converted";
type Sort = "newest" | "intent" | "value";

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

function exportCsv(list: LeadRow[]) {
  const head = ["Name", "Phone", "Email", "Interest", "Status", "Intent score", "Est. value (NGN)", "Captured", "Notes"];
  const esc = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = list.map((l) =>
    [l.name, l.phone, l.email, l.interest, l.status, l.intent_score, l.est_value, l.created_at, l.notes].map(esc).join(","),
  );
  const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `imagio-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 text-xs text-ok">{score}</span>
      <div className="h-1.5 w-28 rounded-full bg-line">
        <div className="h-full rounded-full bg-ok" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const tone = status === "new" ? "accent" : status === "contacted" ? "amber" : status === "converted" ? "green" : "neutral";
  return <Badge tone={tone}>{STATUSES.find((s) => s.value === status)?.label}</Badge>;
}

export default function LeadsPage() {
  const leads = useAsync(
    async () =>
      (
        unwrap(
          await supabase.from("admin_leads_view").select("*").order("created_at", { ascending: false }).limit(500),
        ) as LeadRow[]
      ).map((l) => ({ ...l, est_value: Number(l.est_value) })),
    [],
    60_000,
  );

  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<LeadRow | null>(null);

  const rows = useMemo(() => leads.data ?? [], [leads.data]);

  const stats = useMemo(() => {
    const active = rows.filter((l) => l.status === "new" || l.status === "contacted");
    const pipeline = active.reduce((sum, l) => sum + l.est_value, 0);
    const high = active.filter((l) => l.intent_score >= HIGH_INTENT);
    const converted = rows.filter((l) => l.status === "converted").length;
    const week = 7 * 24 * 3600 * 1000;
    const now = Date.now();
    const weekly = Array.from({ length: 8 }, () => 0);
    for (const l of rows) {
      const w = Math.floor((now - new Date(l.created_at).getTime()) / week);
      if (w >= 0 && w < 8) weekly[7 - w] += 1;
    }
    return {
      pipeline,
      highCount: high.length,
      highFollow: high.filter((l) => l.status === "new").length,
      activeCount: active.length,
      avg: active.length ? pipeline / active.length : 0,
      conversion: rows.length ? (converted / rows.length) * 100 : 0,
      weekly,
    };
  }, [rows]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      high: rows.filter((l) => l.intent_score >= HIGH_INTENT).length,
      follow: rows.filter((l) => l.status === "new").length,
      converted: rows.filter((l) => l.status === "converted").length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((l) => {
      if (tab === "high" && l.intent_score < HIGH_INTENT) return false;
      if (tab === "follow" && l.status !== "new") return false;
      if (tab === "converted" && l.status !== "converted") return false;
      return !q || [l.name, l.phone, l.email, l.interest].some((v) => v?.toLowerCase().includes(q));
    });
    return list.sort((a, b) =>
      sort === "intent"
        ? b.intent_score - a.intent_score
        : sort === "value"
          ? b.est_value - a.est_value
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [rows, tab, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const allOnPage = pageRows.length > 0 && pageRows.every((l) => selected.has(l.id));

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((s) => {
      const next = new Set(s);
      pageRows.forEach((l) => (allOnPage ? next.delete(l.id) : next.add(l.id)));
      return next;
    });

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All leads" },
    { id: "high", label: "High intent" },
    { id: "follow", label: "Needs follow-up" },
    { id: "converted", label: "Converted" },
  ];

  const maxWeek = Math.max(1, ...stats.weekly);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales pipeline"
        title="Leads"
        subtitle="Understand customer intent, prioritise opportunities, and follow up at the right moment."
        actions={
          <button
            type="button"
            onClick={() => exportCsv(selected.size ? rows.filter((l) => selected.has(l.id)) : filtered)}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            <Download size={16} />
            {selected.size ? `Export ${selected.size} selected` : "Export leads"}
          </button>
        }
      />

      {leads.error && <Notice>Couldn’t load leads: {leads.error}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs text-muted">Pipeline value</p>
          <p className="mt-3 text-3xl font-medium tracking-tight">{naira(stats.pipeline)}</p>
          <p className="mt-2 text-xs text-muted">Starting prices of what active leads were shown</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted">High-intent leads</p>
          <p className="mt-3 text-3xl font-medium tracking-tight">{stats.highCount}</p>
          <p className="mt-2 text-xs text-muted">{stats.highFollow} need follow-up today</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted">Avg. lead value</p>
          <p className="mt-3 text-3xl font-medium tracking-tight">{naira(stats.avg)}</p>
          <p className="mt-2 text-xs text-muted">Across {stats.activeCount} active leads</p>
        </Card>
        <Card className="flex items-end justify-between p-5">
          <div>
            <p className="text-xs text-muted">Conversion rate</p>
            <p className="mt-3 text-3xl font-medium tracking-tight">{stats.conversion.toFixed(1)}%</p>
            <p className="mt-2 text-xs text-muted">New leads, last 8 weeks</p>
          </div>
          <div className="flex h-14 items-end gap-1">
            {stats.weekly.map((n, i) => (
              <div
                key={i}
                className={`w-2 rounded-t ${i === stats.weekly.length - 1 ? "bg-accent" : "bg-accent-soft"}`}
                style={{ height: `${Math.max(8, (n / maxWeek) * 100)}%` }}
              />
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setPage(0);
                }}
                className={`rounded-lg px-4 py-2 text-sm ${
                  tab === t.id ? "bg-[#fbe3d9] text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {t.label} <span className="ml-1 text-xs opacity-70">{counts[t.id]}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted">
              <Search size={14} />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Search"
                className="w-32 bg-transparent text-ink outline-none"
              />
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-line bg-card px-3 py-2 text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="intent">Highest intent</option>
              <option value="value">Highest value</option>
            </select>
          </div>
        </div>

        {leads.loading && <Empty>Loading leads…</Empty>}
        {!leads.loading && filtered.length === 0 && (
          <Empty>
            {rows.length === 0
              ? "No leads yet. They appear when a customer shares their contact details in the chat."
              : "No leads match this view."}
          </Empty>
        )}

        {pageRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-y border-line bg-canvas text-left text-[11px] uppercase tracking-[0.14em] text-muted">
                  <th className="w-12 px-5 py-3">
                    <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Select all on this page" />
                  </th>
                  <th className="px-3 py-3 font-normal">Customer</th>
                  <th className="px-3 py-3 font-normal">Product interest</th>
                  <th className="px-3 py-3 font-normal">Intent score</th>
                  <th className="px-3 py-3 font-normal">Est. value</th>
                  <th className="px-3 py-3 font-normal">Status</th>
                  <th className="px-5 py-3 font-normal">Captured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pageRows.map((l) => (
                  <tr key={l.id} onClick={() => setOpen(l)} className="cursor-pointer hover:bg-canvas/70">
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(l.id)}
                        onChange={() => toggle(l.id)}
                        aria-label={`Select ${l.name ?? "lead"}`}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.name ?? "?"} size="sm" />
                        <div>
                          <p className="font-medium">{l.name ?? "Unknown"}</p>
                          <p className="text-xs text-muted">{l.phone ?? l.email ?? "No contact"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[240px] px-3 py-4">
                      <p className="truncate">{l.interest ?? "—"}</p>
                      <p className="text-xs text-muted">
                        {l.products_shown} {l.products_shown === 1 ? "product" : "products"} shown
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <ScoreBar score={l.intent_score} />
                    </td>
                    <td className="px-3 py-4">{l.est_value > 0 ? naira(l.est_value) : "—"}</td>
                    <td className="px-3 py-4">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-muted">{timeAgo(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-line p-4 text-xs text-muted">
          <span>
            {filtered.length === 0
              ? "No leads"
              : `Showing ${current * PAGE_SIZE + 1}–${current * PAGE_SIZE + pageRows.length} of ${filtered.length} leads`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
              className="rounded-lg border border-line px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={current >= pageCount - 1}
              onClick={() => setPage(current + 1)}
              className="rounded-lg border border-line px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {open && (
        <LeadDrawer
          key={open.id}
          lead={open}
          onClose={() => setOpen(null)}
          onSaved={() => {
            setOpen(null);
            leads.reload();
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------- lead drawer */

function LeadDrawer({ lead, onClose, onSaved }: { lead: LeadRow; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const name = lead.name ?? "Unknown";
  const hello = `Hello ${name}, this is Imagio following up on your enquiry${lead.interest ? ` about ${lead.interest}` : ""}.`;

  async function save() {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase
      .from("leads")
      .update({ status, notes: notes.trim() || null })
      .eq("id", lead.id);
    setBusy(false);
    if (err) setError(err.message);
    else onSaved();
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto bg-canvas p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={name} />
            <div>
              <h2 className="text-lg font-medium">{name}</h2>
              <p className="text-xs text-muted">Captured {timeAgo(lead.created_at)}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <Card className="space-y-4 p-5">
          <Label>Contact</Label>
          {lead.phone && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>{lead.phone}</span>
              <span className="flex gap-2">
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1 rounded-lg border border-line px-3 py-2 text-xs">
                  <Phone size={13} /> Call
                </a>
                <a
                  href={whatsappUrl(lead.phone, hello)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs text-white"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </span>
            </div>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="block text-sm text-accent">
              {lead.email}
            </a>
          )}
          {!lead.phone && !lead.email && <p className="text-sm text-muted">No contact details were shared.</p>}
        </Card>

        <Card className="space-y-3 p-5">
          <Label>Interest</Label>
          <p className="text-sm">{lead.interest ?? "—"}</p>
          <div className="flex items-center justify-between pt-2 text-sm">
            <ScoreBar score={lead.intent_score} />
            <span className="text-muted">{lead.est_value > 0 ? `Est. ${naira(lead.est_value)}` : "No product shown yet"}</span>
          </div>
          <p className="text-xs text-muted">
            {lead.user_messages} customer messages, {lead.products_shown} products shown
            {lead.handoff_requested ? ", asked for a person" : ""}.
          </p>
          {lead.conversation_id && (
            <Link to={`/admin/conversations?open=${lead.conversation_id}`} className="text-sm text-accent">
              View the conversation →
            </Link>
          )}
        </Card>

        <div className="space-y-3">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  status === s.value ? "border-accent bg-[#fdeee8] text-accent" : "border-line bg-card text-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Notes</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add a note for your team"
            className="w-full rounded-xl border border-line bg-card p-4 text-sm outline-none focus:border-accent/60"
          />
        </div>

        {error && <Notice>{error}</Notice>}
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </aside>
    </div>
  );
}