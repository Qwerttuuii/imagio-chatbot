import { ArrowUpRight, BedDouble, Droplets, Gift, Wind } from "lucide-react";

// If you change a card's `prompt`, add the new wording to that card's `matches`
// list in OPENERS (supabase/functions/chat/index.ts) so its first reply stays instant.
const CARDS = [
  {
    label: "Mattresses",
    hint: "Find your comfort",
    Icon: BedDouble,
    bestSeller: true,
    prompt: "Ask me about our mattress.",
  },
  {
    label: "Diffuser machines",
    hint: "For any space",
    Icon: Wind,
    bestSeller: true,
    prompt: "Ask me about our diffuser machines.",
  },
  {
    label: "Fragrance oils",
    hint: "For your diffuser",
    Icon: Droplets,
    bestSeller: true,
    prompt: "Ask me about our fragrance oils.",
  },
  {
    label: "More from Imagio",
    hint: "Pillows, duvets & more",
    Icon: Gift,
    bestSeller: false,
    prompt: "Ask me about our products, like pillows, duvets, candles and gifts.",
  },
];

export default function Welcome({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex min-h-full flex-col justify-center py-4 text-center sm:py-10">
      <p className="text-[13px] text-muted sm:text-sm">Your home, thoughtfully chosen.</p>
      <h1 className="mt-1.5 text-3xl font-medium tracking-tight sm:mt-3 sm:text-4xl">How can we help?</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-snug text-muted sm:mt-4 sm:text-[15px] sm:leading-relaxed">
        Pick a topic, or type your question below.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">
        {CARDS.map(({ label, hint, Icon, bestSeller, prompt }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPick(prompt)}
            className="flex flex-col justify-between gap-2.5 rounded-2xl border border-line bg-card p-3 text-center transition hover:border-accent/50 hover:shadow-sm sm:min-h-[148px] sm:gap-3 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <Icon size={20} className="text-accent" />
              {bestSeller && <span className="whitespace-nowrap text-[11px] font-medium text-accent">Best seller</span>}
              <ArrowUpRight size={14} className="text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium leading-snug sm:text-[15px]">{label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted sm:text-xs">{hint}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
