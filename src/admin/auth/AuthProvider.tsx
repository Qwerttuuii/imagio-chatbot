import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "./auth-context";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [adminCheck, setAdminCheck] = useState<{ uid: string; ok: boolean } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const uid = session?.user.id;

  // Ask the database whether this signed-in user is an admin
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    supabase.rpc("is_admin").then(({ data }) => {
      if (!cancelled) setAdminCheck({ uid, ok: data === true });
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const isAdmin = uid !== undefined && adminCheck?.uid === uid ? adminCheck.ok : null;

  const value = useMemo(
    () => ({
      session,
      isAdmin,
      loading: !ready,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, isAdmin, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}