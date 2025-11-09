import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/Card";
import { CategoryBadge } from "./CategoryBadge";
import { TagBadge } from "./TagBadge";
import { LikeButton } from "./LikeButton";
import type { PostListItem } from "@/types";

interface PostCardProps {
    post: PostListItem;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group">

        {/* Image Preview */}
        {post.cover_image && (
            <Link to={`/posts/${post.slug}`}>
                <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        loading="lazy"
                    />
                </div>
            </Link>
        )}
        <CardHeader className="p-4 grow">
            <div className="flex justify-between items-start mb-2">
                {/* Category Badge integration */}
                {post.categories?.name && (
                    <CategoryBadge name={post.categories.name} />
                )}
            </div>

            <CardTitle className="text-xl font-bold line-clamp-2">
                <Link to={`/posts/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                </Link>
            </CardTitle>
            <CardDescription className="line-clamp-3 mt-1 text-base">
                {post.excerpt}
            </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-2">
            <p className="text-sm text-muted-foreground">
                By <span className="font-medium text-foreground/80">{post.author?.username || 'Unknown'}</span> • {new Date(post.created_at).toLocaleDateString()}
            </p>
        </CardContent>

        <CardFooter className="px-4 pt-0 pb-4 flex justify-between items-center">
            {/* Tag Badges integration */}
            {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tagObj) => (
                        <TagBadge key={tagObj.tags.slug} name={tagObj.tags.name} />
                    ))}
                </div>
            ) : (
                <div />
            )}

            {/* Like Button integration */}
            <LikeButton />
        </CardFooter>
    </Card>
);