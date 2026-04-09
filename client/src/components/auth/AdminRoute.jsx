import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store";

export default function AdminRoute() {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (!["ADMIN", "SUPER_ADMIN"].includes(user?.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
