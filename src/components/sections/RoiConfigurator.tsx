"use client";

import React from "react";
import { Language, TierQuantities } from "@/types/botanical";

interface RoiConfiguratorProps {
  lang: Language;
  quantities: TierQuantities;
  onChangeQuantity: (tier: keyof TierQuantities, value: number) => void;
  onApplyPreset: (totalTrees: number) => void;
  onOpenOrderModal: () => void;
}

export const RoiConfigurator: React.FC<RoiConfiguratorProps> = ({
  lang,
  quantities,
  onChangeQuantity,
  onApplyPreset,
  onOpenOrderModal,
}) => {
  const tiers: {
    key: keyof TierQuantities;
    badgeKa: string;
    badgeEn: string;
    titleKa: string;
    titleEn: string;
    heightKa: string;
    heightEn: string;
    price: number;
    featured?: boolean;
  }[] = [
    {
      key: "tier1",
      badgeKa: "კლასი I • სტანდარტი",
      badgeEn: "TIER I • STANDARD",
      titleKa: "1-წლიანი ნერგი",
      titleEn: "1-Year Seedling",
      heightKa: "სიმაღლე: 1.0 – 1.5 მეტრი",
      heightEn: "Height: 1.0 – 1.5 meters",
      price: 10,
    },
    {
      key: "tier2",
      badgeKa: "კლასი II • პოპულარული",
      badgeEn: "TIER II • MOST POPULAR",
      titleKa: "ელიტარული ნერგი",
      titleEn: "Elite Seedling",
      heightKa: "სიმაღლე: 2.0 – 2.5 მეტრი",
      heightEn: "Height: 2.0 – 2.5 meters",
      price: 20,
      featured: true,
    },
    {
      key: "tier3",
      badgeKa: "კლასი III • პრემიუმი",
      badgeEn: "TIER III • ROYAL GRADE",
      titleKa: "სამეფო ეგზემპლარი",
      titleEn: "Royal Specimen",
      heightKa: "სიმაღლე: 3.0 – 4.0 მეტრი",
      heightEn: "Height: 3.0 – 4.0 meters",
      price: 50,
    },
  ];

  const totalTrees = quantities.tier1 + quantities.tier2 + quantities.tier3;
  const totalPrice =
    quantities.tier1 * 10 + quantities.tier2 * 20 + quantities.tier3 * 50;

  // 625 trees per 1 ha (4x4m grid)
  const recommendedHectares = (totalTrees / 625).toFixed(2);
  // Avg ~0.58 m3 commercial timber per tree in 5-7 yrs
  const projectedTimberM3 = Math.round(totalTrees * 0.58);
  // Avg ~0.16 tons CO2 captured per tree annually
  const annualCo2Tons = (totalTrees * 0.16).toFixed(1);

  const presets = [
    { labelKa: "0.1 ჰა (62 ნერგი)", labelEn: "0.1 ha (62 trees)", trees: 62 },
    { labelKa: "0.5 ჰა (312 ნერგი)", labelEn: "0.5 ha (312 trees)", trees: 312 },
    { labelKa: "1.0 ჰა (625 ნერგი)", labelEn: "1.0 ha (625 trees)", trees: 625 },
    { labelKa: "5.0 ჰა (3125 ნერგი)", labelEn: "5.0 ha (3125 trees)", trees: 3125 },
  ];

  return (
    <section
      id="configurator"
      className="relative z-10 py-20 sm:py-28 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center section-header-shield mb-12">
          <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--gold-main)] block mb-3">
            {lang === "ka" ? "02 / ინვესტიციის დაგეგმვა" : "02 / INVESTMENT PLANNER"}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
            {lang === "ka"
              ? "ნერგების კონფიგურატორი & ROI კალკულატორი"
              : "Seedling Configurator & ROI Calculator"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {lang === "ka"
              ? "აირჩიეთ სასურველი კლასის ნერგები და იხილეთ სიმულაციური 5-წლიანი მერქნისა და ეკოლოგიური შედეგი."
              : "Select your preferred seedling tiers and preview simulated 5-year timber yield and carbon capture."}
          </p>
        </div>

        {/* Hectare Presets Bar */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 mb-7 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--gold-main)] block mb-1">
              {lang === "ka"
                ? "კომერციული პლანტაციის სიმულატორი"
                : "COMMERCIAL PLANTATION SIMULATOR"}
            </span>
            <p className="text-sm font-medium">
              {lang === "ka"
                ? "სწრაფი გათვლა ფართობის მიხედვით (სტანდარტი: 625 ნერგი / 1 ჰა)"
                : "Quick calculation by land area (Standard: 625 seedlings / 1 ha)"}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {presets.map((p) => (
              <button
                key={p.trees}
                type="button"
                onClick={() => onApplyPreset(p.trees)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  totalTrees === p.trees
                    ? "bg-[var(--gold-main)] text-[#060b08] border-[var(--gold-main)]"
                    : "border-[var(--gold-main)]/35 hover:border-[var(--gold-main)] text-[var(--text-secondary)]"
                }`}
              >
                {lang === "ka" ? p.labelKa : p.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Main 4-Column Grid: 3 Tiers + Summary Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {tiers.map((tier) => {
            const qty = quantities[tier.key];
            const subtotal = qty * tier.price;

            return (
              <div
                key={tier.key}
                className={`glass-panel rounded-3xl p-6 flex flex-col justify-between relative ${
                  tier.featured
                    ? "ring-1 ring-[var(--gold-main)]/60"
                    : ""
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--gold-main)] block mb-2">
                    {lang === "ka" ? tier.badgeKa : tier.badgeEn}
                  </span>

                  <h3 className="font-display text-xl font-bold mb-1">
                    {lang === "ka" ? tier.titleKa : tier.titleEn}
                  </h3>

                  <div className="font-display text-3xl font-bold text-gold-gradient mb-2">
                    {tier.price}₾
                  </div>

                  <p className="text-xs text-[var(--text-muted)] mb-6">
                    {lang === "ka" ? tier.heightKa : tier.heightEn}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor={`input-${tier.key}`}
                      className="text-xs text-[var(--text-secondary)]"
                    >
                      {lang === "ka" ? "რაოდენობა:" : "Quantity:"}
                    </label>
                    <input
                      id={`input-${tier.key}`}
                      type="number"
                      min={0}
                      max={10000}
                      value={qty}
                      onChange={(e) =>
                        onChangeQuantity(
                          tier.key,
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                      className="w-24 px-3 py-1.5 rounded-xl bg-black/25 border border-[var(--gold-main)]/35 text-right text-sm font-semibold focus:outline-none focus:border-[var(--gold-main)]"
                    />
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={1500}
                    step={5}
                    value={Math.min(1500, qty)}
                    onChange={(e) =>
                      onChangeQuantity(tier.key, Number(e.target.value))
                    }
                    className="luxury-slider"
                  />

                  <div className="pt-3 border-t border-[var(--gold-main)]/15 flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">
                      {lang === "ka" ? "ჯამური ღირებულება:" : "Subtotal:"}
                    </span>
                    <span className="font-bold text-sm text-[var(--gold-main)]">
                      {subtotal.toLocaleString()} ₾
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Portfolio Summary Card */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-b from-[var(--gold-main)]/10 to-transparent">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold-main)] block mb-2">
                {lang === "ka" ? "თქვენი პორტფელი" : "YOUR PORTFOLIO"}
              </span>
              <h3 className="font-display text-xl font-bold mb-5">
                {lang === "ka" ? "ინვესტიციის შეჯამება" : "Investment Summary"}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[var(--gold-main)]/15">
                  <span className="text-[var(--text-secondary)]">
                    {lang === "ka" ? "სულ ნერგები:" : "Total Seedlings:"}
                  </span>
                  <span className="font-bold">
                    {totalTrees.toLocaleString()}{" "}
                    {lang === "ka" ? "ცალი" : "pcs"}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[var(--gold-main)]/15">
                  <span className="text-[var(--text-secondary)]">
                    {lang === "ka" ? "რეკომენდებული ფართობი:" : "Recommended Area:"}
                  </span>
                  <span className="font-bold">
                    {recommendedHectares} {lang === "ka" ? "ჰა" : "ha"}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[var(--gold-main)]/15">
                  <span className="text-[var(--text-secondary)]">
                    {lang === "ka" ? "მერქანი (5–7 წელში):" : "Timber (5–7 yrs):"}
                  </span>
                  <span className="font-bold text-[var(--gold-main)]">
                    ~{projectedTimberM3.toLocaleString()} მ³
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[var(--gold-main)]/15">
                  <span className="text-[var(--text-secondary)]">
                    {lang === "ka" ? "წლიური CO₂ შთანთქმა:" : "Annual CO₂ Capture:"}
                  </span>
                  <span className="font-bold">
                    ~{annualCo2Tons} {lang === "ka" ? "ტონა" : "tons"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--gold-main)]/25">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {lang === "ka" ? "სრული ბიუჯეტი:" : "Total Budget:"}
                </span>
                <span className="font-display text-3xl font-bold text-gold-gradient">
                  {totalPrice.toLocaleString()} ₾
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenOrderModal}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-[0.16em] uppercase shadow-lg shadow-[#d4af37]/20 hover:brightness-105 transition-all cursor-pointer"
              >
                {lang === "ka" ? "შეკვეთის გაფორმება" : "Proceed to Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};