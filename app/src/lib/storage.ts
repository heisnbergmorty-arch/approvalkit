/**
 * Storage layer — Supabase Storage with presigned uploads.
 *
 * Why Supabase: free 1 GB storage, no credit card needed (vs Cloudflare R2
 * which requires a card). Easy to swap later — see SELF-HOST.md.
 */
import { createClient } from "@supabase/supabase-js";
import { shortId } from "./ids";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY ?? "";
const bucket = process.env.SUPABASE_BUCKET ?? "approvalkit";

if (!supabaseUrl && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("[storage] SUPABASE_URL is not set. Uploads will fail.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder",
  { auth: { persistSession: false } },
);

export interface PresignedUpload {
  uploadUrl: string;
  uploadToken: string;
  key: string;
  publicUrl: string;
}

export async function presignUpload(
  filename: string,
  _contentType: string,
): Promise<PresignedUpload> {
  const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
  const key = `assets/${shortId()}${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(key);

  if (error || !data) throw new Error(`presign failed: ${error?.message}`);

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(key);

  return {
    uploadUrl: data.signedUrl,
    uploadToken: data.token,
    key,
    publicUrl: pub.publicUrl,
  };
}

export async function presignDownload(key: string): Promise<string> {
  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return data.publicUrl;
}

export async function deleteObject(key: string): Promise<void> {
  await supabase.storage.from(bucket).remove([key]);
}
