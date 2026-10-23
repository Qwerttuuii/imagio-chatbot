import { Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import RequireAdmin from "./auth/RequireAdmin";
import AdminLayout from "./layout/AdminLayout";
import AnalyticsPage from "./pages/AnalyticsPage";
import ConversationsPage from "./pages/ConversationsPage";
import HandoffsPage from "./pages/HandoffsPage";
import KnowledgePage from "./pages/KnowledgePage";
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
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="handoffs" element={<HandoffsPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}