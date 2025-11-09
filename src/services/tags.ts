import { supabase } from "@/lib/supabase";
import type { Tag } from "@/types";

// Get all tags
export const getTags = async (): Promise<Tag[]> => {
    const { data, error } = await supabase
        .from('tags')
        .select('*');
    if (error) throw error;
    return data as Tag[];
};

// --- ADMIN ONLY ---
// Create a new tag
export const createTag = async (tag: Omit<Tag, 'id' | 'slug'>): Promise<Tag> => {
    const slug = tag.name.toLowerCase().replace(/ /g, '-');
    const { data, error } = await supabase
        .from('tags')
        .insert({ ...tag, slug })
        .select()
        .single();
    if (error) throw error;
    return data as Tag;
};

// Update a tag
export const updateTag = async (id: number, name: string): Promise<Tag> => {
    const slug = name.toLowerCase().replace(/ /g, '-');
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
export const deleteTag = async (id: number) => {
    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
    if (error) throw error;
}; 