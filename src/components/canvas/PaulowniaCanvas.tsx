"use client";

import React, { useEffect, useRef } from "react";
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
  tone: number;
}

interface BlossomCluster {
  x: number;
  y: number;
  scale: number;
  lengthFactor: number;
  swaySpeed: number;
  swayOffset: number;
}

interface FloatingParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  driftX: number;
  phase: number;
  rotation: number;
  isGold: boolean;
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

export const PaulowniaCanvas: React.FC<PaulowniaCanvasProps> = ({
  theme,
  onScrollProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<ThemeMode>(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let leaves: CanopyLeaf[] = [];
    let blossoms: BlossomCluster[] = [];
    let particles: FloatingParticle[] = [];
    let rootSegments: RootSegment[] = [];

    const buildBotanicalTree = () => {
      leaves = [];
      blossoms = [];
      particles = [];
      rootSegments = [];

      const isMobile = width < 768;
      const centerX = width * 0.5;
      const soilWorldY = height * 1.96;

      // 1. Giant Heart-Shaped Paulownia Leaves across Top & Sides
      const leafCount = isMobile ? 28 : 54;
      for (let i = 0; i < leafCount; i++) {
        const t = i / (leafCount - 1);
        const lx = width * (-0.06 + t * 1.12);
        const edgeDrop = Math.pow(Math.abs(t - 0.5) * 2, 1.45) * (height * 0.44);
        const ly = height * 0.02 + edgeDrop + ((i * 41) % 110);

        leaves.push({
          x: lx,
          y: ly,
          size: isMobile ? 68 + (i % 4) * 18 : 105 + (i % 5) * 26,
          angle: (t - 0.5) * 1.15 + ((i % 3) - 1) * 0.22,
          swaySpeed: 0.6 + (i % 5) * 0.14,
          swayOffset: i * 0.65,
          tone: i % 3,
        });
      }

      // 2. Lush Cascading Violet-Gold Blossom Panicles
      const blossomCount = isMobile ? 16 : 30;
      for (let i = 0; i < blossomCount; i++) {
        const t = i / (blossomCount - 1);
        const bx = width * (0.01 + t * 0.98);
        const edgeDrop = Math.pow(Math.abs(t - 0.5) * 2, 1.55) * (height * 0.38);
        const by = height * 0.04 + edgeDrop + ((i * 47) % 95);

        blossoms.push({
          x: bx,
          y: by,
          scale: isMobile ? 0.85 + (i % 3) * 0.16 : 1.1 + (i % 4) * 0.2,
          lengthFactor: 0.85 + (i % 4) * 0.16,
          swaySpeed: 0.75 + (i % 4) * 0.16,
          swayOffset: i * 0.85,
        });
      }

      // 3. Ambient Drifting Gold Pollen & Petals
      const particleCount = isMobile ? 24 : 46;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 3.0 + (i % 4) * 1.3,
          speedY: 0.15 + (i % 5) * 0.05,
          driftX: 0.32 + (i % 3) * 0.18,
          phase: i * 1.1,
          rotation: Math.random() * Math.PI * 2,
          isGold: i % 2 === 0,
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

        // Organic winding wave instead of rigid straight segments
        const wave = Math.sin(depth * 1.9 + lateralPull * 2.4) * 0.24;
        const targetAngle = angle + lateralPull * 0.14 + wave;

        const x2 = x1 + Math.sin(targetAngle) * length;
        const y2 = y1 + Math.cos(targetAngle) * length;

        // Strong S-curve control points for natural sinuous root flow
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

        // Primary fork
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

        // Extra delicate capillary rootlet off mid-curve for organic richness
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

      // 9 Majestic Primary Taproots fanning out across the entire screen width & corners
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
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildBotanicalTree();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const drawPaulowniaLeaf = (
      x: number,
      y: number,
      size: number,
      angle: number,
      tone: number,
      isLight: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, -size * 0.55);
      ctx.bezierCurveTo(
        size * 0.68,
        -size * 0.74,
        size * 0.88,
        size * 0.08,
        0,
        size * 0.65
      );
      ctx.bezierCurveTo(
        -size * 0.88,
        size * 0.08,
        -size * 0.68,
        -size * 0.74,
        0,
        -size * 0.55
      );
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, -size * 0.5, 0, size * 0.65);
      if (isLight) {
        grad.addColorStop(
          0,
          tone === 0 ? "rgba(32, 68, 42, 0.26)" : "rgba(46, 86, 54, 0.21)"
        );
        grad.addColorStop(1, "rgba(154, 118, 30, 0.16)");
      } else {
        grad.addColorStop(
          0,
          tone === 0 ? "rgba(22, 48, 30, 0.58)" : "rgba(30, 62, 39, 0.48)"
        );
        grad.addColorStop(1, "rgba(212, 175, 55, 0.14)");
      }
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = isLight
        ? "rgba(154, 118, 30, 0.28)"
        : "rgba(212, 175, 55, 0.24)";
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.48);
      ctx.lineTo(0, size * 0.58);
      ctx.moveTo(0, -size * 0.18);
      ctx.lineTo(size * 0.36, size * 0.04);
      ctx.moveTo(0, -size * 0.18);
      ctx.lineTo(-size * 0.36, size * 0.04);
      ctx.moveTo(0, size * 0.1);
      ctx.lineTo(size * 0.28, size * 0.3);
      ctx.moveTo(0, size * 0.1);
      ctx.lineTo(-size * 0.28, size * 0.3);
      ctx.stroke();

      ctx.restore();
    };

    const drawBlossomCluster = (
      x: number,
      y: number,
      scale: number,
      lengthFactor: number,
      sway: number,
      isLight: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sway * 0.045);
      ctx.scale(scale, scale * lengthFactor);

      ctx.strokeStyle = isLight
        ? "rgba(154, 118, 30, 0.32)"
        : "rgba(212, 175, 55, 0.28)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(0, 128);
      ctx.stroke();

      const florets = [
        { fx: 0, fy: -10, r: 10 },
        { fx: -14, fy: 2, r: 11.5 },
        { fx: 14, fy: 2, r: 11.5 },
        { fx: -22, fy: 18, r: 12.5 },
        { fx: 0, fy: 16, r: 12 },
        { fx: 22, fy: 18, r: 12.5 },
        { fx: -20, fy: 36, r: 13 },
        { fx: 4, fy: 34, r: 12.5 },
        { fx: 21, fy: 38, r: 12.5 },
        { fx: -16, fy: 54, r: 12 },
        { fx: 15, fy: 56, r: 12 },
        { fx: -2, fy: 52, r: 11.5 },
        { fx: -13, fy: 74, r: 11 },
        { fx: 12, fy: 76, r: 11 },
        { fx: -8, fy: 94, r: 10 },
        { fx: 9, fy: 96, r: 10 },
        { fx: -3, fy: 112, r: 9 },
        { fx: 4, fy: 126, r: 8 },
      ];

      florets.forEach((f) => {
        const aura = ctx.createRadialGradient(
          f.fx,
          f.fy,
          1,
          f.fx,
          f.fy,
          f.r * 1.85
        );
        if (isLight) {
          aura.addColorStop(0, "rgba(148, 102, 196, 0.45)");
          aura.addColorStop(0.6, "rgba(176, 134, 214, 0.2)");
          aura.addColorStop(1, "rgba(176, 134, 214, 0)");
        } else {
          aura.addColorStop(0, "rgba(178, 140, 224, 0.48)");
          aura.addColorStop(0.6, "rgba(136, 98, 186, 0.2)");
          aura.addColorStop(1, "rgba(136, 98, 186, 0)");
        }
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(f.fx, f.fy, f.r * 1.85, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isLight
          ? "rgba(138, 94, 182, 0.62)"
          : "rgba(168, 132, 214, 0.56)";
        ctx.beginPath();
        ctx.ellipse(
          f.fx,
          f.fy,
          f.r * 0.88,
          f.r * 1.08,
          f.fx * 0.02,
          0,
          Math.PI * 2
        );
        ctx.fill();

        const core = ctx.createRadialGradient(
          f.fx,
          f.fy + 1,
          0.5,
          f.fx,
          f.fy + 1,
          f.r * 0.65
        );
        core.addColorStop(0, "rgba(255, 244, 204, 0.92)");
        core.addColorStop(0.55, "rgba(232, 198, 118, 0.45)");
        core.addColorStop(1, "rgba(232, 198, 118, 0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(f.fx, f.fy + 1, f.r * 0.65, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    const render = (timeMs: number) => {
      const t = timeMs * 0.001;
      const isLight = themeRef.current === "light";

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const scrollFraction = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll)
      );

      if (onScrollProgress) {
        onScrollProgress(scrollFraction);
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

      // 2. Massive Canopy Leaves & Cascading Blossoms
      const canopyVisibility = Math.max(0, 1 - scrollFraction * 2.5);
      if (canopyVisibility > 0.01) {
        ctx.save();
        ctx.globalAlpha = canopyVisibility;

        leaves.forEach((leaf) => {
          const sway = Math.sin(t * leaf.swaySpeed + leaf.swayOffset) * 0.07;
          drawPaulowniaLeaf(
            leaf.x,
            leaf.y - cameraOffsetY * 0.55,
            leaf.size,
            leaf.angle + sway,
            leaf.tone,
            isLight
          );
        });

        blossoms.forEach((b) => {
          const sway = Math.sin(t * b.swaySpeed + b.swayOffset);
          drawBlossomCluster(
            b.x,
            b.y - cameraOffsetY * 0.48,
            b.scale,
            b.lengthFactor,
            sway,
            isLight
          );
        });

        ctx.restore();
      }

      // 3. Drifting Gold Pollen & Petals
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y > height + 20) p.y = -20;
        const px = p.x + Math.sin(t * p.driftX + p.phase) * 28;

        ctx.save();
        ctx.translate(px, p.y);
        ctx.rotate(t * 0.6 + p.rotation);
        if (p.isGold) {
          ctx.fillStyle = isLight
            ? "rgba(154, 118, 30, 0.45)"
            : "rgba(245, 231, 189, 0.48)";
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.65, 0, Math.PI * 2);
          ctx.fill();
        } else if (canopyVisibility > 0.05) {
          ctx.globalAlpha = canopyVisibility;
          ctx.fillStyle = isLight
            ? "rgba(148, 102, 192, 0.46)"
            : "rgba(182, 144, 226, 0.48)";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.15, p.size * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

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

        // Warm golden root collar glow where trunk meets soil
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
          // Smooth ease-out curve for organic growth feel
          const clampedT = Math.min(1, Math.max(0, rawT));
          const drawT = 1 - Math.pow(1 - clampedT, 2);

          // Gentle living sway in the soil
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

          // Soft Golden Aura behind primary roots (depth 1-3)
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

          // Main Tapered Root Stroke
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

          // Luminous Growing Tip Spark while actively extending
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

          // Pulsing Golden Nutrient Nodes at mature junctions
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
  }, [onScrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};