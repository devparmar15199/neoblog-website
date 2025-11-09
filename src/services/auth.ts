import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";

// Sign up
export const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // This 'data' is passed to the 'handle_new_user' trigger
            data: { username },
        },
    });
    if (error) throw error;
    return data;
};

// Sign in
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

// Sign out
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Get current user session
export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Get extended profile (for the authenticated user)
export const getExtendedProfile = async (userId: string): Promise<Profile> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data as Profile;
};

// Update profile
export const updateProfile = async (
    userId: string,
    updates: { display_name?: string | null; bio?: string | null; avatar_url?: string | null }
): Promise<Profile> => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data as Profile;
};

// Upload avatar
export const uploadAvatar = async (userId: string, avatarFile: File) => {
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false, // Don't allow overwriting
        });

    if (uploadError) throw uploadError;
    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
    await updateProfile(userId, { avatar_url: data.publicUrl });
    return data.publicUrl;
};

// Request Password Reset
export const resetPasswordRequest = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) throw error;
};

// Update password (for logged-in user)
export const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
};