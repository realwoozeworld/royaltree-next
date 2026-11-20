"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/data/paulowniaData";
import { GalleryItem, Language } from "@/types/botanical";

interface PlantationGalleryProps {
  lang: Language;
}

export const PlantationGallery: React.FC<PlantationGalleryProps> = ({
  lang,
}) => {
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
              : "04 / ESTATE VISUAL ARCHIVE"}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
            {lang === "ka"
              ? "ჩვენი პლანტაცია ახალქალაქში"
              : "Our Plantation in Akhalkalaki"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {lang === "ka"
              ? "კასპის რაიონი, სოფ. ახალქალაქი — სერტიფიცირებული სანერგე მეურნეობა და სამრეწველო კორომები."
              : "Akhalkalaki, Kaspi Municipality — certified seedling nursery and commercial timber groves."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className="group glass-panel rounded-3xl overflow-hidden text-left cursor-pointer flex flex-col"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={lang === "ka" ? item.titleKa : item.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b08]/85 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-[#d4af37]/35 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#f5e7bd]">
                  {item.code}
                </span>
              </div>

              <div className="p-6 sm:p-7 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold-main)] block mb-1.5">
                    {lang === "ka" ? item.categoryKa : item.categoryEn}
                  </span>
                  <h3 className="font-display text-xl font-bold mb-1.5">
                    {lang === "ka" ? item.titleKa : item.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2">
                    {lang === "ka" ? item.descriptionKa : item.descriptionEn}
                  </p>
                </div>

                <span className="shrink-0 w-10 h-10 rounded-full border border-[var(--gold-main)]/40 flex items-center justify-center text-[var(--gold-main)] group-hover:bg-[var(--gold-main)] group-hover:text-[#060b08] transition-all">
                  ↗
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-w-3xl w-full rounded-3xl overflow-hidden"
          >
            <div className="relative h-72 sm:h-96">
              <Image
                src={selectedItem.imageUrl}
                alt={
                  lang === "ka" ? selectedItem.titleKa : selectedItem.titleEn
                }
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/65 text-white border border-white/20 flex items-center justify-center hover:border-[#d4af37] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--gold-main)] block mb-2">
                {selectedItem.code} •{" "}
                {lang === "ka"
                  ? selectedItem.categoryKa
                  : selectedItem.categoryEn}
              </span>
              <h3 className="font-display text-2xl font-bold mb-2">
                {lang === "ka" ? selectedItem.titleKa : selectedItem.titleEn}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
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