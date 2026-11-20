"use client";

import React, { useState } from "react";
import { DOSSIER_TABS } from "@/data/paulowniaData";
import { DossierTabItem, Language } from "@/types/botanical";

interface KnowledgeSanctuaryProps {
  lang: Language;
}

export const KnowledgeSanctuary: React.FC<KnowledgeSanctuaryProps> = ({
  lang,
}) => {
  const [activeId, setActiveId] = useState<DossierTabItem["id"]>("history");

  const activeTab =
    DOSSIER_TABS.find((t) => t.id === activeId) || DOSSIER_TABS[0];

  return (
    <section
      id="sanctuary"
      className="relative z-10 py-20 sm:py-28 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center section-header-shield mb-12">
          <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--gold-main)] block mb-3">
            {lang === "ka" ? "03 / აგრო-ენციკლოპედია" : "03 / AGRO-ENCYCLOPEDIA"}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
            {lang === "ka" ? "ცოდნის სანქტუარიუმი" : "Knowledge Sanctuary"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {lang === "ka"
              ? "გაეცანით პავლოვნიის კულტურას, აგროტექნიკას, მერქნის ინჟინერიას და სამრეწველო პოტენციალს."
              : "Explore Paulownia heritage, planting protocol, timber engineering, and multi-industry potential."}
          </p>
        </div>

        {/* Tab Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {DOSSIER_TABS.map((tab) => {
            const isSelected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] shadow-lg shadow-[#d4af37]/20"
                    : "glass-panel text-[var(--text-secondary)] hover:text-[var(--gold-main)]"
                }`}
              >
                {lang === "ka" ? tab.labelKa : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Active Dossier Panel */}
        <div className="glass-panel rounded-3xl p-7 sm:p-11">
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--gold-main)] block mb-3">
            {lang === "ka" ? activeTab.eyebrowKa : activeTab.eyebrowEn}
          </span>

          <h3 className="font-display text-2xl sm:text-3xl font-bold mb-6 leading-snug">
            {lang === "ka" ? activeTab.titleKa : activeTab.titleEn}
          </h3>

          <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-9">
            {(lang === "ka"
              ? activeTab.paragraphsKa
              : activeTab.paragraphsEn
            ).map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* 3 Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--gold-main)]/20">
            {activeTab.metrics.map((m) => (
              <div
                key={m.labelEn}
                className="rounded-2xl bg-[var(--gold-main)]/5 border border-[var(--gold-main)]/20 p-4 text-center"
              >
                <div className="font-display text-2xl font-bold text-gold-gradient mb-1">
                  {m.value}
                </div>
                <div className="text-xs tracking-wider uppercase text-[var(--text-muted)]">
                  {lang === "ka" ? m.labelKa : m.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};