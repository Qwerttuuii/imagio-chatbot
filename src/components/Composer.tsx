import { useRef, useState } from "react";
import { ArrowUp, Paperclip, Plus, RotateCcw } from "lucide-react";

interface Props {
  disabled: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
}

export default function Composer({ disabled, onSend, onReset }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled;

  function submit() {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  }

  return (
    <div className="shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-5">
      <div className="rounded-2xl border border-line bg-card p-3 shadow-sm sm:p-4">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          placeholder="Ask about our products or how we can help..."
          className="max-h-40 w-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-muted/70 sm:text-[17px]"
          onChange={(e) => setValue(e.target.value)}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-muted sm:gap-5">
            {/* Photo upload: wired up in a later step */}
            <button type="button" aria-label="Attach a photo" className="hover:text-ink">
              <Paperclip size={20} />
            </button>
            {/* Quick actions: wired up in a later step */}
            <button type="button" aria-label="More options" className="hover:text-ink">
              <Plus size={20} />
            </button>
            <button type="button" aria-label="Start over" onClick={onReset} className="hover:text-ink">
              <RotateCcw size={20} />
            </button>
          </div>

          <button
            type="button"
            aria-label="Send message"
            onClick={submit}
            disabled={!canSend}
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition ${
              canSend ? "bg-accent" : "bg-accent-soft"
            }`}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted sm:mt-3">A little help making yourself at home.</p>
    </div>
  );
}
