import { useState, useEffect, useCallback } from "react";
import type { Profile } from "@/types";
import { getProfileByUsername, getPostsByAuthorUsername } from "@/services/profile";
import toast from "react-hot-toast";

export type AuthorPostItem = {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    created_at: string;
    like_count: number;
    comment_count: number;
};

export const useProfile = (username: string) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<AuthorPostItem[]>([]);
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
            const profileData = await getProfileByUsername(username);
            if (!profileData) {
                throw new Error("Profile not found.");
            }
            const postsData = await getPostsByAuthorUsername(username);

            setProfile(profileData);
            setPosts(postsData);
        } catch (error: any) {
            const message = error.message || 'Failed to load profile';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchProfileData();
    }, [username]);

    return {
        profile,
        posts,
        loading,
        error,
        refetch: fetchProfileData,
    };
};