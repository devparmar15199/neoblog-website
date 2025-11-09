// Dashboard.tsx (Updated)
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
// import { useUserDashboardStats } from "@/hooks/useUserDashboardStats";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  LogOut, Settings, Newspaper, PlusCircle, MessageSquare, Zap,
  Heart, Users, PenTool, MessageCircleMore, Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export const Dashboard = () => {
  // Access user, profile, and CRITICALLY, the loading state
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // const { stats, isLoading: isStatsLoading } = useUserDashboardStats();

  // 1. Show loading spinner while the auth state is being determined.
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Redirect UNLESS loading is false AND user is present.
  if (!user && !loading) {
    navigate("/auth", { replace: true });
    return null;
  }

  // NOTE: If the user is present but the profile is still null (e.g., initial fetch failed), 
  // you might want to show an intermediate screen or rely on the logic below 
  // to gracefully handle the missing profile data.

  const displayName = profile?.display_name || profile?.username || "Blogger";
  const username = profile?.username || "user";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  const memberSince = user!.created_at ? new Date(user!.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Sign out failed. Please try again.");
    }
  };

  // The rest of your component rendering logic remains unchanged
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-extrabold tracking-tight">
        Dashboard <span className="text-primary">{displayName}</span>
      </h1>

      {/* 1. Profile Summary and Stats Card */}
      <Card className="shadow-xl">
        <CardHeader className="p-6 border-b">
          <div className="flex items-center gap-6">
            <Avatar className="size-20 border-4 border-primary shadow-lg">
              <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-extrabold">{displayName}</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">
                @{username} | Member Since: {memberSince}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-2">
          <h2 className="text-xl font-semibold mb-4 text-foreground/90">Your Activity Snapshot</h2>

          {/* Activity Snapshot/Stats section here */}
          {/* Note: If you uncomment the stats section, you'll need to handle isStatsLoading */}
          
        </CardContent>

        <CardFooter className="flex justify-end pt-6 border-t p-4">
          <Link to="/profile">
            <Button
              variant="outline"
              icon={Settings}
            >
              Manage Profile & Settings
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* 2 & 3. Quick Actions and Recent Posts Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* 2. Quick Actions Panel (Column 1) */}
        <Card className="md:col-span-1 h-fit shadow-lg">
          <CardHeader className="p-6 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="size-5 text-primary" />
              Immediate Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-6">
            <Link to="/posts/create">
              <Button className="w-full h-12 justify-start font-semibold shadow-md" icon={PlusCircle}>
                Start New Post
              </Button>
            </Link>
            <Link to="/posts/drafts">
              <Button variant="outline" className="w-full h-12 justify-start" icon={Newspaper}>
                Review Drafts (0)
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="outline" className="w-full h-12 justify-start" icon={MessageSquare}>
                Notifications (0)
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 3. My Recent Posts Panel (Column 2 & 3) */}
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
            <CardTitle className="text-xl">Your Latest Content</CardTitle>
            <Link to="/posts/manage">
              <Button variant="secondary" size="sm">Manage All Posts</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            {/* Placeholder for a list of recent user posts (Enhanced Styling) */}
            <ul className="space-y-3">
              {/* Example Post 1 */}
              <Link to="/posts/123">
                <li className="flex justify-between items-center p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold truncate">The Future of React Hooks: Beyond useEffect</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Published 2 days ago</p>
                  </div>
                  <MessageSquare className="size-4 text-primary/80 shrink-0 ml-4" />
                </li>
              </Link>

              {/* Example Post 2 */}
              <Link to="/posts/drafts/456">
                <li className="flex justify-between items-center p-3 border border-dashed rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold truncate text-muted-foreground">Styling with CVA and Tailwind: A Deep Dive (Draft)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Last edited 4 hours ago</p>
                  </div>
                  <Newspaper className="size-4 text-amber-500/80 shrink-0 ml-4" />
                </li>
              </Link>
            </ul>
          </CardContent>
          <CardFooter className="justify-end pt-6 border-t p-4">
            <Button onClick={handleSignOut} variant="destructive" icon={LogOut}>
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};