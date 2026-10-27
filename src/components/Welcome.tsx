import { ArrowUpRight, BedDouble, Droplets, Gift, Wind } from "lucide-react";


const CARDS = [
  {
    label: "Mattresses",
    hint: "Find your perfect comfort",
    Icon: BedDouble,
    bestSeller: true,
    prompt: "Ask me about our mattress.",
  },
  {
    label: "Diffuser machines",
    hint: "Fragrance for any space",
    Icon: Wind,
    bestSeller: true,
    prompt: "Ask me about our diffuser machines.",
  },
  {
    label: "Fragrance oils",
    hint: "Scents for your diffuser",
    Icon: Droplets,
    bestSeller: true,
    prompt: "Ask me about our fragrance oils.",
  },
  {
    label: "More from Imagio",
    hint: "Pillows, duvets, candles, gifts and more",
    Icon: Gift,
    bestSeller: false,
    prompt: "Ask me about our products, like pillows, duvets, candles and gifts.",
  },
];

export default function Welcome({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex min-h-full flex-col justify-center py-10 text-center">
      <p className="text-sm text-muted">Your home, thoughtfully chosen.</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">How can we help?</h1>
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        Choose what you’d like help with, or type your question below.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {CARDS.map(({ label, hint, Icon, bestSeller, prompt }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPick(prompt)}
            className="flex min-h-[156px] flex-col justify-between rounded-2xl border border-line bg-card p-4 text-center transition hover:border-accent/50 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <Icon size={20} className="text-accent" />
              <ArrowUpRight size={14} className="text-muted" />
            </div>
            <div>
              {bestSeller && <p className="mb-1 text-[11px] font-medium text-accent"></p>}
              <p className="text-[15px] font-medium leading-snug">{label}</p>
              <p className="mt-1 text-xs leading-snug text-muted">{hint}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}