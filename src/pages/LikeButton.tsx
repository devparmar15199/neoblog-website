import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useLikes } from "@/hooks/useLikes";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    initialIsLiked: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikes, initialIsLiked }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    // State to track local like status and count
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [loading, setLoading] = useState(false);

    const { toggleLike } = useLikes(postId);

    useEffect(() => {
        setIsLiked(initialIsLiked);
        setLikeCount(initialLikes);
    }, [initialIsLiked, initialLikes])

    const handleLike = async () => {
        if (!user) {
            toast.error("Please sign in to like posts.");
            return;
        };

        setLoading(true);

        const newIsLiked = !isLiked;
        const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;

        setIsLiked(newIsLiked);
        setLikeCount(newCount);

        try {
            await toggleLike();
        } catch (error) {
            setIsLiked(!newIsLiked);
            setLikeCount(!newIsLiked ? likeCount + 1 : likeCount - 1);
            toast.error("Failed to update like status. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleLike}
            variant={isLiked ? "default" : "outline"}
            className={`transition-colors ${isLiked ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-accent'}`}
            disabled={loading}
        >
            {loading ? (
                <LoadingSpinner size="sm" />
            ) : (
                <Heart className={`size-4 mr-2 ${isLiked ? 'fill-white' : 'fill-none'}`} />
            )}
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </Button>
    );
};