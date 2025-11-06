import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUser, setProfile, setError, type Profile } from "../store/slices/authSlice";
import { supabase } from "../lib/supabase";
import {
    getCurrentUser,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getExtendedProfile,
    uploadAvatar,
    updatePassword
} from "../services/auth";

export const useAuth = () => {
    const dispatch = useDispatch();

    // Utility function to fetch and set extended profile
    const fetchAndSetProfile = useCallback(async (userId: string | null) => {
        if (!userId) {
            dispatch(setProfile(null)); // Clear profile on sign out
            return;
        }
        try {
            const profileData = await getExtendedProfile(userId);
            dispatch(setProfile(profileData));
        } catch (error: any) {
            console.error("Failed to fetch profile:", error);
            dispatch(setError(error.message || 'Failed to fetch profile'));
        }
    }, [dispatch]);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                dispatch(setUser(currentUser));
                if (currentUser) {
                    await fetchAndSetProfile(currentUser.id);   // Fetch profile on initial load
                }
            } catch (error: any) {
                dispatch(setError(error.message || 'Failed to initialize user'));
            }
        };
        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            dispatch(setUser(user));
            if (user) {
                fetchAndSetProfile(user.id);    // Fetch profile on sign in
            } else {
                dispatch(setProfile(null)); // Clear profile on sign out
            }
        });

        return () => authListener.subscription.unsubscribe();
    }, [dispatch, fetchAndSetProfile]);

    const handleSignIn = async (email: string, password: string) => {
        try {
            dispatch(setError(null));
            return await signIn(email, password);
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign in failed'));
            throw error;
        }
    };

    const handleSignUp = async (email: string, password: string, username: string) => {
        try {
            dispatch(setError(null));
            return await signUp(email, password, username);
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign up failed'));
            throw error;
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(setError(null));
            return await signOut();
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign out failed'));
            throw error;
        }
    };

    const handleUpdateProfile = async (
        userId: string,
        updates: { display_name?: string; bio?: string; avatar_url?: string }
    ) => {
        try {
            dispatch(setError(null));
            const updatedProfile = await updateProfile(userId, updates);
            // Dispatch the updated profile to the Redux store
            dispatch(setProfile(updatedProfile as Profile));
            return updatedProfile;
        } catch (error: any) {
            dispatch(setError(error.message || 'Profile update failed'));
            throw error;
        }
    };

    const handleUploadAvatar = async (userId: string, avatarFile: File) => {
        try {
            dispatch(setError(null));
            const publicUrl = await uploadAvatar(userId, avatarFile);
            await fetchAndSetProfile(userId);
            return publicUrl;
        } catch (error: any) {
            dispatch(setError(error.message || 'Avatar upload failed'));
            throw error;
        }
    };

    const handleUpdatePassword = async (newPassword: string) => {
        try {
            dispatch(setError(null));
            await updatePassword(newPassword);
        } catch (error: any) {
            dispatch(setError(error.message || 'Password update failed'));
            throw error;
        }
    };

    return {
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateProfile: handleUpdateProfile,
        uploadAvatar: handleUploadAvatar,
        updatePassword: handleUpdatePassword,
    };
};