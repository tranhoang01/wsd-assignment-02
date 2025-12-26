import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { User } from "firebase/auth";
import { listenAuth } from "../firebase/auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = listenAuth((u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  // ✅ while checking auth state
  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0b10", color: "white", display: "grid", placeItems: "center" }}>
        Checking login...
      </div>
    );
  }

  // ✅ not logged in -> go signin
  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
