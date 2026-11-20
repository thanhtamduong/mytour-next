"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LuMenu,
  LuMessageCircleHeart,
  LuPhoneCall,
  LuX,
} from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { LotusMotif } from "@/components/common/LotusMotif";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";
import { JOURNEY_STORIES } from "@/data/journeyData";
import { ADVISOR_PROFILE } from "@/data/profileData";
import { buildTelHref } from "@/lib/sanitize";

const NAV_LINKS = [
  { label: "Giới thiệu", href: "/#gioi-thieu" },
  { label: "Ảnh cá nhân", href: "/#anh-ca-nhan" },
  { label: "Tour đang bán", href: "/#tour-du-lich" },
  ...(JOURNEY_STORIES.length > 0
    ? [{ label: "Hành trình khách", href: "/#hanh-trinh" }]
    : []),
  { label: "Liên hệ", href: "/#lien-he" },
];

export function Navbar() {
  const { openConsult } = useTravelProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#FBCFE2]/70 bg-[#FFFDFC]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link
          href="/#top"
          onClick={handleNavClick}
          className="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-[#E13D7D]"
        >
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF5F8] to-[#EEF9F2] border border-[#FBCFE2] shadow-sm transition-transform duration-300 group-hover:scale-105">
            <LotusMotif className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm sm:text-base font-extrabold tracking-tight text-[#103F2B]">
                {ADVISOR_PROFILE.nickname}
              </span>
              <span className="hidden sm:inline-block shrink-0 rounded-full bg-[#EEF9F2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#186C42]">
                {ADVISOR_PROFILE.brandName}
              </span>
            </div>
            <p className="truncate text-[11px] font-medium text-[#C82564]">
              Sales Tour Trong Nước &amp; Quốc Tế
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Điều hướng chính"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-[#103F2B]/80 transition hover:bg-[#FCE7F0]/65 hover:text-[#C82564]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <a
            href={buildTelHref(ADVISOR_PROFILE.phone)}
            className="hidden md:inline-flex items-center gap-1.5 rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2] px-3.5 py-2 text-xs font-bold text-[#145335] transition hover:bg-[#D7F0E0]"
          >
            <LuPhoneCall className="h-3.5 w-3.5 text-[#186C42]" />
            <span>{ADVISOR_PROFILE.phone}</span>
          </a>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<LuMessageCircleHeart className="h-4 w-4" />}
            onClick={() => openConsult()}
            className="hidden sm:inline-flex"
          >
            Tư vấn nhanh
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#FBCFE2] bg-[#FFF5F8] text-[#C82564] lg:hidden cursor-pointer"
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <LuX className="h-5 w-5" />
            ) : (
              <LuMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-[#FCE7F0] bg-[#FFFDFC] px-4 py-4 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Menu di động">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="flex min-h-[44px] items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-[#103F2B] transition hover:bg-[#FCE7F0]/70 hover:text-[#C82564]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 border-t border-[#FCE7F0] pt-4">
            <Button
              variant="soft-green"
              size="sm"
              href={buildTelHref(ADVISOR_PROFILE.phone)}
              leftIcon={<LuPhoneCall className="h-4 w-4" />}
              fullWidth
            >
              Gọi {ADVISOR_PROFILE.phone}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<LuMessageCircleHeart className="h-4 w-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                openConsult();
              }}
              fullWidth
            >
              Nhận báo giá
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
