import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*');
    if (error) throw error;
    return data as Category[];
};

// Get a single category by its slug
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error) throw error;
    return data as Category;
};

// --- ADMIN ONLY ---
// These functions will *only* work if RLS policies pass (user is admin)
// Create a new category
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
    const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
    if (error) throw error;
    return data as Category;
};

// Update a category
export const updateCategory = async (id: number, updates: Partial<Omit<Category, 'id'>>): Promise<Category> => {
    const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as Category;
};

// Delete a category
export const deleteCategory = async (id: number) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
};