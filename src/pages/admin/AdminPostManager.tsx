import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '@/store';
import { deletePost, getPosts } from '@/services/posts';
import { getCategories } from '@/services/categories';
import { getAllProfiles } from '@/services/users';
import type { PostDetails, Profile, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Edit, Trash2, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import toast from 'react-hot-toast';

export const AdminPostManager = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [authorId, setAuthorId] = useState<string | undefined>(undefined);

  // Filter Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    getCategories().then(setCategories);
    getAllProfiles(1, 50).then(res => setProfiles(res.profiles));
  }, []);

  // const fetchPosts = useMemo(() => async () => {
  //   setLoading(true);
  //   try {
  //     const { posts, totalPages } = await getPosts(
  //       page, 10, search, categoryId, undefined, authorId
  //     );
  //     setPosts(posts);
  //     setTotalPages(totalPages);
  //   } catch (err: any) {
  //     setError(err.message || "Failed to fetch posts");
  //     toast.error(err.message || "Failed to fetch posts");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [page, search, categoryId, authorId, userId]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetchPosts();
  //   }, 300); // Debounce

  //   return () => clearTimeout(timer);
  // }, [fetchPosts]);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      toast.success("Post deleted successfully.");
      // fetchPosts();
    } catch (err: any) {
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Post Management</h2>
        <div className="flex gap-2">
          <Select onValueChange={(val) => setCategoryId(val === "all" ? undefined : Number(val))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[200px]"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center"><LoadingSpinner /></TableCell></TableRow>
            ) : posts.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No posts found.</TableCell></TableRow>
            ) : (
              posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">{post.slug}</div>
                  </TableCell>
                  <TableCell>{post.profiles?.username || "Unknown"}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/post/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" title="View Public"><ExternalLink className="size-4" /></Button>
                    </Link>
                    <Link to={`/edit-post/${post.id}`}>
                      <Button variant="outline" size="icon" title="Edit"><Edit className="size-4" /></Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon"><Trash2 className="size-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)}>Delete</AlertDialogAction>
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

      {/* Pagination Controls (Similar to UserList) */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ArrowLeft className="size-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}><ArrowRight className="size-4" /></Button>
      </div>
    </div>
  );
};