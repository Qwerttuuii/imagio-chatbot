import type { ProductCardData } from "../types";

export type ChatEvent =
  | { type: "meta"; conversation_id: string }
  | { type: "stage"; stage: number }
  | { type: "delta"; text: string }
  | { type: "products"; items: ProductCardData[] }
  | { type: "handoff"; whatsapp: string | null }
  | { type: "done"; message_id: string | null }
  | { type: "error"; message: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat`;
const SESSION_KEY = "imagio_session_id";

export function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID(); // storage blocked: fall back to a per-load id
  }
}

interface StreamOptions {
  message: string;
  conversationId: string | null;
  onEvent: (event: ChatEvent) => void;
  signal?: AbortSignal;
}

/** Sends one message and reads the streamed reply (server-sent events over fetch). */
export async function streamChat({ message, conversationId, onEvent, signal }: StreamOptions) {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      session_id: getSessionId(),
      conversation_id: conversationId,
      message,
    }),
  });

  if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let end: number;
    while ((end = buffer.indexOf("\n\n")) !== -1) {
      const chunk = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      const line = chunk.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      try {
        onEvent(JSON.parse(line.slice(5).trim()) as ChatEvent);
      } catch {
        /* ignore a malformed chunk */
      }
    }
  }
}