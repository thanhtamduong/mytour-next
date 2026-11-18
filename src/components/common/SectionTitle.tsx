import type { ReactNode } from "react";
import { LotusMotif } from "@/components/common/LotusMotif";

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  rightSlot?: ReactNode;
}

export function SectionTitle({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  rightSlot,
}: SectionTitleProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 ${
        isCentered
          ? "items-center text-center max-w-3xl mx-auto"
          : "md:flex-row md:items-end md:justify-between text-left"
      }`}
    >
      <div className={isCentered ? "flex flex-col items-center" : "max-w-2xl"}>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FBCFE2] bg-[#FFF5F8] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C82564]">
          <LotusMotif className="w-4 h-4 shrink-0" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="mt-3.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#103F2B] leading-tight">
          {title}{" "}
          {highlight && (
            <span className="text-[#E13D7D] font-display italic">
              {highlight}
            </span>
          )}
        </h2>

        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-[#103F2B]/75 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}
