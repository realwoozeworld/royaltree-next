import { DOSSIER_TABS, GALLERY_ITEMS } from "@/data/paulowniaData";
import { DossierTabItem, GalleryItem } from "@/types/botanical";
import { supabase } from "./supabase";

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
  try {
    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || "შენახვა ვერ მოხერხდა" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "ქსელის შეცდომა შენახვისას" };
  }
}

export async function uploadMediaFile(
  file: File
): Promise<{ url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "ატვირთვა ვერ მოხერხდა" };
    }
    return { url: data.url };
  } catch {
    return { error: "ქსელის შეცდომა ატვირთვისას" };
  }
}