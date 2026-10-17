import { LoaderCircle } from "lucide-react";
import { AssistantLabel } from "./Message";

const STEPS = ["Your question", "Your needs", "Your answer"];
const LINES = [
  "Understanding your question…",
  "Working out what you need…",
  "Preparing your answer…",
];

/** stage: 0 = question, 1 = needs, 2 = answer */
export default function ThinkingStepper({ stage }: { stage: number }) {
  return (
    <div>
      <AssistantLabel />

      <div className="mt-3 flex items-center gap-3 text-muted">
        <LoaderCircle size={18} className="animate-spin text-accent" />
        <span>{LINES[stage]}</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {STEPS.map((label, i) => {
          const active = i <= stage;
          return (
            <div key={label}>
              <div
                className={`flex items-center gap-2 pb-3 text-sm ${
                  active ? "text-ink" : "text-muted/60"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent" : "bg-line"}`}
                />
                {label}
              </div>
              <div className={`h-0.5 rounded-full ${active ? "bg-accent" : "bg-line"}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}