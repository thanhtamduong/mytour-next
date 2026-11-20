"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  LuClock,
  LuFacebook,
  LuInstagram,
  LuMail,
  LuMapPin,
  LuPhoneCall,
  LuPlaneTakeoff,
} from "@/components/common/Icons";
import { LotusMotif } from "@/components/common/LotusMotif";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";
import { ADVISOR_PROFILE } from "@/data/profileData";
import {
  buildTelHref,
  sanitizeExternalUrl,
  sanitizeMailtoHref,
} from "@/lib/sanitize";

const DOMESTIC_TAGS = ["Đà Lạt", "Nha Trang", "Đà Nẵng", "Huế"];
const INTERNATIONAL_TAGS = [
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Hàn Quốc",
  "Nhật Bản",
  "Mỹ",
  "Úc",
  "Canada",
];

const emptySubscribe = () => () => {};

function useCurrentYear(): number {
  return useSyncExternalStore(
    emptySubscribe,
    () => new Date().getFullYear(),
    () => 2026
  );
}

export function Footer() {
  const { selectDestination } = useTravelProfile();
  const currentYear = useCurrentYear();
  const mailtoHref = sanitizeMailtoHref(ADVISOR_PROFILE.email);
  const facebookHref = sanitizeExternalUrl(ADVISOR_PROFILE.facebookUrl);
  const instagramHref = sanitizeExternalUrl(ADVISOR_PROFILE.instagramUrl);
  const zaloHref = sanitizeExternalUrl(ADVISOR_PROFILE.zaloLink);
  const telHref = buildTelHref(ADVISOR_PROFILE.phone);

  return (
    <footer className="relative overflow-hidden bg-[#0B2D1E] text-white">
      {/* Subtle lotus leaf decorative background */}
      <LotusMotif
        variant="leaf"
        className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 text-[#49A875]/20"
      />
      <LotusMotif
        variant="outline"
        className="pointer-events-none absolute -left-8 bottom-8 h-40 w-40 text-[#F472A8]/15"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 sm:pt-14 sm:pb-20 lg:px-8 lg:pb-14">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF5F8] shadow-md">
                <LotusMotif className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-extrabold tracking-tight text-white">
                  {ADVISOR_PROFILE.fullName}
                </h3>
                <p className="text-xs font-medium text-[#F8A4C7]">
                  {ADVISOR_PROFILE.brandName} • Sales Tour
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#D7F0E0]/85">
              {ADVISOR_PROFILE.tagline}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {facebookHref && (
                <a
                  href={facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-[#E13D7D]"
                  aria-label="Facebook cá nhân"
                >
                  <LuFacebook className="h-5 w-5" />
                </a>
              )}
              {instagramHref && (
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-[#E13D7D]"
                  aria-label="Instagram cá nhân"
                >
                  <LuInstagram className="h-5 w-5" />
                </a>
              )}
              {zaloHref && (
                <a
                  href={zaloHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[#E13D7D] px-3.5 text-xs font-bold text-white transition hover:bg-[#F26B9F]"
                >
                  Zalo 24/7
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Domestic Tours */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#F8A4C7]">
              <LuMapPin className="h-4 w-4" />
              <span>Tour Trong Nước</span>
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#D7F0E0]/90">
              {DOMESTIC_TAGS.map((place) => (
                <li key={place}>
                  <Link
                    href="/#tour-du-lich"
                    onClick={() => selectDestination(place)}
                    className="inline-flex items-center gap-2 py-0.5 transition hover:text-[#F8A4C7]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#49A875]" />
                    <span>Tour {place} trọn gói</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: International Tours */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#F8A4C7]">
              <LuPlaneTakeoff className="h-4 w-4" />
              <span>Tour Quốc Tế</span>
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {INTERNATIONAL_TAGS.map((country) => (
                <Link
                  key={country}
                  href="/#tour-du-lich"
                  onClick={() => selectDestination(country)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#D7F0E0] transition hover:border-[#F472A8] hover:bg-[#E13D7D]/20 hover:text-white"
                >
                  {country}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F8A4C7]">
              Thông tin liên hệ
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#D7F0E0]/90">
              <li className="flex items-start gap-2.5">
                <LuPhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-[#F472A8]" />
                <a
                  href={telHref}
                  className="font-semibold text-white hover:text-[#F8A4C7]"
                >
                  {ADVISOR_PROFILE.phone}
                </a>
              </li>
              {mailtoHref && (
                <li className="flex items-start gap-2.5">
                  <LuMail className="mt-0.5 h-4 w-4 shrink-0 text-[#F472A8]" />
                  <a
                    href={mailtoHref}
                    className="break-all hover:text-[#F8A4C7]"
                  >
                    {ADVISOR_PROFILE.email}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <LuMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#49A875]" />
                <span>{ADVISOR_PROFILE.officeAddress}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <LuClock className="mt-0.5 h-4 w-4 shrink-0 text-[#49A875]" />
                <span>{ADVISOR_PROFILE.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-start sm:items-center justify-between gap-2.5 border-t border-white/15 pt-6 text-xs text-[#D7F0E0]/70 sm:flex-row">
          <p>
            © {currentYear} {ADVISOR_PROFILE.fullName} —{" "}
            {ADVISOR_PROFILE.brandName}. Sắc hồng &amp; xanh lá hoa sen Việt Nam.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>
              Tư vấn lịch trình &amp; hỗ trợ Visa tận tâm • Liên hệ trực tiếp
              qua Hotline/Zalo chính chủ.
            </p>
            <Link
              href="/admin"
              className="font-semibold text-[#F8A4C7]/85 underline-offset-4 transition hover:text-white hover:underline"
            >
              Quản lý tour
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
