import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { CategoryBadge } from "./CategoryBadge";
import { TagBadge } from "./TagBadge";
import type { PostListItem } from "@/types";

interface PostCardProps {
    post: PostListItem;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const authorInitials = (post.profiles.display_name || post.profiles.username || "U")
        .substring(0, 2)
        .toUpperCase();

    return (
        <Link to={`/posts/${post.slug}`} className="block h-full group">
            <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-border/60 hover:border-primary/50">

                {/* Cover Image */}
                {post.cover_image && (
                    <div className="w-full h-48 overflow-hidden bg-muted relative">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        {post.categories && (
                            <div className="absolute top-3 left-3">
                                <CategoryBadge category={post.categories} className="bg-background/80 backdrop-blur-sm shadow-sm" />
                            </div>
                        )}
                    </div>
                )}

                <CardHeader className="p-5 pb-2 space-y-3">
                    {/* Meta Header (Author & Date) */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 group/author" onClick={(e) => e.stopPropagation()}>
                            <Link to={`/profile/${post.profiles.username}`} className="flex items-center gap-2">
                                <Avatar className="size-6 border border-border">
                                    <AvatarImage src={post.profiles.avatar_url || undefined} />
                                    <AvatarFallback className="text-[10px]">{authorInitials}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-muted-foreground group-hover/author:text-foreground transition-colors">
                                    {post.profiles.display_name || post.profiles.username}
                                </span>
                            </Link>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </CardHeader>

                <CardContent className="p-5 pt-0 grow space-y-3">
                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {post.excerpt || "Read more to find out..."}
                    </p>

                    {/* Tags */}
                    {post.post_tags && post.post_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {post.post_tags.slice(0, 3).map((pt: any) => (
                               pt.tags && <TagBadge key={pt.tags.id} tag={pt.tags} />
                            ))}
                            {post.post_tags.length > 3 && (
                                <span className="text-xs text-muted-foreground self-center">+{post.post_tags.length - 3}</span>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Footer Actions (Static for Card view) */}
                <CardFooter className="p-4 border-t bg-muted/10 flex justify-between items-center text-muted-foreground text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Heart className={`size-4 ${post.user_has_liked ? "fill-red-500 text-red-500" : ""}`} />
                            <span className="font-medium">{post.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MessageSquare className="size-4" />
                            <span className="font-medium">{post.comment_count}</span>
                        </div>
                    </div>

                    <span className="text-xs font-medium text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                        Read Article →
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
};