import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '@/store';
import { getAllPosts } from '@/services/posts'; // Admin service
import { deletePost } from '@/services/posts';
import { getCategories } from '@/services/categories';
import { getAllProfiles } from '@/services/users';
import type { PostDetails, Profile, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Edit, Trash2, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import toast from 'react-hot-toast';

export const AdminPostManager = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [authorId, setAuthorId] = useState<string | undefined>(undefined);

  // Data for filters
  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // Fetch data for filters
  useEffect(() => {
    getCategories().then(setCategories).catch(() => toast.error("Failed to load categories"));
    getAllProfiles(1, 100).then(data => setProfiles(data.profiles)).catch(() => toast.error("Failed to load users"));
  }, []);

  // Fetch posts based on filters
  const fetchPosts = useMemo(() => async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts, totalPages } = await getAllPosts(
        page, 10, search, categoryId, undefined, authorId, userId
      );
      setPosts(posts);
      setTotalPages(totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts");
      toast.error(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId, authorId, userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      toast.success("Post deleted successfully.");
      fetchPosts(); // Refetch
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-1"
        />
        <Select onValueChange={(val) => setCategoryId(val ? Number(val) : undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(val) => setAuthorId(val || undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Authors</SelectItem>
            {profiles.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.username}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive h-24">
                  {error}
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author?.username || 'N/A'}</TableCell>
                  <TableCell>{post.categories?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Link to={`/posts/edit/${post.id}`}>
                      <Button variant="outline" size="icon" aria-label="Edit">
                        <Edit className="size-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" aria-label="Delete">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the post "{post.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4">
        <Button variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          <ArrowLeft className="size-4 mr-2" /> Previous
        </Button>
        <span className="text-sm font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
          Next <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};