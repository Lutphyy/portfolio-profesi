import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * Creates the bucket if it doesn't exist.
 */
export async function uploadImage(
  supabase: SupabaseClient,
  bucket: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Uploads multiple files to Supabase Storage and returns array of public URLs.
 */
export async function uploadMultipleImages(
  supabase: SupabaseClient,
  bucket: string,
  files: File[]
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(supabase, bucket, file));
  return Promise.all(uploadPromises);
}

/**
 * Deletes an image from Supabase Storage by its public URL.
 */
export async function deleteImage(
  supabase: SupabaseClient,
  bucket: string,
  publicUrl: string
): Promise<void> {
  const parts = publicUrl.split(`/storage/v1/object/public/${bucket}/`);
  if (parts.length < 2) return;
  const filePath = parts[1];

  await supabase.storage.from(bucket).remove([filePath]);
}
