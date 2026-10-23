import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Pager, SearchField, Tabs } from "../adminParts";
import { visitorName, type ConversationRow, type HandoffStatus, type ThreadMessage } from "../adminTypes";
import { timeAgo, whatsappUrl } from "../format";
import { Avatar, Badge, Card, Empty, Label, Notice, PageHeader } from "../ui";
import { unwrap, useAsync } from "../useAsync";

type Tab = "all" | "unread" | "ai" | "handoff";
const PAGE_SIZE = 25;

export default function ConversationsPage() {
  const [params, setParams] = useSearchParams();
  const openId = params.get("open");
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const list = useAsync(
    async () =>
      unwrap(
        await supabase.from("admin_conversations_view").select("*").order("last_activity", { ascending: false }).limit(300),
      ) as ConversationRow[],
    [],
    20_000,
  );
  const rows = useMemo(() => list.data ?? [], [list.data]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      unread: rows.filter((r) => r.unread_count > 0).length,
      ai: rows.filter((r) => !r.handoff_id).length,
      handoff: rows.filter((r) => r.handoff_id).length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab === "unread" && r.unread_count === 0) return false;
      if (tab === "ai" && r.handoff_id) return false;
      if (tab === "handoff" && !r.handoff_id) return false;
      if (!q) return true;
      return [r.lead_name, r.lead_phone, r.lead_email, r.last_message, r.first_message].some((v) =>
        v?.toLowerCase().includes(q),
      );
    });
  }, [rows, tab, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const selected = rows.find((r) => r.id === openId) ?? null;

  // Opening a conversation marks it as seen
  const selectedId = selected?.id;
  const selectedUnread = selected?.unread_count ?? 0;
  useEffect(() => {
    if (!selectedId || selectedUnread === 0) return;
    supabase
      .from("conversations")
      .update({ admin_seen_at: new Date().toISOString() })
      .eq("id", selectedId)
      .then(() => list.reload());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedUnread]);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "All conversations", count: counts.all },
    { id: "unread", label: "Unread", count: counts.unread },
    { id: "ai", label: "AI resolved", count: counts.ai },
    { id: "handoff", label: "Human handoff", count: counts.handoff },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer inbox"
        title="Conversations"
        subtitle="Review every customer exchange and step in when a personal touch is needed."
        actions={
          <span className="flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white">
            <Sparkles size={16} />
            AI is active
          </span>
        }
      />

      {list.error && <Notice>Couldn’t load conversations: {list.error}</Notice>}

      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(t) => {
          setTab(t);
          setPage(0);
        }}
      />

      <Card className="overflow-hidden">
        <div className="grid min-h-[560px] lg:grid-cols-[360px_1fr]">
          {/* list */}
          <div className={`flex-col border-line lg:flex lg:border-r ${selected ? "hidden" : "flex"}`}>
            <div className="border-b border-line p-4">
              <SearchField
                value={query}
                onChange={(v) => {
                  setQuery(v);
                  setPage(0);
                }}
                placeholder="Search conversations"
              />
            </div>
            <div className="flex-1 divide-y divide-line overflow-y-auto lg:max-h-[620px]">
              {list.loading && <Empty>Loading…</Empty>}
              {!list.loading && pageRows.length === 0 && (
                <Empty>{rows.length === 0 ? "No conversations yet." : "Nothing matches this view."}</Empty>
              )}
              {pageRows.map((r) => {
                const name = visitorName(r.lead_name, r.id);
                const active = r.id === openId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setParams({ open: r.id })}
                    className={`flex w-full items-start gap-3 border-l-2 p-4 text-left transition hover:bg-canvas ${
                      active ? "border-accent bg-canvas" : "border-transparent"
                    }`}
                  >
                    <Avatar name={name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${r.unread_count > 0 ? "font-semibold" : "font-medium"}`}>{name}</p>
                        <span className="shrink-0 text-[11px] text-muted">{timeAgo(r.last_activity)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="line-clamp-2 text-xs text-muted">{r.last_message ?? "No messages yet"}</p>
                        {r.unread_count > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] text-white">
                            {r.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <Pager
              page={current}
              pageCount={pageCount}
              from={current * PAGE_SIZE + 1}
              to={current * PAGE_SIZE + pageRows.length}
              total={filtered.length}
              noun="conversations"
              onPage={setPage}
            />
          </div>

          {/* detail */}
          <div className={`min-w-0 flex-col lg:flex ${selected ? "flex" : "hidden"}`}>
            {selected ? (
              <Thread conv={selected} onBack={() => setParams({})} onChanged={list.reload} />
            ) : (
              <div className="flex flex-1 items-center justify-center p-10 text-sm text-muted">
                Select a conversation to read it.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------------- thread */

interface ThreadData {
  messages: ThreadMessage[];
  profile: Record<string, unknown>;
  products: Record<string, string>;
  feedback: Record<string, number>;
}

async function loadThread(conversationId: string): Promise<ThreadData> {
  const messages = unwrap(
    await supabase
      .from("messages")
      .select("id, role, content, product_ids, created_at")
      .eq("conversation_id", conversationId)
      .in("role", ["user", "assistant"])
      .order("created_at", { ascending: true }),
  ) as ThreadMessage[];

  const profileRow = unwrap(
    await supabase.from("customer_profiles").select("data").eq("conversation_id", conversationId).maybeSingle(),
  ) as { data: Record<string, unknown> } | null;

  const productIds = [...new Set(messages.flatMap((m) => m.product_ids ?? []))];
  const products: Record<string, string> = {};
  if (productIds.length) {
    const rows = unwrap(await supabase.from("products").select("id, name").in("id", productIds)) as {
      id: string;
      name: string;
    }[];
    rows.forEach((p) => (products[p.id] = p.name));
  }

  const feedback: Record<string, number> = {};
  const assistantIds = messages.filter((m) => m.role === "assistant").map((m) => m.id);
  if (assistantIds.length) {
    const rows = unwrap(await supabase.from("feedback").select("message_id, rating").in("message_id", assistantIds)) as {
      message_id: string;
      rating: number;
    }[];
    rows.forEach((f) => (feedback[f.message_id] = f.rating));
  }

  return { messages, profile: profileRow?.data ?? {}, products, feedback };
}

const prettyKey = (k: string) => k.replace(/_/g, " ");
const prettyValue = (v: unknown) =>
  typeof v === "boolean" ? (v ? "yes" : "no") : Array.isArray(v) ? v.join(", ") : String(v);

function Thread({ conv, onBack, onChanged }: { conv: ConversationRow; onBack: () => void; onChanged: () => void }) {
  const thread = useAsync(() => loadThread(conv.id), [conv.id], 15_000);
  const endRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messages = thread.data?.messages ?? [];
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, conv.id]);

  const name = visitorName(conv.lead_name, conv.id);
  const minutesAgo = (Date.now() - new Date(conv.last_activity).getTime()) / 60000;
  const profile = Object.entries(thread.data?.profile ?? {});

  async function setHandoff(status: HandoffStatus) {
    if (!conv.handoff_id) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("handoffs").update({ status }).eq("id", conv.handoff_id);
    setBusy(false);
    if (err) setError(err.message);
    else onChanged();
  }

  const badge =
    conv.handoff_status === "pending" ? (
      <Badge tone="accent">Needs a person</Badge>
    ) : conv.handoff_status === "contacted" ? (
      <Badge tone="amber">Team contacted</Badge>
    ) : conv.handoff_status === "closed" ? (
      <Badge>Handled by team</Badge>
    ) : (
      <Badge tone="green">
        <Sparkles size={12} className="mr-1" />
        AI handling
      </Badge>
    );

  let lastDay = "";

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-line p-4">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onBack} aria-label="Back to the list" className="text-muted lg:hidden">
            <ArrowLeft size={18} />
          </button>
          <Avatar name={name} />
          <div className="min-w-0">
            <p className="truncate font-medium">{name}</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              {minutesAgo < 5 && <span className="h-1.5 w-1.5 rounded-full bg-ok" />}
              {minutesAgo < 5 ? "Online now" : `Active ${timeAgo(conv.last_activity)}`}
            </p>
          </div>
        </div>
        {badge}
      </div>

      {(conv.lead_phone || conv.lead_email || profile.length > 0 || conv.handoff_id) && (
        <div className="space-y-3 border-b border-line bg-canvas/60 p-4 text-sm">
          {(conv.lead_phone || conv.lead_email) && (
            <div className="flex flex-wrap items-center gap-3">
              {conv.lead_phone && <span>{conv.lead_phone}</span>}
              {conv.lead_email && <span className="text-muted">{conv.lead_email}</span>}
              {conv.lead_phone && (
                <a
                  href={whatsappUrl(conv.lead_phone, `Hello ${name}, this is Imagio following up on your chat with us.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs text-white"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              )}
              <Link to="/admin/leads" className="text-xs text-accent">
                View lead
              </Link>
            </div>
          )}
          {profile.length > 0 && (
            <div>
              <Label>What the assistant learned</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.map(([k, v]) => (
                  <span key={k} className="rounded-full bg-bubble px-3 py-1 text-xs">
                    <span className="text-muted">{prettyKey(k)}:</span> {prettyValue(v)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {conv.handoff_id && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted">
                Asked for a person {timeAgo(conv.handoff_at ?? conv.created_at)}
                {conv.handoff_reason ? `: ${conv.handoff_reason}` : ""}
              </p>
              <div className="flex gap-2">
                {conv.handoff_status === "pending" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setHandoff("contacted")}
                    className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs"
                  >
                    Mark contacted
                  </button>
                )}
                {conv.handoff_status !== "closed" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setHandoff("closed")}
                    className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs"
                  >
                    Mark handled
                  </button>
                )}
                {conv.handoff_status === "closed" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setHandoff("pending")}
                    className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          )}
          {error && <Notice>{error}</Notice>}
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto p-5 lg:max-h-[520px]">
        {thread.error && <Notice>Couldn’t load this conversation: {thread.error}</Notice>}
        {thread.loading && <Empty>Loading…</Empty>}
        {messages.map((m) => {
          const day = new Date(m.created_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
          const showDay = day !== lastDay;
          lastDay = day;
          const time = new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
          const rating = thread.data?.feedback[m.id];
          return (
            <div key={m.id}>
              {showDay && <p className="my-2 text-center text-[11px] text-muted">{day}</p>}
              {m.role === "user" ? (
                <div className="ml-auto max-w-[80%] rounded-2xl bg-[#3a3735] px-4 py-3 text-sm text-white">
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <p className="mt-1 text-right text-[11px] text-white/60">{time}</p>
                </div>
              ) : (
                <div className="max-w-[80%] rounded-2xl border border-line bg-card px-4 py-3 text-sm">
                  <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-accent">
                    <Sparkles size={11} /> Imagio AI
                  </p>
                  <p className="mt-2 whitespace-pre-wrap">{m.content}</p>
                  {m.product_ids?.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-muted">Showed:</span>
                      {m.product_ids.map((id) => (
                        <span key={id} className="rounded-full bg-bubble px-3 py-1 text-xs">
                          {thread.data?.products[id] ?? "Product"}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                    {time}
                    {rating === 1 && <ThumbsUp size={12} className="text-ok" />}
                    {rating === -1 && <ThumbsDown size={12} className="text-accent" />}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <p className="border-t border-line p-4 text-xs text-muted">
        Customers who ask for a person are sent to your WhatsApp. Replies from this screen aren’t switched on yet.
      </p>
    </>
  );
}