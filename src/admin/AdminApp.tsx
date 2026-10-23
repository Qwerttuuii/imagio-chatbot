import { Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import RequireAdmin from "./auth/RequireAdmin";
import AdminLayout from "./layout/AdminLayout";
import ComingSoon from "./pages/ComingSoon";
import LeadsPage from "./pages/LeadsPage";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="conversations" element={<ComingSoon eyebrow="Customer inbox" title="Conversations" />} />
            <Route path="handoffs" element={<ComingSoon eyebrow="Needs a person" title="Human handoffs" />} />
            <Route path="knowledge" element={<ComingSoon eyebrow="What the assistant knows" title="Knowledge base" />} />
            <Route path="analytics" element={<ComingSoon eyebrow="Performance" title="Analytics" />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}