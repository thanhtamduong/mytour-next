"use client";

import { LuMessageCircleHeart, LuPhoneCall } from "@/components/common/Icons";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";
import { ADVISOR_PROFILE } from "@/data/profileData";

export function FloatingContact() {
  const { openConsult } = useTravelProfile();

  return (
    <div className="fixed bottom-3.5 right-3.5 z-30 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6 sm:gap-2.5">
      <a
        href={`tel:${ADVISOR_PROFILE.phone.replace(/\s+/g, "")}`}
        className="flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full border border-[#B2DFC4] bg-white/95 px-3 sm:px-4 text-xs font-bold text-[#145335] shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-[#EEF9F2]"
        aria-label="Gọi điện tư vấn tour"
      >
        <LuPhoneCall className="h-4 w-4 text-[#186C42]" />
        <span className="hidden sm:inline">{ADVISOR_PROFILE.phone}</span>
      </a>

      <button
        type="button"
        onClick={() => openConsult()}
        className="flex h-11 sm:h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#E13D7D] to-[#C82564] px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-[#E13D7D]/35 transition hover:scale-105 hover:brightness-105 cursor-pointer"
      >
        <LuMessageCircleHeart className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Tư vấn tour ngay</span>
      </button>
    </div>
  );
}
