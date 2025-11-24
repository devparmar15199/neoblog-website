import { supabase } from "@/lib/supabase";

export const uploadPostImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('post-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Delete image (useful for cleanup if user cancels post creation)
export const deletePostImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('post-images')
    .remove([path]);
    
  if (error) throw error;
};