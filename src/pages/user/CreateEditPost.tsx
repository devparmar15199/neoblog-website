import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { uploadPostImage } from "@/services/storage";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

// import { Editor, EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import toast from "react-hot-toast";

import {
  Save, Image as ImageIcon, Tags, ChevronLeft, Bold, Italic, Strikethrough, Code, Undo, Redo,
  List, Quote, ListOrdered
} from "lucide-react";

// Menu bar component for the editor
// const MenuBar = ({ editor }: { editor: Editor }) => {
//   // Only fetch state changes needed for the buttons
//   const editorState = useEditorState({
//     editor,
//     selector: ctx => {
//       return {
//         isBold: ctx.editor.isActive('bold') ?? false,
//         canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
//         isItalic: ctx.editor.isActive('italic') ?? false,
//         canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
//         isStrike: ctx.editor.isActive('strike') ?? false,
//         canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
//         isCode: ctx.editor.isActive('code') ?? false,
//         canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
//         isParagraph: ctx.editor.isActive('paragraph') ?? false,
//         isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
//         isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
//         isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
//         isBulletList: ctx.editor.isActive('bulletList') ?? false,
//         isOrderedList: ctx.editor.isActive('orderedList') ?? false,
//         isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
//         isBlockqoute: ctx.editor.isActive('blockquote') ?? false,
//         canUndo: ctx.editor.can().chain().undo().run() ?? false,
//         canRedo: ctx.editor.can().chain().redo().run() ?? false,
//       }
//     },
//   });

//   // Determine button variant based on active state
//   const getButtonVariant = (isActive: boolean) => isActive ? 'secondary' : 'ghost';
//   if (!editor) return null;

//   return (
//     <div className="w-full mb-4 rounded-md">
//       <div className="flex flex-wrap justify-start items-center gap-1 border bg-muted/20 dark:bg-muted/40 p-1.5 rounded-md">
//         {/* Text Formatting */}
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           disabled={!editorState.canBold}
//           variant={getButtonVariant(editorState.isBold)}
//           size="icon"
//           aria-label="Bold"
//         >
//           <Bold className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           disabled={!editorState.canItalic}
//           variant={getButtonVariant(editorState.isItalic)}
//           size="icon"
//           aria-label="Italic"
//         >
//           <Italic className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           disabled={!editorState.canStrike}
//           variant={getButtonVariant(editorState.isStrike)}
//           size="icon"
//           aria-label="Strike"
//         >
//           <Strikethrough className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleCode().run()}
//           disabled={!editorState.canCode}
//           variant={getButtonVariant(editorState.isCode)}
//           size="icon"
//           aria-label="Inline Code"
//         >
//           <Code className="size-4" />
//         </Button>

//         <div className="mx-1 h-6 w-px bg-border/80" /> {/* Separator */}

//         {/* Headings */}
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().setParagraph().run()}
//           variant={getButtonVariant(editorState.isParagraph)}
//           size="icon"
//           aria-label="Paragraph"
//         >
//           <AlignLeft className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           variant={getButtonVariant(editorState.isHeading1)}
//           size="icon"
//           aria-label="Heading 1"
//         >
//           <Heading1 className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           variant={getButtonVariant(editorState.isHeading2)}
//           size="icon"
//           aria-label="Heading 2"
//         >
//           <Heading2 className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           variant={getButtonVariant(editorState.isHeading3)}
//           size="icon"
//           aria-label="Heading 3"
//         >
//           <Heading3 className="size-4" />
//         </Button>

//         <div className="mx-1 h-6 w-px bg-border/80" /> {/* Separator */}

//         {/* Lists and Blocks */}
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           variant={getButtonVariant(editorState.isBulletList)}
//           size="icon"
//           aria-label="Bullet List"
//         >
//           <List className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           variant={getButtonVariant(editorState.isOrderedList)}
//           size="icon"
//           aria-label="Ordered List"
//         >
//           <ListOrdered className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           variant={getButtonVariant(editorState.isCodeBlock)}
//           size="icon"
//           aria-label="Code Block"
//         >
//           <CodeIcon className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           variant={getButtonVariant(editorState.isBlockqoute)}
//           size="icon"
//           aria-label="Blockquote"
//         >
//           <Quote className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().setHorizontalRule().run()}
//           variant="ghost"
//           size="icon"
//           aria-label="Horizontal Rule"
//         >
//           <Minus className="size-4" />
//         </Button>

//         <div className="mx-1 h-6 w-px bg-border/80" /> {/* Separator */}

//         {/* History */}
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={!editorState.canUndo}
//           variant="ghost"
//           size="icon"
//           aria-label="Undo"
//         >
//           <Undo className="size-4" />
//         </Button>
//         <Button
//           type="button"
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={!editorState.canRedo}
//           variant="ghost"
//           size="icon"
//           aria-label="Redo"
//         >
//           <Redo className="size-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

const EditorMenu = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const toggle = (action: string) => {
    switch (action) {
      case 'bold': editor.chain().focus().toggleBold().run(); break;
      case 'italic': editor.chain().focus().toggleItalic().run(); break;
      case 'strike': editor.chain().focus().toggleStrike().run(); break;
      case 'code': editor.chain().focus().toggleCode().run(); break;
      case 'bullet': editor.chain().focus().toggleBulletList().run(); break;
      case 'ordered': editor.chain().focus().toggleOrderedList().run(); break;
      case 'blockquote': editor.chain().focus().toggleBlockquote().run(); break;
      case 'undo': editor.chain().focus().undo().run(); break;
      case 'redo': editor.chain().focus().redo().run(); break;
    }
  };

  const isActive = (name: string) => editor.isActive(name) ? "secondary" : "ghost";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/20">
      <Button type="button" size="icon" variant={isActive('bold')} onClick={() => toggle('bold')}>
        <Bold className="size-4" />
      </Button>
      <Button type="button" size="icon" variant={isActive('italic')} onClick={() => toggle('italic')}>
        <Italic className="size-4" />
      </Button>
      <Button type="button" size="icon" variant={isActive('strike')} onClick={() => toggle('strike')}>
        <Strikethrough className="size-4" />
      </Button>
      <Button type="button" size="icon" variant={isActive('code')} onClick={() => toggle('code')}>
        <Code className="size-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1 self-center" />
      <Button type="button" size="icon" variant={isActive('bulletList')} onClick={() => toggle('bullet')}>
        <List className="size-4" />
      </Button>
      <Button type="button" size="icon" variant={isActive('orderedList')} onClick={() => toggle('ordered')}>
        <ListOrdered className="size-4" />
      </Button>
      <Button type="button" size="icon" variant={isActive('blockquote')} onClick={() => toggle('blockquote')}>
        <Quote className="size-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1 self-center" />
      <Button type="button" size="icon" variant="ghost" onClick={() => toggle('undo')} disabled={!editor.can().undo()}>
        <Undo className="size-4" />
      </Button>
      <Button type="button" size="icon" variant="ghost" onClick={() => toggle('redo')} disabled={!editor.can().redo()}>
        <Redo className="size-4" />
      </Button>
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

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    // onUpdate: ({ editor }) => {
    //   setContent(editor.getHTML());
    // },
    editorProps: {
      attributes: { class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4' }
    }
  });

  // 1. Fetch Post Data (if editing)
  useEffect(() => {
    if (isEditMode && postId) {
      loadPostById(postId).catch(() => {
        toast.error("Post not found");
        navigate("/dashboard");
      });
    }
  }, [isEditMode, postId, loadPostById, navigate]);


  // 2. Populate Form
  useEffect(() => {
    if (isEditMode && currentPost && currentPost.id === postId && editor) {
      // Check ownership
      if (user && currentPost.author !== user.id) {
        toast.error("Unauthorized access");
        navigate("/dashboard");
        return;
      }

      setTitle(currentPost.title);
      setSlug(currentPost.slug);
      setExcerpt(currentPost.excerpt || "");
      setExistingImageUrl(currentPost.cover_image || "");
      setIsPublished(currentPost.published);
      setSelectedCategoryId(currentPost.category_id ? String(currentPost.category_id) : "");

      // Map tags (ensure we map the name for the UI selector)
      if (currentPost.post_tags) {
        const names = currentPost.post_tags.map((pt: any) => pt.tags?.name || pt.name).filter(Boolean);
        setSelectedTagNames(names);
      }

      // Set Editor Content safely
      if (editor.isEmpty && currentPost.content) {
        editor.commands.setContent(currentPost.content);
      }
    }
  }, [isEditMode, currentPost, postId, editor, user, navigate]);

  // 3. Auto-Slug Generation
  useEffect(() => {
    if (!isEditMode) {
      const newSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');
      setSlug(newSlug);
    }
  }, [title, isEditMode]);

  // Handlers
  const handleTagToggle = (tagName: string) => {
    setSelectedTagNames(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editor) return;

    const contentHTML = editor.getHTML();
    if (!title || contentHTML === '<p></p>') {
      toast.error("Title and content are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = existingImageUrl;

      // Upload new image if selected
      if (coverImageFile) {
        finalImageUrl = await uploadPostImage(coverImageFile);
      }

      const payload = {
        title,
        slug,
        excerpt,
        content: contentHTML,
        category_id: selectedCategoryId ? parseInt(selectedCategoryId) : null,
        cover_image: finalImageUrl,
        published: isPublished,
        tags: selectedTagNames
      };

      if (isEditMode && postId) {
        await updatePost(postId, payload);
        toast.success("Post updated!");
      } else {
        await createPost(payload, user.id);
        toast.success("Draft created!");
      }
      navigate("/dashboard");

    } catch (error: any) {
      toast.error(error.message || "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (postLoading && isEditMode) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon"><ChevronLeft className="size-5" /></Button>
        </Link>
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Story" : "Write a Story"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Title</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter a captivating title..."
              className="text-xl font-bold h-14 px-4"
            />
          </div>

          <Card className="overflow-hidden border-muted-foreground/20">
            <EditorMenu editor={editor} />
            <EditorContent editor={editor} />
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="publish-switch">Publish immediately</Label>
                <Switch id="publish-switch" checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner size="sm" /> : (
                  <span className="flex items-center gap-2"><Save className="size-4" /> Save {isPublished ? " & Publish" : " Draft"}</span>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Meta Data</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Excerpt */}
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Short summary for previews..."
                  className="h-24 resize-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} disabled={categoriesLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {selectedTagNames.length > 0 ? `${selectedTagNames.length} Selected` : "Select Tags"}
                      <Tags className="size-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                    <DropdownMenuLabel>Available Tags</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tagsLoading ? <div className="p-2 text-xs">Loading...</div> : tags.map(t => (
                      <DropdownMenuCheckboxItem
                        key={t.id}
                        checked={selectedTagNames.includes(t.name)}
                        onCheckedChange={() => handleTagToggle(t.name)}
                        onSelect={e => e.preventDefault()}
                      >
                        {t.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTagNames.map(t => (
                    <span key={t} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">#{t}</span>
                  ))}
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition cursor-pointer relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => setCoverImageFile(e.target.files?.[0] || null)}
                  />
                  <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {coverImageFile ? coverImageFile.name : "Click to upload"}
                  </p>
                </div>
                {existingImageUrl && !coverImageFile && (
                  <img src={existingImageUrl} alt="Cover" className="w-full h-32 object-cover rounded-md mt-2" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};