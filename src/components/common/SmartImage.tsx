"use client";

import Image from "next/image";
import { useState } from "react";
import { LotusMotif } from "@/components/common/LotusMotif";
import type { ImageSource } from "@/types/travel";

interface SmartImageProps {
  src: ImageSource;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: "lazy" | "eager";
  preload?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Hiển thị ảnh tối ưu qua next/image kèm khung dự phòng mang họa tiết hoa sen
 * trong trường hợp đường dẫn mạng bị gián đoạn.
 */
export function SmartImage({
  src,
  alt,
  className = "object-cover",
  fallbackLabel,
  loading = "lazy",
  preload = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 75,
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FCE7F0] via-[#FFF5F8] to-[#D7F0E0] p-6 text-center text-[#145335] ${className}`}
        role="img"
        aria-label={alt}
      >
        <LotusMotif className="w-12 h-12 mb-2 opacity-90" />
        <p className="text-xs font-semibold text-[#103F2B]/80 line-clamp-2">
          {fallbackLabel || alt}
        </p>
      </div>
    );
  }

  const isStaticImport = typeof src !== "string";

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FCE7F0]/40">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        preload={preload}
        loading={preload ? undefined : loading}
        placeholder={isStaticImport ? "blur" : "empty"}
        draggable={false}
        onError={() => setHasError(true)}
        className={`select-none ${className}`}
      />
    </div>
  );
}
