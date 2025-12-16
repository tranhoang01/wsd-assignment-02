import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const currentUser = localStorage.getItem("currentUser") || "";
  if (!currentUser) return <Navigate to="/signin" replace />;
  return <Outlet />;
}
