import type { ReactNode } from "react";

type BadgeTone = "pink" | "green" | "gold" | "neutral" | "glass";

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  pink: "bg-[#FCE7F0] text-[#A51950] border-[#FBCFE2]",
  green: "bg-[#EEF9F2] text-[#145335] border-[#B2DFC4]",
  gold: "bg-amber-50 text-amber-800 border-amber-200",
  neutral: "bg-stone-100 text-stone-700 border-stone-200",
  glass: "bg-white/90 backdrop-blur-md text-[#103F2B] border-white/60 shadow-sm",
};

export function Badge({
  tone = "pink",
  icon,
  className = "",
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
