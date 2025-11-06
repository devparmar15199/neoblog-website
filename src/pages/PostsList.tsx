import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/store";
import { usePosts } from "@/hooks/usePosts";
// import { useCategories } from '@/hooks/useCategories';

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/Label";

interface PostCardProps {
  post: {
    id: string;
    author: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    created_at: string;
    cover_image?: string;
    tags?: { name: string }[] | null;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
    {/* Image Preview */}
    {post.cover_image && (
      <Link to={`/posts/${post.slug}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </Link>
    )}
    <CardHeader className="p-4 grow">
      <CardTitle className="text-xl line-clamp-2">
        <Link to={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
          {post.title}
        </Link>
      </CardTitle>
      <CardDescription className="line-clamp-3">
        {post.excerpt}
      </CardDescription>
    </CardHeader>
    <CardContent className="px-4 pb-2">
      <p className="text-sm text-muted-foreground">
        By {post.profiles?.username || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
      </p>
    </CardContent>
    <CardFooter className="px-4 pt-0 pb-3">
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.name}
              className="bg-accent text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </CardFooter>
  </Card>
);

export const PostsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State to hold selected filters values
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedTagId, setSelectedTagId] = useState<string>("");

  const { user } = useSelector((state: RootState) => state.auth);
  const { posts, loading, error, totalPages } = useSelector((state: RootState) => state.posts);
  // const { categories } = useCategories();

  // Use derived number values for hook call
  const categoryId = selectedCategoryId ? parseInt(selectedCategoryId) : undefined;
  const tagId = selectedTagId ? parseInt(selectedTagId) : undefined;

  // Trigger fetch via hook whenever filters or page change
  usePosts(page, 10, search, categoryId, tagId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Latest <span className="text-primary">Posts</span>
        </h1>
        {user && (
          <Link to="/posts/create">
            <Button icon={Plus}>Create Post</Button>
          </Link>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="md:col-span-2 lg:col-span-3 flex gap-3">
          <Input
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow h-12"
          />
          <Button type="submit" icon={Search} className="h-12">
            Search
          </Button>
        </form>

        {/* Category Filter */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm">Category</Label>
          <Select onValueChange={setSelectedCategoryId} value={selectedCategoryId}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Categories</SelectItem>
              <SelectItem value="1">React</SelectItem>
              <SelectItem value="2">Supabase</SelectItem>
              {/* Assuming categories structure: [{id: 1, name: 'Tech'}] */}
              {/* {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))} */}
            </SelectContent>
          </Select>
        </div>

        {/* Tag Filter (Placeholder logic, assuming tags are fetched elsewhere) */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm">Tag</Label>
          <Select onValueChange={setSelectedTagId} value={selectedTagId} disabled>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Tags</SelectItem>
              <SelectItem value="1">React</SelectItem>
              <SelectItem value="2">Supabase</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Posts List or Feedback */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-destructive text-center p-12">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground text-center p-12">No posts found matching your criteria. Try widening your search!</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            icon={ArrowLeft}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            icon={ArrowRight}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
