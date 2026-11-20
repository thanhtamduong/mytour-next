"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  LuCheck,
  LuChevronUp,
  LuEyeOff,
  LuFlower2,
  LuLeaf,
  LuSnowflake,
  LuSparkles,
  LuSun,
  LuX,
} from "@/components/common/Icons";
import {
  getClockSeasonServerSnapshot,
  getClockSeasonSnapshot,
  getSeasonModeServerSnapshot,
  getSeasonModeSnapshot,
  SEASON_META_BY_KEY,
  SEASON_OPTIONS,
  setSeasonMode,
  subscribeClockSeason,
  subscribeSeasonMode,
  type SeasonKey,
  type SeasonMode,
} from "@/lib/season";

const SEASON_ICONS: Record<
  SeasonKey,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  spring: LuFlower2,
  summer: LuSun,
  autumn: LuLeaf,
  winter: LuSnowflake,
};

const SEASON_STYLE_CLASSES: Record<
  SeasonKey,
  {
    pillBorder: string;
    iconBg: string;
    iconText: string;
    activeCard: string;
  }
> = {
  spring: {
    pillBorder: "border-[#FBCFE2] hover:border-[#E13D7D]",
    iconBg: "bg-[#FCE7F0]",
    iconText: "text-[#C82564]",
    activeCard: "border-[#E13D7D] bg-[#FFF5F8] ring-1 ring-[#E13D7D]/25",
  },
  summer: {
    pillBorder: "border-[#B2DFC4] hover:border-[#186C42]",
    iconBg: "bg-[#EEF9F2]",
    iconText: "text-[#145335]",
    activeCard: "border-[#186C42] bg-[#EEF9F2] ring-1 ring-[#186C42]/25",
  },
  autumn: {
    pillBorder: "border-orange-200 hover:border-orange-500",
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    activeCard: "border-orange-500 bg-orange-50/80 ring-1 ring-orange-500/25",
  },
  winter: {
    pillBorder: "border-sky-200 hover:border-sky-500",
    iconBg: "bg-sky-50",
    iconText: "text-sky-600",
    activeCard: "border-sky-500 bg-sky-50/85 ring-1 ring-sky-500/25",
  },
};

export function SeasonSwitcher() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mode = useSyncExternalStore(
    subscribeSeasonMode,
    getSeasonModeSnapshot,
    getSeasonModeServerSnapshot
  );
  const clockSeason = useSyncExternalStore(
    subscribeClockSeason,
    getClockSeasonSnapshot,
    getClockSeasonServerSnapshot
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const activeSeason: SeasonKey | null =
    mode === "off" ? null : mode === "auto" ? clockSeason : mode;
  const activeMeta = activeSeason ? SEASON_META_BY_KEY[activeSeason] : null;
  const ActiveIcon = activeSeason ? SEASON_ICONS[activeSeason] : LuEyeOff;
  const pillStyle = activeSeason
    ? SEASON_STYLE_CLASSES[activeSeason]
    : {
        pillBorder: "border-stone-200 hover:border-stone-400",
        iconBg: "bg-stone-100",
        iconText: "text-stone-500",
        activeCard: "",
      };

  const handleSelectMode = (nextMode: SeasonMode) => {
    setSeasonMode(nextMode);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-3.5 left-3.5 z-30 sm:bottom-6 sm:left-6"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chọn chủ đề hiệu ứng mùa rơi"
          className="mb-2.5 w-[min(calc(100vw-1.75rem),19rem)] rounded-3xl border border-[#FBCFE2] bg-white/95 p-3.5 shadow-2xl shadow-[#103F2B]/15 backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[#FCE7F0] pb-2.5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#103F2B]">
                Hiệu ứng 4 mùa
              </p>
              <p className="mt-0.5 text-[11px] text-[#103F2B]/65">
                Thử ngay hoa, lá &amp; tuyết rơi theo mùa
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng bảng chọn mùa"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#103F2B]/60 transition hover:bg-[#FCE7F0] hover:text-[#C82564] cursor-pointer"
            >
              <LuX className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2.5 space-y-2">
            {/* Auto by real-time clock */}
            <button
              type="button"
              onClick={() => handleSelectMode("auto")}
              className={`flex w-full items-center justify-between gap-2.5 rounded-2xl border p-2.5 text-left transition cursor-pointer ${
                mode === "auto"
                  ? "border-[#186C42] bg-[#EEF9F2] ring-1 ring-[#186C42]/20"
                  : "border-[#FCE7F0] bg-[#FFFDFC] hover:border-[#B2DFC4] hover:bg-[#EEF9F2]/50"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FCE7F0] to-[#D7F0E0] text-[#103F2B]">
                  <LuSparkles className="h-4 w-4 text-[#C82564]" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#103F2B]">
                    Tự động theo thời gian
                  </p>
                  <p className="truncate text-[11px] text-[#103F2B]/65">
                    {clockSeason
                      ? `Hiện đang là ${SEASON_META_BY_KEY[clockSeason].title}`
                      : "Tự nhận diện theo ngày hiện tại"}
                  </p>
                </div>
              </div>
              {mode === "auto" && (
                <LuCheck className="h-4 w-4 shrink-0 text-[#186C42]" />
              )}
            </button>

            {/* 4 Seasons Grid */}
            <div className="grid grid-cols-2 gap-2">
              {SEASON_OPTIONS.map((option) => {
                const Icon = SEASON_ICONS[option.key];
                const style = SEASON_STYLE_CLASSES[option.key];
                const isSelected = mode === option.key;
                const isRunningNow = mode === "auto" && clockSeason === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleSelectMode(option.key)}
                    className={`group relative flex flex-col rounded-2xl border p-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? style.activeCard
                        : "border-[#FCE7F0] bg-white hover:border-[#FBCFE2] hover:bg-[#FFF5F8]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-xl ${style.iconBg} ${style.iconText}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {isSelected ? (
                        <LuCheck className={`h-3.5 w-3.5 ${style.iconText}`} />
                      ) : isRunningNow ? (
                        <span className="rounded-full bg-[#EEF9F2] px-1.5 py-0.5 text-[9px] font-bold text-[#186C42]">
                          Hiện tại
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#103F2B]">
                      {option.title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-snug text-[#103F2B]/65">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Disable toggle */}
            <button
              type="button"
              onClick={() => handleSelectMode(mode === "off" ? "auto" : "off")}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-[11px] font-semibold transition cursor-pointer ${
                mode === "off"
                  ? "border-stone-400 bg-stone-100 text-stone-800"
                  : "border-transparent bg-stone-50 text-[#103F2B]/70 hover:bg-stone-100"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <LuEyeOff className="h-3.5 w-3.5" />
                <span>
                  {mode === "off"
                    ? "Đang tắt hiệu ứng (bấm để bật tự động)"
                    : "Tạm tắt hiệu ứng rơi"}
                </span>
              </span>
              {mode === "off" && <LuCheck className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Compact Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Chọn chủ đề hiệu ứng mùa rơi"
        className={`inline-flex h-11 items-center gap-2 rounded-full border bg-white/95 pl-2 pr-3 text-xs font-bold text-[#103F2B] shadow-lg backdrop-blur-md transition hover:scale-[1.03] cursor-pointer ${pillStyle.pillBorder}`}
      >
        <span
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${pillStyle.iconBg} ${pillStyle.iconText}`}
        >
          <ActiveIcon className="h-3.5 w-3.5" />
        </span>
        <span className="sm:hidden">
          {mode === "off" ? "Tắt" : activeMeta ? activeMeta.shortLabel : "Mùa"}
        </span>
        <span className="hidden sm:inline">
          {mode === "off"
            ? "Hiệu ứng: Tắt"
            : activeMeta
              ? activeMeta.title
              : "Theo mùa"}
        </span>
        {mode === "auto" && activeMeta && (
          <span className="hidden md:inline-block rounded-full bg-[#EEF9F2] px-1.5 py-0.5 text-[10px] font-bold text-[#186C42]">
            Auto
          </span>
        )}
        <LuChevronUp
          className={`h-3.5 w-3.5 text-[#103F2B]/60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
