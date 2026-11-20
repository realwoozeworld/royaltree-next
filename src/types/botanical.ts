export type Language = "ka" | "en";
export type ThemeMode = "dark" | "light";

export interface TierQuantities {
  tier1: number; // 10₾ (1.0 - 1.5m)
  tier2: number; // 20₾ (2.0 - 2.5m)
  tier3: number; // 50₾ (3.0 - 4.0m)
}

export interface DossierTabItem {
  id: "history" | "care" | "properties" | "usage";
  labelKa: string;
  labelEn: string;
  eyebrowKa: string;
  eyebrowEn: string;
  titleKa: string;
  titleEn: string;
  paragraphsKa: string[];
  paragraphsEn: string[];
  metrics: {
    value: string;
    labelKa: string;
    labelEn: string;
  }[];
}

export interface GalleryItem {
  id: string;
  code: string;
  categoryKa: string;
  categoryEn: string;
  titleKa: string;
  titleEn: string;
  descriptionKa: string;
  descriptionEn: string;
  imageUrl: string;
  spanWide?: boolean;
}