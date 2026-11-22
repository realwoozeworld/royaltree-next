import { DOSSIER_TABS, GALLERY_ITEMS } from "@/data/paulowniaData";
import { DossierTabItem, GalleryItem } from "@/types/botanical";
import { supabase } from "./supabase";
import { saveSiteContentAction } from "./adminActions";

export interface DynamicSiteContent {
  heroImageUrl: string;
  heroCaptionKa: string;
  heroCaptionEn: string;
  gallery: GalleryItem[];
  dossierTabs: DossierTabItem[];
}

export const DEFAULT_SITE_CONTENT: DynamicSiteContent = {
  heroImageUrl:
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85",
  heroCaptionKa: "სწორღეროიანი, სწრაფმზარდი ელიტარული ნერგები 10₾-დან.",
  heroCaptionEn:
    "Straight-trunk, fast-growing elite seedlings starting from 10₾.",
  gallery: GALLERY_ITEMS,
  dossierTabs: DOSSIER_TABS,
};

export async function fetchSiteContent(): Promise<DynamicSiteContent> {
  if (!supabase) return DEFAULT_SITE_CONTENT;

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "main")
      .maybeSingle();

    if (error || !data?.value) {
      return DEFAULT_SITE_CONTENT;
    }

    return {
      ...DEFAULT_SITE_CONTENT,
      ...(data.value as Partial<DynamicSiteContent>),
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(
  content: DynamicSiteContent
): Promise<{ ok: boolean; error?: string }> {
  return saveSiteContentAction(content);
}

export async function uploadMediaFile(
  file: File
): Promise<{ url?: string; error?: string }> {
  if (!supabase) {
    return { error: "Supabase არ არის კონფიგურირებული" };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("royal-tree-media")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage
    .from("royal-tree-media")
    .getPublicUrl(fileName);

  return { url: data.publicUrl };
}