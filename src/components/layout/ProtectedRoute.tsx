import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/store";
// import { LoadingSpinner } from "../ui/LoadingSpinner";

interface ProtectedRouteProps {
    redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = "/auth" }) => {
    const { user, loading } = useSelector((state: RootState) => state.auth);

    // if (loading) {
    //     return (
    //         <div className="flex h-screen justify-center items-center">
    //             <LoadingSpinner size="lg" />
    //         </div>
    //     );
    // }

    return user ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
