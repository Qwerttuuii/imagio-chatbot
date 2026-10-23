import type { Session } from "@supabase/supabase-js";

export const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

export function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

/** Percentage change from previous to current. null when there is nothing to compare with. */
export function change(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

export function nameFromSession(session: Session | null): string {
  const meta = session?.user.user_metadata?.full_name as string | undefined;
  if (meta) return meta.split(" ")[0] ?? meta;
  const local = session?.user.email?.split("@")[0] ?? "there";
  const word = local.split(/[._-]/)[0] ?? local;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Turns 0803 123 4567 into a wa.me link (Nigerian numbers get 234). */
export function whatsappUrl(phone: string, text?: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) digits = `234${digits.slice(1)}`;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}