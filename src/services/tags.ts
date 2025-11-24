import { supabase } from "@/lib/supabase";
import type { Tag } from "@/types";

// Payload helper
export interface CreateTagPayload {
    name: string;
}

// Helper function to generate slugs
const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')   // Remove special characters
        .replace(/[\s_-]+/g, '-')   // Replace spaces/underscores with hyphens
        .replace(/^-+|-+$/g, '');   // Trim hyphens from start/end
};

// Get all tags
export const getTags = async (): Promise<Tag[]> => {
    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data as Tag[];
};

// --- ADMIN ONLY ---
// Create a new tag
export const createTag = async (payload: CreateTagPayload): Promise<Tag> => {
    const slug = generateSlug(payload.name);

    const { data, error } = await supabase
        .from('tags')
        .insert({ name: payload.name, slug })
        .select()
        .single();

    if (error) throw error;
    return data as Tag;
};

// Update a tag
export const updateTag = async (id: number, name: string): Promise<Tag> => {
    const slug = generateSlug(name);

    const { data, error } = await supabase
        .from('tags')
        .update({ name, slug })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Tag;
};

// Delete a tag
export const deleteTag = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

    if (error) throw error;
}; 