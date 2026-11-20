"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DEFAULT_SITE_CONTENT,
  DynamicSiteContent,
  fetchSiteContent,
  saveSiteContent,
  uploadMediaFile,
} from "@/lib/contentStore";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { GalleryItem } from "@/types/botanical";

export default function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [content, setContent] =
    useState<DynamicSiteContent>(DEFAULT_SITE_CONTENT);
  const [activeTab, setActiveTab] = useState<"hero" | "gallery" | "sanctuary">(
    "gallery"
  );
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setAuthLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSessionEmail(data.session?.user?.email ?? null);

      const loaded = await fetchSiteContent();
      setContent(loaded);
      setAuthLoading(false);
    };
    init();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setAuthError(
        error.message === "Invalid login credentials"
          ? "არასწორი ელფოსტა ან პაროლი"
          : error.message
      );
      return;
    }

    setSessionEmail(data.user?.email ?? null);
    const loaded = await fetchSiteContent();
    setContent(loaded);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSessionEmail(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMsg(null);
    const res = await saveSiteContent(content);
    setSaving(false);

    if (res.ok) {
      setStatusMsg({
        type: "ok",
        text: "ცვლილებები წარმატებით შეინახა და აისახა საიტზე!",
      });
    } else {
      setStatusMsg({
        type: "err",
        text: res.error || "შენახვა ვერ მოხერხდა",
      });
    }
  };

  const handleHeroImageUpload = async (file: File) => {
    setUploadingId("hero");
    const res = await uploadMediaFile(file);
    setUploadingId(null);
    if (res.url) {
      setContent((prev) => ({ ...prev, heroImageUrl: res.url! }));
    } else {
      setStatusMsg({
        type: "err",
        text: res.error || "ატვირთვა ვერ მოხერხდა",
      });
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
    } else {
      setStatusMsg({
        type: "err",
        text: res.error || "ატვირთვა ვერ მოხერხდა",
      });
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
    setContent((prev) => ({ ...prev, gallery: [...prev.gallery, newItem] }));
  };

  const removeGalleryItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b08] text-[#f4f1ea]">
        იტვირთება...
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b08] text-[#f4f1ea] p-6">
        <div className="glass-panel max-w-lg rounded-3xl p-8 text-center">
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

  if (!sessionEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b08] text-[#f4f1ea] p-4">
        <form
          onSubmit={handleLogin}
          className="glass-panel max-w-md w-full rounded-3xl p-8 space-y-5"
        >
          <div>
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#d4af37] block mb-1">
              ROYAL TREE • ADMIN
            </span>
            <h1 className="font-display text-2xl font-bold">
              მართვის პანელში შესვლა
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
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[#d4af37]/30 text-sm focus:outline-none focus:border-[#d4af37]"
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
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/30 border border-[#d4af37]/30 text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "პაროლის დამალვა" : "პაროლის ნახვა"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-[#d4af37] transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {authError && <p className="text-xs text-red-400">{authError}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-wider uppercase cursor-pointer"
          >
            შესვლა
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b08] text-[#f4f1ea] pb-20">
      <header className="sticky top-0 z-30 bg-[#0a120d]/90 backdrop-blur-xl border-b border-[#d4af37]/20 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs px-3.5 py-2 rounded-full border border-[#d4af37]/35 text-[#d4af37] hover:bg-[#d4af37]/10"
            >
              ← საიტზე დაბრუნება
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold">
                Royal Tree — კონტენტის მართვა
              </h1>
              <p className="text-[11px] text-white/50">{sessionEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-wider uppercase cursor-pointer disabled:opacity-60"
            >
              {saving ? "ინახება..." : "ცვლილებების შენახვა"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full border border-white/20 text-xs text-white/70 hover:text-white cursor-pointer"
            >
              გასვლა
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        {statusMsg && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-medium border ${
              statusMsg.type === "ok"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/60 border-red-500/40 text-red-200"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 mb-8">
          {[
            { id: "gallery", label: "გალერეა და ფოტოები" },
            { id: "hero", label: "მთავარი ბანერის ფოტო (Hero)" },
            { id: "sanctuary", label: "ცოდნის სანქტუარიუმი (ტექსტები)" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer ${
                activeTab === t.id
                  ? "bg-[#d4af37] text-[#060b08]"
                  : "glass-panel text-white/75 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                გალერეის ელემენტები ({content.gallery.length})
              </h2>
              <button
                type="button"
                onClick={addGalleryItem}
                className="px-4 py-2 rounded-full border border-[#d4af37] text-xs font-semibold text-[#d4af37] hover:bg-[#d4af37]/10 cursor-pointer"
              >
                + ახალი ფოტოს დამატება
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.gallery.map((item, idx) => (
                <div
                  key={item.id}
                  className="glass-panel rounded-3xl p-6 space-y-4"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-black/40">
                    <Image
                      src={item.imageUrl}
                      alt={item.titleKa}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <label className="absolute bottom-3 right-3 px-3.5 py-2 rounded-full bg-black/75 border border-[#d4af37]/50 text-[11px] font-semibold text-[#f5e7bd] cursor-pointer hover:bg-black">
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
                      <label className="block mb-1 text-white/60">
                        სათაური (ქარ)
                      </label>
                      <input
                        type="text"
                        value={item.titleKa}
                        onChange={(e) => {
                          const updated = [...content.gallery];
                          updated[idx] = { ...item, titleKa: e.target.value };
                          setContent({ ...content, gallery: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-white/60">
                        Title (ENG)
                      </label>
                      <input
                        type="text"
                        value={item.titleEn}
                        onChange={(e) => {
                          const updated = [...content.gallery];
                          updated[idx] = { ...item, titleEn: e.target.value };
                          setContent({ ...content, gallery: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block mb-1 text-white/60">
                        კატეგორია (ქარ)
                      </label>
                      <input
                        type="text"
                        value={item.categoryKa}
                        onChange={(e) => {
                          const updated = [...content.gallery];
                          updated[idx] = {
                            ...item,
                            categoryKa: e.target.value,
                          };
                          setContent({ ...content, gallery: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-white/60">
                        Category (ENG)
                      </label>
                      <input
                        type="text"
                        value={item.categoryEn}
                        onChange={(e) => {
                          const updated = [...content.gallery];
                          updated[idx] = {
                            ...item,
                            categoryEn: e.target.value,
                          };
                          setContent({ ...content, gallery: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block mb-1 text-white/60">
                        აღწერა (ქარ)
                      </label>
                      <textarea
                        rows={2}
                        value={item.descriptionKa}
                        onChange={(e) => {
                          const updated = [...content.gallery];
                          updated[idx] = {
                            ...item,
                            descriptionKa: e.target.value,
                          };
                          setContent({ ...content, gallery: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-white/60">
                        Description (ENG)
                      </label>
                      <textarea
                        rows={2}
                        value={item.descriptionEn}
                        onChange={(e) => {
                          const updated = [...content.gallery];
                          updated[idx] = {
                            ...item,
                            descriptionEn: e.target.value,
                          };
                          setContent({ ...content, gallery: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      წაშლა
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl space-y-5">
            <h2 className="font-display text-xl font-bold">
              მთავარი სექციის ფოტო-ჩარჩო
            </h2>

            <div className="relative h-64 rounded-2xl overflow-hidden bg-black/40">
              <Image
                src={content.heroImageUrl}
                alt="Hero Preview"
                fill
                unoptimized
                className="object-cover"
              />
              <label className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/80 border border-[#d4af37] text-xs font-semibold text-[#f5e7bd] cursor-pointer">
                {uploadingId === "hero"
                  ? "იტვირთება..."
                  : "ახალი ფოტოს ატვირთვა"}
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/15"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/15"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "sanctuary" && (
          <div className="space-y-6">
            {content.dossierTabs.map((tab, tIdx) => (
              <div
                key={tab.id}
                className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">
                  ტაბი #{tIdx + 1} — {tab.labelKa}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block mb-1 text-white/60">
                      სათაური (ქარ)
                    </label>
                    <input
                      type="text"
                      value={tab.titleKa}
                      onChange={(e) => {
                        const updated = [...content.dossierTabs];
                        updated[tIdx] = { ...tab, titleKa: e.target.value };
                        setContent({ ...content, dossierTabs: updated });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/15"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white/60">
                      Title (ENG)
                    </label>
                    <input
                      type="text"
                      value={tab.titleEn}
                      onChange={(e) => {
                        const updated = [...content.dossierTabs];
                        updated[tIdx] = { ...tab, titleEn: e.target.value };
                        setContent({ ...content, dossierTabs: updated });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block mb-1 text-white/60">
                      ტექსტი (ქარ — აბზაცები გამოყავით Enter-ით)
                    </label>
                    <textarea
                      rows={5}
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/15"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white/60">
                      Text (ENG — separate paragraphs with blank line)
                    </label>
                    <textarea
                      rows={5}
                      value={tab.paragraphsEn.join("\n\n")}
                      onChange={(e) => {
                        const updated = [...content.dossierTabs];
                        updated[tIdx] = {
                          ...tab,
                          paragraphsEn: e.target.value
                            .split("\n\n")
                            .filter(Boolean),
                        };
                        setContent({ ...content, dossierTabs: updated });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/15"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}