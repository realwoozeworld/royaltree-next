"use client";

import React from "react";
import { Language } from "@/types/botanical";

interface DepthHudProps {
  progress: number;
  lang: Language;
}

export const DepthHud: React.FC<DepthHudProps> = ({ progress, lang }) => {
  const pct = Math.round(progress * 100);

  const stages = [
    { fraction: 0.0, ka: "ვარჯი", en: "CANOPY" },
    { fraction: 0.35, ka: "ტანი", en: "TRUNK" },
    { fraction: 0.62, ka: "ნიადაგი", en: "SOIL" },
    { fraction: 0.96, ka: "ფესვები", en: "ROOTS" },
  ];

  const activeIndex =
    progress < 0.25 ? 0 : progress < 0.52 ? 1 : progress < 0.78 ? 2 : 3;

  const activeStage = stages[activeIndex];

  const scrollToFraction = (fraction: number) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * fraction,
      behavior: "smooth",
    });
  };

  return (
    <aside
      aria-label="Botanical Depth Indicator"
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-end gap-3"
    >
      {/* Vertical Capsule with 4 Nodes & Connecting Hairlines */}
      <div className="glass-panel w-11 py-5 rounded-full flex flex-col items-center justify-between gap-2.5 relative">
        {stages.map((st, idx) => {
          const isActive = idx === activeIndex;
          return (
            <React.Fragment key={st.en}>
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <div className="absolute right-10 whitespace-nowrap px-3.5 py-1.5 rounded-full glass-panel text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--gold-main)] pointer-events-none">
                    {st.ka} / {st.en}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => scrollToFraction(st.fraction)}
                  aria-label={`${st.ka} / ${st.en}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[var(--gold-main)] shadow-[0_0_12px_rgba(212,175,55,0.85)] scale-115"
                      : "bg-[var(--gold-main)]/30 hover:bg-[var(--gold-main)]/65"
                  }`}
                />
              </div>

              {idx < stages.length - 1 && (
                <div className="w-[1px] h-7 bg-[var(--gold-main)]/30" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Pill */}
      <div className="glass-panel px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--gold-main)]">
        {lang === "ka" ? activeStage.ka : activeStage.en} • {pct}%
      </div>
    </aside>
  );
};