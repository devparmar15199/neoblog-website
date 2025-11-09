import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { supabase } from "@/lib/supabase";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Editor, EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import {
  Save, FilePenLine, Image as ImageIcon, Tags, ChevronLeft, Bold, Italic, Strikethrough, Code, Undo, Redo,
  List, Code as CodeIcon, Quote, AlignLeft, Minus, Heading1, Heading2, Heading3, ListOrdered
} from "lucide-react";

// Menu bar component for the editor
const MenuBar = ({ editor }: { editor: Editor }) => {
  // Only fetch state changes needed for the buttons
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockqoute: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  });

  // Determine button variant based on active state
  const getButtonVariant = (isActive: boolean) => isActive ? 'secondary' : 'ghost';
  if (!editor) return null;

  return (
    <div className="w-full mb-4 rounded-md">
      <div className="flex flex-wrap justify-start items-center gap-1 border bg-muted/20 dark:bg-muted/40 p-1.5 rounded-md">
        {/* Text Formatting */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          variant={getButtonVariant(editorState.isBold)}
          size="icon"
          aria-label="Bold"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          variant={getButtonVariant(editorState.isItalic)}
          size="icon"
          aria-label="Italic"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          variant={getButtonVariant(editorState.isStrike)}
          size="icon"
          aria-label="Strike"
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          variant={getButtonVariant(editorState.isCode)}
          size="icon"
          aria-label="Inline Code"
        >
          <Code className="size-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border/80" /> {/* Separator */}

        {/* Headings */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          variant={getButtonVariant(editorState.isParagraph)}
          size="icon"
          aria-label="Paragraph"
        >
          <AlignLeft className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          variant={getButtonVariant(editorState.isHeading1)}
          size="icon"
          aria-label="Heading 1"
        >
          <Heading1 className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant={getButtonVariant(editorState.isHeading2)}
          size="icon"
          aria-label="Heading 2"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          variant={getButtonVariant(editorState.isHeading3)}
          size="icon"
          aria-label="Heading 3"
        >
          <Heading3 className="size-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border/80" /> {/* Separator */}

        {/* Lists and Blocks */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={getButtonVariant(editorState.isBulletList)}
          size="icon"
          aria-label="Bullet List"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={getButtonVariant(editorState.isOrderedList)}
          size="icon"
          aria-label="Ordered List"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          variant={getButtonVariant(editorState.isCodeBlock)}
          size="icon"
          aria-label="Code Block"
        >
          <CodeIcon className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          variant={getButtonVariant(editorState.isBlockqoute)}
          size="icon"
          aria-label="Blockquote"
        >
          <Quote className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          variant="ghost"
          size="icon"
          aria-label="Horizontal Rule"
        >
          <Minus className="size-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border/80" /> {/* Separator */}

        {/* History */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          variant="ghost"
          size="icon"
          aria-label="Undo"
        >
          <Undo className="size-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          variant="ghost"
          size="icon"
          aria-label="Redo"
        >
          <Redo className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export const CreateEditPost = () => {
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { currentPost, loading: postLoading } = useSelector((state: RootState) => state.posts);
  const { loadPostById, createPost, updatePost } = usePosts();

  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading } = useTags();

  const isEditMode = !!postId;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Apply theme-aware styling directly to the editor area
        class: 'min-h-[400px] h-full p-4 focus:outline-none'
      }
    }
  });

  useEffect(() => {
    if (isEditMode && postId) {
      loadPostById(postId).catch(() => {
        toast.error("Could not find post to edit.");
        navigate("/posts");
      })
    }
  }, [isEditMode, postId, loadPostById, navigate]);


  const postAuthorId = currentPost?.author?.id;
  // Populates form fields when post data is ready
  useEffect(() => {
    if (isEditMode) {
      // We are editing. Wait for the post to be loaded into Redux.
      if (currentPost && editor && postId === currentPost.id) {
        // Check if the current user is the author
        if (user && user.id !== postAuthorId) {
          toast.error("You are not authorized to edit this post.");
          navigate("/posts", { replace: true });
          return;
        }

        // Populate all fields from Redux
        setTitle(currentPost.title);
        setSlug(currentPost.slug); // Set slug from current post
        setExcerpt(currentPost.excerpt || '');
        setExistingImageUrl(currentPost.cover_image || "");

        // 🚀 NEW: Populate category and tags
        setSelectedCategory(String(currentPost.category_id || ""));
        // The tags structure from the service is { tags: { id: number, ... } }
        setSelectedTags(currentPost.tags.map(tagObj => tagObj.tags.name));

        // 🚀 UX FIX: Set editor content only once post is loaded
        if (editor.getHTML() !== currentPost.content) {
          editor.commands.setContent(currentPost.content || '');
          setContent(currentPost.content || ''); // Also update state
        }
      }
    } else {
      // We are creating. Clear all fields.
      setTitle("");
      setSlug("");
      setExcerpt("");
      setExistingImageUrl("");
      setCoverImageFile(null);
      setSelectedCategory("");
      setSelectedTags([]);
      if (editor) {
        editor.commands.setContent("");
      }
      setContent("");
    }
  }, [isEditMode, currentPost, editor, user, navigate, postId]);

  // Utility: Slug Generator
  const generateSlug = useCallback((title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    [],
  );

  // Update slug automatically when title changes
  useEffect(() => {
    if (!isEditMode) {  // Only auto-update slug in create mode
      setSlug(generateSlug(title));
    }
  }, [title, generateSlug, isEditMode]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    const finalContent = editor?.getHTML() || content;
    if (!title || !finalContent || !excerpt || finalContent === '<p></p>') {
      toast.error('Please fill in the title, content, and excerpt.');
      setLoading(false);
      return;
    }

    let imageUrl = existingImageUrl;  // Start with the existing URL

    // Handle new cover image upload
    if (coverImageFile) {
      const fileExt = coverImageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, coverImageFile, { upsert: true });

      if (uploadError) {
        toast.error(`Image upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      // Get the public URL for the newly uploaded file
      const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(filePath);
      imageUrl = publicUrl;
    }

    try {

      const categoryId = selectedCategory ? parseInt(selectedCategory) : null;

      const postData = {
        title,
        slug,
        content: finalContent,
        excerpt,
        author: user!.id,
        cover_image: imageUrl,
        category_id: categoryId,
        published: publish,
        featured: false,
      };

      if (isEditMode) {
        await updatePost(postId!, postData, selectedTags);
        toast.success("Post updated successfully!");
      } else {
        await createPost(postData);
        toast.success("Post created successfully!");
      }
      navigate("/posts");
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message || "An unknown error occurred."}`);
    } finally {
      setLoading(false);
    }
  };

  // Show main loader while fetching post in edit mode
  if (isEditMode && postLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (!user || !editor) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <Link to="/posts">
        <Button variant="ghost" className="mb-4" icon={ChevronLeft}>Back to Posts</Button>
      </Link>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <FilePenLine className="size-6 text-primary" />
            {isEditMode ? "Edit Post" : "Create New Post"}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Post Metadata (1/3 width) */}
            <div className="lg:col-span-1 space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  placeholder="Post Tile"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              {/* Slug */}
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  placeholder="post-title-slug"
                  value={slug}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt (Short Summary) <span className="text-destructive">*</span></Label>
                <Textarea
                  id="excerpt"
                  placeholder="A brief, attention-grabbing summary (max 160 characters)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  rows={3}
                  maxLength={160}
                />
              </div>
              {/* Cover Image */}
              <div className="pt-2">
                <Label htmlFor="cover-image" className="flex items-center gap-1">
                  Cover Image <ImageIcon className="size-4" />
                </Label>
                <Input
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                  className="file:text-sm file:font-semibold"
                />
                {(existingImageUrl || coverImageFile) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current Image: {coverImageFile ? coverImageFile.name : "URL provided."}
                  </p>
                )}
              </div>
              {/* 🚀 NEW: Categories & Tags Section */}
              <div className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="category-select" className="flex items-center gap-1">
                    <Tags className="size-4" /> Category
                  </Label>
                  <Select
                    onValueChange={setSelectedCategory}
                    value={selectedCategory}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger id="category-select">
                      <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select a category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">(No Category)</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <Tags className="size-4" /> Tags
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal" disabled={tagsLoading}>
                        {tagsLoading ? "Loading tags..." :
                          selectedTags.length > 0 ? `Selected (${selectedTags.length})` : "Select tags"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="start">
                      <DropdownMenuLabel>Available Tags</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {tags.map(tag => (
                        <DropdownMenuCheckboxItem
                          key={tag.id}
                          checked={selectedTags.includes(tag.name)}
                          onCheckedChange={() => handleTagToggle(tag.name)}
                          onSelect={(e) => e.preventDefault()} // Prevent menu from closing on click
                        >
                          {tag.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={publish}
                      onCheckedChange={setPublish}
                    />
                    Publish Post Immediately
                  </Label>
                </div>
              </div>

            </div>

            {/* Right Column: TipTap Editor (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col min-h-[600px] border rounded-lg p-0 bg-background/50">
              <MenuBar editor={editor} />
              <div className="grow overflow-y-auto">
                <EditorContent
                  editor={editor}
                  className="prose dark:prose-invert max-w-none p-4 min-h-[500px] h-full"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end border-t pt-6">
            <Button
              type="submit"
              disabled={loading || postLoading || !editor || !title || !excerpt}
              icon={loading ? undefined : Save}
              size="lg"
            >
              {loading ? <LoadingSpinner size="sm" /> : isEditMode ? "Update Post" : "Publish Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};