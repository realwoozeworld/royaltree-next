"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#070c09] text-[#f4f1ea] overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 selection:bg-[#d4af37]/30 selection:text-[#f5e7bd]">
      {/* Background radial gradients for obsidian forest depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(196,165,245,0.07),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none" />

      {/* Editorial Watermark "404" */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none font-display font-bold text-[32vw] md:text-[28vw] leading-none text-white/[0.018] tracking-tighter"
      >
        404
      </div>

      {/* Centered Glassmorphic Bento Card with Asymmetric Split Layout */}
      <div className="relative z-10 w-full max-w-5xl rounded-[2.5rem] p-7 sm:p-12 lg:p-16 border border-[#d4af37]/20 bg-[#0a120d]/85 backdrop-blur-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Subtle top gold accent line */}
        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Georgian Copy & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#f5e7bd]">
                შეცდომა 404 • NOT FOUND
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-[#f4f1ea] leading-[1.15]">
              გზა აგერიათ,{" "}
              <span className="text-gold-gradient block sm:inline">
                გვერდი ვერ მოიძებნა
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[rgba(244,241,234,0.72)] leading-relaxed max-w-lg">
              მოთხოვნილი გვერდი აღარ არსებობს ან გადატანილია. შეგიძლიათ
              დაბრუნდეთ სამეფო ხის მთავარ პორტალზე ან გამოთვალოთ პავლოვნიის
              პლანტაციის 5-წლიანი საინვესტიციო ROI.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-[0.16em] uppercase shadow-lg shadow-[#d4af37]/20 hover:brightness-105 active:scale-[0.98] transition-all"
              >
                ← მთავარ გვერდზე დაბრუნება
              </Link>
              <Link
                href="/#configurator"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-[#d4af37]/35 bg-black/40 text-[#f5e7bd] hover:bg-[#d4af37]/10 hover:border-[#d4af37] text-xs font-bold tracking-[0.16em] uppercase transition-all"
              >
                ROI კალკულატორი
              </Link>
            </div>
          </div>

          {/* Right Column: Minimalist Botanical SVG Animation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center rounded-3xl bg-black/30 border border-[#d4af37]/10 p-6">
              {/* Lavender blossom ambient halo */}
              <div className="absolute w-40 h-40 rounded-full bg-[#c4a5f5]/10 blur-3xl pointer-events-none" />

              <svg
                viewBox="0 0 240 240"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ground Level Horizon */}
                <line
                  x1="20"
                  y1="160"
                  x2="220"
                  y2="160"
                  stroke="#d4af37"
                  strokeOpacity="0.25"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Subterranean Roots System */}
                <g opacity="0.6">
                  {/* Central Taproot */}
                  <path
                    d="M120 160 C 120 180, 115 195, 120 225"
                    stroke="#d4af37"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Left Root Branch */}
                  <path
                    d="M120 168 C 105 185, 80 195, 65 210"
                    stroke="#d4af37"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.7"
                  />
                  {/* Right Root Branch */}
                  <path
                    d="M120 172 C 140 188, 160 198, 185 215"
                    stroke="#d4af37"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.7"
                  />
                  {/* Deep Fibrous Tendrils */}
                  <path
                    d="M100 188 C 95 200, 85 218, 90 228"
                    stroke="#d4af37"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                  <path
                    d="M140 192 C 150 205, 155 220, 150 230"
                    stroke="#d4af37"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                </g>

                {/* Drifting Paulownia Blossom Petal Animation */}
                <motion.g
                  animate={{
                    y: [0, 45, 95, 128],
                    x: [0, 18, -12, 4],
                    rotate: [0, 24, -18, 12],
                    opacity: [0, 0.95, 0.95, 0.75],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.35, 0.75, 1],
                  }}
                >
                  {/* Gentle Paulownia Bell-shaped Blossom Petal */}
                  <path
                    d="M120 25 C 108 38, 102 52, 112 66 C 120 76, 128 76, 134 66 C 142 52, 136 38, 120 25 Z"
                    fill="url(#blossomGradient)"
                    stroke="#d4af37"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                  {/* Petal Inner Vein */}
                  <path
                    d="M120 32 Q 122 50 123 68"
                    stroke="#f5e7bd"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                </motion.g>

                {/* Second Smaller Floating Petal for Depth */}
                <motion.g
                  animate={{
                    y: [0, 50, 105, 132],
                    x: [0, -15, 14, -2],
                    rotate: [0, -28, 20, -10],
                    opacity: [0, 0.7, 0.7, 0.5],
                  }}
                  transition={{
                    duration: 7.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.5,
                    times: [0, 0.35, 0.75, 1],
                  }}
                >
                  <path
                    d="M145 20 C 137 28, 132 38, 140 48 C 146 55, 152 55, 156 48 C 162 38, 157 28, 145 20 Z"
                    fill="url(#blossomGradientSoft)"
                    stroke="#c4a5f5"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                  />
                </motion.g>

                {/* Linear Gradients */}
                <defs>
                  <linearGradient
                    id="blossomGradient"
                    x1="105"
                    y1="25"
                    x2="135"
                    y2="75"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#e9dcfa" />
                    <stop offset="45%" stopColor="#c4a5f5" />
                    <stop offset="85%" stopColor="#8d6abf" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0.8" />
                  </linearGradient>

                  <linearGradient
                    id="blossomGradientSoft"
                    x1="130"
                    y1="20"
                    x2="160"
                    y2="55"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#f3ebff" />
                    <stop offset="60%" stopColor="#d5beff" />
                    <stop offset="100%" stopColor="#9b7ec9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
