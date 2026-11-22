"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DynamicSiteContent, uploadMediaFile } from "@/lib/contentStore";
import {
  loginAdminAction,
  logoutAdminAction,
  saveSiteContentAction,
  updateOrderStatusAction,
  updateSaplingProductsAction,
  fetchAdminDataAction,
} from "@/lib/adminActions";
import {
  OrderRecord,
  SaplingProductInput,
} from "@/types/admin";
import { isSupabaseConfigured } from "@/lib/supabase";
import { GalleryItem } from "@/types/botanical";

type AdminTab = "products" | "orders" | "content";

interface AdminClientProps {
  initialSessionEmail: string | null;
  initialDbConnected: boolean;
  initialOrders: OrderRecord[];
  initialProducts: SaplingProductInput[];
  initialContent: DynamicSiteContent;
}

export default function AdminClient({
  initialSessionEmail,
  initialDbConnected,
  initialOrders,
  initialProducts,
  initialContent,
}: AdminClientProps) {
  const [sessionEmail, setSessionEmail] = useState<string | null>(initialSessionEmail);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [dbConnected] = useState<boolean>(initialDbConnected);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  // Server data & clean baseline state for dirty-tracking
  const [content, setContent] = useState<DynamicSiteContent>(initialContent);
  const [savedContent, setSavedContent] = useState<DynamicSiteContent>(initialContent);

  const [products, setProducts] = useState<SaplingProductInput[]>(initialProducts);
  const [savedProducts, setSavedProducts] = useState<SaplingProductInput[]>(initialProducts);

  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [productSearch, setProductSearch] = useState("");

  // Content sub-tabs
  const [contentSubTab, setContentSubTab] = useState<"hero" | "gallery" | "sanctuary">("gallery");

  // Status & loaders
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; message: string } | null>(null);

  // Toast timer auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Dirty State Detection
  const isContentDirty = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(savedContent);
  }, [content, savedContent]);

  const isProductsDirty = useMemo(() => {
    return JSON.stringify(products) !== JSON.stringify(savedProducts);
  }, [products, savedProducts]);

  const isCurrentTabDirty = useMemo(() => {
    if (activeTab === "products") return isProductsDirty;
    if (activeTab === "content") return isContentDirty;
    return false;
  }, [activeTab, isProductsDirty, isContentDirty]);

  // KPIs calculation
  const kpiStats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "confirmed").length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === "all" ? true : o.status === orderStatusFilter;
      const q = orderSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.fullName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        (o.region && o.region.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.nameKa.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const res = await loginAdminAction({
      email: email.trim(),
      password,
    });

    if (!res.ok) {
      setAuthError(res.error || "არასწორი ელფოსტა ან პაროლი");
      return;
    }

    setSessionEmail(res.email ?? email.trim());
    const data = await fetchAdminDataAction();
    if (data.ok) {
      setContent(data.content);
      setSavedContent(JSON.parse(JSON.stringify(data.content)));

      setProducts(data.products);
      setSavedProducts(JSON.parse(JSON.stringify(data.products)));

      setOrders(data.orders);
    }
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    setSessionEmail(null);
  };

  // Save changes for current active tab
  const handleSaveCurrentTab = async () => {
    setSaving(true);
    setToast(null);

    try {
      if (activeTab === "products") {
        const res = await updateSaplingProductsAction(products);
        if (res.ok) {
          setSavedProducts(JSON.parse(JSON.stringify(products)));
          setToast({
            type: "ok",
            message: "პროდუქტების ფასები და ნაშთები წარმატებით შეინახა!",
          });
        } else {
          setToast({ type: "err", message: res.error || "შენახვა ვერ მოხერხდა" });
        }
      } else if (activeTab === "content") {
        const res = await saveSiteContentAction(content);
        if (res.ok) {
          setSavedContent(JSON.parse(JSON.stringify(content)));
          setToast({
            type: "ok",
            message: "საიტის კონტენტი წარმატებით განახლდა!",
          });
        } else {
          setToast({ type: "err", message: res.error || "შენახვა ვერ მოხერხდა" });
        }
      }
    } catch {
      setToast({ type: "err", message: "სერვერთან კავშირის შეცდომა." });
    } finally {
      setSaving(false);
    }
  };

  // Update single order status
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderRecord["status"]
  ) => {
    const prevOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    const res = await updateOrderStatusAction(orderId, newStatus);
    if (!res.ok) {
      setOrders(prevOrders);
      setToast({ type: "err", message: res.error || "სტატუსის შეცვლა ვერ მოხერხდა" });
    } else {
      setToast({ type: "ok", message: `შეკვეთის სტატუსი განახლდა: ${newStatus}` });
    }
  };

  const handleHeroImageUpload = async (file: File) => {
    setUploadingId("hero");
    const res = await uploadMediaFile(file);
    setUploadingId(null);
    if (res.url) {
      setContent((prev) => ({ ...prev, heroImageUrl: res.url! }));
      setToast({ type: "ok", message: "Hero ფოტო აიტვირთა!" });
    } else {
      setToast({ type: "err", message: res.error || "ატვირთვა ვერ მოხერხდა" });
    }
  };

  const handleGalleryImageUpload = async (index: number, file: File) => {
    setUploadingId(`gallery-${index}`);
    const res = await uploadMediaFile(file);
    setUploadingId(null);
    if (res.url) {
      setContent((prev) => {
        const updated = [...prev.gallery];
        updated[index] = { ...updated[index], imageUrl: res.url! };
        return { ...prev, gallery: updated };
      });
      setToast({ type: "ok", message: "გალერეის ფოტო აიტვირთა!" });
    } else {
      setToast({ type: "err", message: res.error || "ატვირთვა ვერ მოხერხდა" });
    }
  };

  const addGalleryItem = () => {
    const nextNum = String(content.gallery.length + 1).padStart(2, "0");
    const newItem: GalleryItem = {
      id: `item-${Date.now()}`,
      code: `${nextNum} / ARCHIVE`,
      categoryKa: "სანერგე მეურნეობა",
      categoryEn: "NURSERY ARCHIVE",
      titleKa: "ახალი ფოტო",
      titleEn: "New Photo",
      descriptionKa: "ფოტოს მოკლე აღწერა ქართულად.",
      descriptionEn: "Short photo description in English.",
      imageUrl:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85",
    };
    setContent((prev) => ({ ...prev, gallery: [newItem, ...prev.gallery] }));
  };

  const removeGalleryItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Missing Configuration Screen
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b08] text-[#f4f1ea] p-6">
        <div className="bg-[#121a15]/90 border border-white/10 max-w-lg rounded-3xl p-8 text-center backdrop-blur-2xl">
          <h1 className="font-display text-2xl font-bold text-[#d4af37] mb-3">
            Supabase კონფიგურაცია აკლია
          </h1>
          <p className="text-sm text-white/75 leading-relaxed">
            ადმინ პანელის ასამუშავებლად <code>.env.local</code> ფაილში დაამატეთ{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> და{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!sessionEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b08] text-[#f4f1ea] p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08),transparent_60%)] pointer-events-none" />

        <form
          onSubmit={handleLogin}
          className="bg-[#0f1712]/90 border border-[#d4af37]/25 max-w-md w-full rounded-3xl p-8 space-y-5 backdrop-blur-2xl shadow-2xl relative z-10"
        >
          <div>
            <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#d4af37] block mb-1">
              ROYAL TREE • მართვის პანელი
            </span>
            <h1 className="font-display text-2xl font-bold">
              ავტორიზაცია
            </h1>
          </div>

          <div>
            <label className="block text-xs mb-1.5 text-white/70">
              ელფოსტა
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="admin@royaltree.ge"
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5 text-white/70">პაროლი</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "დამალვა" : "ნახვა"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#d4af37] transition-colors"
              >
                {showPassword ? "დამალვა" : "ნახვა"}
              </button>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs leading-relaxed">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-wider uppercase cursor-pointer hover:brightness-105 active:scale-[0.99] transition-all shadow-lg shadow-[#d4af37]/20"
          >
            შესვლა
          </button>
        </form>
      </div>
    );
  }

  // Main Authenticated Admin Workspace
  return (
    <div className="min-h-screen bg-[#070c09] text-[#f4f1ea] selection:bg-[#d4af37]/30 selection:text-[#f5e7bd]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-medium shadow-2xl backdrop-blur-xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === "ok"
              ? "bg-[#102418]/95 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50"
              : "bg-[#281111]/95 border-rose-500/50 text-rose-200 shadow-rose-950/50"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              toast.type === "ok" ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
          {toast.message}
        </div>
      )}

      {/* 1. Sleek Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0a120d]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Branding & DB Status */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs px-3.5 py-1.5 rounded-full border border-white/15 text-white/70 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
            >
              ← საიტზე
            </Link>

            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-base tracking-wide text-[#f4f1ea]">
                ROYAL TREE <span className="text-[#d4af37] font-normal text-xs ml-1">WORKSPACE</span>
              </span>

              {/* Live Database status dot */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[10px]"
                title={dbConnected ? "Database Live & Connected" : "Database Disconnected"}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    dbConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                />
                <span className="text-white/60">
                  {dbConnected ? "Live DB" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Clean Tab Navigation */}
          <nav className="flex items-center p-1 rounded-full bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#d4af37] text-[#060b08] shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              ნერგები / პროდუქცია
              {isProductsDirty && (
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block align-middle" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#d4af37] text-[#060b08] shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              შეკვეთები
              {orders.filter((o) => o.status === "pending").length > 0 && (
                <span className="ml-2 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {orders.filter((o) => o.status === "pending").length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === "content"
                  ? "bg-[#d4af37] text-[#060b08] shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              კონტენტი
              {isContentDirty && (
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block align-middle" />
              )}
            </button>
          </nav>

          {/* Right: Dirty Save Button & Subtle Logout */}
          <div className="flex items-center gap-3">
            {activeTab !== "orders" && (
              <button
                type="button"
                onClick={handleSaveCurrentTab}
                disabled={saving || !isCurrentTabDirty}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  isCurrentTabDirty
                    ? "bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] shadow-lg shadow-[#d4af37]/30 hover:brightness-105"
                    : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {saving && (
                  <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                )}
                {saving ? "ინახება..." : isCurrentTabDirty ? "ცვლილებების შენახვა" : "შენახულია"}
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs px-3.5 py-2 rounded-full border border-white/10 text-white/50 hover:text-rose-300 hover:border-rose-500/30 transition-colors"
            >
              გასვლა
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* 2. Top 4-Card KPI Summary Bar */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-5 border-l-4 border-l-[#d4af37] shadow-xl backdrop-blur-xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 block mb-1">
              სულ შეკვეთები
            </span>
            <div className="font-display text-3xl font-bold text-[#f4f1ea]">
              {kpiStats.totalOrders}
            </div>
            <span className="text-[11px] text-white/40 mt-1 block">რეგისტრირებული</span>
          </div>

          <div className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-5 border-l-4 border-l-amber-500 shadow-xl backdrop-blur-xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400/80 block mb-1">
              ახალი / მოლოდინში
            </span>
            <div className="font-display text-3xl font-bold text-amber-200">
              {kpiStats.pendingOrders}
            </div>
            <span className="text-[11px] text-amber-400/60 mt-1 block">საჭიროებს დამუშავებას</span>
          </div>

          <div className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-5 border-l-4 border-l-emerald-500 shadow-xl backdrop-blur-xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400/80 block mb-1">
              დადასტურებული / გაგზავნილი
            </span>
            <div className="font-display text-3xl font-bold text-emerald-200">
              {kpiStats.completedOrders}
            </div>
            <span className="text-[11px] text-emerald-400/60 mt-1 block">დახურული გარიგებები</span>
          </div>

          <div className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-5 border-l-4 border-l-sky-500 shadow-xl backdrop-blur-xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-sky-400/80 block mb-1">
              ჯამური ბრუნვა
            </span>
            <div className="font-display text-3xl font-bold text-sky-200">
              {kpiStats.totalRevenue.toLocaleString()} ₾
            </div>
            <span className="text-[11px] text-sky-400/60 mt-1 block">
              ~${Math.round(kpiStats.totalRevenue / 2.75).toLocaleString()} USD
            </span>
          </div>
        </section>

        {/* 3. TAB 1: ნერგები / პროდუქცია (Products & Saplings Management) */}
        {activeTab === "products" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#f4f1ea]">
                  პავლოვნიის ნერგების კატალოგი და ნაშთები
                </h2>
                <p className="text-xs text-white/50">
                  განაახლეთ ნერგების ფასები, სასაწყობო მარაგები და ზომები.
                </p>
              </div>

              <input
                type="text"
                placeholder="პროდუქტის ძებნა..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="px-4 py-2 rounded-xl bg-[#121a15] border border-white/10 text-xs w-64 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((p, idx) => {
                const original = savedProducts.find((sp) => sp.id === p.id) || p;
                const isItemDirty =
                  p.price !== original.price ||
                  p.stockCount !== original.stockCount ||
                  p.heightKa !== original.heightKa;

                return (
                  <div
                    key={p.id}
                    className={`bg-[#121a15]/90 border rounded-2xl p-6 space-y-4 backdrop-blur-xl transition-all border-l-4 ${
                      isItemDirty
                        ? "border-l-amber-400 border-white/20 shadow-amber-950/20"
                        : "border-l-[#d4af37]/60 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">
                        {p.id.toUpperCase()}
                      </span>
                      {isItemDirty && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                          მოდიფიცირებული
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {p.nameKa}
                      </h3>
                      <span className="text-xs text-white/40">{p.nameEn}</span>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                      <div>
                        <label className="block text-white/60 mb-1">
                          ფასი (₾ ცალი)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={p.price}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setProducts((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, price: val } : item
                              )
                            );
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 font-bold text-sm text-[#f5e7bd] focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      <div>
                        <label className="block text-white/60 mb-1">
                          ხელმისაწვდომი მარაგი (ცალი)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={p.stockCount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setProducts((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, stockCount: val } : item
                              )
                            );
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      <div>
                        <label className="block text-white/60 mb-1">
                          სიმაღლე (სტანდარტი)
                        </label>
                        <input
                          type="text"
                          value={p.heightKa || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProducts((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, heightKa: val } : item
                              )
                            );
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white/90 focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. TAB 2: შეკვეთები (Orders Management) */}
        {activeTab === "orders" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#f4f1ea]">
                  შემოსული რეზერვაციები & შეკვეთები
                </h2>
                <p className="text-xs text-white/50">
                  მომხმარებელთა საკონტაქტო მონაცემები და შეკვეთის სტატუსები.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: "all", label: "ყველა" },
                  { key: "pending", label: "მოლოდინში" },
                  { key: "confirmed", label: "დადასტურებული" },
                  { key: "completed", label: "შესრულებული" },
                  { key: "cancelled", label: "გაუქმებული" },
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setOrderStatusFilter(st.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      orderStatusFilter === st.key
                        ? "bg-[#d4af37] text-[#060b08] font-bold"
                        : "bg-[#121a15] text-white/60 hover:text-white border border-white/10"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}

                <input
                  type="text"
                  placeholder="სახელით ან ტელეფონით..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="px-4 py-1.5 rounded-xl bg-[#121a15] border border-white/10 text-xs w-52 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-12 text-center text-white/50 text-xs">
                შეკვეთები არ მოიძებნა. ახალი შეკვეთები ავტომატურად იგზავნება Resend-ით ელფოსტაზე და ინახება ბაზაში.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((ord) => {
                  const statusColors: Record<OrderRecord["status"], { border: string; pill: string; text: string }> = {
                    pending: {
                      border: "border-l-amber-500",
                      pill: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                      text: "მოლოდინში",
                    },
                    confirmed: {
                      border: "border-l-sky-500",
                      pill: "bg-sky-500/20 text-sky-300 border-sky-500/40",
                      text: "დადასტურებული",
                    },
                    completed: {
                      border: "border-l-emerald-500",
                      pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                      text: "შესრულებული",
                    },
                    cancelled: {
                      border: "border-l-rose-500",
                      pill: "bg-rose-500/20 text-rose-300 border-rose-500/40",
                      text: "გაუქმებული",
                    },
                  };

                  const currentStyle = statusColors[ord.status] || statusColors.pending;

                  return (
                    <div
                      key={ord.id}
                      className={`bg-[#121a15]/90 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-xl border-l-4 ${currentStyle.border}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-base text-white">
                            {ord.fullName}
                          </h3>
                          <a
                            href={`tel:${ord.phone}`}
                            className="text-xs text-[#d4af37] hover:underline"
                          >
                            {ord.phone}
                          </a>
                        </div>

                        {/* Status Dropdown Pill */}
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value as OrderRecord["status"])
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer bg-[#070c09] focus:outline-none ${currentStyle.pill}`}
                        >
                          <option value="pending">მოლოდინში</option>
                          <option value="confirmed">დადასტურებული</option>
                          <option value="completed">შესრულებული</option>
                          <option value="cancelled">გაუქმებული</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs bg-black/30 p-3 rounded-xl border border-white/5">
                        <div>
                          <span className="text-white/40 block">რეგიონი / ლოკაცია:</span>
                          <span className="text-white/90">{ord.region || "არ არის მითითებული"}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">სულ ნერგები:</span>
                          <span className="font-bold text-[#f5e7bd]">{ord.totalTrees} ცალი</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">ჯამური ფასი:</span>
                          <span className="font-bold text-emerald-300">{ord.totalPrice.toLocaleString()} ₾</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">თარიღი:</span>
                          <span className="text-white/70">
                            {new Date(ord.created_at).toLocaleDateString("ka-GE")}
                          </span>
                        </div>
                      </div>

                      {ord.notes && (
                        <p className="text-xs text-white/60 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                          &ldquo;{ord.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 5. TAB 3: კონტენტი (Hero, Gallery, Sanctuary) */}
        {activeTab === "content" && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              {[
                { key: "gallery", label: "პლანტაციის გალერეა" },
                { key: "hero", label: "მთავარი სექცია (Hero)" },
                { key: "sanctuary", label: "ცოდნის სივრცე (Sanctuary)" },
              ].map((sub) => (
                <button
                  key={sub.key}
                  type="button"
                  onClick={() => setContentSubTab(sub.key as "hero" | "gallery" | "sanctuary")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    contentSubTab === sub.key
                      ? "bg-white/10 text-[#f5e7bd] border border-[#d4af37]/40"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab: Gallery */}
            {contentSubTab === "gallery" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">
                    სულ: {content.gallery.length} ფოტო-ბარათი
                  </span>
                  <button
                    type="button"
                    onClick={addGalleryItem}
                    className="px-4 py-2 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f5e7bd] text-xs font-bold hover:bg-[#d4af37]/30 transition-all cursor-pointer"
                  >
                    + ახალი ფოტოს დამატება
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.gallery.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-xl border-l-4 border-l-[#d4af37]/40"
                    >
                      <div className="relative h-48 rounded-xl overflow-hidden bg-black/40">
                        <Image
                          src={item.imageUrl}
                          alt={item.titleKa}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <label className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-black/80 border border-[#d4af37]/50 text-[11px] font-semibold text-[#f5e7bd] cursor-pointer hover:bg-black transition-colors">
                          {uploadingId === `gallery-${idx}`
                            ? "იტვირთება..."
                            : "ფოტოს შეცვლა"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGalleryImageUpload(idx, file);
                            }}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-white/50 mb-1">კოდი / ნომერი</label>
                          <input
                            type="text"
                            value={item.code}
                            onChange={(e) => {
                              const updated = [...content.gallery];
                              updated[idx] = { ...item, code: e.target.value };
                              setContent({ ...content, gallery: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 mb-1">კატეგორია (ქარ)</label>
                          <input
                            type="text"
                            value={item.categoryKa}
                            onChange={(e) => {
                              const updated = [...content.gallery];
                              updated[idx] = { ...item, categoryKa: e.target.value };
                              setContent({ ...content, gallery: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <label className="block text-white/50">სათაური (ქარ)</label>
                        <input
                          type="text"
                          value={item.titleKa}
                          onChange={(e) => {
                            const updated = [...content.gallery];
                            updated[idx] = { ...item, titleKa: e.target.value };
                            setContent({ ...content, gallery: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        {/* Custom Toggle Switch for SpanWide */}
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-white/60">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={item.spanWide}
                            onClick={() => {
                              const updated = [...content.gallery];
                              updated[idx] = { ...item, spanWide: !item.spanWide };
                              setContent({ ...content, gallery: updated });
                            }}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer relative ${
                              item.spanWide ? "bg-[#d4af37]" : "bg-white/20"
                            }`}
                          >
                            <span
                              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                                item.spanWide ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                          ორმაგი სიგანე (Bento Wide)
                        </label>

                        <button
                          type="button"
                          onClick={() => removeGalleryItem(idx)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        >
                          წაშლა
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab: Hero */}
            {contentSubTab === "hero" && (
              <div className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-5 border-l-4 border-l-[#d4af37]">
                <h3 className="font-display text-lg font-bold">
                  მთავარი სექციის ფოტო-ჩარჩო & წარწერები
                </h3>

                <div className="relative h-64 rounded-xl overflow-hidden bg-black/40">
                  <Image
                    src={content.heroImageUrl}
                    alt="Hero Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <label className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/80 border border-[#d4af37] text-xs font-semibold text-[#f5e7bd] cursor-pointer hover:bg-black transition-colors">
                    {uploadingId === "hero" ? "იტვირთება..." : "ახალი ფოტოს ატვირთვა"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroImageUpload(file);
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 text-white/60">
                      ფოტოს ქვედა წარწერა (ქარ)
                    </label>
                    <input
                      type="text"
                      value={content.heroCaptionKa}
                      onChange={(e) =>
                        setContent({ ...content, heroCaptionKa: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-white/60">
                      Photo Caption (ENG)
                    </label>
                    <input
                      type="text"
                      value={content.heroCaptionEn}
                      onChange={(e) =>
                        setContent({ ...content, heroCaptionEn: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab: Sanctuary */}
            {contentSubTab === "sanctuary" && (
              <div className="space-y-6">
                {content.dossierTabs.map((tab, tIdx) => (
                  <div
                    key={tab.id}
                    className="bg-[#121a15]/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 border-l-4 border-l-[#d4af37]/40"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">
                      ტაბი #{tIdx + 1} — {tab.labelKa}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block mb-1 text-white/60">სათაური (ქარ)</label>
                        <input
                          type="text"
                          value={tab.titleKa}
                          onChange={(e) => {
                            const updated = [...content.dossierTabs];
                            updated[tIdx] = { ...tab, titleKa: e.target.value };
                            setContent({ ...content, dossierTabs: updated });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-white/60">Title (ENG)</label>
                        <input
                          type="text"
                          value={tab.titleEn}
                          onChange={(e) => {
                            const updated = [...content.dossierTabs];
                            updated[tIdx] = { ...tab, titleEn: e.target.value };
                            setContent({ ...content, dossierTabs: updated });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block mb-1 text-white/60">
                        ტექსტი (ქარ — აბზაცები გამოყავით Enter-ით)
                      </label>
                      <textarea
                        rows={4}
                        value={tab.paragraphsKa.join("\n\n")}
                        onChange={(e) => {
                          const updated = [...content.dossierTabs];
                          updated[tIdx] = {
                            ...tab,
                            paragraphsKa: e.target.value
                              .split("\n\n")
                              .filter(Boolean),
                          };
                          setContent({ ...content, dossierTabs: updated });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
