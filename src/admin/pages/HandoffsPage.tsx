import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Headset, History, MessageCircle, CircleCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Tabs } from "../adminParts";
import { visitorName, type HandoffRow, type HandoffStatus } from "../adminTypes";
import { timeAgo, whatsappUrl } from "../format";
import { Avatar, Badge, Card, Empty, Notice, PageHeader, StatCard } from "../ui";
import { unwrap, useAsync } from "../useAsync";

type Tab = HandoffStatus | "all";

const minutesSince = (iso: string) => Math.max(0, (Date.now() - new Date(iso).getTime()) / 60000);

function duration(minutes: number): string {
  if (minutes < 1) return "under a minute";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = minutes / 60;
  if (h < 24) return `${h.toFixed(h < 10 ? 1 : 0)} h`;
  return `${Math.round(h / 24)} d`;
}

export default function HandoffsPage() {
  const list = useAsync(
    async () =>
      unwrap(
        await supabase.from("admin_handoffs_view").select("*").order("created_at", { ascending: false }).limit(300),
      ) as HandoffRow[],
    [],
    20_000,
  );
  const rows = useMemo(() => list.data ?? [], [list.data]);
  const [tab, setTab] = useState<Tab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const week = Date.now() - 7 * 24 * 3600 * 1000;
    const handled = rows.filter((r) => r.handled_at && new Date(r.created_at).getTime() >= week);
    const avg = handled.length
      ? handled.reduce((sum, r) => sum + (new Date(r.handled_at!).getTime() - new Date(r.created_at).getTime()) / 60000, 0) /
        handled.length
      : null;
    return {
      pending: rows.filter((r) => r.status === "pending").length,
      contacted: rows.filter((r) => r.status === "contacted").length,
      closedWeek: rows.filter((r) => r.status === "closed" && r.handled_at && new Date(r.handled_at).getTime() >= week).length,
      avg,
      handledCount: handled.length,
      noContact: rows.filter((r) => r.status === "pending" && !r.lead_phone && !r.lead_email).length,
    };
  }, [rows]);

  const shown = useMemo(() => {
    const list2 = rows.filter((r) => tab === "all" || r.status === tab);
    // the longest wait comes first in the waiting tab
    return tab === "pending"
      ? [...list2].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      : list2;
  }, [rows, tab]);

  async function setStatus(id: string, status: HandoffStatus) {
    setBusyId(id);
    setError(null);
    const { error: err } = await supabase.from("handoffs").update({ status }).eq("id", id);
    setBusyId(null);
    if (err) setError(err.message);
    else list.reload();
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "pending", label: "Waiting", count: stats.pending },
    { id: "contacted", label: "Contacted", count: stats.contacted },
    { id: "closed", label: "Handled", count: rows.filter((r) => r.status === "closed").length },
    { id: "all", label: "All", count: rows.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Needs a person"
        title="Human handoffs"
        subtitle="Customers who asked for a person. Reach them quickly while the conversation is fresh."
      />

      {list.error && <Notice>Couldn’t load handoffs: {list.error}</Notice>}
      {error && <Notice>{error}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          highlight={stats.pending > 0}
          icon={<Headset size={18} />}
          label="Waiting now"
          value={String(stats.pending)}
          note={stats.pending === 0 ? "Everyone has been looked after" : "Oldest first in the list below"}
        />
        <StatCard
          icon={<MessageCircle size={18} />}
          label="Contacted"
          value={String(stats.contacted)}
          note="Reached, not yet closed"
        />
        <StatCard
          icon={<CircleCheck size={18} />}
          label="Handled this week"
          value={String(stats.closedWeek)}
          note="Marked as handled"
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Average response"
          value={stats.avg === null ? "—" : duration(stats.avg)}
          note={stats.avg === null ? "Shows once a few are handled" : `Over ${stats.handledCount} handoffs this week`}
        />
      </div>

      {stats.noContact > 0 && (
        <Notice>
          {stats.noContact} waiting {stats.noContact === 1 ? "customer didn’t" : "customers didn’t"} share contact details. They were
          shown your WhatsApp link, so they’ll reach you there.
        </Notice>
      )}

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="space-y-3">
        {list.loading && <Empty>Loading…</Empty>}
        {!list.loading && shown.length === 0 && (
          <Card>
            <Empty>{tab === "pending" ? "Nothing waiting. The assistant is handling everyone." : "Nothing here yet."}</Empty>
          </Card>
        )}

        {shown.map((h) => {
          const name = visitorName(h.lead_name, h.conversation_id);
          const waited = minutesSince(h.created_at);
          const tone = waited < 15 ? "green" : waited < 60 ? "amber" : "accent";
          const busy = busyId === h.id;
          const contact = h.lead_phone ?? h.lead_email;
          return (
            <Card key={h.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar name={name} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{name}</p>
                      {h.status === "pending" && <Badge tone={tone}>Waiting {duration(waited)}</Badge>}
                      {h.status === "contacted" && <Badge tone="amber">Contacted</Badge>}
                      {h.status === "closed" && <Badge>Handled</Badge>}
                    </div>
                    <p className="mt-1 text-sm">{h.reason ?? "Asked for a person"}</p>
                    <p className="mt-1 text-xs text-muted">
                      Asked {timeAgo(h.created_at)}
                      {h.handled_at && ` · answered after ${duration((new Date(h.handled_at).getTime() - new Date(h.created_at).getTime()) / 60000)}`}
                      {contact ? ` · ${contact}` : " · no contact details"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {h.lead_phone && (
                    <a
                      href={whatsappUrl(h.lead_phone, `Hello ${name}, this is Imagio. I’m following up on your chat with us.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs text-white"
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  )}
                  <Link
                    to={`/admin/conversations?open=${h.conversation_id}`}
                    className="flex items-center gap-1 rounded-lg border border-line bg-card px-3 py-2 text-xs"
                  >
                    <History size={13} /> Conversation
                  </Link>
                  {h.status === "pending" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setStatus(h.id, "contacted")}
                      className="rounded-lg border border-line bg-card px-3 py-2 text-xs"
                    >
                      Mark contacted
                    </button>
                  )}
                  {h.status !== "closed" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setStatus(h.id, "closed")}
                      className="rounded-lg border border-line bg-card px-3 py-2 text-xs"
                    >
                      Mark handled
                    </button>
                  )}
                  {h.status !== "pending" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setStatus(h.id, "pending")}
                      className="rounded-lg border border-line bg-card px-3 py-2 text-xs text-muted"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              {(h.last_message || h.lead_interest) && (
                <div className="mt-4 grid gap-3 rounded-xl bg-canvas p-4 text-sm sm:grid-cols-2">
                  {h.last_message && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Customer’s last message</p>
                      <p className="mt-1 line-clamp-3">“{h.last_message}”</p>
                    </div>
                  )}
                  {h.lead_interest && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Interested in</p>
                      <p className="mt-1">{h.lead_interest}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}