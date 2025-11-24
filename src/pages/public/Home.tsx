import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { PostCard } from "@/components/posts/PostCard";
import { PostCardSkeleton } from "@/components/posts/PostCardSkeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Filter, X } from "lucide-react";

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");

  // Redux state
  const { user } = useSelector((state: RootState) => state.auth);
  const { categories } = useCategories();

  // URL Params state
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") ? parseInt(searchParams.get("category")!) : undefined;
  const tagId = searchParams.get("tag") ? parseInt(searchParams.get("tag")!) : undefined;

  // Data fetching
  const { posts, loading, totalPages } = usePosts(page, 9, search, categoryId, tagId);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (localSearch) prev.set("search", localSearch);
      else prev.delete("search");
      prev.set("page", "1"); // Reset to page 1
      return prev;
    });
  };

  const handleCategoryClick = (id?: number) => {
    setSearchParams(prev => {
      if (id) prev.set("category", id.toString());
      else prev.delete("category");
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const clearAllFilters = () => {
    setLocalSearch("");
    setSearchParams({});
  };

  const isFiltering = !!search || !!categoryId || !!tagId;

  return (
    <div className="space-y-8 pb-10">
      {/* Header / Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Explore <span className="text-primary">Stories</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover the latest thoughts, ideas, and trends.
          </p>
        </div>
        {user && (
          <Link to="/create-post">
            <Button size="lg" className="gap-2 shadow-md">
              <Plus className="size-5" /> Write Story
            </Button>
          </Link>
        )}
      </section>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-muted/30 p-4 rounded-xl">
        {/* Category Quick Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!categoryId ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick()}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryId === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(cat.id)}
              className="rounded-full"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex w-full lg:w-auto gap-2">
          <div className="relative grow lg:grow-0">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-9 w-full lg:w-64 bg-background"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      {/* Results Info */}
      {isFiltering && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="size-4" />
          <span>
            Showing results for:
            {search && <strong className="text-foreground ml-1">"{search}"</strong>}
            {categoryId && <strong className="text-foreground ml-1">Category: {categories.find(c => c.id === categoryId)?.name}</strong>}
            {tagId && <strong className="text-foreground ml-1">Tag ID: {tagId}</strong>}
          </span>
          <Button variant="ghost" size="sm" className="h-auto p-0 ml-2 text-destructive hover:text-destructive" onClick={clearAllFilters}>
            <X className="size-3 mr-1" /> Clear
          </Button>
        </div>
      )}

      {/* Main Grid */}
      <section>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-lg border border-dashed">
            <div className="bg-muted rounded-full p-4 mb-4">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No stories found</h3>
            <p className="text-muted-foreground mt-1 max-w-md text-center">
              We couldn't find any posts matching your criteria. Try adjusting your search or filters.
            </p>
            <Button variant="outline" className="mt-6" onClick={clearAllFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-8">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center px-4 text-sm font-medium bg-muted rounded-md">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
