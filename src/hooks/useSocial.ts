import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setFollowers, setFollowing, setLoading, setError } from "@/store/slices/socialSlice";
import { followUser, unfollowUser, getFollowers, getFollowing, isFollowingUser } from "@/services/social";
import toast from "react-hot-toast";

export const useSocial = () => {
  const dispatch = useDispatch();
  const { followers, following, loading } = useSelector((state: RootState) => state.social);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const fetchConnections = useCallback(async (userId: string) => {
    dispatch(setLoading(true));
    try {
      const [followersData, followingData] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId)
      ]);
      dispatch(setFollowers(followersData));
      dispatch(setFollowing(followingData));
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleFollow = useCallback(async (targetUserId: string) => {
    if (!currentUserId) return toast.error("Please login to follow.");
    try {
      await followUser(currentUserId, targetUserId);
      toast.success("Followed successfully");
      // Optionally refetch or optimistically update
    } catch (err: any) {
      toast.error("Failed to follow");
    }
  }, [currentUserId]);

  const handleUnfollow = useCallback(async (targetUserId: string) => {
    if (!currentUserId) return;
    try {
      await unfollowUser(currentUserId, targetUserId);
      toast.success("Unfollowed");
    } catch (err: any) {
      toast.error("Failed to unfollow");
    }
  }, [currentUserId]);

  const checkIsFollowing = useCallback(async (targetUserId: string) => {
    if (!currentUserId) return false;
    return await isFollowingUser(currentUserId, targetUserId);
  }, [currentUserId]);

  return {
    followers,
    following,
    loading,
    fetchConnections,
    follow: handleFollow,
    unfollow: handleUnfollow,
    checkIsFollowing
  };
};