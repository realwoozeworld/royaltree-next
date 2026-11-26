"use client";

import React, { memo, useEffect, useRef } from "react";
import { ThemeMode } from "@/types/botanical";

interface PaulowniaCanvasProps {
  theme: ThemeMode;
  onScrollProgress?: (progress: number) => void;
}

interface CanopyLeaf {
  x: number;
  y: number;
  size: number;
  angle: number;
  swaySpeed: number;
  swayOffset: number;
  variant: number;
  depth: number;
}

interface BlossomCluster {
  x: number;
  y: number;
  scale: number;
  lengthFactor: number;
  swaySpeed: number;
  swayOffset: number;
  variant: number;
  depth: number;
}

interface FloatingParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  driftX: number;
  phase: number;
  rotation: number;
  spinSpeed: number;
  isGold: boolean;
  floretVariant: number;
  depth: number;
}

interface RootSegment {
  x1: number;
  y1: number;
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
  x2: number;
  y2: number;
  thicknessStart: number;
  thicknessEnd: number;
  depth: number;
  revealStart: number;
  revealEnd: number;
  hasNode: boolean;
  phase: number;
}

type SpriteCanvas = OffscreenCanvas | HTMLCanvasElement;
type SpriteCtx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function createOffscreenSurface(
  width: number,
  height: number
): { canvas: SpriteCanvas; ctx: SpriteCtx | null } {
  if (typeof OffscreenCanvas !== "undefined") {
    const offscreen = new OffscreenCanvas(width, height);
    return { canvas: offscreen, ctx: offscreen.getContext("2d") };
  }
  const el = document.createElement("canvas");
  el.width = width;
  el.height = height;
  return { canvas: el, ctx: el.getContext("2d") };
}

// Deterministic pseudo-random helper for organic botanical details
function seededRand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Pre-renders a hyper-realistic Paulownia Tomentosa cordate (heart-shaped) leaf
 * with curved petiole, sunlit green gradients, prominent midrib + branching
 * lateral veins, subtle velvety surface sheen, and baked soft drop shadow.
 */
function createLeafSprite(variant: number): SpriteCanvas {
  const w = 420;
  const h = 460;
  const { canvas, ctx } = createOffscreenSurface(w, h);
  if (!ctx) return canvas;

  const cx = w * 0.5;
  const cy = h * 0.52;
  const s = 148;

  // Color palettes for sunlit, mid-canopy, and deep-canopy leaf tones
  const palettes = [
    {
      sunTop: "#9be05a",
      midGreen: "#6eb838",
      deepGreen: "#4f942c",
      shadowGreen: "#2f6418",
      veinMain: "#d3ef9c",
      veinShadow: "#35661b",
      petioleLight: "#a7d668",
      petioleDark: "#4c7426",
    },
    {
      sunTop: "#8ccf4e",
      midGreen: "#61a932",
      deepGreen: "#438323",
      shadowGreen: "#265414",
      veinMain: "#c6e78d",
      veinShadow: "#2c5817",
      petioleLight: "#98c95a",
      petioleDark: "#416820",
    },
    {
      sunTop: "#7fc345",
      midGreen: "#569c2c",
      deepGreen: "#39751d",
      shadowGreen: "#1e4510",
      veinMain: "#b9df7f",
      veinShadow: "#234a13",
      petioleLight: "#8bbd4e",
      petioleDark: "#385b1c",
    },
  ];
  const pal = palettes[variant % palettes.length];
  const asym = variant === 1 ? 0.04 : variant === 2 ? -0.04 : 0.015;

  // 1. Baked Soft Drop Shadow for Depth Perception
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = "rgba(3, 14, 7, 0.42)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 12;

  const traceLeafBlade = () => {
    ctx.beginPath();
    // Deep cordate basal sinus where petiole attaches
    ctx.moveTo(0, -s * 0.46);
    // Right basal lobe -> broad heart curve -> acuminate tip
    ctx.bezierCurveTo(
      s * (0.28 + asym),
      -s * 0.92,
      s * (0.96 + asym),
      -s * 0.72,
      s * (0.94 + asym * 0.5),
      -s * 0.12
    );
    ctx.bezierCurveTo(
      s * 0.92,
      s * 0.34,
      s * 0.48,
      s * 0.76,
      s * (asym * 0.4),
      s * 1.06
    );
    // Left acuminate tip -> broad heart curve -> left basal lobe
    ctx.bezierCurveTo(
      -s * 0.48,
      s * 0.76,
      -s * 0.92,
      s * 0.34,
      -s * (0.94 - asym * 0.5),
      -s * 0.12
    );
    ctx.bezierCurveTo(
      -s * (0.96 - asym),
      -s * 0.72,
      -s * (0.28 - asym),
      -s * 0.92,
      0,
      -s * 0.46
    );
    ctx.closePath();
  };

  // Draw curved petiole first (with shadow)
  const petioleCurveX = variant === 1 ? -18 : variant === 2 ? 16 : -10;
  ctx.beginPath();
  ctx.moveTo(-4.5, -s * 0.42);
  ctx.quadraticCurveTo(
    petioleCurveX * 0.6 - 3,
    -s * 0.85,
    petioleCurveX - 2.5,
    -s * 1.24
  );
  ctx.lineTo(petioleCurveX + 2.5, -s * 1.24);
  ctx.quadraticCurveTo(
    petioleCurveX * 0.6 + 4,
    -s * 0.85,
    4.5,
    -s * 0.42
  );
  ctx.closePath();
  const petioleGrad = ctx.createLinearGradient(-12, -s * 1.24, 12, -s * 0.42);
  petioleGrad.addColorStop(0, pal.petioleDark);
  petioleGrad.addColorStop(0.45, pal.petioleLight);
  petioleGrad.addColorStop(1, pal.veinMain);
  ctx.fillStyle = petioleGrad;
  ctx.fill();

  // Draw blade silhouette to cast shadow
  traceLeafBlade();
  ctx.fillStyle = pal.deepGreen;
  ctx.fill();
  ctx.restore();

  // 2. Layered Sunlit Blade Shading & 3D V-Fold Depth
  ctx.save();
  ctx.translate(cx, cy);
  traceLeafBlade();
  ctx.clip();

  // Base sunlit gradient (diagonal sunlight from top-left)
  const baseGrad = ctx.createLinearGradient(-s * 0.8, -s * 0.85, s * 0.75, s * 0.95);
  baseGrad.addColorStop(0, pal.sunTop);
  baseGrad.addColorStop(0.38, pal.midGreen);
  baseGrad.addColorStop(0.75, pal.deepGreen);
  baseGrad.addColorStop(1, pal.shadowGreen);
  ctx.fillStyle = baseGrad;
  ctx.fillRect(-w * 0.5, -h * 0.5, w, h);

  // Left half sunlit boost vs right half subtle V-fold shadow
  const leftHighlight = ctx.createLinearGradient(-s * 0.9, 0, 0, 0);
  leftHighlight.addColorStop(0, "rgba(182, 238, 118, 0.28)");
  leftHighlight.addColorStop(0.7, "rgba(140, 207, 78, 0.14)");
  leftHighlight.addColorStop(1, "rgba(25, 62, 16, 0.22)");
  ctx.fillStyle = leftHighlight;
  ctx.fillRect(-s, -s, s, s * 2.2);

  const rightFold = ctx.createLinearGradient(0, 0, s * 0.95, 0);
  rightFold.addColorStop(0, "rgba(24, 58, 15, 0.24)");
  rightFold.addColorStop(0.45, "rgba(79, 148, 44, 0.08)");
  rightFold.addColorStop(1, "rgba(140, 207, 78, 0.18)");
  ctx.fillStyle = rightFold;
  ctx.fillRect(0, -s, s, s * 2.2);

  // Soft radial sunlit lobes
  const lobeGlow = ctx.createRadialGradient(
    -s * 0.34,
    -s * 0.22,
    s * 0.05,
    -s * 0.25,
    -s * 0.15,
    s * 0.85
  );
  lobeGlow.addColorStop(0, "rgba(218, 248, 162, 0.3)");
  lobeGlow.addColorStop(0.55, "rgba(140, 207, 78, 0.12)");
  lobeGlow.addColorStop(1, "rgba(79, 148, 44, 0)");
  ctx.fillStyle = lobeGlow;
  ctx.fillRect(-w * 0.5, -h * 0.5, w, h);

  // 3. Velvety Tomentose Surface Sheen (fine soft micro-texture)
  ctx.save();
  for (let i = 0; i < 240; i++) {
    const rx = (seededRand(i * 3.1 + variant * 17) - 0.5) * s * 1.75;
    const ry = (seededRand(i * 7.3 + variant * 31) - 0.45) * s * 1.75;
    const rLen = 4 + seededRand(i * 5.7) * 9;
    const alpha = 0.04 + seededRand(i * 2.9) * 0.06;
    ctx.strokeStyle =
      i % 3 === 0
        ? `rgba(235, 252, 205, ${alpha})`
        : `rgba(38, 82, 20, ${alpha * 0.7})`;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + rLen * 0.45, ry + rLen * 0.85);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Prominent Central Midrib & Branching Arcuate Lateral Veins
  const midCurveX = asym * s * 0.45;
  // Shadow underneath midrib
  ctx.strokeStyle = pal.veinShadow;
  ctx.lineWidth = 5.2;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.38;
  ctx.beginPath();
  ctx.moveTo(1.5, -s * 0.46);
  ctx.quadraticCurveTo(midCurveX + 2, s * 0.28, asym * s * 0.4 + 1, s * 1.02);
  ctx.stroke();

  // Highlighted central midrib
  ctx.globalAlpha = 0.92;
  const midGrad = ctx.createLinearGradient(0, -s * 0.46, 0, s * 1.02);
  midGrad.addColorStop(0, pal.veinMain);
  midGrad.addColorStop(0.6, "#b4de76");
  midGrad.addColorStop(1, pal.midGreen);
  ctx.strokeStyle = midGrad;
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.46);
  ctx.quadraticCurveTo(midCurveX, s * 0.28, asym * s * 0.4, s * 1.02);
  ctx.stroke();

  // Branching lateral veins (6 pairs + basal pair)
  const lateralVeins = [
    { startY: -s * 0.4, endX: 0.56, endY: -s * 0.62, ctrlX: 0.34, ctrlY: -s * 0.6 },
    { startY: -s * 0.24, endX: 0.84, endY: -s * 0.24, ctrlX: 0.46, ctrlY: -s * 0.32 },
    { startY: -s * 0.04, endX: 0.86, endY: s * 0.14, ctrlX: 0.5, ctrlY: -s * 0.02 },
    { startY: s * 0.18, endX: 0.72, endY: s * 0.46, ctrlX: 0.44, ctrlY: s * 0.26 },
    { startY: s * 0.42, endX: 0.48, endY: s * 0.72, ctrlX: 0.3, ctrlY: s * 0.54 },
    { startY: s * 0.66, endX: 0.24, endY: s * 0.88, ctrlX: 0.16, ctrlY: s * 0.76 },
  ];

  lateralVeins.forEach((v, idx) => {
    const lw = Math.max(0.85, 2.1 - idx * 0.24);
    [-1, 1].forEach((side) => {
      const sx = midCurveX * ((v.startY + s * 0.46) / (s * 1.48)) * 0.6;
      const ex = side * v.endX * s + asym * s * 0.25;
      const cxV = side * v.ctrlX * s + asym * s * 0.15;

      // Subtle vein shadow
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = pal.veinShadow;
      ctx.lineWidth = lw + 1.0;
      ctx.beginPath();
      ctx.moveTo(sx, v.startY + 1.2);
      ctx.quadraticCurveTo(cxV, v.ctrlY + 1.2, ex, v.endY + 1.2);
      ctx.stroke();

      // Vein highlight
      ctx.globalAlpha = 0.78;
      ctx.strokeStyle = pal.veinMain;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(sx, v.startY);
      ctx.quadraticCurveTo(cxV, v.ctrlY, ex, v.endY);
      ctx.stroke();

      // Secondary sub-veinlets
      if (idx < 4) {
        ctx.globalAlpha = 0.26;
        ctx.lineWidth = 0.7;
        const midVX = (sx + cxV * 2 + ex) * 0.25;
        const midVY = (v.startY + v.ctrlY * 2 + v.endY) * 0.25;
        ctx.beginPath();
        ctx.moveTo(midVX, midVY);
        ctx.quadraticCurveTo(
          midVX + side * s * 0.12,
          midVY + s * 0.08,
          midVX + side * s * 0.2,
          midVY + s * 0.18
        );
        ctx.stroke();
      }
    });
  });

  // 5. Crisp Sunlit Margin Rim
  ctx.globalAlpha = 0.45;
  traceLeafBlade();
  ctx.strokeStyle = pal.sunTop;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.restore();
  return canvas;
}

/**
 * Draws a single hyper-realistic 5-lobed Paulownia Tomentosa flower onto `ctx`
 * at (0, 0), scaled to `radius`.
 * Features:
 * - Bell/trumpet tube with 5-toothed olive-amber calyx
 * - 5 ruffled lobes in pale lavender-pink (#e4d2e6 to #f7eff8)
 * - Deep violet-purple throat (#3b1a30)
 * - Golden-yellow inner nectar stripes (#e3b549)
 * - Fine dark purple speckles on the lower petals + subtle petal venation
 */
function renderPhotorealisticFloret(
  ctx: SpriteCtx,
  radius: number,
  tiltAngle: number,
  seed: number
) {
  ctx.save();
  ctx.rotate(tiltAngle);

  // 1. Velvety Olive-Amber Calyx / Pedicel at top-back of trumpet
  ctx.save();
  const calyxGrad = ctx.createLinearGradient(0, -radius * 1.15, 0, -radius * 0.42);
  calyxGrad.addColorStop(0, "#684e2e");
  calyxGrad.addColorStop(0.55, "#8d6f44");
  calyxGrad.addColorStop(1, "#a98a5a");
  ctx.fillStyle = calyxGrad;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.18, -radius * 0.62);
  ctx.quadraticCurveTo(0, -radius * 1.12, radius * 0.18, -radius * 0.62);
  ctx.lineTo(radius * 0.26, -radius * 0.44);
  ctx.lineTo(0, -radius * 0.52);
  ctx.lineTo(-radius * 0.26, -radius * 0.44);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Trumpet Tube Body (behind the 5 spreading lobes)
  const tubeGrad = ctx.createLinearGradient(0, -radius * 0.65, 0, radius * 0.28);
  tubeGrad.addColorStop(0, "#c8aad0");
  tubeGrad.addColorStop(0.5, "#dfc9e4");
  tubeGrad.addColorStop(1, "#ecdced");
  ctx.fillStyle = tubeGrad;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.25, -radius * 0.58);
  ctx.quadraticCurveTo(-radius * 0.48, -radius * 0.1, -radius * 0.55, radius * 0.2);
  ctx.quadraticCurveTo(0, radius * 0.42, radius * 0.55, radius * 0.2);
  ctx.quadraticCurveTo(radius * 0.48, -radius * 0.1, radius * 0.25, -radius * 0.58);
  ctx.closePath();
  ctx.fill();

  // 3. Five Spreading, Ruffled Corolla Lobes
  // Back/Upper 2 lobes, then Lateral 2 lobes, then Lower central lip
  const lobes = [
    { angle: -Math.PI * 0.68, len: 0.88, width: 0.44, light: "#f7eff8", mid: "#e7d4ea" },
    { angle: -Math.PI * 0.32, len: 0.88, width: 0.44, light: "#f5ecf6", mid: "#e4d2e6" },
    { angle: Math.PI * 0.94, len: 0.96, width: 0.48, light: "#f3e8f4", mid: "#dfcae3" },
    { angle: Math.PI * 0.06, len: 0.96, width: 0.48, light: "#f5ebf6", mid: "#e2cee6" },
    { angle: Math.PI * 0.5, len: 1.06, width: 0.54, light: "#f7eff8", mid: "#e4d2e6" },
  ];

  lobes.forEach((lobe, idx) => {
    ctx.save();
    ctx.rotate(lobe.angle);

    // Subtle soft shadow between overlapping lobes
    ctx.shadowColor = "rgba(59, 26, 48, 0.24)";
    ctx.shadowBlur = radius * 0.12;
    ctx.shadowOffsetY = radius * 0.04;

    const lLen = radius * lobe.len;
    const lW = radius * lobe.width;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      lW * 0.85,
      -lLen * 0.22,
      lW * 1.08,
      lLen * 0.62,
      lLen * 0.04,
      lLen
    );
    // Slight organic petal notch/ruffle at tip
    ctx.quadraticCurveTo(0, lLen * 0.94, -lLen * 0.04, lLen);
    ctx.bezierCurveTo(
      -lW * 1.08,
      lLen * 0.62,
      -lW * 0.85,
      -lLen * 0.22,
      0,
      0
    );
    ctx.closePath();

    const pGrad = ctx.createRadialGradient(0, lLen * 0.15, radius * 0.08, 0, lLen * 0.55, lLen);
    pGrad.addColorStop(0, "#d7bedb");
    pGrad.addColorStop(0.42, lobe.mid);
    pGrad.addColorStop(0.82, lobe.light);
    pGrad.addColorStop(1, "#fbf7fc");
    ctx.fillStyle = pGrad;
    ctx.fill();

    // Subtle petal venation radiating from throat
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(176, 134, 186, 0.28)";
    ctx.lineWidth = Math.max(0.5, radius * 0.022);
    [-0.24, 0, 0.24].forEach((vOffset) => {
      ctx.beginPath();
      ctx.moveTo(0, radius * 0.1);
      ctx.quadraticCurveTo(
        lW * vOffset * 0.8,
        lLen * 0.5,
        lW * vOffset * 1.15,
        lLen * 0.86
      );
      ctx.stroke();
    });

    // Delicate luminous rim on sunlit edge
    ctx.strokeStyle = "rgba(255, 250, 255, 0.48)";
    ctx.lineWidth = Math.max(0.6, radius * 0.02);
    ctx.stroke();

    ctx.restore();
    void idx;
  });

  // 4. Deep Violet-Purple Throat (#3b1a30) for 3D Funnel Depth
  const throatGrad = ctx.createRadialGradient(
    0,
    -radius * 0.04,
    radius * 0.03,
    0,
    radius * 0.04,
    radius * 0.44
  );
  throatGrad.addColorStop(0, "#240d1d");
  throatGrad.addColorStop(0.45, "#3b1a30");
  throatGrad.addColorStop(0.75, "rgba(104, 52, 92, 0.58)");
  throatGrad.addColorStop(1, "rgba(228, 210, 230, 0)");

  ctx.fillStyle = throatGrad;
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.02, radius * 0.38, radius * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Distinct Golden-Yellow Inner Nectar Stripes (#e3b549)
  [-1, 1].forEach((side) => {
    const stripeGrad = ctx.createLinearGradient(0, -radius * 0.05, 0, radius * 0.56);
    stripeGrad.addColorStop(0, "#c8962c");
    stripeGrad.addColorStop(0.45, "#e3b549");
    stripeGrad.addColorStop(0.82, "#f5d67b");
    stripeGrad.addColorStop(1, "rgba(245, 214, 123, 0)");

    ctx.strokeStyle = stripeGrad;
    ctx.lineWidth = Math.max(1.4, radius * 0.095);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(side * radius * 0.075, -radius * 0.04);
    ctx.quadraticCurveTo(
      side * radius * 0.11,
      radius * 0.28,
      side * radius * 0.085,
      radius * 0.55
    );
    ctx.stroke();

    // Subtle bright ridge core
    ctx.strokeStyle = "rgba(255, 245, 198, 0.72)";
    ctx.lineWidth = Math.max(0.6, radius * 0.034);
    ctx.stroke();
  });

  // 6. Fine Dark Purple Speckles / Dots Inside Lower Petals
  for (let i = 0; i < 22; i++) {
    const sAngle = Math.PI * 0.18 + seededRand(seed + i * 2.3) * Math.PI * 0.64;
    const sDist = radius * (0.14 + seededRand(seed + i * 5.1) * 0.52);
    const sx = Math.cos(sAngle) * sDist * 0.85;
    const sy = Math.sin(sAngle) * sDist * 0.95;
    const dotR = radius * (0.016 + seededRand(seed + i * 7.7) * 0.022);
    const alpha = 0.45 + seededRand(seed + i * 3.9) * 0.42;

    ctx.fillStyle = `rgba(59, 26, 48, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  // 7. Tiny Creamy-Gold Stamens Tucked in Upper Throat
  [-1, 1].forEach((side) => {
    ctx.fillStyle = "#f4df9e";
    ctx.beginPath();
    ctx.ellipse(
      side * radius * 0.06,
      -radius * 0.12,
      radius * 0.032,
      radius * 0.048,
      side * 0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Pre-renders an individual floating Paulownia floret sprite for drifting blossoms.
 */
function createFloatingFloretSprite(variant: number): SpriteCanvas {
  const size = 128;
  const { canvas, ctx } = createOffscreenSurface(size, size);
  if (!ctx) return canvas;

  ctx.save();
  ctx.translate(size * 0.5, size * 0.5);
  ctx.shadowColor = "rgba(26, 10, 22, 0.32)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  renderPhotorealisticFloret(
    ctx,
    42,
    (variant - 1) * 0.28,
    variant * 41 + 7
  );
  ctx.restore();
  return canvas;
}

/**
 * Pre-renders a lush cascading Paulownia Tomentosa blossom panicle cluster
 * composed of a woody olive-gold raceme stem and 16 depth-sorted 3D florets.
 */
function createPanicleSprite(variant: number): SpriteCanvas {
  const w = 260;
  const h = 380;
  const { canvas, ctx } = createOffscreenSurface(w, h);
  if (!ctx) return canvas;

  const cx = w * 0.5;
  const topY = 58;

  // 1. Woody Velvety Raceme Stem & Lateral Pedicels
  ctx.save();
  ctx.shadowColor = "rgba(10, 18, 12, 0.35)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  const stemSway = variant === 1 ? 8 : variant === 2 ? -8 : 3;
  const stemGrad = ctx.createLinearGradient(cx, topY - 25, cx, h - 38);
  stemGrad.addColorStop(0, "#755b38");
  stemGrad.addColorStop(0.5, "#9c7e4f");
  stemGrad.addColorStop(1, "#6c5332");
  ctx.strokeStyle = stemGrad;
  ctx.lineWidth = 3.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, topY - 28);
  ctx.quadraticCurveTo(cx + stemSway, h * 0.52, cx - stemSway * 0.4, h - 42);
  ctx.stroke();

  // Back-to-front floret layout for lush pyramidal panicle
  const florets = [
    { fx: -36, fy: 44, r: 27, tilt: -0.45, z: 0 },
    { fx: 36, fy: 46, r: 27, tilt: 0.45, z: 0 },
    { fx: -44, fy: 92, r: 29, tilt: -0.52, z: 0 },
    { fx: 44, fy: 95, r: 29, tilt: 0.52, z: 0 },
    { fx: -38, fy: 144, r: 28, tilt: -0.42, z: 0 },
    { fx: 38, fy: 148, r: 28, tilt: 0.42, z: 0 },
    { fx: -28, fy: 196, r: 26, tilt: -0.36, z: 0 },
    { fx: 28, fy: 200, r: 26, tilt: 0.36, z: 0 },
    { fx: -18, fy: 246, r: 23, tilt: -0.25, z: 0 },
    { fx: 18, fy: 250, r: 23, tilt: 0.25, z: 0 },
    // Foreground florets
    { fx: 0, fy: 24, r: 25, tilt: 0.08, z: 1 },
    { fx: -14, fy: 74, r: 30, tilt: -0.18, z: 1 },
    { fx: 16, fy: 76, r: 30, tilt: 0.2, z: 1 },
    { fx: 0, fy: 124, r: 31, tilt: -0.05, z: 1 },
    { fx: -12, fy: 174, r: 29, tilt: -0.16, z: 1 },
    { fx: 14, fy: 178, r: 28, tilt: 0.18, z: 1 },
    { fx: 0, fy: 228, r: 25, tilt: 0.06, z: 1 },
    { fx: 2, fy: 274, r: 21, tilt: -0.08, z: 1 },
  ];

  // Draw pedicels
  ctx.lineWidth = 2.0;
  florets.forEach((f, idx) => {
    const jitterX = (seededRand(idx * 9.1 + variant * 13) - 0.5) * 6;
    ctx.beginPath();
    ctx.moveTo(cx + stemSway * 0.2, topY + f.fy - 16);
    ctx.lineTo(cx + f.fx + jitterX, topY + f.fy - f.r * 0.45);
    ctx.stroke();
  });
  ctx.restore();

  // Render florets back-to-front with soft drop shadows
  florets.forEach((f, idx) => {
    const jx = (seededRand(idx * 9.1 + variant * 13) - 0.5) * 6;
    const jy = (seededRand(idx * 4.7 + variant * 19) - 0.5) * 5;
    ctx.save();
    ctx.translate(cx + f.fx + jx, topY + f.fy + jy);
    ctx.shadowColor = f.z === 1 ? "rgba(28, 12, 24, 0.34)" : "rgba(28, 12, 24, 0.24)";
    ctx.shadowBlur = f.z === 1 ? 12 : 8;
    ctx.shadowOffsetY = 5;
    renderPhotorealisticFloret(
      ctx,
      f.r,
      f.tilt + (variant - 1) * 0.08,
      idx * 29 + variant * 101
    );
    ctx.restore();
  });

  return canvas;
}

// Helper: evaluate point on cubic Bezier curve at t in [0, 1]
function cubicPoint(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number {
  const mt = 1 - t;
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  );
}

// Helper: draw partial cubic Bezier from 0 to t (De Casteljau subdivision)
function drawPartialBezier(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x2: number,
  y2: number,
  t: number
): { tipX: number; tipY: number } {
  if (t >= 0.999) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
    ctx.stroke();
    return { tipX: x2, tipY: y2 };
  }

  const x12 = x1 + (cx1 - x1) * t;
  const y12 = y1 + (cy1 - y1) * t;
  const x23 = cx1 + (cx2 - cx1) * t;
  const y23 = cy1 + (cy2 - cy1) * t;
  const x34 = cx2 + (x2 - cx2) * t;
  const y34 = cy2 + (y2 - cy2) * t;

  const x123 = x12 + (x23 - x12) * t;
  const y123 = y12 + (y23 - y12) * t;
  const x234 = x23 + (x34 - x23) * t;
  const y234 = y23 + (y34 - y23) * t;

  const tipX = x123 + (x234 - x123) * t;
  const tipY = y123 + (y234 - y123) * t;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(x12, y12, x123, y123, tipX, tipY);
  ctx.stroke();

  return { tipX, tipY };
}

const PaulowniaCanvasInner: React.FC<PaulowniaCanvasProps> = ({
  theme,
  onScrollProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<ThemeMode>(theme);
  const onScrollProgressRef = useRef(onScrollProgress);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    onScrollProgressRef.current = onScrollProgress;
  }, [onScrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pre-render high-resolution Offscreen Canvas sprites once on mount
    const leafSprites: SpriteCanvas[] = [
      createLeafSprite(0),
      createLeafSprite(1),
      createLeafSprite(2),
    ];
    const panicleSprites: SpriteCanvas[] = [
      createPanicleSprite(0),
      createPanicleSprite(1),
      createPanicleSprite(2),
    ];
    const floretSprites: SpriteCanvas[] = [
      createFloatingFloretSprite(0),
      createFloatingFloretSprite(1),
      createFloatingFloretSprite(2),
    ];

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let leaves: CanopyLeaf[] = [];
    let blossoms: BlossomCluster[] = [];
    let particles: FloatingParticle[] = [];
    let rootSegments: RootSegment[] = [];

    // Track last reported scroll percentage without triggering unnecessary React re-renders
    let lastReportedPct = -1;

    const buildBotanicalTree = () => {
      leaves = [];
      blossoms = [];
      particles = [];
      rootSegments = [];

      const isMobile = width < 768;
      const centerX = width * 0.5;
      const soilWorldY = height * 1.96;

      // 1. Giant Heart-Shaped Paulownia Leaves across Top & Sides (sorted back-to-front by depth)
      const leafCount = isMobile ? 24 : 48;
      for (let i = 0; i < leafCount; i++) {
        const t = i / (leafCount - 1);
        const lx = width * (-0.06 + t * 1.12);
        const edgeDrop = Math.pow(Math.abs(t - 0.5) * 2, 1.45) * (height * 0.44);
        const ly = height * 0.02 + edgeDrop + ((i * 41) % 110);
        const depth = ((i * 37) % 100) / 100; // 0.0 (far) -> 1.0 (near)

        leaves.push({
          x: lx,
          y: ly,
          size: (isMobile ? 74 + (i % 4) * 18 : 112 + (i % 5) * 26) * (0.82 + depth * 0.32),
          angle: (t - 0.5) * 1.15 + ((i % 3) - 1) * 0.22,
          swaySpeed: 0.55 + (i % 5) * 0.14,
          swayOffset: i * 0.65,
          variant: i % 3,
          depth,
        });
      }
      leaves.sort((a, b) => a.depth - b.depth);

      // 2. Lush Cascading Violet-Gold Blossom Panicles
      const blossomCount = isMobile ? 14 : 26;
      for (let i = 0; i < blossomCount; i++) {
        const t = i / (blossomCount - 1);
        const bx = width * (0.01 + t * 0.98);
        const edgeDrop = Math.pow(Math.abs(t - 0.5) * 2, 1.55) * (height * 0.38);
        const by = height * 0.04 + edgeDrop + ((i * 47) % 95);
        const depth = ((i * 53) % 100) / 100;

        blossoms.push({
          x: bx,
          y: by,
          scale: (isMobile ? 0.58 + (i % 3) * 0.1 : 0.72 + (i % 4) * 0.12) * (0.85 + depth * 0.28),
          lengthFactor: 0.88 + (i % 4) * 0.12,
          swaySpeed: 0.7 + (i % 4) * 0.16,
          swayOffset: i * 0.85,
          variant: i % 3,
          depth,
        });
      }
      blossoms.sort((a, b) => a.depth - b.depth);

      // 3. Ambient Drifting Gold Pollen & Photorealistic Paulownia Florets
      const particleCount = isMobile ? 22 : 42;
      for (let i = 0; i < particleCount; i++) {
        const depth = ((i * 29) % 100) / 100;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 3.2 + (i % 4) * 1.4,
          speedY: (0.18 + (i % 5) * 0.06) * (0.75 + depth * 0.55),
          driftX: 0.32 + (i % 3) * 0.18,
          phase: i * 1.1,
          rotation: Math.random() * Math.PI * 2,
          spinSpeed: (i % 2 === 0 ? 1 : -1) * (0.28 + (i % 4) * 0.1),
          isGold: i % 3 === 0,
          floretVariant: i % 3,
          depth,
        });
      }

      // 4. Organic, Flowing Botanical Root System (Smooth S-Curves + Fine Capillaries)
      const buildRootBranch = (
        x1: number,
        y1: number,
        angle: number,
        length: number,
        thickness: number,
        depth: number,
        maxDepth: number,
        lateralPull: number,
        startProgress: number
      ) => {
        if (depth > maxDepth || thickness < 0.35) return;

        const wave = Math.sin(depth * 1.9 + lateralPull * 2.4) * 0.24;
        const targetAngle = angle + lateralPull * 0.14 + wave;

        const x2 = x1 + Math.sin(targetAngle) * length;
        const y2 = y1 + Math.cos(targetAngle) * length;

        const perpX = Math.cos(targetAngle);
        const perpY = -Math.sin(targetAngle);
        const bendMag = length * (0.28 + (depth % 2) * 0.12);
        const dirSign = depth % 2 === 0 ? 1 : -1;

        const cx1 =
          x1 + Math.sin(targetAngle) * (length * 0.34) + perpX * bendMag * dirSign;
        const cy1 =
          y1 + Math.cos(targetAngle) * (length * 0.34) + perpY * bendMag * dirSign;

        const cx2 =
          x1 +
          Math.sin(targetAngle) * (length * 0.72) -
          perpX * (bendMag * 0.85) * dirSign;
        const cy2 =
          y1 +
          Math.cos(targetAngle) * (length * 0.72) -
          perpY * (bendMag * 0.85) * dirSign;

        const duration = 0.22;
        const revealStart = Math.min(0.84, startProgress);
        const revealEnd = Math.min(1.0, revealStart + duration);
        const nextThick = thickness * 0.66;

        rootSegments.push({
          x1,
          y1,
          cx1,
          cy1,
          cx2,
          cy2,
          x2,
          y2,
          thicknessStart: thickness,
          thicknessEnd: nextThick,
          depth,
          revealStart,
          revealEnd,
          hasNode: depth >= 2 && (depth + Math.round(Math.abs(lateralPull * 10))) % 2 === 0,
          phase: depth * 1.3 + lateralPull * 3.1,
        });

        const nextLen = length * (isMobile ? 0.78 : 0.84);
        const childStart = revealStart + duration * 0.72;

        buildRootBranch(
          x2,
          y2,
          targetAngle - 0.22 - (depth % 2) * 0.08,
          nextLen,
          nextThick,
          depth + 1,
          maxDepth,
          lateralPull * 1.04,
          childStart
        );

        buildRootBranch(
          x2,
          y2,
          targetAngle + 0.22 + ((depth + 1) % 2) * 0.08,
          nextLen,
          nextThick,
          depth + 1,
          maxDepth,
          lateralPull * 1.04,
          childStart
        );

        if (depth >= 2 && depth <= maxDepth - 1) {
          const midX = cubicPoint(x1, cx1, cx2, x2, 0.55);
          const midY = cubicPoint(y1, cy1, cy2, y2, 0.55);
          buildRootBranch(
            midX,
            midY,
            targetAngle + dirSign * 0.48,
            nextLen * 0.62,
            nextThick * 0.52,
            depth + 2,
            maxDepth,
            lateralPull * 1.1,
            revealStart + duration * 0.45
          );
        }
      };

      const rootConfigs = [
        { angle: -1.24, len: height * 0.34, thick: 7.5, pull: -1.52 },
        { angle: -0.96, len: height * 0.33, thick: 9.0, pull: -1.22 },
        { angle: -0.66, len: height * 0.32, thick: 10.5, pull: -0.84 },
        { angle: -0.34, len: height * 0.31, thick: 12.0, pull: -0.42 },
        { angle: 0.0, len: height * 0.33, thick: 13.5, pull: 0.0 },
        { angle: 0.34, len: height * 0.31, thick: 12.0, pull: 0.42 },
        { angle: 0.66, len: height * 0.32, thick: 10.5, pull: 0.84 },
        { angle: 0.96, len: height * 0.33, thick: 9.0, pull: 1.22 },
        { angle: 1.24, len: height * 0.34, thick: 7.5, pull: 1.52 },
      ];

      const maxDepth = isMobile ? 4 : 5;
      rootConfigs.forEach((cfg, idx) => {
        buildRootBranch(
          centerX + cfg.angle * 18,
          soilWorldY - 4,
          cfg.angle,
          cfg.len,
          cfg.thick,
          1,
          maxDepth,
          cfg.pull,
          (idx % 3) * 0.025
        );
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildBotanicalTree();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = (timeMs: number) => {
      const t = timeMs * 0.001;
      const isLight = themeRef.current === "light";

      const currentScrollY = window.scrollY;

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const scrollFraction = Math.min(
        1,
        Math.max(0, currentScrollY / maxScroll)
      );

      const currentPct = Math.round(scrollFraction * 100);
      if (onScrollProgressRef.current && currentPct !== lastReportedPct) {
        lastReportedPct = currentPct;
        onScrollProgressRef.current(scrollFraction);
      }

      ctx.clearRect(0, 0, width, height);

      // Ambient Emerald & Gold Radial Atmosphere
      const radialAtmo = ctx.createRadialGradient(
        width * 0.5,
        height * 0.22,
        10,
        width * 0.5,
        height * 0.5,
        width * 0.75
      );
      if (isLight) {
        radialAtmo.addColorStop(0, "rgba(212, 175, 55, 0.09)");
        radialAtmo.addColorStop(1, "transparent");
      } else {
        radialAtmo.addColorStop(0, "rgba(24, 58, 38, 0.28)");
        radialAtmo.addColorStop(1, "transparent");
      }
      ctx.fillStyle = radialAtmo;
      ctx.fillRect(0, 0, width, height);

      const cameraOffsetY = scrollFraction * (height * 2.3);
      const centerX = width * 0.5;
      const trunkTopY = height * 0.2 - cameraOffsetY;
      const soilScreenY = height * 1.96 - cameraOffsetY;

      // 1. Central Striated Paulownia Trunk
      if (soilScreenY > -100 && trunkTopY < height + 100) {
        const trunkWidthTop = width < 768 ? 16 : 24;
        const trunkWidthBottom = width < 768 ? 38 : 58;

        const trunkGrad = ctx.createLinearGradient(
          centerX - trunkWidthBottom,
          0,
          centerX + trunkWidthBottom,
          0
        );
        if (isLight) {
          trunkGrad.addColorStop(0, "rgba(74, 62, 46, 0.04)");
          trunkGrad.addColorStop(0.5, "rgba(92, 76, 54, 0.16)");
          trunkGrad.addColorStop(1, "rgba(74, 62, 46, 0.04)");
        } else {
          trunkGrad.addColorStop(0, "rgba(26, 42, 31, 0.06)");
          trunkGrad.addColorStop(0.5, "rgba(44, 68, 52, 0.24)");
          trunkGrad.addColorStop(1, "rgba(26, 42, 31, 0.06)");
        }

        ctx.fillStyle = trunkGrad;
        ctx.beginPath();
        ctx.moveTo(centerX - trunkWidthTop, trunkTopY);
        ctx.lineTo(centerX + trunkWidthTop, trunkTopY);
        ctx.lineTo(centerX + trunkWidthBottom, soilScreenY);
        ctx.lineTo(centerX - trunkWidthBottom, soilScreenY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = isLight
          ? "rgba(154, 118, 30, 0.22)"
          : "rgba(212, 175, 55, 0.24)";
        ctx.lineWidth = 1;
        [-0.32, 0, 0.32].forEach((offset) => {
          ctx.beginPath();
          ctx.moveTo(centerX + trunkWidthTop * offset, trunkTopY);
          ctx.lineTo(centerX + trunkWidthBottom * offset, soilScreenY);
          ctx.stroke();
        });
      }

      // 2. Massive Canopy Leaves & Cascading Blossoms (Fast Offscreen Sprite drawImage)
      const canopyVisibility = Math.max(0, 1 - scrollFraction * 2.5);
      if (canopyVisibility > 0.01) {
        const baseLeafAlpha = isLight ? 0.54 : 0.78;
        const baseBlossomAlpha = isLight ? 0.88 : 0.94;

        // Draw pre-rendered Paulownia Leaves with depth parallax + natural wind sway
        for (let i = 0; i < leaves.length; i++) {
          const leaf = leaves[i];
          const parallaxFactor = 0.36 + leaf.depth * 0.44;
          const drawY = leaf.y - cameraOffsetY * parallaxFactor;
          if (drawY < -leaf.size * 1.4 || drawY > height + leaf.size * 1.4) continue;

          const sway = Math.sin(t * leaf.swaySpeed + leaf.swayOffset) * 0.065;

          const sprite = leafSprites[leaf.variant];
          const drawW = leaf.size * 1.42;
          const drawH = leaf.size * 1.56;

          ctx.save();
          ctx.globalAlpha = canopyVisibility * baseLeafAlpha * (0.68 + leaf.depth * 0.32);
          ctx.translate(leaf.x, drawY);
          ctx.rotate(leaf.angle + sway);
          ctx.drawImage(sprite, -drawW * 0.5, -drawH * 0.52, drawW, drawH);
          ctx.restore();
        }

        // Draw pre-rendered Cascading Blossom Panicles with depth parallax + wind sway
        for (let i = 0; i < blossoms.length; i++) {
          const b = blossoms[i];
          const parallaxFactor = 0.32 + b.depth * 0.42;
          const drawY = b.y - cameraOffsetY * parallaxFactor;
          const drawW = 260 * b.scale;
          const drawH = 380 * b.scale * b.lengthFactor;
          if (drawY < -drawH || drawY > height + drawH) continue;

          const sway = Math.sin(t * b.swaySpeed + b.swayOffset) * 0.055;

          const sprite = panicleSprites[b.variant];

          ctx.save();
          ctx.globalAlpha = canopyVisibility * baseBlossomAlpha * (0.72 + b.depth * 0.28);
          ctx.translate(b.x, drawY);
          ctx.rotate(sway);
          ctx.drawImage(sprite, -drawW * 0.5, -36 * b.scale, drawW, drawH);
          ctx.restore();
        }
      }

      // 3. Drifting Gold Pollen & Photorealistic Paulownia Florets
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        if (p.y > height + 36) p.y = -36;
        const px = p.x + Math.sin(t * p.driftX + p.phase) * (24 + p.depth * 18);

        if (p.isGold) {
          ctx.save();
          ctx.translate(px, p.y);
          ctx.fillStyle = isLight
            ? "rgba(154, 118, 30, 0.45)"
            : "rgba(245, 231, 189, 0.5)";
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (canopyVisibility > 0.05) {
          const floretSprite = floretSprites[p.floretVariant];
          const fSize = (22 + p.size * 3.8) * (0.72 + p.depth * 0.42);
          ctx.save();
          ctx.globalAlpha = canopyVisibility * (0.58 + p.depth * 0.34);
          ctx.translate(px, p.y);
          ctx.rotate(t * p.spinSpeed + p.rotation);
          ctx.drawImage(floretSprite, -fSize * 0.5, -fSize * 0.5, fSize, fSize);
          ctx.restore();
        }
      }

      // 4. Luminous Soil Horizon Line + Root Crown Glow
      if (soilScreenY > -120 && soilScreenY < height + 120) {
        const horizonGrad = ctx.createLinearGradient(0, 0, width, 0);
        horizonGrad.addColorStop(0, "transparent");
        horizonGrad.addColorStop(
          0.5,
          isLight ? "rgba(138, 100, 20, 0.42)" : "rgba(212, 175, 55, 0.45)"
        );
        horizonGrad.addColorStop(1, "transparent");

        ctx.strokeStyle = horizonGrad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, soilScreenY);
        ctx.lineTo(width, soilScreenY);
        ctx.stroke();

        const crownGlow = ctx.createRadialGradient(
          centerX,
          soilScreenY,
          4,
          centerX,
          soilScreenY,
          140
        );
        crownGlow.addColorStop(
          0,
          isLight ? "rgba(154, 118, 30, 0.22)" : "rgba(212, 175, 55, 0.25)"
        );
        crownGlow.addColorStop(1, "transparent");
        ctx.fillStyle = crownGlow;
        ctx.beginPath();
        ctx.arc(centerX, soilScreenY, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Animated Organic Root Growth (Draws smoothly along curves as you scroll)
      const rootGrowProgress = Math.min(
        1,
        Math.max(0, (scrollFraction - 0.42) / 0.56)
      );

      if (rootGrowProgress > 0.002) {
        rootSegments.forEach((seg) => {
          if (rootGrowProgress <= seg.revealStart) return;

          const rawT =
            (rootGrowProgress - seg.revealStart) /
            Math.max(0.04, seg.revealEnd - seg.revealStart);
          const clampedT = Math.min(1, Math.max(0, rawT));
          const drawT = 1 - Math.pow(1 - clampedT, 2);

          const breathe = Math.sin(t * 1.1 + seg.phase) * (seg.depth * 1.4);

          const sy1 = seg.y1 - cameraOffsetY;
          const scy1 = seg.cy1 - cameraOffsetY + breathe * 0.4;
          const scy2 = seg.cy2 - cameraOffsetY + breathe * 0.8;
          const sy2 = seg.y2 - cameraOffsetY + breathe;

          if (
            Math.min(sy1, sy2) > height + 150 ||
            Math.max(sy1, sy2) < -150
          ) {
            return;
          }

          ctx.save();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          if (seg.depth <= 3) {
            ctx.strokeStyle = isLight
              ? "rgba(154, 118, 30, 0.14)"
              : "rgba(212, 175, 55, 0.16)";
            ctx.lineWidth = seg.thicknessStart * 2.4;
            drawPartialBezier(
              ctx,
              seg.x1,
              sy1,
              seg.cx1,
              scy1,
              seg.cx2,
              scy2,
              seg.x2,
              sy2,
              drawT
            );
          }

          const alpha = Math.max(0.24, (isLight ? 0.68 : 0.78) - seg.depth * 0.09);
          ctx.strokeStyle = isLight
            ? `rgba(138, 100, 20, ${alpha})`
            : `rgba(222, 185, 68, ${alpha})`;
          ctx.lineWidth =
            seg.thicknessStart +
            (seg.thicknessEnd - seg.thicknessStart) * drawT;

          const { tipX, tipY } = drawPartialBezier(
            ctx,
            seg.x1,
            sy1,
            seg.cx1,
            scy1,
            seg.cx2,
            scy2,
            seg.x2,
            sy2,
            drawT
          );

          if (drawT > 0.04 && drawT < 0.99) {
            const spark = ctx.createRadialGradient(
              tipX,
              tipY,
              0.5,
              tipX,
              tipY,
              seg.depth <= 2 ? 12 : 7
            );
            spark.addColorStop(
              0,
              isLight ? "rgba(168, 122, 24, 0.95)" : "rgba(255, 246, 210, 0.98)"
            );
            spark.addColorStop(
              0.5,
              isLight ? "rgba(168, 122, 24, 0.35)" : "rgba(212, 175, 55, 0.45)"
            );
            spark.addColorStop(1, "transparent");
            ctx.fillStyle = spark;
            ctx.beginPath();
            ctx.arc(tipX, tipY, seg.depth <= 2 ? 12 : 7, 0, Math.PI * 2);
            ctx.fill();
          }

          if (seg.hasNode && drawT >= 0.96) {
            const pulse = 0.65 + 0.35 * Math.sin(t * 2.2 + seg.phase);
            ctx.fillStyle = isLight
              ? `rgba(138, 100, 20, ${0.7 * pulse})`
              : `rgba(245, 231, 189, ${0.88 * pulse})`;
            ctx.beginPath();
            ctx.arc(seg.x2, sy2, seg.depth === 2 ? 2.8 : 2.0, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export const PaulowniaCanvas = memo(PaulowniaCanvasInner);
PaulowniaCanvas.displayName = "PaulowniaCanvas";