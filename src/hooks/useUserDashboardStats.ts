import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getAuthorPosts } from "@/services/posts";
import toast from "react-hot-toast";

interface UserStats {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    draftsCount: number;
    followersCount: number;
}

export const useUserDashboardStats = (): { stats: UserStats; isLoading: boolean; error: string | null } => {
    const [stats, setStats] = useState<UserStats>({
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        draftsCount: 0,
        followersCount: 0, // Will be fetched or mocked
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        if (!userId) {
            setStats((prev) => ({ ...prev, followersCount: 0 }));
            setIsLoading(false);
            return;
        }

        const fetchStats = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const posts = await getAuthorPosts(userId);

                const totalPosts = posts.length;
                const draftsCount = posts.filter((p) => !p.published).length;
                const totalLikes = posts.reduce((sum, p) => sum + p.like_count, 0);
                const totalComments = posts.reduce((sum, p) => sum + p.comment_count, 0);

                // Note: followersCount is not available from `getAuthorPosts`
                // You may want to add a separate endpoint like `getFollowersCount(userId)`
                // For now, we'll use a placeholder or fetch from another source
                const followersCount = 125; // Replace with real API call

                setStats({
                    totalPosts,
                    totalLikes,
                    totalComments,
                    draftsCount,
                    followersCount,
                });
            } catch (err: any) {
                const message = err.message || "Failed to load dashboard stats";
                setError(message);
                toast.error(message);
                console.error("useUserDashboardStats error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    return { stats, isLoading, error };
};