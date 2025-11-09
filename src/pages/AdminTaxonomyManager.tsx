import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import type { Category, Tag } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { toast } from 'react-hot-toast';

// Reusable Form for creating/editing Categories
const CategoryForm = ({
    category,
    onSave,
    onClose,
}: {
    category?: Category;
    onSave: (name: string, description: string, slug: string) => Promise<void>;
    onClose: () => void;
}) => {
    const [name, setName] = useState(category?.name || '');
    const [description, setDescription] = useState(category?.description || '');
    const [slug, setSlug] = useState(category?.slug || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(name, description, slug);
            onClose();
        } catch (err) {
            // Error is toasted by the hook, no need to toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="cat-name">Name</Label>
                <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="cat-slug">Slug</Label>
                <Input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="cat-desc">Description</Label>
                <Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner size="sm" /> : 'Save'}
                </Button>
            </DialogFooter>
        </form>
    );
};

// Reusable Form for creating/editing Tags
const TagForm = ({
    tag,
    onSave,
    onClose,
}: {
    tag?: Tag;
    onSave: (name: string) => Promise<void>;
    onClose: () => void;
}) => {
    const [name, setName] = useState(tag?.name || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(name);
            onClose();
        } catch (err) {
            // Error is toasted by the hook
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="tag-name">Name</Label>
                <Input id="tag-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner size="sm" /> : 'Save'}
                </Button>
            </DialogFooter>
        </form>
    );
};


export const AdminTaxonomyManager = () => {
    const { categories, createCategory, updateCategory, deleteCategory, loading: categoriesLoading } = useCategories();
    const { tags, createTag, updateTag, deleteTag, loading: tagsLoading } = useTags();

    // State for managing dialogs
    const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
    const [editingTag, setEditingTag] = useState<Tag | undefined>(undefined);

    const handleSaveCategory = async (name: string, description: string, slug: string) => {
        if (editingCategory) {
            await updateCategory(editingCategory.id, { name, description, slug });
        } else {
            await createCategory({ name, description, slug });
        }
    };

    const handleSaveTag = async (name: string) => {
        if (editingTag) {
            await updateTag(editingTag.id, name);
        } else {
            await createTag({ name });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories Column */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Categories</h3>
                    <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" icon={Plus} onClick={() => setEditingCategory(undefined)}>
                                New Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                                category={editingCategory}
                                onSave={handleSaveCategory}
                                onClose={() => setIsCatDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="border rounded-lg h-96 overflow-y-auto">
                    {categoriesLoading && categories.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        categories.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium">{cat.name}</p>
                                    <p className="text-sm text-muted-foreground">{cat.slug}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => { setEditingCategory(cat); setIsCatDialogOpen(true); }}>
                                        <Edit className="size-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete category "{cat.name}"?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteCategory(cat.id)}>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Tags Column */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Tags</h3>
                     <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" icon={Plus} onClick={() => setEditingTag(undefined)}>
                                New Tag
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingTag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
                            </DialogHeader>
                            <TagForm
                                tag={editingTag}
                                onSave={handleSaveTag}
                                onClose={() => setIsTagDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="border rounded-lg h-96 overflow-y-auto">
                     {tagsLoading && tags.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        tags.map(tag => (
                            <div key={tag.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium">{tag.name}</p>
                                    <p className="text-sm text-muted-foreground">{tag.slug}</p>
                                </div>
                                <div className="flex gap-2">
                                     <Button variant="outline" size="icon" onClick={() => { setEditingTag(tag); setIsTagDialogOpen(true); }}>
                                        <Edit className="size-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete tag "{tag.name}"?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteTag(tag.id)}>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};