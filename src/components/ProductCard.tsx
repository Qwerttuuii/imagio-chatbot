import type { ProductCardData } from "../types";

const LABELS: Record<string, string> = {
  diffuser_machine: "Diffuser",
  fragrance_oil: "Fragrance oil",
  mattress: "Mattress",
  pillow: "Pillow",
  bedset: "Bedset",
  duvet: "Duvet",
  room_spray: "Room spray",
  candle: "Candle",
  zen_set: "Gift set",
  reed_diffuser: "Reed diffuser",
};

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

interface Props {
  item: ProductCardData;
  onAsk: (text: string) => void;
}

export default function ProductCard({ item, onAsk }: Props) {
  const label = LABELS[item.category] ?? "Product";

  return (
    <div className="flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex h-28 items-center justify-center bg-bubble">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted">{label}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs text-accent">{label}</span>
        <h3 className="mt-1 text-[15px] font-medium leading-snug">{item.name}</h3>

        {item.variants.length > 1 ? (
          <ul className="mt-2 space-y-0.5 text-sm text-muted">
            {item.variants.slice(0, 4).map((v) => (
              <li key={v.label} className="flex justify-between gap-3">
                <span>{v.label}</span>
                <span className="text-ink">{naira(v.price)}</span>
              </li>
            ))}
          </ul>
        ) : (
          item.price != null && <p className="mt-2 text-[15px]">{naira(item.price)}</p>
        )}

        {item.reason && <p className="mt-3 text-sm leading-snug text-muted">{item.reason}</p>}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onAsk(`Tell me more about the ${item.name}`)}
            className="flex-1 rounded-xl border border-line px-3 py-2 text-sm transition hover:border-accent/50"
          >
            Tell me more
          </button>
          {item.product_url && (
            <a
              href={item.product_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl bg-accent px-3 py-2 text-center text-sm text-white"
            >
              View
            </a>
          )}
        </div>
      </div>
    </div>
  );
}