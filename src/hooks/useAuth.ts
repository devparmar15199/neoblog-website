// src/hooks/useAuth.ts:
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
    
    // 1. Utility function to fetch and set extended profile
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
            // Only set error, don't change global loading/initialization state
            dispatch(setError(error.message || 'Failed to fetch profile'));
        }
    }, [dispatch]);

    useEffect(() => {
        // Only set the initial app loading state here
        const initializeAuth = async () => {
            dispatch(setLoading(true));
            try {
                // 1. Get current session state (this is synchronous/fast)
                const currentUser = await getCurrentUser();
                dispatch(setUser(currentUser));

                // 2. If user exists, fetch profile (async)
                if (currentUser) {
                    await fetchAndSetProfile(currentUser.id); 
                }
            } catch (error: any) {
                dispatch(setError(error.message || 'Failed to initialize user'));
            } finally {
                // 3. Critically, set loading to false *only* when the initial check is complete.
                dispatch(setLoading(false));
            }
        };

        initializeAuth();

        // Listener for future auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            
            dispatch(setUser(newUser));

            // On sign in/out, we also need to fetch profile/clear profile, 
            // but we MUST NOT set the global loading state here or it will interfere 
            // with the AuthPage redirect logic, causing the loop.
            if (newUser) {
                fetchAndSetProfile(newUser.id);    
            } else {
                dispatch(setProfile(null));
            }
        });

        return () => authListener.subscription.unsubscribe();
    }, [dispatch, fetchAndSetProfile]);
    
    // --- Handlers (Keep the loading logic for individual actions) ---

    const handleSignIn = async (email: string, password: string) => {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true)); // Loading for this specific sign-in action
            const result = await signIn(email, password);
            return result;
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign in failed'));
            throw error;
        } finally {
            dispatch(setLoading(false)); // Clear loading for this specific action
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
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign out failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateProfile = async (
        userId: string,
        updates: { display_name?: string | null; bio?: string | null; avatar_url?: string | null }
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