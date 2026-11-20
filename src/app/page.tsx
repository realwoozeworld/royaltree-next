"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DepthHud } from "@/components/canvas/DepthHud";
import { PaulowniaCanvas } from "@/components/canvas/PaulowniaCanvas";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { OrderModal } from "@/components/modals/OrderModal";
import { AdvantagesBento } from "@/components/sections/AdvantagesBento";
import { Hero } from "@/components/sections/Hero";
import { KnowledgeSanctuary } from "@/components/sections/KnowledgeSanctuary";
import { PlantationGallery } from "@/components/sections/PlantationGallery";
import { RoiConfigurator } from "@/components/sections/RoiConfigurator";
import { Language, ThemeMode, TierQuantities } from "@/types/botanical";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("ka");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("royaltree-theme") as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    }
    return "dark";
  });
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);

  const [quantities, setQuantities] = useState<TierQuantities>({
    tier1: 125,
    tier2: 500,
    tier3: 0,
  });

  // Sync html class for Light / Dark theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("royaltree-theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === "ka" ? "en" : "ka"));
  };

  const handleChangeQuantity = (tier: keyof TierQuantities, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [tier]: value,
    }));
  };

  const handleApplyPreset = (totalTrees: number) => {
    setQuantities({
      tier1: 0,
      tier2: totalTrees,
      tier3: 0,
    });
  };

  const handleScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Scroll-driven Botanical Paulownia Tree & Roots Canvas */}
      <PaulowniaCanvas
        theme={theme}
        onScrollProgress={handleScrollProgress}
      />

      {/* Right-Edge Botanical Depth Indicator */}
      <DepthHud progress={scrollProgress} lang={lang} />

      {/* Floating Glass Navbar */}
      <Navbar
        lang={lang}
        theme={theme}
        onToggleLang={handleToggleLang}
        onToggleTheme={handleToggleTheme}
        onOpenOrderModal={() => setOrderModalOpen(true)}
      />

      {/* Page Sections */}
      <Hero lang={lang} onOpenOrderModal={() => setOrderModalOpen(true)} />
      <AdvantagesBento lang={lang} />
      <RoiConfigurator
        lang={lang}
        quantities={quantities}
        onChangeQuantity={handleChangeQuantity}
        onApplyPreset={handleApplyPreset}
        onOpenOrderModal={() => setOrderModalOpen(true)}
      />
      <KnowledgeSanctuary lang={lang} />
      <PlantationGallery lang={lang} />

      {/* Contact & Footer */}
      <Footer lang={lang} onOpenOrderModal={() => setOrderModalOpen(true)} />

      {/* Seedling Reservation Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        lang={lang}
        quantities={quantities}
      />
    </main>
  );
}