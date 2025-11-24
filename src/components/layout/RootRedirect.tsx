import { Navigate } from "react-router-dom";
import type { RootState } from "@/store";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Home } from "@/pages/public/Home";
import { useSelector } from "react-redux";

export const RootRedirect = () => {
    const { user, profile, loading } = useSelector((state: RootState) => state.auth);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // 1. If Logged In
    if (user && profile) {
        // 1a. Admins go to Admin Dashboard
        if (profile.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }

        // 1b. Regular Users go to User Dashboard (or you can keep them on Home if you prefer)
        return <Navigate to="/dashboard" replace />;
    }

    // 2. If Guest (Not logged in), show the Public Home Page
    return <Home />;
};