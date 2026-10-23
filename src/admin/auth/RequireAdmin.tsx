import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Logo from "../../components/Logo";
import { Card, Spinner } from "../ui";
import { useAuth } from "./auth-context";

function FullPage({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-canvas px-5">{children}</div>;
}

export default function RequireAdmin() {
  const { session, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (isAdmin === null) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }
  if (!isAdmin) {
    return (
      <FullPage>
        <Card className="w-full max-w-sm p-8 text-center">
          <Logo />
          <h1 className="mt-6 text-xl font-medium">No access</h1>
          <p className="mt-2 text-sm text-muted">
            {session.user.email} is signed in but isn’t an admin of this dashboard.
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-6 rounded-xl border border-line px-5 py-3 text-sm hover:border-accent/50"
          >
            Sign out
          </button>
        </Card>
      </FullPage>
    );
  }
  return <Outlet />;
}