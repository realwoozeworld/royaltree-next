"use client";

import React from "react";
import Image from "next/image";
import { Language } from "@/types/botanical";

interface HeroProps {
  lang: Language;
  onOpenOrderModal: () => void;
  imageUrl?: string;
  captionKa?: string;
  captionEn?: string;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOpenOrderModal,
  imageUrl,
  captionKa,
  captionEn,
}) => {
  const stats = [
    { value: "4–5 მ", ka: "წლიური ზრდა", en: "Annual Growth" },
    { value: "10×", ka: "CO₂ შთანთქმა", en: "CO₂ Absorption" },
    { value: "5–7 წ.", ka: "მერქნის ციკლი", en: "Harvest Cycle" },
    { value: "10₾-დან", ka: "1-წლიანი ნერგი", en: "1-Yr Seedling" },
  ];

  const activeImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85";

  return (
    <section className="relative z-10 pt-36 pb-20 sm:pt-44 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 section-header-shield text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[var(--gold-main)]/35 bg-[var(--glass-bg)] text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--gold-main)] mb-7">
              <span>
                {lang === "ka"
                  ? "კასპის სანერგე • სამეფო ხე • PAULOWNIA TOMENTOSA"
                  : "KASPI NURSERY • EMPRESS TREE • PAULOWNIA TOMENTOSA"}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.2] tracking-[0.01em] mb-6">
              {lang === "ka" ? (
                <>
                  მომავლის მწვანე{" "}
                  <span className="text-gold-gradient">ინვესტიცია</span>{" "}
                  საქართველოში
                </>
              ) : (
                <>
                  The Future of{" "}
                  <span className="text-gold-gradient">Botanical Wealth</span> in
                  Georgia
                </>
              )}
            </h1>

            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-9">
              {lang === "ka"
                ? "პავლოვნია ტომენტოზას სერტიფიცირებული სანერგე მეურნეობა და სამრეწველო პლანტაციები. ჩამოსქროლეთ ქვემოთ, რათა იხილოთ ხის არქიტექტურა ვარჯიდან ღრმა ფესვთა სისტემამდე."
                : "Certified Paulownia Tomentosa nursery and commercial timber plantations. Scroll down to explore the tree's architecture from blossom canopy to deep root network."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onOpenOrderModal}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-[0.18em] uppercase shadow-xl shadow-[#d4af37]/25 hover:scale-[1.02] transition-all cursor-pointer"
              >
                {lang === "ka" ? "ნერგების დაჯავშნა" : "Reserve Seedlings"}
              </button>

              <a
                href="#configurator"
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel text-xs font-bold tracking-[0.18em] uppercase hover:border-[var(--gold-main)] transition-all text-center"
              >
                {lang === "ka" ? "ROI კალკულატორი" : "ROI Configurator"}
              </a>
            </div>
          </div>

          {/* Right Column: Botanical Estate Framed Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-[2rem] p-3.5 relative">
              <div className="relative h-[380px] sm:h-[430px] rounded-[1.5rem] overflow-hidden">
                <Image
                  src={activeImage}
                  alt="Paulownia Tomentosa Royal Tree Plantation"
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b08]/90 via-[#060b08]/20 to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-[#d4af37]/35 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#f5e7bd]">
                    {lang === "ka"
                      ? "სოფ. მეფისქალაქი • კასპი"
                      : "MEPISKALAKI • KASPI"}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#d4af37]/20 backdrop-blur-md border border-[#d4af37]/40 text-[10px] font-bold tracking-widest uppercase text-[#f5e7bd]">
                    625 / HA
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#d4af37] block mb-1">
                    {lang === "ka"
                      ? "სერტიფიცირებული გენეტიკა"
                      : "CERTIFIED GENETICS"}
                  </span>
                  <h2 className="font-display text-lg sm:text-[22px] leading-[1.2] tracking-[0.01em] font-semibold text-[#f4f1ea] mb-1">
                    პავლოვნია ტომენტოზა • სამეფო ხე
                  </h2>
                  <p className="text-xs text-[#f4f1ea]/75">
                    {lang === "ka"
                      ? captionKa ||
                        "სწორღეროიანი, სწრაფმზარდი ელიტარული ნერგები 10₾-დან."
                      : captionEn ||
                        "Straight-trunk, fast-growing elite seedlings starting from 10₾."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 4-Column Key Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mt-12">
          {stats.map((item) => (
            <div
              key={item.en}
              className="glass-panel rounded-2xl p-5 text-center"
            >
              <div className="font-body text-2xl sm:text-3xl font-semibold tabular-nums text-gold-gradient mb-1">
                {item.value}
              </div>
              <div className="text-xs tracking-wider uppercase text-[var(--text-muted)]">
                {lang === "ka" ? item.ka : item.en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};