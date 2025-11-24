import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PostCard } from "@/components/posts/PostCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { PenSquare, Settings, BookMarked, FileText } from "lucide-react";

export const UserDashboard = () => {
  const { user } = useAuth();
  const username = user?.user_metadata?.username || "";

  const { posts: myPosts, loading: profileLoading, refetch } = useProfile(username);
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();

  useEffect(() => {
    if (username) refetch();
  }, [username, refetch]);

  if (profileLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your content and settings.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/settings">
            <Button variant="outline" className="gap-2">
              <Settings className="size-4" /> Settings
            </Button>
          </Link>
          <Link to="/create-post">
            <Button className="gap-2 shadow-md">
              <PenSquare className="size-4" /> Write New Story
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
            <BookMarked className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookmarks.length}</div>
          </CardContent>
        </Card>
        {/* Placeholder for analytics */}
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <span className="text-xs bg-primary/10 text-primary px-1.5 rounded">Coming Soon</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="posts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            My Stories
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Bookmarks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6 min-h-[300px]">
          {myPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myPosts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
              <FileText className="size-10 mb-3 opacity-20" />
              <p>You haven't published any stories yet.</p>
              <Link to="/create-post">
                <Button variant="link" className="mt-2">Start writing now</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-6 min-h-[300px]">
          {bookmarksLoading ? (
            <div className="flex justify-center py-10"><LoadingSpinner /></div>
          ) : bookmarks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
              <BookMarked className="size-10 mb-3 opacity-20" />
              <p>No bookmarks yet.</p>
              <Link to="/">
                <Button variant="link" className="mt-2">Explore stories</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};