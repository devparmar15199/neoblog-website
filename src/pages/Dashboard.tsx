import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, Newspaper, PlusCircle, MessageSquare, Zap } from "lucide-react";
import toast from "react-hot-toast";

export const Dashboard = () => {
  // Access user and profile data from Redux store
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Ensure user is authenticated
  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  const displayName = profile?.display_name || profile?.username || "Blogger";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome back, <span className="text-primary">{displayName}</span>!
      </h1>

      {/* 1. Profile Summary and Stats Card */}
      <Card className="p-4">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border-2 border-primary">
              <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{displayName}</CardTitle>
              <CardDescription>
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-0">
          {/* Dummy Stats for a complete dashboard feel */}
          <div className="text-center p-3 rounded-md bg-muted/50">
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Total Posts</p>
          </div>
          <div className="text-center p-3 rounded-md bg-muted/50">
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-muted-foreground">Total Likes</p>
          </div>
          <div className="text-center p-3 rounded-md bg-muted/50">
            <p className="text-2xl font-bold">17</p>
            <p className="text-sm text-muted-foreground">Comments</p>
          </div>
          <div className="text-center p-3 rounded-md bg-muted/50">
            <p className="text-2xl font-bold">100</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-4">
          <Link to="/profile">
            <Button
              variant="outline"
              icon={Settings}
            >
              Edit Profile
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. Quick Actions Panel */}
        <Card className="md:col-span-1 p-4 pt-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link to="/posts/create">
              <Button className="w-full justify-start" icon={PlusCircle}>
                Write a New Post
              </Button>
            </Link>
            <Link to="/posts/drafts">
              <Button variant="secondary" className="w-full justify-start" icon={Newspaper}>
                Review Drafts (3)
              </Button>
            </Link>
            <Link to="/comments">
              <Button variant="secondary" className="w-full justify-start" icon={MessageSquare}>
                Unread Comments (5)
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 3. My Recent Posts Panel (Placeholder) */}
        <Card className="md:col-span-2 p-4 pt-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>My Recent Posts</CardTitle>
            <Link to="/posts/manage">
              <Button variant="ghost" size="sm">Manage All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a list of recent user posts */}
            <ul className="space-y-3">
              <li className="p-2 border rounded-md hover:bg-accent/50 transition-colors">
                <p className="font-medium truncate">The Future of React Hooks: Beyond useEffect</p>
                <p className="text-xs text-muted-foreground">Published 2 days ago</p>
              </li>
              <li className="p-2 border rounded-md hover:bg-accent/50 transition-colors">
                <p className="font-medium truncate">Styling with CVA and Tailwind: A Deep Dive</p>
                <p className="text-xs text-muted-foreground">Draft - Last edited 4 hours ago</p>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleSignOut} variant="destructive" icon={LogOut}>
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};