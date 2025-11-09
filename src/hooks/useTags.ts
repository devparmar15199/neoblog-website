import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
    setTags,
    addTag as addTagAction,
    updateTag as updateTagAction,
    deleteTag as deleteTagAction,
    setLoading,
    setError
} from "@/store/slices/tagsSlice";
import {
    getTags,
    createTag,
    updateTag,
    deleteTag
} from "@/services/tags";
import type { Tag } from "@/types";
import toast from "react-hot-toast";

export const useTags = () => {
    const dispatch = useDispatch();
    const { tags, loading, error } = useSelector((state: RootState) => state.tags);

    // Fetch tags only once
    useEffect(() => {
        // If tags are already loaded, do not fetch again
        if (tags.length > 0) return;

        dispatch(setLoading(true));
        dispatch(setError(null));

        const fetchTags = async () => {
            try {
                const data = await getTags();
                dispatch(setTags(data));
            } catch (error: any) {
                const message = error.message || 'Failed to load tags.';
                dispatch(setError(message));
                toast.error(message);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchTags();
    }, [dispatch, tags.length]);

    // Create a new tag
    const handleCreateTag = useCallback(async (tag: Omit<Tag, 'id' | 'slug'>): Promise<Tag> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            const newTag = await createTag(tag);
            dispatch(addTagAction(newTag));
            toast.success('Tag created successfully.');
            return newTag;
        } catch (error: any) {
            const message = error.message || 'Failed to create tag (Admin access required?)';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Update a tag
    const handleUpdateTag = useCallback(async (id: number, name: string): Promise<Tag> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            const updatedTag = await updateTag(id, name);
            dispatch(updateTagAction(updatedTag));
            toast.success(`Tag updated to "${updatedTag.name}"`);
            return updatedTag;
        } catch (error: any) {
            const message = error.message || 'Failed to update tag (Admin access required?)';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Delete a tag
    const handleDeleteTag = useCallback(async (id: number): Promise<void> => {
        dispatch(setLoading(true));
        try {
            dispatch(setError(null));
            await deleteTag(id);
            dispatch(deleteTagAction(id));
            toast.success('Tag deleted successfully.');
        } catch (error: any) {
            const message = error.message || 'Failed to delete tag (Admin access required?)';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return {
        tags,
        loading,
        error,
        createTag: handleCreateTag,
        updateTag: handleUpdateTag,
        deleteTag: handleDeleteTag,
    };
};