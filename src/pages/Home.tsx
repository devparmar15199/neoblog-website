import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Zap, Heart, MessageSquare, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

// Recent Posts component (later)
// import { RecentPosts } from '@/components/posts/RecentPosts';

export const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const features = [
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "See comments and interactions happen live, thanks to Supabase Realtime.",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Like and engage with posts. Find content curated by users, for users.",
    },
    {
      icon: MessageSquare,
      title: "Rich Discussions",
      description: "Dive deep into topics with our structured and moderated comment threads.",
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <section className="text-center py-16 md:py-24 bg-background">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter max-w-4xl mx-auto">
          The <span className="text-primary">Modern Blog</span> for Modern Thinkers
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Share your insights, connect with fellow enthusiasts, and explore a seamless reading experience powered by React, TypeScript, and Supabase.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <Link to="/posts/create">
              <Button size="lg" icon={Zap}>
                Start Writing Now
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="lg" icon={ArrowRight}>
                Join the Community
              </Button>
            </Link>
          )}
          <Link to="/posts">
            <Button variant="outline" size="lg">
              Explore Posts
            </Button>
          </Link>
        </div>
      </section>

      <div className="container mx-auto">
        {/* 2. Features Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 text-left hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="px-0 pt-0">
                  <feature.icon className="size-8 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Recent Posts Preview */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl">Latest Buzz</h2>
            <Link to="/posts">
              <Button variant="link" icon={ArrowRight}>
                View All Posts
              </Button>
            </Link>
          </div>

          {/* TODO: Replace this placeholder with <RecentPosts /> component when ready. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-4 text-center">
              <CardContent className="px-0 pb-0 pt-2">
                <p className="text-muted-foreground">The post feed will load here shortly...</p>
                <div className="h-24 bg-muted/50 rounded-md mt-4 animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="hidden md:block p-4 text-center">
              <CardContent className="px-0 pb-0 pt-2">
                <p className="text-muted-foreground">See what the community is talking about.</p>
                <div className="h-24 bg-muted/50 rounded-md mt-4 animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="hidden lg:block p-4 text-center">
              <CardContent className="px-0 pb-0 pt-2">
                <p className="text-muted-foreground">Filtering options for tags and categories.</p>
                <div className="h-24 bg-muted/50 rounded-md mt-4 animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. Call to Action / Theme Demo */}
        <section className="text-center mb-12 bg-primary/10 dark:bg-primary/20 p-8">
          <h2 className="text-2xl font-bold">Experience the Difference</h2>
          <p className="mt-2 mb-6 text-muted-foreground">Switch themes right here to see our beautiful, consistent design.</p>
          <div className="flex justify-center items-center">
            <ThemeToggle />
          </div>
        </section>
      </div>
    </div>
  );
};
