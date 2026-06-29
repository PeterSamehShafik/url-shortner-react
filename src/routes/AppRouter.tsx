import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "@/pages/NotFound";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <div>Auth</div>
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/:id/analytics"
          element={
            <ProtectedRoute>
              <div>Analytics</div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
