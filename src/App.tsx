import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import OfflineView from "./components/OfflineView";
import Message from "./components/Message";
import ThinkingStepper from "./components/ThinkingStepper";
import Composer from "./components/Composer";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useChat } from "./hooks/useChat";
import type { Status } from "./types";

export default function App() {
  const [showStartup, setShowStartup] = useState(true);
  const { online, recheck } = useOnlineStatus();
  const { messages, thinking, stage, handoff, send, reset } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowStartup(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, stage, handoff]);

  const last = messages[messages.length - 1];
  const showStepper = thinking && last?.role !== "assistant";
  const status: Status = !online ? "offline" : thinking ? "thinking" : "ready";

  const whatsappLink = handoff?.whatsapp
    ? `https://wa.me/${handoff.whatsapp}?text=${encodeURIComponent("Hello Imagio, I would like to speak to someone.")}`
    : null;

  return (
    <>
      <div className="app-shell mx-auto flex h-dvh w-full max-w-[480px] flex-col">
        <Header status={status} />

        <main className="min-h-0 flex-1 overflow-y-auto px-5">
        {!online ? (
          <OfflineView onRetry={recheck} />
        ) : messages.length === 0 && !thinking ? (
          <Welcome onPick={send} />
        ) : (
          <div className="space-y-8 py-8">
            {messages.map((m) => (
              <Message key={m.id} message={m} onAsk={send} />
            ))}
            {showStepper && <ThinkingStepper stage={stage} />}

            {handoff && (
              <div className="rounded-2xl border border-line bg-card p-4 text-sm">
                {whatsappLink ? (
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="font-medium text-accent">
                    Continue with our team on WhatsApp →
                  </a>
                ) : (
                  <span>Our team has been notified and will reach out to you.</span>
                )}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
        </main>

        <Composer disabled={thinking || !online} onSend={send} onReset={reset} />
      </div>

      {showStartup && (
        <div className="startup-screen" role="status" aria-live="polite">
          <div className="startup-content">
            <img className="startup-logo" src="/imagio-logo.svg" alt="Imagio" />
            <p className="startup-tagline">Your home, thoughtfully chosen.</p>
            <span className="startup-indicator" aria-label="Loading" />
          </div>
        </div>
      )}
    </>
  );
}
