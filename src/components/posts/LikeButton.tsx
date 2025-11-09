import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLikes } from '@/hooks/useLikes';

export const LikeButton: React.FC = () => {
    const { count, isLiked, toggleLike, userId } = useLikes();
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLike}
            disabled={!userId} // Disable if not logged in
            className="group px-2 py-1 h-auto text-sm transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/40"
            aria-label={isLiked ? "Unlike post" : "Like post"}
        >
            <Heart
                className={`size-5 transition-transform duration-200 ${isLiked
                        ? 'fill-red-500 text-red-500 group-hover:scale-110'
                        : 'text-muted-foreground group-hover:text-red-500'
                    }`}
            />
            <span className={`ml-1 font-semibold ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                {count}
            </span>
        </Button>
    );
};