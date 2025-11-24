import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setUser, setProfile, setError, setLoading } from "../store/slices/authSlice";
import { supabase } from "../lib/supabase";
import {
    getCurrentUser,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getExtendedProfile,
    uploadAvatar,
    updatePassword,
    resetPasswordRequest,
} from "../services/auth";
import type { Profile } from "@/types";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, profile, loading, error } = useSelector((state: RootState) => state.auth);

    // Utility: Fetch and set extended profile
    const fetchAndSetProfile = useCallback(async (userId: string | null) => {
        if (!userId) {
            dispatch(setProfile(null));
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

    // Initialization Effect
    useEffect(() => {
        const initializeAuth = async () => {
            dispatch(setLoading(true));
            try {
                // 1. Get current session
                const currentUser = await getCurrentUser();
                dispatch(setUser(currentUser));

                // 2. If user exists, fetch profile
                if (currentUser) {
                    await fetchAndSetProfile(currentUser.id);
                }
            } catch (error: any) {
                dispatch(setError(error.message || 'Failed to initialize user'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        initializeAuth();

        // Supabase Auth Listener
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            dispatch(setUser(newUser));

            if (newUser) {
                // If we just logged in, fetch the profile.
                // Note: We don't trigger global loading here to avoid UI flicker/redirect loops.
                fetchAndSetProfile(newUser.id);
            } else {
                dispatch(setProfile(null));
            }
        });

        return () => authListener.subscription.unsubscribe();
    }, [dispatch, fetchAndSetProfile]);

    // --- Action Handlers ---

    const handleSignIn = async (email: string, password: string) => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            const result = await signIn(email, password);
            return result;
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign in failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSignUp = async (email: string, password: string, username: string) => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            const result = await signUp(email, password, username);
            return result;
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign up failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            await signOut();
            // State clearing is handled by the onAuthStateChange listener
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign out failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateProfile = async (
        userId: string,
        updates: Partial<Pick<Profile, 'display_name' | 'bio' | 'avatar_url' | 'username'>>
    ): Promise<Profile> => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            const updatedProfile = await updateProfile(userId, updates);
            dispatch(setProfile(updatedProfile));
            return updatedProfile;
        } catch (error: any) {
            dispatch(setError(error.message || 'Profile update failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUploadAvatar = async (userId: string, avatarFile: File): Promise<string> => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            const publicUrl = await uploadAvatar(userId, avatarFile);
            // Profile is auto-updated in the service, but we refresh local state here
            await fetchAndSetProfile(userId);
            return publicUrl;
        } catch (error: any) {
            dispatch(setError(error.message || 'Avatar upload failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdatePassword = async (newPassword: string) => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            await updatePassword(newPassword);
        } catch (error: any) {
            dispatch(setError(error.message || 'Password update failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleResetPasswordRequest = async (email: string) => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            await resetPasswordRequest(email);
        } catch (error: any) {
            dispatch(setError(error.message || 'Password reset request failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        profile,
        loading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateProfile: handleUpdateProfile,
        uploadAvatar: handleUploadAvatar,
        updatePassword: handleUpdatePassword,
        resetPasswordRequest: handleResetPasswordRequest,
    };
};