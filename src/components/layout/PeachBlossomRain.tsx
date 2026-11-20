"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getClockSeasonServerSnapshot,
  getClockSeasonSnapshot,
  getSeasonByDate,
  getSeasonModeServerSnapshot,
  getSeasonModeSnapshot,
  subscribeClockSeason,
  subscribeSeasonMode,
  type SeasonKey,
} from "@/lib/season";

export { getSeasonByDate, type SeasonKey };

type ParticleShape =
  | "petal"
  | "curled"
  | "blossom"
  | "leaf"
  | "maple"
  | "ginkgo"
  | "snowflake"
  | "snowdot";

interface ParticlePalette {
  base: string;
  mid: string;
  tip: string;
  stroke: string;
  center: string;
  stamen?: string;
}

interface SeasonVisualConfig {
  label: string;
  shapes: readonly ParticleShape[];
  palettes: readonly ParticlePalette[];
  sizeRange: readonly [number, number];
  fallSpeedRange: readonly [number, number];
  swayRange: readonly [number, number];
  breezeBase: number;
  breezeAmp: number;
  flipSpeedRange: readonly [number, number];
  rotationSpeedMax: number;
  alphaRange: readonly [number, number];
}

interface Particle {
  x: number;
  y: number;
  size: number;
  shape: ParticleShape;
  palette: ParticlePalette;
  depth: number;
  fallSpeed: number;
  swayAmplitude: number;
  swayFreq: number;
  swayPhase: number;
  rotation: number;
  rotationSpeed: number;
  flipPhase: number;
  flipSpeed: number;
  alpha: number;
}

const SEASON_CONFIGS: Record<SeasonKey, SeasonVisualConfig> = {
  spring: {
    label: "Mùa Xuân",
    shapes: ["petal", "petal", "curled", "blossom"],
    palettes: [
      {
        base: "#E13D7D",
        mid: "#F472A8",
        tip: "#FFE5F0",
        stroke: "rgba(200, 37, 100, 0.34)",
        center: "#C82564",
        stamen: "rgba(245, 158, 11, 0.85)",
      },
      {
        base: "#EC4899",
        mid: "#F8A4C7",
        tip: "#FFF5F8",
        stroke: "rgba(225, 61, 125, 0.32)",
        center: "#E13D7D",
        stamen: "rgba(245, 158, 11, 0.85)",
      },
      {
        base: "#F26B9F",
        mid: "#FBCFE2",
        tip: "#FFFFFF",
        stroke: "rgba(225, 61, 125, 0.28)",
        center: "#DB2777",
        stamen: "rgba(245, 158, 11, 0.85)",
      },
      {
        base: "#EAB308",
        mid: "#FDE047",
        tip: "#FEFCE8",
        stroke: "rgba(202, 138, 4, 0.34)",
        center: "#CA8A04",
        stamen: "rgba(234, 88, 12, 0.8)",
      },
    ],
    sizeRange: [9, 14.5],
    fallSpeedRange: [30, 56],
    swayRange: [15, 34],
    breezeBase: 11,
    breezeAmp: 8,
    flipSpeedRange: [1.1, 2.4],
    rotationSpeedMax: 1.2,
    alphaRange: [0.64, 0.94],
  },
  summer: {
    label: "Mùa Hạ",
    shapes: ["leaf", "leaf", "petal", "curled", "blossom"],
    palettes: [
      {
        base: "#15803D",
        mid: "#22C55E",
        tip: "#BBF7D0",
        stroke: "rgba(20, 83, 45, 0.36)",
        center: "#166534",
      },
      {
        base: "#186C42",
        mid: "#49A875",
        tip: "#D7F0E0",
        stroke: "rgba(16, 63, 43, 0.34)",
        center: "#145335",
      },
      {
        base: "#65A30D",
        mid: "#A3E635",
        tip: "#ECFCCB",
        stroke: "rgba(77, 124, 15, 0.32)",
        center: "#4D7C0F",
      },
      {
        base: "#DC2626",
        mid: "#F97316",
        tip: "#FFE4E6",
        stroke: "rgba(185, 28, 28, 0.34)",
        center: "#B91C1C",
        stamen: "rgba(250, 204, 21, 0.9)",
      },
    ],
    sizeRange: [8.5, 14],
    fallSpeedRange: [34, 62],
    swayRange: [16, 36],
    breezeBase: 14,
    breezeAmp: 10,
    flipSpeedRange: [1.2, 2.5],
    rotationSpeedMax: 1.3,
    alphaRange: [0.62, 0.9],
  },
  autumn: {
    label: "Mùa Thu",
    shapes: ["maple", "maple", "leaf", "ginkgo", "ginkgo"],
    palettes: [
      {
        base: "#B91C1C",
        mid: "#EF4444",
        tip: "#FCA5A5",
        stroke: "rgba(127, 29, 29, 0.4)",
        center: "#991B1B",
      },
      {
        base: "#C2410C",
        mid: "#F97316",
        tip: "#FED7AA",
        stroke: "rgba(154, 52, 18, 0.38)",
        center: "#9A3412",
      },
      {
        base: "#B45309",
        mid: "#F59E0B",
        tip: "#FDE68A",
        stroke: "rgba(146, 64, 14, 0.38)",
        center: "#92400E",
      },
      {
        base: "#CA8A04",
        mid: "#FACC15",
        tip: "#FEF9C3",
        stroke: "rgba(161, 98, 7, 0.36)",
        center: "#A16207",
      },
    ],
    sizeRange: [10, 16],
    fallSpeedRange: [28, 52],
    swayRange: [22, 46],
    breezeBase: 13,
    breezeAmp: 11,
    flipSpeedRange: [1.0, 2.2],
    rotationSpeedMax: 1.1,
    alphaRange: [0.68, 0.94],
  },
  winter: {
    label: "Mùa Đông",
    shapes: ["snowflake", "snowflake", "snowflake", "snowdot"],
    palettes: [
      {
        base: "#7DD3FC",
        mid: "#BAE6FD",
        tip: "#FFFFFF",
        stroke: "rgba(14, 116, 144, 0.45)",
        center: "#38BDF8",
      },
      {
        base: "#60A5FA",
        mid: "#BFDBFE",
        tip: "#F8FAFC",
        stroke: "rgba(37, 99, 235, 0.38)",
        center: "#3B82F6",
      },
      {
        base: "#93C5FD",
        mid: "#E0F2FE",
        tip: "#FFFFFF",
        stroke: "rgba(2, 132, 199, 0.42)",
        center: "#0EA5E9",
      },
    ],
    sizeRange: [8, 14],
    fallSpeedRange: [22, 44],
    swayRange: [10, 24],
    breezeBase: 6,
    breezeAmp: 6,
    flipSpeedRange: [0.5, 1.1],
    rotationSpeedMax: 0.75,
    alphaRange: [0.65, 0.92],
  },
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getTargetParticleCount(width: number): number {
  if (width < 640) return 22;
  if (width < 1024) return 30;
  return 40;
}

function createParticle(
  width: number,
  height: number,
  season: SeasonKey,
  randomY: boolean
): Particle {
  const config = SEASON_CONFIGS[season];
  const depth = randomBetween(0.55, 1.3);
  const shape =
    config.shapes[Math.floor(Math.random() * config.shapes.length)];
  const palette =
    config.palettes[Math.floor(Math.random() * config.palettes.length)];
  const baseSize = randomBetween(config.sizeRange[0], config.sizeRange[1]);
  const size =
    shape === "blossom"
      ? baseSize * 1.12 * depth
      : shape === "snowdot"
        ? baseSize * 0.42 * depth
        : baseSize * depth;

  return {
    x: Math.random() * (width + 80) - 40,
    y: randomY ? Math.random() * height : -size * 2.5 - Math.random() * 40,
    size,
    shape,
    palette,
    depth,
    fallSpeed:
      randomBetween(config.fallSpeedRange[0], config.fallSpeedRange[1]) * depth,
    swayAmplitude:
      randomBetween(config.swayRange[0], config.swayRange[1]) * depth,
    swayFreq: randomBetween(0.65, 1.55),
    swayPhase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed:
      (Math.random() - 0.5) *
      2 *
      (shape === "blossom"
        ? config.rotationSpeedMax * 0.75
        : config.rotationSpeedMax),
    flipPhase: Math.random() * Math.PI * 2,
    flipSpeed: randomBetween(
      config.flipSpeedRange[0],
      config.flipSpeedRange[1]
    ),
    alpha: Math.min(
      config.alphaRange[1],
      config.alphaRange[0] + depth * 0.22
    ),
  };
}

function drawNotchedPetalPath(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(
    -s * 0.85,
    s * 0.55,
    -s * 0.98,
    -s * 0.35,
    -s * 0.35,
    -s * 0.85
  );
  ctx.bezierCurveTo(-s * 0.16, -s * 0.98, -s * 0.06, -s * 0.72, 0, -s * 0.58);
  ctx.bezierCurveTo(s * 0.06, -s * 0.72, s * 0.16, -s * 0.98, s * 0.35, -s * 0.85);
  ctx.bezierCurveTo(s * 0.98, -s * 0.35, s * 0.85, s * 0.55, 0, s);
  ctx.closePath();
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;
  const flipScale = 0.42 + 0.58 * Math.abs(Math.cos(p.flipPhase));

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.scale(1, flipScale);
  ctx.globalAlpha = p.alpha;

  const grad = ctx.createLinearGradient(0, s, 0, -s);
  grad.addColorStop(0, p.palette.base);
  grad.addColorStop(0.45, p.palette.mid);
  grad.addColorStop(1, p.palette.tip);

  drawNotchedPetalPath(ctx, s);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 0.85;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, s * 0.75);
  ctx.lineTo(0, -s * 0.25);
  ctx.lineWidth = 0.65;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.restore();
}

function drawCurledPetal(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;
  const flipScale = 0.45 + 0.55 * Math.abs(Math.cos(p.flipPhase));

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.scale(flipScale, 1);
  ctx.globalAlpha = p.alpha;

  const grad = ctx.createLinearGradient(-s * 0.3, s, s * 0.4, -s);
  grad.addColorStop(0, p.palette.base);
  grad.addColorStop(0.5, p.palette.mid);
  grad.addColorStop(1, p.palette.tip);

  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(-s * 0.9, s * 0.45, -s * 0.75, -s * 0.6, s * 0.08, -s * 0.92);
  ctx.bezierCurveTo(s * 0.25, -s * 0.98, s * 0.28, -s * 0.68, s * 0.34, -s * 0.58);
  ctx.bezierCurveTo(s * 0.55, -s * 0.72, s * 0.82, -s * 0.38, s * 0.72, s * 0.15);
  ctx.bezierCurveTo(s * 0.6, s * 0.62, s * 0.26, s * 0.86, 0, s);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 0.8;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.restore();
}

function drawFullBlossom(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;
  const tilt = 0.76 + 0.24 * Math.cos(p.flipPhase * 0.7);

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.scale(1, tilt);
  ctx.globalAlpha = p.alpha;

  const petalLen = s * 0.95;

  for (let i = 0; i < 5; i += 1) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 5);

    const grad = ctx.createLinearGradient(0, 0, 0, -petalLen);
    grad.addColorStop(0, p.palette.base);
    grad.addColorStop(0.45, p.palette.mid);
    grad.addColorStop(1, p.palette.tip);

    ctx.beginPath();
    ctx.moveTo(0, -petalLen * 0.12);
    ctx.bezierCurveTo(
      -petalLen * 0.44,
      -petalLen * 0.36,
      -petalLen * 0.42,
      -petalLen * 0.94,
      -petalLen * 0.12,
      -petalLen * 0.98
    );
    ctx.bezierCurveTo(
      -petalLen * 0.04,
      -petalLen * 0.99,
      -petalLen * 0.02,
      -petalLen * 0.84,
      0,
      -petalLen * 0.78
    );
    ctx.bezierCurveTo(
      petalLen * 0.02,
      -petalLen * 0.84,
      petalLen * 0.04,
      -petalLen * 0.99,
      petalLen * 0.12,
      -petalLen * 0.98
    );
    ctx.bezierCurveTo(
      petalLen * 0.42,
      -petalLen * 0.94,
      petalLen * 0.44,
      -petalLen * 0.36,
      0,
      -petalLen * 0.12
    );
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 0.65;
    ctx.strokeStyle = p.palette.stroke;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = p.palette.center;
  ctx.fill();

  const stamenColor = p.palette.stamen ?? "rgba(245, 158, 11, 0.85)";
  for (let i = 0; i < 5; i += 1) {
    const angle = (i * Math.PI * 2) / 5 + 0.31;
    const tipX = Math.cos(angle) * s * 0.36;
    const tipY = Math.sin(angle) * s * 0.36;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tipX, tipY);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = stamenColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tipX, tipY, Math.max(1.1, s * 0.06), 0, Math.PI * 2);
    ctx.fillStyle = "#FDE047";
    ctx.fill();
  }

  ctx.restore();
}

function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;
  const flipScale = 0.42 + 0.58 * Math.abs(Math.cos(p.flipPhase));

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.scale(flipScale, 1);
  ctx.globalAlpha = p.alpha;

  const grad = ctx.createLinearGradient(0, s, 0, -s);
  grad.addColorStop(0, p.palette.base);
  grad.addColorStop(0.55, p.palette.mid);
  grad.addColorStop(1, p.palette.tip);

  ctx.beginPath();
  ctx.moveTo(0, s * 0.92);
  ctx.bezierCurveTo(-s * 0.68, s * 0.45, -s * 0.62, -s * 0.45, 0, -s);
  ctx.bezierCurveTo(s * 0.62, -s * 0.45, s * 0.68, s * 0.45, 0, s * 0.92);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 0.8;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  // Stem & midrib + subtle side veins
  ctx.beginPath();
  ctx.moveTo(0, s * 1.12);
  ctx.lineTo(0, -s * 0.78);
  for (const vy of [s * 0.35, 0, -s * 0.32]) {
    const span = s * (0.28 - Math.abs(vy) * 0.12);
    ctx.moveTo(0, vy);
    ctx.lineTo(-span, vy - s * 0.2);
    ctx.moveTo(0, vy);
    ctx.lineTo(span, vy - s * 0.2);
  }
  ctx.lineWidth = 0.65;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.restore();
}

function drawMapleLeaf(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;
  const flipScale = 0.46 + 0.54 * Math.abs(Math.cos(p.flipPhase));

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.scale(flipScale, 1);
  ctx.globalAlpha = p.alpha;

  const grad = ctx.createLinearGradient(0, s, 0, -s);
  grad.addColorStop(0, p.palette.base);
  grad.addColorStop(0.5, p.palette.mid);
  grad.addColorStop(1, p.palette.tip);

  ctx.beginPath();
  ctx.moveTo(0, s * 0.62);
  ctx.lineTo(-s * 0.28, s * 0.58);
  ctx.lineTo(-s * 0.78, s * 0.68);
  ctx.lineTo(-s * 0.56, s * 0.32);
  ctx.lineTo(-s * 0.96, -s * 0.04);
  ctx.lineTo(-s * 0.48, -s * 0.18);
  ctx.lineTo(-s * 0.58, -s * 0.52);
  ctx.lineTo(-s * 0.24, -s * 0.38);
  ctx.lineTo(0, -s);
  ctx.lineTo(s * 0.24, -s * 0.38);
  ctx.lineTo(s * 0.58, -s * 0.52);
  ctx.lineTo(s * 0.48, -s * 0.18);
  ctx.lineTo(s * 0.96, -s * 0.04);
  ctx.lineTo(s * 0.56, s * 0.32);
  ctx.lineTo(s * 0.78, s * 0.68);
  ctx.lineTo(s * 0.28, s * 0.58);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  // Stem & radiating veins
  ctx.beginPath();
  ctx.moveTo(0, s * 1.05);
  ctx.lineTo(0, -s * 0.75);
  ctx.moveTo(0, s * 0.42);
  ctx.lineTo(-s * 0.68, -s * 0.02);
  ctx.moveTo(0, s * 0.42);
  ctx.lineTo(s * 0.68, -s * 0.02);
  ctx.moveTo(0, s * 0.48);
  ctx.lineTo(-s * 0.52, s * 0.54);
  ctx.moveTo(0, s * 0.48);
  ctx.lineTo(s * 0.52, s * 0.54);
  ctx.lineWidth = 0.6;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.restore();
}

function drawGinkgoLeaf(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;
  const flipScale = 0.48 + 0.52 * Math.abs(Math.cos(p.flipPhase));

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.scale(flipScale, 1);
  ctx.globalAlpha = p.alpha;

  const grad = ctx.createLinearGradient(0, s * 0.6, 0, -s * 0.9);
  grad.addColorStop(0, p.palette.base);
  grad.addColorStop(0.5, p.palette.mid);
  grad.addColorStop(1, p.palette.tip);

  ctx.beginPath();
  ctx.moveTo(0, s * 0.48);
  ctx.bezierCurveTo(-s * 0.55, s * 0.15, -s * 0.95, -s * 0.22, -s * 0.85, -s * 0.62);
  ctx.bezierCurveTo(-s * 0.62, -s * 0.92, -s * 0.22, -s * 0.92, -s * 0.06, -s * 0.64);
  ctx.lineTo(0, -s * 0.34);
  ctx.lineTo(s * 0.06, -s * 0.64);
  ctx.bezierCurveTo(s * 0.22, -s * 0.92, s * 0.62, -s * 0.92, s * 0.85, -s * 0.62);
  ctx.bezierCurveTo(s * 0.95, -s * 0.22, s * 0.55, s * 0.15, 0, s * 0.48);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, s * 0.98);
  ctx.lineTo(0, s * 0.42);
  ctx.lineWidth = 0.85;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.restore();
}

function drawSnowflake(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.alpha;
  ctx.lineCap = "round";

  for (let i = 0; i < 6; i += 1) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);

    // Subtle icy halo under crystal branch
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -s);
    ctx.moveTo(0, -s * 0.46);
    ctx.lineTo(-s * 0.22, -s * 0.66);
    ctx.moveTo(0, -s * 0.46);
    ctx.lineTo(s * 0.22, -s * 0.66);
    ctx.moveTo(0, -s * 0.72);
    ctx.lineTo(-s * 0.15, -s * 0.86);
    ctx.moveTo(0, -s * 0.72);
    ctx.lineTo(s * 0.15, -s * 0.86);

    ctx.lineWidth = 2.1;
    ctx.strokeStyle = p.palette.mid;
    ctx.stroke();

    ctx.lineWidth = 1.05;
    ctx.strokeStyle = p.palette.stroke;
    ctx.stroke();

    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1.4, s * 0.14), 0, Math.PI * 2);
  ctx.fillStyle = p.palette.tip;
  ctx.fill();
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.restore();
}

function drawSnowDot(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = p.alpha * 0.88;

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
  grad.addColorStop(0, p.palette.tip);
  grad.addColorStop(0.55, p.palette.mid);
  grad.addColorStop(1, p.palette.base);

  ctx.beginPath();
  ctx.arc(0, 0, s, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 0.65;
  ctx.strokeStyle = p.palette.stroke;
  ctx.stroke();

  ctx.restore();
}

const SHAPE_DRAWERS: Record<
  ParticleShape,
  (ctx: CanvasRenderingContext2D, p: Particle) => void
> = {
  petal: drawPetal,
  curled: drawCurledPetal,
  blossom: drawFullBlossom,
  leaf: drawLeaf,
  maple: drawMapleLeaf,
  ginkgo: drawGinkgoLeaf,
  snowflake: drawSnowflake,
  snowdot: drawSnowDot,
};

/**
 * Hiệu ứng bông, lá & tuyết rơi toàn trang bằng Canvas mượt mà,
 * tự động bắt thời gian hiện tại theo 4 mùa Xuân – Hạ – Thu – Đông.
 */
export function PeachBlossomRain({
  enabled = true,
  season,
}: {
  enabled?: boolean;
  season?: SeasonKey;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mode = useSyncExternalStore(
    subscribeSeasonMode,
    getSeasonModeSnapshot,
    getSeasonModeServerSnapshot
  );
  const clockSeason = useSyncExternalStore(
    subscribeClockSeason,
    getClockSeasonSnapshot,
    getClockSeasonServerSnapshot
  );

  const activeSeason: SeasonKey | null = !enabled
    ? null
    : (season ?? (mode === "off" ? null : mode === "auto" ? clockSeason : mode));

  useEffect(() => {
    if (!activeSeason) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const syncParticleCount = () => {
      const targetCount = getTargetParticleCount(width);
      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, () =>
          createParticle(width, height, activeSeason, true)
        );
      } else if (particles.length < targetCount) {
        while (particles.length < targetCount) {
          particles.push(createParticle(width, height, activeSeason, true));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    const setupSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      syncParticleCount();
    };

    const tick = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
      lastTime = now;

      if (!document.hidden && width > 0 && height > 0) {
        elapsed += dt;
        ctx.clearRect(0, 0, width, height);

        const seasonCfg = SEASON_CONFIGS[activeSeason];
        const breeze =
          seasonCfg.breezeBase +
          Math.sin(elapsed * 0.45) * seasonCfg.breezeAmp;

        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          p.y += p.fallSpeed * dt;
          p.x +=
            (breeze * p.depth +
              Math.cos(elapsed * p.swayFreq + p.swayPhase) * p.swayAmplitude) *
            dt;
          p.rotation += p.rotationSpeed * dt;
          p.flipPhase += p.flipSpeed * dt;

          const margin = p.size * 2.5;
          if (p.x > width + margin) {
            p.x = -margin;
          } else if (p.x < -margin) {
            p.x = width + margin;
          }

          if (p.y > height + margin) {
            particles[i] = createParticle(width, height, activeSeason, false);
            continue;
          }

          SHAPE_DRAWERS[p.shape](ctx, p);
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        lastTime = performance.now();
      }
    };

    setupSize();
    rafId = window.requestAnimationFrame(tick);
    window.addEventListener("resize", setupSize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setupSize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeSeason]);

  if (!activeSeason) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full select-none"
    />
  );
}
