"use client";

import React from "react";
import { Language } from "@/types/botanical";

interface AdvantagesBentoProps {
  lang: Language;
}

export const AdvantagesBento: React.FC<AdvantagesBentoProps> = ({ lang }) => {
  const cards = [
    {
      num: "01",
      tagKa: "რეკორდული ბიომასა",
      tagEn: "RECORD BIOMASS",
      titleKa: "სწრაფი ზრდა — 4–5 მეტრი პირველივე სეზონზე",
      titleEn: "Rapid Growth — 4–5 Meters in the Very First Season",
      descKa:
        "გენეტიკურად სუფთა Paulownia Tomentosa-ს ნერგები ძლიერი ფესვთა სისტემის წყალობით 5–7 წელიწადში აღწევს სამრეწველო ჭრის კონდიციას (350+ მ³ ჰექტარზე).",
      descEn:
        "Genetically pure Paulownia Tomentosa seedlings reach commercial harvest maturity in just 5–7 years (350+ m³ per hectare) thanks to vigorous root architecture.",
      wide: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      num: "02",
      tagKa: "ეკოლოგიური ფილტრი",
      tagEn: "ECOLOGICAL FILTER",
      titleKa: "ეკოლოგიური გავლენა — 10× CO₂ შთანთქმა",
      titleEn: "Ecological Impact — 10× CO₂ Absorption",
      descKa:
        "გიგანტური (70 სმ-მდე) ფოთლების წყალობით, 1 ჰექტარი პავლოვნია წელიწადში შთანთქავს 100 ტონამდე ნახშირორჟანგს და გამოყოფს რეკორდული რაოდენობის სუფთა ჟანგბადს.",
      descEn:
        "With giant leaves up to 70 cm wide, 1 hectare absorbs up to 100 tons of CO₂ annually while releasing record volumes of pure oxygen.",
      wide: false,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
        </svg>
      ),
    },
    {
      num: "03",
      tagKa: "მრავალჯერადი მოსავალი",
      tagEn: "MULTI-CYCLE HARVEST",
      titleKa: "4 სრული ციკლი ერთი დარგვიდან",
      titleEn: "4 Full Harvest Cycles from One Planting",
      descKa:
        "მოჭრის შემდეგ ხე ხელახლა ამოიყრის იმავე ფესვიდან დარგვის დამატებითი ხარჯების გარეშე, რაც მკვეთრად ზრდის ინვესტიციის უკუგებას.",
      descEn:
        "After harvesting, the tree regenerates directly from the existing root system with zero replanting cost, multiplying investment return.",
      wide: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      num: "04",
      tagKa: "სამეფო თაფლი და ნიადაგის აღდგენა",
      tagEn: "ROYAL HONEY & SOIL RESTORATION",
      titleKa: "იასამნისფერი ყვავილობა — 700 კგ თაფლი ჰექტარზე",
      titleEn: "Violet Blossom — 700 kg Honey per Hectare",
      descKa:
        "გაზაფხულზე ხე იფარება სურნელოვანი იასამნისფერი ყვავილებით, საიდანაც მიიღება უიშვიათესი მსუბუქი სამკურნალო თაფლი, ხოლო აზოტით მდიდარი ფოთლები ბუნებრივად ანოყიერებს ნიადაგს.",
      descEn:
        "In spring, fragrant violet blossoms yield up to 700 kg of rare medicinal honey per hectare, while nitrogen-rich foliage naturally enriches the soil.",
      wide: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.4 5.2L20 9l-4 4.1.9 5.9L12 16.2 7.1 19l.9-5.9L4 9l5.6-.8L12 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="advantages"
      className="relative z-10 py-20 sm:py-28 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center section-header-shield mb-14">
          <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--gold-main)] block mb-3">
            {lang === "ka" ? "01 / ბოტანიკური უპირატესობა" : "01 / BOTANICAL EDGE"}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-[1.2] tracking-[0.01em] mb-4">
            {lang === "ka" ? "რატომ სამეფო ხე?" : "Why Royal Tree?"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {lang === "ka"
              ? "უნიკალური ბიოლოგიური მახასიათებლები, რომლებიც პავლოვნიას თანამედროვე აგრო-ინვესტიციების ლიდერად აქცევს."
              : "Unique biological characteristics making Paulownia the premier modern agro-forestry investment."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {cards.map((card) => (
            <div
              key={card.num}
              className={`glass-panel rounded-3xl p-7 sm:p-9 flex flex-col justify-between ${
                card.wide ? "lg:col-span-7" : "lg:col-span-5"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-body text-3xl sm:text-4xl font-light tabular-nums text-[var(--gold-main)]/45">
                    {card.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl border border-[var(--gold-main)]/30 bg-[var(--gold-main)]/10 flex items-center justify-center text-[var(--gold-main)]">
                    {card.icon}
                  </div>
                </div>

                <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--gold-main)] block mb-2.5">
                  {lang === "ka" ? card.tagKa : card.tagEn}
                </span>

                <h3 className="font-display text-xl sm:text-2xl font-semibold mb-3.5 leading-snug">
                  {lang === "ka" ? card.titleKa : card.titleEn}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {lang === "ka" ? card.descKa : card.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};