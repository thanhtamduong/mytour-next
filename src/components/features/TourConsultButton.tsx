"use client";

import { LuMessageCircleHeart } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";

interface TourConsultButtonProps {
  tourTitle: string;
  label?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function TourConsultButton({
  tourTitle,
  label = "Nhận báo giá & Tư vấn tour này",
  variant = "primary",
  size = "lg",
  fullWidth = false,
}: TourConsultButtonProps) {
  const { openConsult } = useTravelProfile();

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      leftIcon={<LuMessageCircleHeart className="h-5 w-5" />}
      onClick={() => openConsult(tourTitle)}
    >
      {label}
    </Button>
  );
}
