import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { supabase } from "@/lib/supabase";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Editor, EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import toast from "react-hot-toast";
import { Save, FilePenLine, Image as ImageIcon, Tags, ChevronLeft } from "lucide-react";
import {
  Bold, Italic, Strikethrough, Code, Undo, Redo, List, ListOrdered, Code as CodeIcon, Quote,
  AlignLeft, Minus, Heading1, Heading2, Heading3
} from 'lucide-react';

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
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          variant={getButtonVariant(editorState.isBold)}
          size="icon"
          aria-label="Bold"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          variant={getButtonVariant(editorState.isItalic)}
          size="icon"
          aria-label="Italic"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          variant={getButtonVariant(editorState.isStrike)}
          size="icon"
          aria-label="Strike"
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
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
          onClick={() => editor.chain().focus().setParagraph().run()}
          variant={getButtonVariant(editorState.isParagraph)}
          size="icon"
          aria-label="Paragraph"
        >
          <AlignLeft className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          variant={getButtonVariant(editorState.isHeading1)}
          size="icon"
          aria-label="Heading 1"
        >
          <Heading1 className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant={getButtonVariant(editorState.isHeading2)}
          size="icon"
          aria-label="Heading 2"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
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
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={getButtonVariant(editorState.isBulletList)}
          size="icon"
          aria-label="Bullet List"
        >
          <List className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={getButtonVariant(editorState.isOrderedList)}
          size="icon"
          aria-label="Ordered List"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          variant={getButtonVariant(editorState.isCodeBlock)}
          size="icon"
          aria-label="Code Block"
        >
          <CodeIcon className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          variant={getButtonVariant(editorState.isBlockqoute)}
          size="icon"
          aria-label="Blockquote"
        >
          <Quote className="size-4" />
        </Button>
        <Button
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
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          variant="ghost"
          size="icon"
          aria-label="Undo"
        >
          <Undo className="size-4" />
        </Button>
        <Button
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
  const { currentPost } = useSelector((state: RootState) => state.posts);
  const { createPost, updatePost } = usePosts();

  const isEditMode = !!postId;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // TipTap Editor setup
  const extensions = [StarterKit];

  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    editorProps: {
      attributes: {
        // Apply theme-aware styling directly to the editor area
        class: 'min-h-[400px] h-full p-4 focus:outline-none'
      }
    }
  }, [isEditMode]);

  const [initialContentLoaded, setInitialContentLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    // Only run logic when editor is ready
    if (!editor) return;

    // Populate fields in Edit Mode
    if (isEditMode && currentPost && !initialContentLoaded) {
      // Check if the current user is the author
      if (user.id !== currentPost.author) {
        toast.error("You are not authorized to edit this post.");
        navigate("/posts", { replace: true });
        return;
      }
      setTitle(currentPost.title);
      setExcerpt(currentPost.excerpt);
      setContent(currentPost.content);
      setExistingImageUrl(currentPost.cover_image || "");
      setInitialContentLoaded(true);
    } else if (!isEditMode && !initialContentLoaded) {
      // Clear fields in Create Mode
      setTitle("");
      editor.commands.setContent("");
      setContent("");
      setExcerpt("");
      setExistingImageUrl("");
      setCoverImageFile(null);
      setInitialContentLoaded(true);
    }
  }, [user, postId, currentPost, navigate, initialContentLoaded, editor, isEditMode]);

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
    } else if (currentPost && !slug) {
      setSlug(currentPost.slug);  // Initialize slug in edit mode
    }
  }, [title, generateSlug, isEditMode, currentPost, slug]);

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
        .upload(filePath, coverImageFile, {
          cacheControl: '3600',
          upsert: true
        });

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
      const postData = {
        title,
        slug: isEditMode ? slug : generateSlug(title),
        content: finalContent,
        excerpt,
        author: user!.id,
        cover_image: imageUrl,
        published: true,
        featured: false,
      };

      if (isEditMode) {
        await updatePost(postId!, postData);
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

  if (!user) return null;
  if (!editor || (isEditMode && !initialContentLoaded)) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;

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
          <CardDescription>
            {isEditMode ? `Editing post ID: ${postId}` : "Start writing a compelling article for your readers."}
          </CardDescription>
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
              {/* Categories/Tags Placeholder */}
              <div className="pt-4 space-y-2">
                <Label className="flex items-center gap-1 text-muted-foreground">
                  <Tags className="size-4" /> Categories & Tags (TODO)
                </Label>
                <Input
                  value="Tech, React, Supabase"
                  readOnly
                  className="text-sm italic bg-muted/50"
                />
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
              disabled={loading || !editor || !editor.getHTML() || !title}
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