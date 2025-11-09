import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
    setCategories,
    addCategory as addCategoryAction,
    updateCategory as updateCategoryAction,
    deleteCategory as deleteCategoryAction,
    setLoading,
    setError
} from "@/store/slices/categoriesSlice";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug,
} from "@/services/categories";
import type { Category } from "@/types";
import toast from "react-hot-toast";

export const useCategories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state: RootState) => state.categories);

    // Fetch categories only if not already loaded
    useEffect(() => {
        if (categories.length > 0) return;

        dispatch(setLoading(true));
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                dispatch(setCategories(data));
            } catch (error: any) {
                const message = error.message || 'Failed to fetch categories';
                dispatch(setError(message));
                toast.error(message);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchCategories();
    }, [dispatch, categories.length]);

    const handleCreateCategory = useCallback(async (newCategory: Omit<Category, 'id'>): Promise<Category> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            const createdCategory = await createCategory(newCategory);
            dispatch(addCategoryAction(createdCategory));
            toast.success(`Category "${createdCategory.name}" created!`);
            return createdCategory;
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to create category (Admin access required?)';
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateCategory = useCallback(async (id: number, updates: Partial<Omit<Category, 'id'>>): Promise<Category> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            const updatedCategory = await updateCategory(id, updates);
            dispatch(updateCategoryAction(updatedCategory));
            toast.success(`Category "${updatedCategory.name}" updated!`);
            return updatedCategory;
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to update category (Admin access required?)';
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteCategory = useCallback(async (id: number): Promise<void> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            await deleteCategory(id);
            dispatch(deleteCategoryAction(id));
            toast.success(`Category deleted successfully!`);
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to delete category (Admin access required?)';
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetCategoryBySlug = useCallback(async (slug: string): Promise<Category> => {
        try {
            const category = await getCategoryBySlug(slug);
            return category;
        } catch (error: any) {
            const message = error.message || `Category with slug "${slug}" not found`;
            toast.error(message);
            throw error;
        }
    }, []);

    return {
        categories,
        loading,
        error,
        createCategory: handleCreateCategory,
        updateCategory: handleUpdateCategory,
        deleteCategory: handleDeleteCategory,
        getCategoryBySlug: handleGetCategoryBySlug,
    };
};