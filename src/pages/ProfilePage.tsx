import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProfile, type AuthorPostItem } from "@/hooks/useProfile";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Calendar, PenTool } from "lucide-react";

const PostItem: React.FC<{ post: AuthorPostItem }> = ({ post }) => (
    <Link to={`/posts/${post.slug}`}>
        <div className="block p-4 border rounded-lg hover:bg-accent transition-colors">
            <p className="font-semibold text-lg">{post.title}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="size-4" />
                {new Date(post.created_at).toLocaleDateString()}
                <span className="mx-1">•</span>
                <span>{post.like_count} Likes</span>
                <span className="mx-1">•</span>
                <span>{post.comment_count} Comments</span>
            </p>
        </div>
    </Link>
);


export const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { profile, posts, loading, error } = useProfile(username || "");

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="text-center py-20">
                <p className="text-2xl font-bold text-destructive">{error || 'Profile not found.'}</p>
                <Link to="/">
                    <Button variant="link" className="mt-4">Go Home</Button>
                </Link>
            </div>
        );
    }

    const displayName = profile.display_name || profile.username;
    const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-8">
            {/* Profile Header Card */}
            <Card className="shadow-lg">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="size-24 md:size-32 border-4 border-primary">
                        <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
                        <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold">{displayName}</h1>
                        <p className="text-lg text-muted-foreground mt-1">@{profile.username}</p>
                        <p className="text-md mt-4 max-w-prose">{profile.bio || 'No bio provided.'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <PenTool className="size-5 text-primary" />
                        Posts by {displayName}
                    </CardTitle>
                    <CardDescription>
                        All published articles from this author.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map(post => <PostItem key={post.id} post={post} />)
                    ) : (
                        <p className="text-muted-foreground text-center py-8">
                            This user hasn't published any posts yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
