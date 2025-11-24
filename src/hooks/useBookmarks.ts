import { useState, useEffect } from "react";
import { getBookmarkedPosts } from "@/services/bookmarks";
import type { PostListItem } from "@/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;
    
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const data = await getBookmarkedPosts(userId);
        setBookmarks(data);
      } catch (error) {
        console.error("Failed to load bookmarks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [userId]);

  return { bookmarks, loading };
};