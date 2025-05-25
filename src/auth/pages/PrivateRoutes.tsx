import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}
