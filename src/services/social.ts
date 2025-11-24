import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

// Follow a user
export const followUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('followers')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) throw error;
};

// Unfollow a user
export const unfollowUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('followers')
    .delete()
    .match({ follower_id: followerId, following_id: followingId });
    
  if (error) throw error;
};

// Check if User A follows User B
export const isFollowingUser = async (followerId: string, followingId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .match({ follower_id: followerId, following_id: followingId });
    
  if (error) throw error;
  return (count || 0) > 0;
};

// Get list of people a user is following
export const getFollowing = async (userId: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('followers')
    .select(`following_id, profiles!followers_following_id_fkey(*)`) // Join on profiles
    .eq('follower_id', userId);

  if (error) throw error;
  // Map the nested profile data
  return (data || []).map((item: any) => item.profiles) as Profile[];
};

// Get list of people following a user
export const getFollowers = async (userId: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('followers')
    .select(`follower_id, profiles!followers_follower_id_fkey(*)`) // Join on profiles
    .eq('following_id', userId);

  if (error) throw error;
  return (data || []).map((item: any) => item.profiles) as Profile[];
};