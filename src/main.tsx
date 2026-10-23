import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";

// The admin dashboard is loaded only when someone opens /admin,
// so the customer chat stays small and fast.
const AdminApp = lazy(() => import("./admin/AdminApp"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);