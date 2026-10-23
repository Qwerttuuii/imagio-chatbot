import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/auth-context";
import { Card, Notice } from "../ui";

export default function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session) return <Navigate to="/admin" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError("Incorrect email or password.");
    else navigate("/admin", { replace: true });
  }

  const input =
    "mt-2 w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] outline-none focus:border-accent/60";

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-5">
      <Card className="w-full max-w-sm p-8">
        <Logo />
        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted">Admin</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Sign in</h1>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm text-muted">
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </label>
          <label className="block text-sm text-muted">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
          </label>
          {error && <Notice>{error}</Notice>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-accent py-3 text-[15px] font-medium text-white disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </Card>
    </div>
  );
}