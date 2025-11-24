import { useState, useEffect, useCallback } from "react";
import type { Profile, PostListItem } from "@/types";
import { getProfileByUsername, getPostsByAuthorUsername } from "@/services/profile";
import toast from "react-hot-toast";

export const useProfile = (username: string) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<PostListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfileData = useCallback(async () => {
        if (!username) {
            setProfile(null);
            setPosts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Fetch Profile
            const profileData = await getProfileByUsername(username);
            if (!profileData) {
                throw new Error("Profile not found.");
            }
            setProfile(profileData);

            // 2. Fetch Author's Posts
            const postsData = await getPostsByAuthorUsername(username);
            setPosts(postsData);
        } catch (error: any) {
            const message = error.message || 'Failed to load profile';
            setError(message);
            // Only toast if it's not a 404/PGRST116 (which is expected for bad URLs)
            if (error.code !== 'PGRST116') {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    return {
        profile,
        posts,
        loading,
        error,
        refetch: fetchProfileData,
    };
};