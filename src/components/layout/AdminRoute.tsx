import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '@/store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminRoute = () => {
    const { profile, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!loading && profile && profile.role !== 'admin') {
            toast.error("Unauthorized: Admin access required.");
        }
    }, [loading, profile]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // 1. Not logged in -> Go to Login
    if (!profile) {
        return <Navigate to="/auth" replace />;
    }

    // 2. Logged in but NOT Admin -> Go to User Dashboard
    if (profile.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Is Admin -> Render Route
    return <Outlet />;
};