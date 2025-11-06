import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/store";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface ProtectedRouteProps {
    redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath }) => {
    const { user, loading } = useSelector((state: RootState) => state.auth);
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" />
            </div> 
        );
    }

    if (user) {
        return <Outlet />;
    }

    return <Navigate to={redirectPath || "/"} replace />;
}
