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
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3.5 leading-snug">
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
              href="tel:+995595331169"
              className="glass-panel rounded-2xl px-5 py-4 flex items-center justify-between hover:border-[var(--gold-main)] transition-all"
            >
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--gold-main)] block">
                  {lang === "ka"
                    ? "გაყიდვების დეპარტამენტი"
                    : "SALES DEPARTMENT"}
                </span>
                <span className="font-display text-lg font-bold">
                  595 33 11 69
                </span>
              </div>
              <span className="text-[var(--gold-main)]">✆</span>
            </a>

            <a
              href="tel:+995555533302"
              className="glass-panel rounded-2xl px-5 py-4 flex items-center justify-between hover:border-[var(--gold-main)] transition-all"
            >
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--gold-main)] block">
                  {lang === "ka" ? "აგრო-კონსულტაცია" : "AGRO-CONSULTATION"}
                </span>
                <span className="font-display text-lg font-bold">
                  555 53 33 02
                </span>
              </div>
              <span className="text-[var(--gold-main)]">✦</span>
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
                ? "კასპის რაიონი, სოფ. ახალქალაქი, საქართველო"
                : "Village Akhalkalaki, Kaspi Municipality, Georgia"}
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