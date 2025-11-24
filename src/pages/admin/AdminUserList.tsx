import { useState, useEffect, useMemo } from 'react';
import type { Profile } from '@/types';
import { getAllProfiles, updateUserRole, deleteUser } from '@/services/users';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Trash2, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import toast from 'react-hot-toast';

export const AdminUserList = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchProfiles = useMemo(() => async () => {
        setLoading(true);
        try {
            const { profiles, totalPages } = await getAllProfiles(page, 10, search);
            setProfiles(profiles);
            setTotalPages(totalPages);
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProfiles();
        }, 300); // Debounce search by 300ms

        return () => clearTimeout(timer);
    }, [fetchProfiles]);

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        try {
            await updateUserRole(userId, newRole);
            toast.success("User role updated.");
            // Optimistic update locally
            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
        } catch (err: any) {
            toast.error("Failed to update role.");
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await deleteUser(userId);
            toast.success("User deleted successfully.");
            setProfiles(prev => prev.filter(p => p.id !== userId));
        } catch (err: any) {
            toast.error("Failed to delete user.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center"><LoadingSpinner /></TableCell>
                            </TableRow>
                        ) : profiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No users found.</TableCell>
                            </TableRow>
                        ) : (
                            profiles.map(profile => (
                                <TableRow key={profile.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{profile.display_name || "No Name"}</span>
                                            <span className="text-xs text-muted-foreground">@{profile.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={profile.role}
                                            onValueChange={(val) => handleRoleChange(profile.id, val as 'user' | 'admin')}
                                        >
                                            <SelectTrigger className="w-[100px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently remove @{profile.username} and all their posts.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(profile.id)} className="bg-destructive hover:bg-destructive/90">
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

            <div className="flex justify-end items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                    <ArrowLeft className="size-4 mr-2" /> Previous
                </Button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                    Next <ArrowRight className="size-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};