import { useCallback, useEffect, useRef, useState } from "react";
import { streamChat, type ChatEvent } from "../lib/chat";
import type { Block, ChatMessage } from "../types";

const FRIENDLY_ERROR = "Sorry, I couldn't reach our assistant just now. Please try again.";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [stage, setStage] = useState(0);
  const [handoff, setHandoff] = useState<{ whatsapp: string | null } | null>(null);
  const conversationId = useRef<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      if (thinking) return;

      const controller = new AbortController();
      abort.current = controller;

      const assistantId = crypto.randomUUID();
      let assistantCreated = false;

      const mutate = (fn: (blocks: Block[]) => Block[]) => {
        if (!assistantCreated) {
          assistantCreated = true;
          setMessages((m) => [...m, { id: assistantId, role: "assistant", blocks: [] }]);
        }
        setMessages((m) => m.map((x) => (x.id === assistantId ? { ...x, blocks: fn(x.blocks) } : x)));
      };

      const appendText = (t: string) =>
        mutate((blocks) => {
          const last = blocks[blocks.length - 1];
          if (last?.type === "text") return [...blocks.slice(0, -1), { type: "text", text: last.text + t }];
          return [...blocks, { type: "text", text: t }];
        });

      const onEvent = (e: ChatEvent) => {
        switch (e.type) {
          case "meta":
            conversationId.current = e.conversation_id;
            break;
          case "stage":
            setStage(e.stage);
            break;
          case "delta":
            appendText(e.text);
            break;
          case "products":
            mutate((blocks) => [...blocks, { type: "products", items: e.items }]);
            break;
          case "handoff":
            setHandoff({ whatsapp: e.whatsapp });
            break;
          case "error":
            appendText(e.message);
            break;
        }
      };

      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "user", blocks: [{ type: "text", text }] },
      ]);
      setThinking(true);
      setStage(0);

      try {
        await streamChat({ message: text, conversationId: conversationId.current, onEvent, signal: controller.signal });
      } catch (err) {
        if ((err as Error).name !== "AbortError") appendText(FRIENDLY_ERROR);
      } finally {
        setThinking(false);
      }
    },
    [thinking],
  );

  const reset = useCallback(() => {
    abort.current?.abort();
    conversationId.current = null;
    setMessages([]);
    setThinking(false);
    setStage(0);
    setHandoff(null);
  }, []);

  return { messages, thinking, stage, handoff, send, reset };
}