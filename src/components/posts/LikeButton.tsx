import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLikes } from '@/hooks/useLikes';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
    variant?: "ghost" | "default" | "outline";
    size?: "sm" | "lg" | "default" | "icon";
}

export const LikeButton: React.FC<LikeButtonProps> = ({ variant = "ghost", size = "sm" }) => {
    const { count, isLiked, toggleLike } = useLikes();

    return (
        <Button
            variant={variant}
            size={size}
            onClick={(e) => {
                e.stopPropagation();
                toggleLike();
            }}
            className={cn(
                "gap-2 transition-colors",
                isLiked && "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            )}
        >
            <Heart
                className={cn(
                    "size-4 transition-transform group-active:scale-75",
                    isLiked && "fill-current"
                )}
            />
            <span className="min-w-[1ch] text-left">{count}</span>
        </Button>
    );
};