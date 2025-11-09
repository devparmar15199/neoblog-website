import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '@/store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminRoute = () => {
    const { profile, loading: authLoading } = useSelector((state: RootState) => state.auth);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!profile) {
        // Not logged in at all
        toast.error("Please sign in.");
        return <Navigate to="/auth" replace />;
    }
    
    if (profile.role !== 'admin') {
        // Logged in, but not an admin
        toast.error("You are not authorized to view this page.");
        return <Navigate to="/dashboard" replace />;
    }

    // Logged in and IS an admin
    return <Outlet />;
};