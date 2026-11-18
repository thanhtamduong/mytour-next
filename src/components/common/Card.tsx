import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "white" | "blush" | "mint";
  children: ReactNode;
}

const PADDING_CLASSES = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const TONE_CLASSES = {
  white: "bg-white border-[#186C42]/12",
  blush: "bg-gradient-to-br from-[#FFF5F8] to-white border-[#FBCFE2]",
  mint: "bg-gradient-to-br from-[#EEF9F2] to-white border-[#B2DFC4]",
};

export function Card({
  hoverable = false,
  padding = "md",
  tone = "white",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-3xl border shadow-sm transition-all duration-300",
        TONE_CLASSES[tone],
        PADDING_CLASSES[padding],
        hoverable
          ? "hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E13D7D]/10 hover:border-[#F26B9F]/50"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
