import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, ChartColumn, Headset, LayoutGrid, LogOut, MessageSquare, UserPlus } from "lucide-react";
import Logo from "../../components/Logo";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/auth-context";
import { nameFromSession } from "../format";
import { Avatar } from "../ui";
import { useAsync } from "../useAsync";

const NAV = [
  { to: "/admin", label: "Overview", Icon: LayoutGrid, end: true },
  { to: "/admin/leads", label: "Leads", Icon: UserPlus, end: false },
  { to: "/admin/conversations", label: "Conversations", Icon: MessageSquare, end: false },
  { to: "/admin/handoffs", label: "Human handoffs", Icon: Headset, end: false },
  { to: "/admin/knowledge", label: "Knowledge base", Icon: BookOpen, end: false },
  { to: "/admin/analytics", label: "Analytics", Icon: ChartColumn, end: false },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const name = nameFromSession(session);

  // number shown on the "Human handoffs" link
  const pending = useAsync(
    async () => {
      const { count } = await supabase
        .from("handoffs")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      return count ?? 0;
    },
    [],
    30_000,
  );

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col justify-between bg-[#f1efea] px-5 py-8 lg:flex">
        <div>
          <div className="px-3">
            <Logo />
          </div>
          <p className="mt-10 px-3 text-xs uppercase tracking-[0.18em] text-muted">Workspace</p>
          <nav className="mt-4 space-y-1">
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition ${
                    isActive ? "bg-card text-accent shadow-sm" : "text-muted hover:text-ink"
                  }`
                }
              >
                <Icon size={19} />
                <span className="flex-1">{label}</span>
                {to === "/admin/handoffs" && (pending.data ?? 0) > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs text-white">
                    {pending.data}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-canvas p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-ok" />
              Imagio assistant
            </p>
            <p className="mt-1 text-xs text-muted">Online and answering customers</p>
          </div>
          <div className="flex items-center gap-3 px-2">
            <Avatar name={name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="text-xs text-muted">Administrator</p>
            </div>
            <button type="button" onClick={signOut} aria-label="Sign out" className="text-muted hover:text-ink">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="border-b border-line bg-[#f1efea] px-5 pt-4 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" onClick={signOut} aria-label="Sign out" className="text-muted">
              <LogOut size={18} />
            </button>
          </div>
          <nav className="-mx-5 mt-3 flex gap-1 overflow-x-auto px-5 pb-3">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-4 py-2 text-sm ${isActive ? "bg-card text-accent" : "text-muted"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <main className="mx-auto max-w-[1280px] px-5 py-8 lg:px-12 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}