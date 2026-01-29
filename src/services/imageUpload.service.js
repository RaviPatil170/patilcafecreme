import { supabase } from "./supabaseClient";

export const uploadProductImage = async (imageFile) => {
  const fileName = `${Date.now()}-${imageFile.name}`;
  const sanitizeFileName = fileName
    .normalize("NFKD") // normalize unicode
    .replace(/[\u00A0\u202F]/g, "-") // remove NBSP variants
    .replace(/\s+/g, "-") // normal spaces
    .replace(/[^a-zA-Z0-9._-]/g, "") // allow only safe chars
    .toLowerCase();

  const { error } = await supabase.storage
    .from("product_images")
    .upload(sanitizeFileName, imageFile);
  if (error) {
    throw error;
  }
  const { data } = supabase.storage
    .from("product_images")
    .getPublicUrl(sanitizeFileName);
  return data.publicUrl;
};
