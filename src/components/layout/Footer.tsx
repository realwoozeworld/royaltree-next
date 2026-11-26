"use client";

import React from "react";
import { Language } from "@/types/botanical";

interface FooterProps {
  lang: Language;
  onOpenOrderModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenOrderModal }) => {
  return (
    <footer
      id="contact"
      className="relative z-10 pt-14 pb-16 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Agro-Consultation Banner Card */}
        <div className="glass-panel rounded-3xl p-7 sm:p-11 mb-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--gold-main)] block mb-2.5">
              {lang === "ka"
                ? "პერსონალური კონსულტაცია"
                : "PERSONAL CONSULTATION"}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-semibold mb-3.5 leading-[1.2] tracking-[0.01em]">
              {lang === "ka"
                ? "დაგეგმეთ ვიზიტი მეურნეობაში ან შეუკვეთეთ ნერგები"
                : "Schedule an Estate Visit or Reserve Seedlings"}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {lang === "ka"
                ? "ჩვენი აგრონომები დაგეხმარებიან ნიადაგის შერჩევაში, სარწყავი სისტემის დაგეგმვასა და საუკეთესო სანერგე მასალის მიწოდებაში საქართველოს ნებისმიერ წერტილში."
                : "Our agronomists assist with soil selection, drip irrigation planning, and nationwide delivery of certified planting stock across Georgia."}
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-3.5 min-w-[280px]">
            <a
              href="https://wa.me/995595331169"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:border-[var(--gold-main)] transition-all group"
            >
              <div>
                <span className="text-[10px] font-semibold tracking-[0.04em] uppercase text-[var(--gold-main)] block mb-0.5">
                  {lang === "ka"
                    ? "გაყიდვების დეპარტამენტი • WhatsApp"
                    : "SALES DEPARTMENT • WHATSAPP"}
                </span>
                <span className="font-body text-lg font-semibold tracking-wide tabular-nums">
                  595 33 11 69
                </span>
              </div>
              <span className="w-9 h-9 rounded-full border border-[var(--gold-main)]/35 bg-[var(--gold-main)]/10 flex items-center justify-center text-[var(--gold-main)] group-hover:scale-105 transition-transform shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.77 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.37-.14-.19-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.9 2.16.07.15.12.32.02.51-.1.19-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.29.15.46.12.63-.07.17-.2.74-.86.94-1.16.19-.29.39-.24.66-.15.27.1 1.71.81 2 .95.29.15.49.22.56.34.07.12.07.7-.17 1.38z" />
                </svg>
              </span>
            </a>

            <a
              href="https://wa.me/995555533302"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:border-[var(--gold-main)] transition-all group"
            >
              <div>
                <span className="text-[10px] font-semibold tracking-[0.04em] uppercase text-[var(--gold-main)] block mb-0.5">
                  {lang === "ka"
                    ? "აგრო-კონსულტაცია • WhatsApp"
                    : "AGRO-CONSULTATION • WHATSAPP"}
                </span>
                <span className="font-body text-lg font-semibold tracking-wide tabular-nums">
                  555 53 33 02
                </span>
              </div>
              <span className="w-9 h-9 rounded-full border border-[var(--gold-main)]/35 bg-[var(--gold-main)]/10 flex items-center justify-center text-[var(--gold-main)] group-hover:scale-105 transition-transform shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.77 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.37-.14-.19-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.9 2.16.07.15.12.32.02.51-.1.19-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.29.15.46.12.63-.07.17-.2.74-.86.94-1.16.19-.29.39-.24.66-.15.27.1 1.71.81 2 .95.29.15.49.22.56.34.07.12.07.7-.17 1.38z" />
                </svg>
              </span>
            </a>

            <button
              type="button"
              onClick={onOpenOrderModal}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-[0.16em] uppercase shadow-lg shadow-[#d4af37]/20 hover:brightness-105 transition-all cursor-pointer"
            >
              {lang === "ka" ? "ონლაინ განაცხადი" : "Online Reservation"}
            </button>
          </div>
        </div>

        {/* Bottom Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[var(--gold-main)]/20 text-xs">
          <div>
            <div className="font-display text-base font-bold tracking-wider uppercase mb-2">
              ROYAL TREE
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs">
              {lang === "ka"
                ? "სამეფო ხე — პავლოვნია ტომენტოზას სანერგე მეურნეობა და სამრეწველო პლანტაციები საქართველოში."
                : "Royal Tree — Paulownia Tomentosa seedling nursery and commercial timber plantations in Georgia."}
            </p>
          </div>

          <div>
            <div className="font-semibold uppercase tracking-wider text-[var(--gold-main)] mb-2">
              {lang === "ka" ? "მისამართი" : "Location"}
            </div>
            <p className="text-[var(--text-secondary)] mb-1">
              {lang === "ka"
                ? "კასპის რაიონი, სოფ. მეფისქალაქი, საქართველო"
                : "Village Mepiskalaki, Kaspi Municipality, Georgia"}
            </p>
            <a
              href="mailto:infopaulownia1@gmail.com"
              className="text-[var(--text-secondary)] hover:text-[var(--gold-main)] transition-colors"
            >
              infopaulownia1@gmail.com
            </a>
          </div>

          <div className="md:text-right">
            <div className="font-semibold uppercase tracking-wider text-[var(--gold-main)] mb-2">
              {lang === "ka" ? "ნავიგაცია" : "Navigation"}
            </div>
            <div className="flex flex-wrap md:justify-end gap-4 text-[var(--text-secondary)]">
              <a href="#advantages" className="hover:text-[var(--gold-main)]">
                {lang === "ka" ? "უპირატესობები" : "Advantages"}
              </a>
              <a href="#configurator" className="hover:text-[var(--gold-main)]">
                {lang === "ka" ? "კალკულატორი" : "Calculator"}
              </a>
              <a href="#sanctuary" className="hover:text-[var(--gold-main)]">
                {lang === "ka" ? "პავლოვნია" : "Paulownia"}
              </a>
              <a href="#gallery" className="hover:text-[var(--gold-main)]">
                {lang === "ka" ? "გალერეა" : "Gallery"}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <span>© 2026 ROYALTREE.GE — All Rights Reserved</span>
          <span>Paulownia Tomentosa Botanical Estate</span>
        </div>
      </div>
    </footer>
  );
};