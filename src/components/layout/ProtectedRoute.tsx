import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


export const ProtectedRoute: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    return user ? (
        <Outlet />
    ) : (
        <Navigate to="/auth" state={{ from: location }} replace />
    );
};
