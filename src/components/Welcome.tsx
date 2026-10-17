import { Armchair, ArrowUpRight, BedDouble, Flower2 } from "lucide-react";

const CARDS = [
  {
    label: "Find the right furniture",
    Icon: Armchair,
    prompt: "I'd like help finding the right furniture for my home.",
  },
  {
    label: "Discover your scent",
    Icon: Flower2,
    prompt: "Help me discover the right scent for my space.",
  },
  {
    label: "Find your comfort",
    Icon: BedDouble,
    prompt: "Help me find the right mattress and bedding for better sleep.",
  },
];

export default function Welcome({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex min-h-full flex-col justify-center py-8 text-center sm:py-10">
      <p className="text-sm text-muted">Your home, thoughtfully chosen.</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">How can we help?</h1>
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        Furniture, fragrances, or better sleep. Find what feels right for you.
      </p>

      <div className="mt-7 grid grid-cols-3 gap-2 text-left sm:mt-8 sm:gap-3">
        {CARDS.map(({ label, Icon, prompt }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPick(prompt)}
            className="flex min-h-[116px] flex-col justify-between rounded-2xl border border-line bg-card p-3 transition hover:border-accent/50 hover:shadow-sm sm:h-[132px] sm:p-4"
          >
            <div className="flex items-start justify-between">
              <Icon size={18} className="shrink-0 text-accent sm:size-5" />
              <ArrowUpRight size={14} className="text-muted" />
            </div>
            <span className="text-[13px] leading-snug sm:text-[15px]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
