import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const PublicOnlyRoute = () => {
  const { user, profile } = useSelector((state: RootState) => state.auth);

  // If user is logged in, redirect them based on their role
  if (user && profile) {
    if (profile.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, allow access to the route (e.g., Login/Register)
  return <Outlet />;
};