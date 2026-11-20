"use client";

import React, { useState } from "react";
import { Language, ThemeMode } from "@/types/botanical";

interface NavbarProps {
  lang: Language;
  theme: ThemeMode;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onOpenOrderModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  onOpenOrderModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#advantages", ka: "უპირატესობები", en: "Advantages" },
    { href: "#configurator", ka: "კალკულატორი", en: "Calculator" },
    { href: "#sanctuary", ka: "პავლოვნია", en: "Paulownia" },
    { href: "#gallery", ka: "გალერეა", en: "Gallery" },
    { href: "#contact", ka: "კონტაქტი", en: "Contact" },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-40 px-4 sm:px-6">
      <nav className="max-w-7xl mx-auto glass-panel rounded-full px-5 sm:px-7 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full border border-[var(--gold-main)]/50 flex items-center justify-center bg-[var(--gold-main)]/10 text-[var(--gold-main)] font-display font-bold text-sm">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm sm:text-base font-bold tracking-wider uppercase">
              ROYAL TREE
            </span>
            <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold-main)]">
              {lang === "ka" ? "სამეფო ხე • 1998" : "EMPRESS TREE • 1998"}
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wider uppercase text-[var(--text-secondary)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[var(--gold-main)] transition-colors"
            >
              {lang === "ka" ? link.ka : link.en}
            </a>
          ))}
        </div>

        {/* Controls: Theme (თეთრი / შავი), Language (ქარ / ENG), Order CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Light/Dark Theme"
            className="px-3 py-1.5 rounded-full border border-[var(--gold-main)]/35 text-[11px] font-semibold tracking-wider uppercase hover:border-[var(--gold-main)] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                theme === "dark" ? "bg-[#f5e7bd]" : "bg-[#142219]"
              }`}
            />
            <span>
              {theme === "dark"
                ? lang === "ka"
                  ? "თეთრი"
                  : "LIGHT"
                : lang === "ka"
                  ? "შავი"
                  : "DARK"}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-full border border-[var(--gold-main)]/35 text-[11px] font-semibold tracking-wider uppercase text-[var(--gold-main)] hover:bg-[var(--gold-main)]/10 transition-all cursor-pointer"
          >
            {lang === "ka" ? "ENG" : "ქარ"}
          </button>

          {/* Order CTA */}
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-wider uppercase shadow-lg shadow-[#d4af37]/20 hover:brightness-105 transition-all cursor-pointer"
          >
            {lang === "ka" ? "შეკვეთა" : "Order"}
          </button>

          {/* Mobile Burger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Menu"
            className="lg:hidden w-9 h-9 rounded-full border border-[var(--gold-main)]/35 flex items-center justify-center text-[var(--gold-main)] cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 glass-panel rounded-3xl p-5 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--gold-main)] hover:bg-[var(--gold-main)]/10 transition-colors"
            >
              {lang === "ka" ? link.ka : link.en}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderModal();
            }}
            className="mt-2 w-full py-3 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-wider uppercase cursor-pointer"
          >
            {lang === "ka" ? "ნერგების შეკვეთა" : "Order Seedlings"}
          </button>
        </div>
      )}
    </header>
  );
};