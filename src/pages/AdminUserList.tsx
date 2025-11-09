import React, { useState, useEffect, useMemo } from 'react';
import type { Profile } from '@/types';
import { getAllProfiles, updateUserRole, deleteUser } from '@/services/users';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import toast from 'react-hot-toast';

export const AdminUserList = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchProfiles = useMemo(() => async () => {
        setLoading(true);
        setError(null);
        try {
            const { profiles, totalPages } = await getAllProfiles(page, 10, search);
            setProfiles(profiles);
            setTotalPages(totalPages);
        } catch (err: any) {
            setError(err.message || "Failed to fetch users");
            toast.error(err.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        try {
            await updateUserRole(userId, newRole);
            toast.success("User role updated.");
            fetchProfiles(); // Refetch
        } catch (err: any) {
            toast.error(err.message || "Failed to update role.");
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await deleteUser(userId);
            toast.success("User deleted successfully.");
            fetchProfiles(); // Refetch
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user.");
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <Input
                placeholder="Search by username or display name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Users Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Display Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    <LoadingSpinner />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center text-destructive h-24">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : profiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            profiles.map(profile => (
                                <TableRow key={profile.id}>
                                    <TableCell className="font-medium">@{profile.username}</TableCell>
                                    <TableCell>{profile.display_name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={profile.role}
                                            onValueChange={(value) => handleRoleChange(profile.id, value as 'user' | 'admin')}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" aria-label="Delete User">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete user @{profile.username}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the user and all their associated data (posts, comments, etc.). This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(profile.id)}>
                                                        Delete User
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