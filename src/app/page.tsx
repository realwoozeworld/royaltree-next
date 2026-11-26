"use client";

import React, { useEffect, useState } from "react";
import { PaulowniaCanvas } from "@/components/canvas/PaulowniaCanvas";
import { DepthHud } from "@/components/canvas/DepthHud";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { AdvantagesBento } from "@/components/sections/AdvantagesBento";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { KnowledgeSanctuary } from "@/components/sections/KnowledgeSanctuary";
import { PlantationGallery } from "@/components/sections/PlantationGallery";
import { Footer } from "@/components/layout/Footer";
import { OrderModal } from "@/components/modals/OrderModal";
import { Language, ThemeMode, TierQuantities } from "@/types/botanical";
import {
  DEFAULT_SITE_CONTENT,
  DynamicSiteContent,
  fetchSiteContent,
} from "@/lib/contentStore";

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [lang, setLang] = useState<Language>("ka");
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<TierQuantities>({
    tier1: 125,
    tier2: 500,
    tier3: 0,
  });
  const [siteContent, setSiteContent] =
    useState<DynamicSiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [theme]);

  useEffect(() => {
    fetchSiteContent().then(setSiteContent);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleLang = () => {
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

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <PaulowniaCanvas theme={theme} />
      <DepthHud lang={lang} />

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
        onOpenOrderModal={() => setOrderModalOpen(true)}
      />

      <Hero
        lang={lang}
        onOpenOrderModal={() => setOrderModalOpen(true)}
        imageUrl={siteContent.heroImageUrl}
        captionKa={siteContent.heroCaptionKa}
        captionEn={siteContent.heroCaptionEn}
      />

      <AdvantagesBento lang={lang} />

      <CalculatorSection
        lang={lang}
        quantities={quantities}
        onChangeQuantity={handleChangeQuantity}
        onApplyPreset={handleApplyPreset}
        onOpenOrderModal={() => setOrderModalOpen(true)}
      />

      <KnowledgeSanctuary lang={lang} tabs={siteContent.dossierTabs} />

      <PlantationGallery lang={lang} items={siteContent.gallery} />

      <Footer
        lang={lang}
        onOpenOrderModal={() => setOrderModalOpen(true)}
      />

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        lang={lang}
        quantities={quantities}
      />
    </main>
  );
}