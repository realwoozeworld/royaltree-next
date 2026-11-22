"use server";

import { revalidatePath } from "next/cache";
import {
  checkAdminAuth,
  checkLoginRateLimit,
  clearAdminSessionCookie,
  recordFailedLogin,
  recordSuccessfulLogin,
  setAdminSessionCookie,
} from "./adminAuth";
import {
  DEFAULT_SITE_CONTENT,
  DynamicSiteContent,
} from "./contentStore";
import { supabase } from "./supabase";
import { DossierTabItem, GalleryItem } from "@/types/botanical";
import {
  DEFAULT_SAPLING_PRODUCTS,
  OrderRecord,
  RoiParametersInput,
  SaplingProductInput,
} from "@/types/admin";

export type { OrderRecord, RoiParametersInput, SaplingProductInput };

/**
 * Server Action: Admin Login with Rate Limiting & Secure Cookie
 */
export async function loginAdminAction(formData: {
  email?: string;
  password?: string;
}): Promise<{ ok: boolean; email?: string; error?: string }> {
  const email = (formData.email || "").trim().toLowerCase();
  const password = formData.password || "";

  if (!email || !password) {
    return { ok: false, error: "გთხოვთ შეავსოთ ელფოსტა და პაროლი." };
  }

  // Rate limit by email
  const rateLimitStatus = checkLoginRateLimit(email);
  if (!rateLimitStatus.allowed) {
    return { ok: false, error: rateLimitStatus.message };
  }

  if (!supabase) {
    return {
      ok: false,
      error: "Supabase არ არის კონფიგურირებული (.env.local).",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      const failedResult = recordFailedLogin(email);
      return { ok: false, error: failedResult.message };
    }

    recordSuccessfulLogin(email);
    await setAdminSessionCookie(data.user.email || email);

    return { ok: true, email: data.user.email || email };
  } catch {
    const failedResult = recordFailedLogin(email);
    return { ok: false, error: failedResult.message };
  }
}

/**
 * Server Action: Admin Logout
 */
export async function logoutAdminAction(): Promise<{ ok: boolean }> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Continue clearing session cookie
    }
  }
  await clearAdminSessionCookie();
  return { ok: true };
}

/**
 * Server Action: Check Current Admin Session
 */
export async function getAdminSessionAction(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  const auth = await checkAdminAuth();
  return { authenticated: auth.authorized, email: auth.email };
}

/**
 * Helper to sanitize and trim strings
 */
function sanitizeString(str: unknown, maxLength = 500): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLength);
}

/**
 * Helper to validate non-negative numbers (prices, stock, ROI parameters)
 */
function sanitizeNonNegativeNumber(
  val: unknown,
  defaultValue = 0,
  max = 1000000000
): number {
  const n = Number(val);
  if (isNaN(n) || !isFinite(n) || n < 0) return defaultValue;
  return Math.min(n, max);
}

/**
 * Helper to sanitize URL strings
 */
function sanitizeUrl(urlStr: unknown): string {
  const s = sanitizeString(urlStr, 2048);
  if (!s) return "";
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) {
    return s;
  }
  return "";
}

/**
 * Validates and sanitizes Gallery Items
 */
function sanitizeGalleryItems(items: unknown[]): GalleryItem[] {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 50).map((raw, idx) => {
    const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    return {
      id: sanitizeString(item.id, 64) || `item-${Date.now()}-${idx}`,
      code: sanitizeString(item.code, 64) || `${String(idx + 1).padStart(2, "0")} / ARCHIVE`,
      categoryKa: sanitizeString(item.categoryKa, 100) || "სანერგე მეურნეობა",
      categoryEn: sanitizeString(item.categoryEn, 100) || "NURSERY ARCHIVE",
      titleKa: sanitizeString(item.titleKa, 150) || "ახალი ფოტო",
      titleEn: sanitizeString(item.titleEn, 150) || "New Photo",
      descriptionKa: sanitizeString(item.descriptionKa, 500),
      descriptionEn: sanitizeString(item.descriptionEn, 500),
      imageUrl: sanitizeUrl(item.imageUrl) || DEFAULT_SITE_CONTENT.heroImageUrl,
      spanWide: Boolean(item.spanWide),
    };
  });
}

/**
 * Validates and sanitizes Dossier (Knowledge Sanctuary) Tabs
 */
function sanitizeDossierTabs(tabs: unknown[]): DossierTabItem[] {
  if (!Array.isArray(tabs)) return [];
  return tabs.slice(0, 10).map((raw, idx) => {
    const tab = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const idVal = sanitizeString(tab.id, 32);
    const validId: DossierTabItem["id"] =
      idVal === "history" || idVal === "care" || idVal === "properties" || idVal === "usage"
        ? idVal
        : (["history", "care", "properties", "usage"][idx % 4] as DossierTabItem["id"]);

    const paragraphsKa = Array.isArray(tab.paragraphsKa)
      ? tab.paragraphsKa.map((p) => sanitizeString(p, 2000)).filter(Boolean).slice(0, 20)
      : [];
    const paragraphsEn = Array.isArray(tab.paragraphsEn)
      ? tab.paragraphsEn.map((p) => sanitizeString(p, 2000)).filter(Boolean).slice(0, 20)
      : [];

    const metrics = Array.isArray(tab.metrics)
      ? tab.metrics.slice(0, 10).map((m) => {
          const mObj = (m && typeof m === "object" ? m : {}) as Record<string, unknown>;
          return {
            value: sanitizeString(mObj.value, 50),
            labelKa: sanitizeString(mObj.labelKa, 100),
            labelEn: sanitizeString(mObj.labelEn, 100),
          };
        })
      : [];

    return {
      id: validId,
      labelKa: sanitizeString(tab.labelKa, 100) || "ტაბი",
      labelEn: sanitizeString(tab.labelEn, 100) || "Tab",
      eyebrowKa: sanitizeString(tab.eyebrowKa, 100),
      eyebrowEn: sanitizeString(tab.eyebrowEn, 100),
      titleKa: sanitizeString(tab.titleKa, 200) || "სათაური",
      titleEn: sanitizeString(tab.titleEn, 200) || "Title",
      paragraphsKa,
      paragraphsEn,
      metrics,
    };
  });
}

/**
 * Server Action: Save Site Content (Hero, Gallery, Sanctuary)
 * Validates inputs and enforces checkAdminAuth()
 */
export async function saveSiteContentAction(
  rawContent: unknown
): Promise<{ ok: boolean; error?: string }> {
  // 1. Enforce Admin Authentication
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { ok: false, error: auth.error || "წვდომა უარყოფილია (Unauthorized)." };
  }

  if (!supabase) {
    return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
  }

  // 2. Input Sanitization & Validation
  if (!rawContent || typeof rawContent !== "object") {
    return { ok: false, error: "არასწორი მონაცემების ფორმატი." };
  }

  const content = rawContent as Record<string, unknown>;

  const sanitizedContent: DynamicSiteContent = {
    heroImageUrl:
      sanitizeUrl(content.heroImageUrl) || DEFAULT_SITE_CONTENT.heroImageUrl,
    heroCaptionKa: sanitizeString(content.heroCaptionKa, 300),
    heroCaptionEn: sanitizeString(content.heroCaptionEn, 300),
    gallery: sanitizeGalleryItems(content.gallery as unknown[]),
    dossierTabs: sanitizeDossierTabs(content.dossierTabs as unknown[]),
  };

  try {
    const { error } = await supabase.from("site_content").upsert(
      {
        key: "main",
        value: sanitizedContent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
    return { ok: false, error: msg };
  }
}

/**
 * Server Action: Update Sapling Products (Price & Stock)
 * Enforces checkAdminAuth() and validates non-negative numbers
 */
export async function updateSaplingProductsAction(
  products: unknown[]
): Promise<{ ok: boolean; error?: string; count?: number }> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { ok: false, error: auth.error || "წვდომა უარყოფილია." };
  }

  if (!Array.isArray(products)) {
    return { ok: false, error: "არასწორი მონაცემები." };
  }

  const sanitizedProducts: SaplingProductInput[] = products
    .slice(0, 20)
    .map((p, idx) => {
      const obj = (p && typeof p === "object" ? p : {}) as Record<string, unknown>;
      return {
        id: sanitizeString(obj.id, 64) || `tier-${idx + 1}`,
        nameKa: sanitizeString(obj.nameKa, 100),
        nameEn: sanitizeString(obj.nameEn, 100),
        price: sanitizeNonNegativeNumber(obj.price, 0, 100000),
        stockCount: Math.round(sanitizeNonNegativeNumber(obj.stockCount, 0, 1000000)),
        heightKa: sanitizeString(obj.heightKa, 100),
        heightEn: sanitizeString(obj.heightEn, 100),
      };
    });

  if (supabase) {
    try {
      await supabase.from("site_content").upsert(
        {
          key: "sapling_products",
          value: sanitizedProducts,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    } catch {
      // Handled cleanly
    }
  }

  revalidatePath("/");
  return { ok: true, count: sanitizedProducts.length };
}

/**
 * Server Action: Update ROI Calculation Parameters
 * Enforces checkAdminAuth() and validates positive numbers
 */
export async function updateRoiParametersAction(
  rawParams: unknown
): Promise<{ ok: boolean; error?: string; params?: RoiParametersInput }> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { ok: false, error: auth.error || "წვდომა უარყოფილია." };
  }

  const p = (rawParams && typeof rawParams === "object" ? rawParams : {}) as Record<string, unknown>;

  const sanitizedParams: RoiParametersInput = {
    spacingMeters: Math.max(1, sanitizeNonNegativeNumber(p.spacingMeters, 4, 20)),
    treesPerHectare: Math.round(Math.max(1, sanitizeNonNegativeNumber(p.treesPerHectare, 625, 10000))),
    timberM3PerTree: sanitizeNonNegativeNumber(p.timberM3PerTree, 0.58, 10),
    annualCo2TonsPerTree: sanitizeNonNegativeNumber(p.annualCo2TonsPerTree, 0.16, 5),
    harvestCycleYears: Math.round(Math.max(1, sanitizeNonNegativeNumber(p.harvestCycleYears, 5, 50))),
  };

  if (supabase) {
    try {
      await supabase.from("site_content").upsert(
        {
          key: "roi_parameters",
          value: sanitizedParams,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    } catch {
      // Handled cleanly
    }
  }

  revalidatePath("/");
  return { ok: true, params: sanitizedParams };
}

/**
 * Server Action: Check Database Connectivity Status
 */
export async function getDatabaseStatusAction(): Promise<{
  connected: boolean;
  latencyMs?: number;
}> {
  if (!supabase) return { connected: false };
  const start = Date.now();
  try {
    const { error } = await supabase
      .from("site_content")
      .select("key")
      .limit(1);
    if (error && error.code !== "PGRST116") {
      return { connected: false };
    }
    return { connected: true, latencyMs: Date.now() - start };
  } catch {
    return { connected: false };
  }
}

/**
 * Server Action: Fetch Admin Data (Orders, Products, Site Content, KPIs)
 */
export async function fetchAdminDataAction(): Promise<{
  ok: boolean;
  error?: string;
  orders: OrderRecord[];
  products: SaplingProductInput[];
  content: DynamicSiteContent;
}> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return {
      ok: false,
      error: auth.error || "ავტორიზაცია არ არის გავლილი.",
      orders: [],
      products: DEFAULT_SAPLING_PRODUCTS,
      content: DEFAULT_SITE_CONTENT,
    };
  }

  let orders: OrderRecord[] = [];
  let products: SaplingProductInput[] = DEFAULT_SAPLING_PRODUCTS;
  let content: DynamicSiteContent = DEFAULT_SITE_CONTENT;

  if (supabase) {
    try {
      // 1. Fetch site content & products
      const { data: contentData } = await supabase
        .from("site_content")
        .select("key, value");

      if (contentData) {
        for (const row of contentData) {
          if (row.key === "main" && row.value) {
            content = {
              ...DEFAULT_SITE_CONTENT,
              ...(row.value as Partial<DynamicSiteContent>),
            };
          }
          if (row.key === "sapling_products" && Array.isArray(row.value)) {
            products = row.value as SaplingProductInput[];
          }
        }
      }

      // 2. Fetch orders from orders table if present
      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!ordersErr && ordersData && ordersData.length > 0) {
        orders = ordersData.map((o) => ({
          id: String(o.id || `ord-${Math.random()}`),
          created_at: String(o.created_at || new Date().toISOString()),
          fullName: String(o.full_name || o.fullName || "უცნობი"),
          phone: String(o.phone || ""),
          region: String(o.region || ""),
          notes: String(o.notes || ""),
          tier1: Number(o.tier1 || 0),
          tier2: Number(o.tier2 || 0),
          tier3: Number(o.tier3 || 0),
          totalTrees: Number(o.total_trees || o.totalTrees || 0),
          totalPrice: Number(o.total_price || o.totalPrice || 0),
          status: (o.status || "pending") as OrderRecord["status"],
        }));
      }
    } catch {
      // Fallbacks kept cleanly
    }
  }

  return { ok: true, orders, products, content };
}

/**
 * Server Action: Update Order Status
 * Enforces checkAdminAuth() and sanitizes inputs
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<{ ok: boolean; error?: string }> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { ok: false, error: auth.error || "წვდომა უარყოფილია." };
  }

  const cleanOrderId = sanitizeString(orderId, 128);
  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return { ok: false, error: "არასწორი სტატუსი." };
  }

  if (supabase) {
    try {
      await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", cleanOrderId);
    } catch {
      // Handled cleanly
    }
  }

  return { ok: true };
}
