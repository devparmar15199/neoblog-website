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
    type CreateCategoryPayload,
    type UpdateCategoryPayload
} from "@/services/categories";
import type { Category } from "@/types";
import toast from "react-hot-toast";

export const useCategories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state: RootState) => state.categories);

    // Fetch categories only if not already loaded (simple caching)
    useEffect(() => {
        if (categories.length > 0) return;

        const fetchCategories = async () => {
            dispatch(setLoading(true));
            try {
                const data = await getCategories();
                dispatch(setCategories(data));
            } catch (error: any) {
                const message = error.message || 'Failed to fetch categories';
                dispatch(setError(message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchCategories();
    }, [dispatch, categories.length]);

    // Admin Action: Create
    const handleCreateCategory = useCallback(async (newCategory: CreateCategoryPayload): Promise<Category> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            const createdCategory = await createCategory(newCategory);
            dispatch(addCategoryAction(createdCategory));
            toast.success(`Category "${createdCategory.name}" created!`);
            return createdCategory;
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to create category';
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Admin Action: Update
    const handleUpdateCategory = useCallback(async (id: number, updates: UpdateCategoryPayload): Promise<Category> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            const updatedCategory = await updateCategory(id, updates);
            dispatch(updateCategoryAction(updatedCategory));
            toast.success(`Category "${updatedCategory.name}" updated!`);
            return updatedCategory;
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to update category';
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Admin Action: Delete
    const handleDeleteCategory = useCallback(async (id: number): Promise<void> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            await deleteCategory(id);
            dispatch(deleteCategoryAction(id));
            toast.success(`Category deleted successfully!`);
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to delete category';
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Public Action: Get Single
    const handleGetCategoryBySlug = useCallback(async (slug: string): Promise<Category> => {
        try {
            const category = await getCategoryBySlug(slug);
            return category;
        } catch (error: any) {
            const message = error.message || `Category not found`;
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