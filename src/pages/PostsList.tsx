import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/store";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Search, ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { PostCard } from "@/components/posts/PostCard";

export const PostsList = () => {
  const [page, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("0"); // "0" means All
  const [selectedTagId, setSelectedTagId] = useState<string>("0"); // "0" means All

  const { user } = useSelector((state: RootState) => state.auth);
  const { posts, loading, error, totalPages } = useSelector((state: RootState) => state.posts);
  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading } = useTags();

  // Use derived number values for hook call, treat "0" as undefined/null
  const categoryId = useMemo(() => selectedCategoryId !== "0" ? parseInt(selectedCategoryId) : undefined, [selectedCategoryId]);
  const tagId = useMemo(() => selectedTagId !== "0" ? parseInt(selectedTagId) : undefined, [selectedTagId]);

  // Trigger fetch via hook whenever filters or page change
  usePosts(page, 10, activeSearch, categoryId, tagId);  // Fetch 12 posts per page

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
    // setActiveSearch(localSearch);
  }, [selectedCategoryId, selectedTagId]); // Re-added search here for consistent behavior

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeSearch !== localSearch) {
      setActiveSearch(localSearch);
      setPage(1);
    }
    // search state change triggers the useEffect above which resets page to 1
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setPage(1);
  };

  const handleTagChange = (value: string) => {
    setSelectedTagId(value);
    setPage(1);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Explore <span className="text-primary">Content</span>
        </h1>
        {user && (
          <Link to="/posts/create">
            <Button icon={Plus} size="lg">Create Post</Button>
          </Link>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end bg-card p-4 rounded-xl shadow-lg">
        <h2 className="md:col-span-4 lg:col-span-5 text-lg font-semibold flex items-center gap-2">
          <Filter className="size-5 text-primary" /> Filter Posts
        </h2>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="col-span-full md:col-span-2 lg:col-span-3 flex gap-3">
          <Input
            placeholder="Search by title or content..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="grow h-11"
          />
          <Button type="submit" icon={Search} className="h-11">
            Search
          </Button>
        </form>

        {/* Category Filter */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="category-select" className="text-sm font-medium">Category</Label>
          <Select
            onValueChange={handleCategoryChange}
            value={selectedCategoryId}
            disabled={categoriesLoading} // Disable while loading categories
          >
            <SelectTrigger id="category-select" className="h-11">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Categories</SelectItem>
              {/* Use fetched categories */}
              {categories.map(cat => (
                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tag Filter (Still disabled as per original code, using a placeholder) */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="tag-select" className="text-sm font-medium">Tag</Label>
          <Select
            onValueChange={handleTagChange}
            value={selectedTagId}
            disabled={tagsLoading}
          >
            <SelectTrigger id="tag-select" className="h-11">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Tags</SelectItem>
              {/* Map fetched tags */}
              {tags.map(tag => (
                <SelectItem key={tag.id} value={String(tag.id)}>{tag.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Posts List or Feedback */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-destructive text-center p-12 bg-destructive/10 border border-destructive rounded-lg">
          <p className="font-semibold text-lg">Error Loading Posts</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-muted-foreground text-center p-20 bg-accent/20 rounded-lg">
          <p className="font-semibold text-lg">No Results Found</p>
          <p className="mt-2">No posts match your current search or filter criteria. Try widening your search!</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-6 pt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            icon={ArrowLeft}
          >
            Previous
          </Button>
          <span className="text-base font-semibold text-muted-foreground">
            Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
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
