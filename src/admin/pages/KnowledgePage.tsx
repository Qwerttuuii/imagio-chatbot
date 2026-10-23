import { useMemo, useState } from "react";
import { BookOpen, ChevronRight, CircleHelp, Plus, Sparkles, Zap } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Drawer, Pager, SearchField, Toggle, inputClass } from "../adminParts";
import type { KnowledgeRow } from "../adminTypes";
import { timeAgo } from "../format";
import { Badge, Card, Empty, Label, Notice, PageHeader, StatCard } from "../ui";
import { unwrap, useAsync } from "../useAsync";

const PAGE_SIZE = 12;
type Filter = "all" | "instant" | "review" | "rules" | "off";

interface QuestionGroup {
  key: string;
  question: string;
  count: number;
  last: string;
  ids: string[];
}

interface Usage {
  entries: { id: string; instant: number; context: number }[];
  instant_total: number;
  opener_total: number;
  assistant_messages: number;
}

interface Draft {
  id: string | null;
  question: string;
  variants: string;
  answer: string;
  product: string;
  instant: boolean;
  active: boolean;
  source: KnowledgeRow["source"];
  resolveIds: string[];
  isRule: boolean;
  reviewNote: string | null;
}

const isRule = (k: KnowledgeRow) => k.topic.startsWith("catalog-rules-");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const emptyDraft = (): Draft => ({
  id: null, question: "", variants: "", answer: "", product: "", instant: true, active: true,
  source: "manual", resolveIds: [], isRule: false, reviewNote: null,
});

const draftFrom = (k: KnowledgeRow): Draft => ({
  id: k.id, question: k.question, variants: (k.variants ?? []).join("\n"), answer: k.answer, product: k.product ?? "",
  instant: k.instant, active: k.active, source: k.source, resolveIds: [], isRule: isRule(k), reviewNote: k.review_note,
});

async function loadEntries(): Promise<KnowledgeRow[]> {
  return unwrap(
    await supabase.from("knowledge_base").select("*").order("product", { ascending: true }).order("question").limit(1000),
  ) as KnowledgeRow[];
}

async function loadQuestions(): Promise<QuestionGroup[]> {
  const rows = unwrap(
    await supabase
      .from("unanswered_questions")
      .select("id, question, created_at")
      .eq("resolved", false)
      .order("created_at", { ascending: false })
      .limit(500),
  ) as { id: string; question: string; created_at: string }[];
  const groups = new Map<string, QuestionGroup>();
  for (const r of rows) {
    const key = r.question.trim().toLowerCase();
    const g = groups.get(key);
    if (g) {
      g.count += 1;
      g.ids.push(r.id);
    } else {
      groups.set(key, { key, question: r.question.trim(), count: 1, last: r.created_at, ids: [r.id] });
    }
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || (a.last < b.last ? 1 : -1));
}

export default function KnowledgePage() {
  const entries = useAsync(loadEntries, [], 60_000);
  const questions = useAsync(loadQuestions, [], 60_000);
  const usage = useAsync(async () => unwrap(await supabase.rpc("admin_faq_usage", { p_days: 30 })) as Usage, [], 60_000);
  const overview = useAsync(
    async () => unwrap(await supabase.rpc("admin_overview", { p_hours: 720 })) as { knowledge_score: number | null },
    [],
    120_000,
  );

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => entries.data ?? [], [entries.data]);
  const usageById = useMemo(() => new Map((usage.data?.entries ?? []).map((e) => [e.id, e])), [usage.data]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      instant: rows.filter((r) => r.active && r.instant).length,
      review: rows.filter((r) => !r.active || r.review_note).length,
      rules: rows.filter(isRule).length,
      off: rows.filter((r) => !r.active).length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "instant" && !(r.active && r.instant)) return false;
      if (filter === "review" && !(!r.active || r.review_note)) return false;
      if (filter === "rules" && !isRule(r)) return false;
      if (filter === "off" && r.active) return false;
      if (!q) return true;
      return [r.question, r.answer, r.product, ...(r.variants ?? [])].some((v) => v?.toLowerCase().includes(q));
    });
  }, [rows, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  const u = usage.data;
  const instantRate = u && u.assistant_messages > 0 ? ((u.instant_total + u.opener_total) / u.assistant_messages) * 100 : null;
  const score = overview.data?.knowledge_score ?? null;
  const openQuestions = questions.data ?? [];

  async function patch(id: string, values: Partial<KnowledgeRow>) {
    setBusyId(id);
    setError(null);
    const { error: err } = await supabase.from("knowledge_base").update(values).eq("id", id);
    setBusyId(null);
    if (err) setError(err.message);
    else entries.reload();
  }

  async function dismiss(g: QuestionGroup) {
    const { error: err } = await supabase.from("unanswered_questions").update({ resolved: true }).in("id", g.ids);
    if (err) setError(err.message);
    else questions.reload();
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: `All (${counts.all})` },
    { id: "instant", label: `Instant (${counts.instant})` },
    { id: "review", label: `Needs review (${counts.review})` },
    { id: "rules", label: `Core rules (${counts.rules})` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="What the assistant knows"
        title="Knowledge base"
        subtitle="Approved answers customers get word for word, plus the questions it couldn’t answer yet. Changes reach customers within about a minute."
        actions={
          <button
            type="button"
            onClick={() => setDraft(emptyDraft())}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white"
          >
            <Plus size={16} /> Add answer
          </button>
        }
      />

      {(entries.error || questions.error) && <Notice>Couldn’t load everything: {entries.error ?? questions.error}</Notice>}
      {error && <Notice>{error}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          highlight
          icon={<Sparkles size={18} />}
          label="Knowledge health"
          value={score === null ? "—" : `${score}/100`}
          note="Conversations with no unanswered question (30 days)"
        />
        <StatCard
          icon={<BookOpen size={18} />}
          label="Approved answers"
          value={String(rows.filter((r) => r.active && !isRule(r)).length)}
          note={`${counts.instant} can be sent instantly`}
        />
        <StatCard
          icon={<CircleHelp size={18} />}
          label="Questions to review"
          value={String(openQuestions.length)}
          note="Asked, but the assistant had no answer"
        />
        <StatCard
          icon={<Zap size={18} />}
          label="Replies without the AI"
          value={instantRate === null ? "—" : `${instantRate.toFixed(0)}%`}
          note={u ? `${u.instant_total + u.opener_total} of ${u.assistant_messages} replies, 30 days` : undefined}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Label>Learning loop</Label>
            <h2 className="mt-2 text-xl font-medium">Questions to review</h2>
          </div>
          {openQuestions.length > 0 && <Badge tone="amber">{openQuestions.length}</Badge>}
        </div>

        <div className="mt-4 divide-y divide-line">
          {questions.loading && <Empty>Loading…</Empty>}
          {!questions.loading && openQuestions.length === 0 && <Empty>No open questions. The assistant could answer everything it was asked.</Empty>}
          {(showAllQuestions ? openQuestions : openQuestions.slice(0, 5)).map((g) => (
            <div key={g.key} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fdf1d9] text-sm text-[#b7791f]">?</span>
                <div className="min-w-0">
                  <p className="truncate text-sm">“{g.question}”</p>
                  <p className="text-xs text-muted">
                    Asked {g.count} {g.count === 1 ? "time" : "times"} · last {timeAgo(g.last)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDraft({ ...emptyDraft(), question: g.question, source: "from_unanswered", resolveIds: g.ids })}
                  className="rounded-lg bg-accent px-3 py-2 text-xs text-white"
                >
                  Add answer
                </button>
                <button type="button" onClick={() => dismiss(g)} className="rounded-lg border border-line px-3 py-2 text-xs text-muted">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
        {openQuestions.length > 5 && (
          <button type="button" onClick={() => setShowAllQuestions((s) => !s)} className="mt-2 text-sm text-accent">
            {showAllQuestions ? "Show fewer" : `Show all ${openQuestions.length}`}
          </button>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  setPage(0);
                }}
                className={`rounded-lg px-4 py-2 text-sm ${filter === f.id ? "bg-[#fbe3d9] text-accent" : "text-muted hover:text-ink"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <SearchField
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(0);
            }}
            placeholder="Search answers"
          />
        </div>

        {entries.loading && <Empty>Loading…</Empty>}
        {!entries.loading && filtered.length === 0 && <Empty>No answers match this view.</Empty>}

        {pageRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-y border-line bg-canvas text-left text-[11px] uppercase tracking-[0.14em] text-muted">
                  <th className="px-5 py-3 font-normal">Question</th>
                  <th className="px-3 py-3 font-normal">Section</th>
                  <th className="px-3 py-3 font-normal">Used (30 days)</th>
                  <th className="px-3 py-3 font-normal">Instant</th>
                  <th className="px-3 py-3 font-normal">On</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pageRows.map((r) => {
                  const use = usageById.get(r.id);
                  const rule = isRule(r);
                  return (
                    <tr key={r.id} onClick={() => setDraft(draftFrom(r))} className="cursor-pointer hover:bg-canvas/70">
                      <td className="max-w-[360px] px-5 py-4">
                        <p className="truncate font-medium">{r.question}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          {(r.variants ?? []).length} other ways to ask
                          {r.has_prices && <Badge tone="amber">Has prices</Badge>}
                          {r.review_note && <Badge tone="accent">Review</Badge>}
                        </p>
                      </td>
                      <td className="px-3 py-4 text-muted">{rule ? "Core rules" : (r.product ?? "General")}</td>
                      <td className="px-3 py-4 text-muted">
                        {use ? `${use.instant} instant · ${use.context} as background` : "—"}
                      </td>
                      <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                        <Toggle
                          label="Answer instantly"
                          checked={r.instant}
                          disabled={rule || busyId === r.id}
                          onChange={(next) => patch(r.id, { instant: next })}
                        />
                      </td>
                      <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                        <Toggle
                          label="Active"
                          checked={r.active}
                          disabled={busyId === r.id}
                          onChange={(next) => patch(r.id, next ? { active: true, review_note: null } : { active: false })}
                        />
                      </td>
                      <td className="px-3 py-4 text-muted">
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pager
          page={current}
          pageCount={pageCount}
          from={current * PAGE_SIZE + 1}
          to={current * PAGE_SIZE + pageRows.length}
          total={filtered.length}
          noun="answers"
          onPage={setPage}
        />
      </Card>

      {draft && (
        <Editor
          key={draft.id ?? "new"}
          initial={draft}
          sections={[...new Set(rows.map((r) => r.product).filter((p): p is string => !!p))]}
          onClose={() => setDraft(null)}
          onSaved={() => {
            setDraft(null);
            entries.reload();
            questions.reload();
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ editor */

function Editor({
  initial,
  sections,
  onClose,
  onSaved,
}: {
  initial: Draft;
  sections: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [d, setD] = useState<Draft>(initial);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((s) => ({ ...s, [key]: value }));

  async function save() {
    const question = d.question.trim();
    const answer = d.answer.trim();
    if (question.length < 3 || answer.length < 2) {
      setError("Add a question and an answer.");
      return;
    }
    const variants = [...new Set(d.variants.split("\n").map((v) => v.trim()).filter(Boolean))].slice(0, 40);
    const product = d.product.trim() || null;
    const values = {
      question,
      answer,
      variants,
      product,
      instant: d.isRule ? false : d.instant,
      active: d.active,
      has_prices: answer.includes("₦"),
      review_note: d.active ? null : d.reviewNote,
    };

    setSaving(true);
    setError(null);
    const res = d.id
      ? await supabase.from("knowledge_base").update(values).eq("id", d.id)
      : await supabase
          .from("knowledge_base")
          .insert({ ...values, topic: `faq-${slug(product ?? "general") || "general"}`, source: d.source });
    if (res.error) {
      setSaving(false);
      setError(res.error.message);
      return;
    }
    if (d.resolveIds.length) await supabase.from("unanswered_questions").update({ resolved: true }).in("id", d.resolveIds);
    setSaving(false);
    onSaved();
  }

  async function remove() {
    if (!d.id) return;
    setSaving(true);
    const { error: err } = await supabase.from("knowledge_base").delete().eq("id", d.id);
    setSaving(false);
    if (err) setError(err.message);
    else onSaved();
  }

  return (
    <Drawer
      title={d.id ? "Edit answer" : "Add answer"}
      subtitle={d.resolveIds.length ? "From a question customers asked" : undefined}
      onClose={onClose}
      footer={
        <div className="space-y-3">
          {error && <Notice>{error}</Notice>}
          <div className="flex items-center justify-between gap-3">
            {d.id ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => (confirmDelete ? remove() : setConfirmDelete(true))}
                className={`rounded-xl border px-4 py-3 text-sm ${confirmDelete ? "border-accent text-accent" : "border-line text-muted"}`}
              >
                {confirmDelete ? "Click again to delete" : "Delete"}
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      }
    >
      {d.reviewNote && !d.active && <Notice>Needs review: {d.reviewNote}</Notice>}
      {d.isRule && (
        <Notice>This is a core rule. It is always given to the assistant as background and is never sent word for word.</Notice>
      )}

      <label className="block space-y-2 text-sm text-muted">
        Question
        <input value={d.question} onChange={(e) => set("question", e.target.value)} className={inputClass} />
      </label>

      <label className="block space-y-2 text-sm text-muted">
        Other ways customers ask this (one per line)
        <textarea
          rows={5}
          value={d.variants}
          onChange={(e) => set("variants", e.target.value)}
          placeholder={"how much is it\nprice please"}
          className={inputClass}
        />
        <span className="block text-xs">
          Write them the way customers really type, short forms and Pidgin included. This is how the assistant recognises the question instantly.
        </span>
      </label>

      <label className="block space-y-2 text-sm text-muted">
        Answer
        <textarea rows={7} value={d.answer} onChange={(e) => set("answer", e.target.value)} className={inputClass} />
        <span className="block text-right text-xs">{d.answer.length} characters</span>
      </label>

      <label className="block space-y-2 text-sm text-muted">
        Section (optional)
        <input list="kb-sections" value={d.product} onChange={(e) => set("product", e.target.value)} className={inputClass} />
        <datalist id="kb-sections">
          {sections.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </label>

      <div className="space-y-4 rounded-2xl border border-line bg-card p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Answer instantly, without the AI</p>
            <p className="mt-1 text-xs text-muted">
              Customers get this answer word for word when their question closely matches. Turn it off if the answer depends on the customer.
            </p>
          </div>
          <Toggle label="Answer instantly" checked={d.isRule ? false : d.instant} disabled={d.isRule} onChange={(v) => set("instant", v)} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="mt-1 text-xs text-muted">Switched off answers are never used.</p>
          </div>
          <Toggle label="Active" checked={d.active} onChange={(v) => set("active", v)} />
        </div>
      </div>

      {answerHasPrice(d.answer) && (
        <p className="text-xs text-muted">
          This answer contains prices. If a price changes, update it here as well as in the catalog.
        </p>
      )}
    </Drawer>
  );
}

const answerHasPrice = (a: string) => a.includes("₦");