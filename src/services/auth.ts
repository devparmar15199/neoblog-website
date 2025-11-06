import type { Profile } from "@/store/slices/authSlice";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

// Sign up
export const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username },
        },
    });
    if (error) throw error || new Error("Signup failed");
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

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Get extended profile
export const getExtendedProfile = async (userId: string) => {
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
    updates: { display_name?: string; bio?: string; avatar_url?: string }
) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

// Upload avatar
export const uploadAvatar = async (userId: string, avatarFile: File) => {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
            upsert: false,
            cacheControl: '3600',
        });

    if (uploadError) throw uploadError;

    // Get the public URL for the file
    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // Update the profile with the new avatar URL
    await updateProfile(userId, { avatar_url: data.publicUrl });

    return data.publicUrl;
};

// Update password 
export const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
};