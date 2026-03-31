import { createClient } from '@supabase/supabase-js';

// ---- SUPABASE CONFIGURATION ----
// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Bucket Name: Make sure you create a public bucket named "files" in Supabase Storage!
const BUCKET_NAME = "files";

// Helper utility to compress images via browser Canvas API
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.6); // 60% quality for smaller size
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Upload an image file to Supabase Storage after compressing it.
 * Overrides the old Firebase Storage method.
 */
export const uploadImage = async (file, folderPath) => {
  try {
    const compressedFile = await compressImage(file);
    const fileName = `${folderPath}/${Date.now()}_${compressedFile.name}`;

    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    console.error("Supabase Image Upload Error:", error);
    throw error;
  }
};

/**
 * Upload a PDF file to Supabase Storage.
 * Overrides the old Firebase Storage method.
 */
export const uploadPDF = async (file, folderPath) => {
  try {
    const fileName = `${folderPath}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicData } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    console.error("Supabase PDF Upload Error:", error);
    throw error;
  }
};

/**
 * Hard delete a file from Supabase Storage using its HTTP URL
 */
export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    // Extract the path from the URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[BUCKET_NAME]/[FILE_PATH]
    const urlObj = new URL(fileUrl);
    const pathStart = urlObj.pathname.indexOf(BUCKET_NAME);
    if (pathStart > -1) {
      // get the actual file path after the bucket name
      const filePath = urlObj.pathname.substring(pathStart + BUCKET_NAME.length + 1);
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([decodeURIComponent(filePath)]);
      if (error) throw error;
    }
  } catch (error) {
    console.error("Supabase Delete Error:", error);
    throw error;
  }
};
