import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}
