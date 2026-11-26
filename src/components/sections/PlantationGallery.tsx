"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/data/paulowniaData";
import { GalleryItem, Language } from "@/types/botanical";

interface PlantationGalleryProps {
  lang: Language;
  items?: GalleryItem[];
}

export const PlantationGallery: React.FC<PlantationGalleryProps> = ({
  lang,
  items,
}) => {
  const list = items && items.length > 0 ? items : GALLERY_ITEMS;
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section
      id="gallery"
      className="relative z-10 py-20 sm:py-28 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center section-header-shield mb-14">
          <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--gold-main)] block mb-3">
            {lang === "ka"
              ? "04 / მეურნეობის ვიზუალური არქივი"
              : "04 / VISUAL ARCHIVE"}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-[1.2] tracking-[0.01em] mb-4">
            {lang === "ka"
              ? "ჩვენი პლანტაცია მეფისქალაქში"
              : "Our Mepiskalaki Plantation"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {lang === "ka"
              ? "კასპის რაიონი, სოფ. მეფისქალაქი — სერტიფიცირებული სანერგე მეურნეობა და სამრეწველო კორომები."
              : "Mepiskalaki village, Kaspi Municipality — certified nursery and commercial Paulownia groves."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="glass-panel rounded-3xl overflow-hidden group cursor-pointer flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={lang === "ka" ? item.titleKa : item.titleEn}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase text-[#f5e7bd] border border-[#d4af37]/30">
                  {item.code}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold-main)] block mb-1.5">
                    {lang === "ka" ? item.categoryKa : item.categoryEn}
                  </span>
                  <h3 className="font-display text-xl font-bold mb-2">
                    {lang === "ka" ? item.titleKa : item.titleEn}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {lang === "ka" ? item.descriptionKa : item.descriptionEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--gold-main)]/15 flex items-center justify-between text-[11px] font-semibold text-[var(--gold-main)]">
                  <span>
                    {lang === "ka" ? "დეტალურად ნახვა" : "Inspect Archive"}
                  </span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-w-3xl w-full rounded-3xl overflow-hidden relative"
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-[#f5e7bd] border border-[#d4af37]/40 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="relative w-full h-[60vh] max-h-[650px] bg-black/60">
              <Image
                src={selectedItem.imageUrl}
                alt={
                  lang === "ka" ? selectedItem.titleKa : selectedItem.titleEn
                }
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="p-6 sm:p-8">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold-main)] block mb-1">
                {selectedItem.code} •{" "}
                {lang === "ka"
                  ? selectedItem.categoryKa
                  : selectedItem.categoryEn}
              </span>
              <h3 className="font-display text-2xl font-bold mb-2">
                {lang === "ka"
                  ? selectedItem.titleKa
                  : selectedItem.titleEn}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {lang === "ka"
                  ? selectedItem.descriptionKa
                  : selectedItem.descriptionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};