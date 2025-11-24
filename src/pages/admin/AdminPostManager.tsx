import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, deletePost } from '@/services/posts';
import { getCategories } from '@/services/categories';
import { getAllProfiles } from '@/services/users';
import type { PostDetails, Category, Profile } from '@/types';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Edit, Trash2, ArrowLeft, ArrowRight, ExternalLink, FileText } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import toast from 'react-hot-toast';

export const AdminPostManager = () => {
  // Data State
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter State
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>("all");
  const [authorId, setAuthorId] = useState<string>("all");

  // Options Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Profile[]>([]);

  // 1. Load Filter Options (Categories & Authors) on Mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [catsData, usersData] = await Promise.all([
          getCategories(),
          getAllProfiles(1, 100) // Fetch top 100 users for the filter dropdown
        ]);
        setCategories(catsData);
        setAuthors(usersData.profiles);
      } catch (error) {
        toast.error("Failed to load filter options.");
      }
    };
    loadOptions();
  }, []);

  // 2. Fetch Posts (Debounced)
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Convert "all" to undefined for the service
      const catFilter = categoryId !== "all" ? parseInt(categoryId) : undefined;
      const authFilter = authorId !== "all" ? authorId : undefined;

      const { posts: data, totalPages: total } = await getAllPosts(
        page,
        ITEMS_PER_PAGE,
        search,
        catFilter,
        undefined, // tagId
        authFilter
      );

      setPosts(data);
      setTotalPages(total);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId, authorId]);

  // Trigger fetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300); // 300ms debounce for search
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  // 3. Handlers
  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      toast.success("Post permanently deleted.");
      fetchPosts(); // Refresh list
    } catch (err: any) {
      toast.error("Failed to delete post.");
    }
  };

  // Reset page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryId(val);
    setPage(1);
  };

  const handleAuthorChange = (val: string) => {
    setAuthorId(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">All Posts ({posts.length})</h2>
          <Link to="/create-post">
            <Button size="sm">Create New</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Author Filter */}
          <Select value={authorId} onValueChange={handleAuthorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.username}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="size-8 opacity-20" />
                    <p>No posts found matching your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[300px]" title={post.title}>
                        {post.title}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                        /{post.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{post.profiles?.username || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.categories ? (
                      <Badge variant="outline" className="font-normal">
                        {post.categories.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/posts/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View Live">
                          <ExternalLink className="size-4 text-muted-foreground" />
                        </Button>
                      </Link>
                      <Link to={`/edit-post/${post.id}`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="size-4 text-blue-600" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete">
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the post
                              <strong> "{post.title}"</strong> and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          <ArrowLeft className="size-4 mr-2" /> Previous
        </Button>
        <span className="text-sm font-medium px-2">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};