import { Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import type { ChatMessage } from "../types";

export function AssistantLabel() {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Sparkles size={16} className="text-accent" />
      imagio
    </div>
  );
}

interface Props {
  message: ChatMessage;
  onAsk: (text: string) => void;
}

export default function Message({ message, onAsk }: Props) {
  if (message.role === "user") {
    return (
      <div className="rounded-2xl bg-bubble px-5 py-4 text-[17px] leading-relaxed">
        {message.blocks.map((b, i) => (b.type === "text" ? <span key={i}>{b.text}</span> : null))}
      </div>
    );
  }

  return (
    <div>
      <AssistantLabel />
      <div className="mt-3 space-y-4">
        {message.blocks.map((b, i) =>
          b.type === "text" ? (
            <p key={i} className="whitespace-pre-wrap text-[16px] leading-relaxed">
              {b.text}
            </p>
          ) : (
            <div key={i} className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
              {b.items.map((item) => (
                <ProductCard key={item.id} item={item} onAsk={onAsk} />
              ))}
            </div>
          ),
        )}
      </div>
    </div>
  );
}