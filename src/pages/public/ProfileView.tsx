import { useParams, Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/posts/PostCard";
import { Calendar } from "lucide-react";

export const ProfileView = () => {
    const { username } = useParams<{ username: string }>();
    const { profile, posts, loading, error } = useProfile(username || "");
    const { user: currentUser } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="text-center py-20 max-w-md mx-auto">
                <div className="bg-destructive/10 text-destructive p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-bold">Profile Not Found</h2>
                    <p>{error || "We couldn't find the user you're looking for."}</p>
                </div>
                <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        );
    }

    const displayName = profile.display_name || profile.username;
    const isOwnProfile = currentUser?.id === profile.id;

    return (
        <div className="space-y-8 pb-10">
            {/* Profile Header Card */}
            <div className="relative">
                {/* Optional Banner Background */}
                <div className="h-48 bg-linear-to-r from-blue-600/20 to-cyan-500/20 rounded-xl w-full absolute top-0 z-0" />

                <div className="relative z-10 px-6 pt-24">
                    <Card className="shadow-lg border-none">
                        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-end gap-6">
                            {/* Avatar */}
                            <div className="-mt-16">
                                <Avatar className="size-32 border-4 border-background shadow-md">
                                    <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
                                    <AvatarFallback className="text-4xl bg-secondary">
                                        {displayName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div>
                                    <h1 className="text-3xl font-extrabold">{displayName}</h1>
                                    <p className="text-muted-foreground font-medium">@{profile.username}</p>
                                </div>

                                {profile.bio && (
                                    <p className="max-w-xl text-foreground/80">{profile.bio}</p>
                                )}

                                {/* Meta Data Row */}
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground pt-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-4" />
                                        Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                    </div>
                                    {/* Placeholders for future features */}
                                    {/* <div className="flex items-center gap-1"><MapPin className="size-4" /> Earth</div> */}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 w-full md:w-auto">
                                {isOwnProfile ? (
                                    <Link to="/settings" className="w-full md:w-auto">
                                        <Button variant="outline" className="w-full">Edit Profile</Button>
                                    </Link>
                                ) : (
                                    <Button className="w-full md:w-auto">Follow</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Content Tabs / Grid */}
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Published Stories ({posts.length})</h2>

                {posts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-lg font-medium text-muted-foreground">
                            {isOwnProfile ? "You haven't published any stories yet." : "This user hasn't published stories yet."}
                        </p>
                        {isOwnProfile && (
                            <Link to="/create-post">
                                <Button variant="link" className="mt-2">Start writing</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
