import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

// Get all profiles (paginated, for admin user management)
export const getAllProfiles = async (
    page = 1,
    limit = 10,
    search = ''
): Promise<{ profiles: Profile[]; totalPages: number }> => {
    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
    if (search) {
        query = query.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    const totalPages = Math.ceil((count || 0) / limit);
    return { profiles: data as Profile[], totalPages };
};

// Update a user's role (admin only)
export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<Profile> => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data as Profile;
};

// Update a user's profile (admin override or self, depending on RLS)
export const updateUserProfile = async (
    userId: string,
    updates: Partial<Omit<Profile, 'id' | 'username' | 'role' | 'created_at'>>
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

// Delete a user (cascades to posts/comments/etc. via FKs)
export const deleteUser = async (userId: string): Promise<void> => {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    if (error) throw error;
};