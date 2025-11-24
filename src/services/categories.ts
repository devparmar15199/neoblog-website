import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

// Payload helper: Description is optional in the form, but nullable in DB
export type CreateCategoryPayload = {
    name: string;
    slug: string;
    description?: string | null;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true }); // Added alphabetical sorting

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

// --- ADMIN ONLY (Protected by RLS) ---

// Create a new category
export const createCategory = async (category: CreateCategoryPayload): Promise<Category> => {
    const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

    if (error) throw error;
    return data as Category;
};

// Update a category
export const updateCategory = async (id: number, updates: UpdateCategoryPayload): Promise<Category> => {
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
export const deleteCategory = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
};