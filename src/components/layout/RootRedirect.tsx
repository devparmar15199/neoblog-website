import { Navigate } from "react-router-dom";
import type { RootState } from "@/store";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Home } from "@/pages/Home";
import { useSelector } from "react-redux";

export const RootRedirect = () => {
    // Get necessary states from Redux
    const { user, profile, loading } = useSelector((state: RootState) => state.auth);

    // Show loading spinner while authentication state is being determined
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Redirect based on authentication status
    if (user) {
        if (profile?.role === 'admin') {
            // Authenticated admin users are directed to the admin dashboard
            return <Navigate to="/admin" replace />;
        } else {
            // Authenticated regular users are directed to the posts page
            return <Navigate to="/posts" replace />;
        }
    }

    // Unauthenticated users are directed to the home page
    return <Home />;
};