"use client";

import { useEffect, useRef } from "react";

type BlossomShape = "petal" | "curled" | "blossom";

interface BlossomPalette {
  base: string;
  mid: string;
  tip: string;
  stroke: string;
  center: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  shape: BlossomShape;
  palette: BlossomPalette;
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

const BLOSSOM_PALETTES: readonly BlossomPalette[] = [
  {
    base: "#E13D7D",
    mid: "#F472A8",
    tip: "#FFE5F0",
    stroke: "rgba(200, 37, 100, 0.34)",
    center: "#C82564",
  },
  {
    base: "#EC4899",
    mid: "#F8A4C7",
    tip: "#FFF5F8",
    stroke: "rgba(225, 61, 125, 0.32)",
    center: "#E13D7D",
  },
  {
    base: "#F26B9F",
    mid: "#FBCFE2",
    tip: "#FFFFFF",
    stroke: "rgba(225, 61, 125, 0.28)",
    center: "#DB2777",
  },
  {
    base: "#FB7185",
    mid: "#FDA4AF",
    tip: "#FFF1F5",
    stroke: "rgba(225, 29, 72, 0.28)",
    center: "#E11D48",
  },
];

function getTargetParticleCount(width: number): number {
  if (width < 640) return 22;
  if (width < 1024) return 30;
  return 40;
}

function pickShape(roll: number): BlossomShape {
  if (roll < 0.22) return "blossom";
  if (roll < 0.52) return "curled";
  return "petal";
}

function createParticle(
  width: number,
  height: number,
  randomY: boolean
): Particle {
  const depth = 0.55 + Math.random() * 0.75;
  const shape = pickShape(Math.random());
  const baseSize = shape === "blossom" ? 11 + Math.random() * 6 : 9 + Math.random() * 5.5;
  const size = baseSize * depth;

  return {
    x: Math.random() * (width + 80) - 40,
    y: randomY ? Math.random() * height : -size * 2.5 - Math.random() * 40,
    size,
    shape,
    palette: BLOSSOM_PALETTES[Math.floor(Math.random() * BLOSSOM_PALETTES.length)],
    depth,
    fallSpeed: (32 + Math.random() * 28) * depth,
    swayAmplitude: (16 + Math.random() * 22) * depth,
    swayFreq: 0.7 + Math.random() * 0.9,
    swayPhase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * (shape === "blossom" ? 0.9 : 1.3),
    flipPhase: Math.random() * Math.PI * 2,
    flipSpeed: 1.1 + Math.random() * 1.4,
    alpha: Math.min(0.95, 0.58 + depth * 0.26),
  };
}

function drawNotchedPetalPath(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(-s * 0.85, s * 0.55, -s * 0.98, -s * 0.35, -s * 0.35, -s * 0.85);
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

  // Delicate center vein
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

  // Warm rosy center & golden stamens
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = p.palette.center;
  ctx.fill();

  for (let i = 0; i < 5; i += 1) {
    const angle = (i * Math.PI * 2) / 5 + 0.31;
    const tipX = Math.cos(angle) * s * 0.36;
    const tipY = Math.sin(angle) * s * 0.36;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tipX, tipY);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tipX, tipY, Math.max(1.1, s * 0.06), 0, Math.PI * 2);
    ctx.fillStyle = "#FDE047";
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Hiệu ứng hoa đào & cánh hoa rơi toàn trang bằng Canvas mượt mà,
 * tạo không khí thơ mộng, lãng mạn mà không cản trở thao tác người dùng.
 */
export function PeachBlossomRain({ enabled = true }: { enabled?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
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

      const targetCount = getTargetParticleCount(width);
      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, () =>
          createParticle(width, height, true)
        );
      } else if (particles.length < targetCount) {
        while (particles.length < targetCount) {
          particles.push(createParticle(width, height, true));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
      lastTime = now;

      if (!document.hidden && width > 0 && height > 0) {
        elapsed += dt;
        ctx.clearRect(0, 0, width, height);

        const breeze = 12 + Math.sin(elapsed * 0.45) * 9;

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
            particles[i] = createParticle(width, height, false);
            continue;
          }

          if (p.shape === "blossom") {
            drawFullBlossom(ctx, p);
          } else if (p.shape === "curled") {
            drawCurledPetal(ctx, p);
          } else {
            drawPetal(ctx, p);
          }
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
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full select-none"
    />
  );
}
