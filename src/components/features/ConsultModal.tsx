"use client";

import { useEffect, useState } from "react";
import {
  LuCheck,
  LuCopy,
  LuExternalLink,
  LuMessageCircleHeart,
  LuPhoneCall,
} from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { SmartImage } from "@/components/common/SmartImage";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";
import { ADVISOR_PROFILE } from "@/data/profileData";

interface ConsultContentProps {
  initialTour: string;
}

function ConsultContent({ initialTour }: ConsultContentProps) {
  const [tourInterest, setTourInterest] = useState(initialTour);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyInquiryText = async () => {
    const tourName = tourInterest.trim() || "Tư vấn chọn tour phù hợp";
    const text = `Chào ${ADVISOR_PROFILE.nickname}, mình muốn tư vấn & nhận báo giá: ${tourName}`;
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard API may be unavailable in restricted webviews; ignore silently.
    }
  };

  return (
    <div className="space-y-4">
      {/* Advisor Profile Strip */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2]/75 p-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#E13D7D]">
          <SmartImage
            src={ADVISOR_PROFILE.avatarUrl}
            alt={ADVISOR_PROFILE.fullName}
            sizes="48px"
            className="object-cover object-[50%_22%]"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#103F2B]">
            {ADVISOR_PROFILE.fullName}
          </p>
          <p className="truncate text-xs font-medium text-[#C82564]">
            Tư vấn trực tiếp qua Zalo &amp; Hotline
          </p>
          <p className="truncate text-[11px] text-[#103F2B]/70">
            {ADVISOR_PROFILE.workingHours}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-[#103F2B]/80">
        Nhấn mở app <strong>Zalo</strong> bên dưới để kết bạn và nhắn trực tiếp
        với {ADVISOR_PROFILE.nickname} — nhận lịch khởi hành gần nhất &amp; báo
        giá tour ưu đãi cho đoàn của bạn.
      </p>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label
            htmlFor="modal-tour"
            className="block text-xs font-bold text-[#103F2B]"
          >
            Tuyến tour bạn đang quan tâm
          </label>
          <button
            type="button"
            onClick={copyInquiryText}
            className="inline-flex items-center gap-1 rounded-full bg-[#FFF5F8] px-2.5 py-1 text-[11px] font-semibold text-[#C82564] border border-[#FBCFE2] transition hover:bg-[#FCE7F0] cursor-pointer"
          >
            {copied ? (
              <>
                <LuCheck className="h-3 w-3 text-[#186C42]" />
                <span className="text-[#186C42]">Đã sao chép</span>
              </>
            ) : (
              <>
                <LuCopy className="h-3 w-3" />
                <span>Sao chép nội dung</span>
              </>
            )}
          </button>
        </div>
        <input
          id="modal-tour"
          type="text"
          value={tourInterest}
          onChange={(e) => setTourInterest(e.target.value)}
          className="w-full rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8]/50 px-3.5 py-2.5 text-base sm:text-sm font-medium text-[#103F2B] focus:border-[#E13D7D] focus:bg-white focus:outline-none"
        />
        <p className="mt-1.5 text-[11px] text-[#103F2B]/65">
          Mẹo: Khi bấm mở Zalo, nội dung tour sẽ tự động sao chép để bạn dán
          vào khung chat nhanh hơn.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        <Button
          variant="primary"
          size="lg"
          href={ADVISOR_PROFILE.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={copyInquiryText}
          leftIcon={<LuMessageCircleHeart className="h-5 w-5" />}
          rightIcon={<LuExternalLink className="h-4 w-4" />}
          fullWidth
        >
          Mở Zalo kết bạn &amp; chat báo giá
        </Button>
        <Button
          variant="soft-green"
          size="md"
          href={`tel:${ADVISOR_PROFILE.phone.replace(/\s+/g, "")}`}
          leftIcon={<LuPhoneCall className="h-4 w-4" />}
          fullWidth
        >
          Hoặc gọi trực tiếp {ADVISOR_PROFILE.phone}
        </Button>
      </div>
    </div>
  );
}

export function ConsultModal() {
  const {
    consultModalOpen: isOpen,
    consultModalTour: defaultTour,
    closeConsult: onClose,
  } = useTravelProfile();
  const initialTour = defaultTour || "Tư vấn chọn tour phù hợp";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhận báo giá & Tư vấn tour"
      maxWidthClass="max-w-lg"
    >
      {isOpen && <ConsultContent key={initialTour} initialTour={initialTour} />}
    </Modal>
  );
}
