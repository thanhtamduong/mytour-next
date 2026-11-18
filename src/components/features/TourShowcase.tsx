"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  LuCalendarDays,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuEarth,
  LuMapPin,
  LuPlane,
  LuPlaneTakeoff,
  LuSearch,
  LuShieldCheck,
  LuSparkles,
  LuStar,
  LuX,
} from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { SmartImage } from "@/components/common/SmartImage";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";
import { ADVISOR_PROFILE } from "@/data/profileData";
import { TOUR_PACKAGES } from "@/data/toursData";
import type { TourFilterTab, TourPackage } from "@/types/travel";

const FILTER_TABS: { id: TourFilterTab; label: string; count: number }[] = [
  { id: "all", label: "Tất cả tuyến tour", count: TOUR_PACKAGES.length },
  {
    id: "vietnam",
    label: "Trong nước (Việt Nam)",
    count: TOUR_PACKAGES.filter((t) => t.region === "vietnam").length,
  },
  {
    id: "international",
    label: "Tất cả Quốc tế",
    count: TOUR_PACKAGES.filter((t) => t.scope === "international").length,
  },
  {
    id: "southeast-asia",
    label: "Đông Nam Á (Sing • Mã • Indo)",
    count: TOUR_PACKAGES.filter((t) => t.region === "southeast-asia").length,
  },
  {
    id: "east-asia",
    label: "Đông Á (Hàn • Nhật)",
    count: TOUR_PACKAGES.filter((t) => t.region === "east-asia").length,
  },
  {
    id: "americas-oceania",
    label: "Mỹ • Úc • Canada",
    count: TOUR_PACKAGES.filter((t) => t.region === "americas-oceania").length,
  },
];

const QUICK_DESTINATIONS = [
  "Đà Lạt",
  "Nha Trang",
  "Đà Nẵng",
  "Huế",
  "Singapore",
  "Malaysia",
  "Bali",
  "Hàn Quốc",
  "Nhật Bản",
  "Mỹ",
  "Úc",
  "Canada",
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function getCardsPerView(): number {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function useCardsPerView(): number {
  return useSyncExternalStore(subscribeResize, getCardsPerView, () => 3);
}

function getCardOffsetLeft(track: HTMLElement, cardEl: HTMLElement): number {
  const trackRect = track.getBoundingClientRect();
  const cardRect = cardEl.getBoundingClientRect();
  return cardRect.left - trackRect.left + track.scrollLeft;
}

export function TourShowcase() {
  const {
    activeTourFilter: activeFilter,
    setActiveTourFilter: onChangeFilter,
    tourSearch: externalSearch,
    setTourSearch: onChangeSearch,
    openConsult: onBookTour,
  } = useTravelProfile();

  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [slideState, setSlideState] = useState<{
    key: string;
    page: number;
    canPrev: boolean;
    canNext: boolean;
  }>({
    key: "",
    page: 0,
    canPrev: false,
    canNext: false,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const cardsPerView = useCardsPerView();

  const isSearching = externalSearch.trim().length > 0;
  const filterKey = `${activeFilter}::${externalSearch.trim()}::${cardsPerView}`;

  const filteredTours = useMemo(() => {
    const query = normalizeText(externalSearch);

    const matched = TOUR_PACKAGES.filter((tour) => {
      const matchesTab =
        activeFilter === "all"
          ? true
          : activeFilter === "international"
            ? tour.scope === "international"
            : tour.region === activeFilter;
      if (!matchesTab) return false;

      if (!query) return true;
      const searchable = normalizeText(
        `${tour.title} ${tour.destination} ${tour.countryOrProvince} ${tour.regionLabel} ${tour.highlights.join(" ")}`,
      );
      return searchable.includes(query);
    });

    if (activeFilter === "all" && !query) {
      const domestic = matched.filter((t) => t.scope === "domestic");
      const international = matched.filter((t) => t.scope === "international");
      const balanced: TourPackage[] = [];
      const maxLen = Math.max(domestic.length, international.length);
      for (let i = 0; i < maxLen; i += 1) {
        if (domestic[i]) balanced.push(domestic[i]);
        if (international[i]) balanced.push(international[i]);
      }
      return balanced;
    }

    return matched;
  }, [activeFilter, externalSearch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTours.length / cardsPerView),
  );
  const activePage =
    slideState.key === filterKey
      ? Math.min(slideState.page, totalPages - 1)
      : 0;
  const canPrev = slideState.key === filterKey ? slideState.canPrev : false;
  const canNext =
    slideState.key === filterKey
      ? slideState.canNext
      : filteredTours.length > cardsPerView;

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [filterKey]);

  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);

  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 6) {
      setSlideState({
        key: filterKey,
        page: 0,
        canPrev: false,
        canNext: false,
      });
      return;
    }

    const scrollLeft = track.scrollLeft;
    const nextCanPrev = scrollLeft > 6;
    const nextCanNext = scrollLeft < maxScroll - 6;

    let nextPage: number;
    if (scrollLeft >= maxScroll - 8) {
      nextPage = totalPages - 1;
    } else {
      const children = Array.from(track.children) as HTMLElement[];
      let closestIdx = 0;
      let minDiff = Number.POSITIVE_INFINITY;
      children.forEach((el, idx) => {
        const cardOffset = getCardOffsetLeft(track, el);
        const diff = Math.abs(cardOffset - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      nextPage = Math.min(
        totalPages - 1,
        Math.floor(closestIdx / cardsPerView + 0.35),
      );
    }

    setSlideState({
      key: filterKey,
      page: nextPage,
      canPrev: nextCanPrev,
      canNext: nextCanNext,
    });
  };

  const scrollToPage = (pageIndex: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clampedPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

    if (clampedPage >= totalPages - 1) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    const targetCardIdx = clampedPage * cardsPerView;
    const cardEl = track.children[targetCardIdx] as HTMLElement | undefined;
    if (cardEl) {
      const targetLeft = getCardOffsetLeft(track, cardEl);
      track.scrollTo({
        left: Math.max(0, Math.min(targetLeft, maxScroll)),
        behavior: "smooth",
      });
    }
  };

  const handleTrackMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button, a")) return;

    const track = trackRef.current;
    if (!track || track.scrollWidth <= track.clientWidth + 4) return;

    const startX = event.clientX;
    const startScrollLeft = track.scrollLeft;
    let dragged = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      if (!dragged && Math.abs(dx) > 6) {
        dragged = true;
        setIsDragging(true);
        window.getSelection()?.removeAllRanges();
      }
      if (dragged) {
        track.scrollLeft = startScrollLeft - dx;
      }
    };

    const cleanup = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dragCleanupRef.current = null;
    };

    const handleMouseUp = () => {
      cleanup();
      if (!dragged) return;

      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);

      setIsDragging(false);

      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const moved = track.scrollLeft - startScrollLeft;
      const bias = Math.abs(moved) > 45 ? Math.sign(moved) * 80 : 0;
      const targetSearchLeft = Math.max(
        0,
        Math.min(track.scrollLeft + bias, maxScroll),
      );

      const children = Array.from(track.children) as HTMLElement[];
      let nearestLeft = track.scrollLeft;
      let minDiff = Number.POSITIVE_INFINITY;
      children.forEach((el) => {
        const cardOffset = Math.min(getCardOffsetLeft(track, el), maxScroll);
        const diff = Math.abs(cardOffset - targetSearchLeft);
        if (diff < minDiff) {
          minDiff = diff;
          nearestLeft = cardOffset;
        }
      });
      track.scrollTo({ left: nearestLeft, behavior: "smooth" });
    };

    dragCleanupRef.current?.();
    dragCleanupRef.current = cleanup;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTrackClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const domesticToursCount = TOUR_PACKAGES.filter(
    (t) => t.scope === "domestic",
  ).length;
  const internationalToursCount = TOUR_PACKAGES.filter(
    (t) => t.scope === "international",
  ).length;

  return (
    <section
      id="tour-du-lich"
      className="relative border-y border-[#FCE7F0] bg-gradient-to-b from-[#FFF5F8]/70 via-[#FFFDFC] to-[#EEF9F2]/55 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Danh mục Tour Đang Mở Bán"
          title="Hành trình trong nước &"
          highlight="quốc tế chọn lọc"
          subtitle="Đầy đủ tuyến hot từ Đà Lạt, Nha Trang, Đà Nẵng, Huế đến Singapore, Malaysia, Indonesia, Hàn Quốc, Nhật Bản, Mỹ, Úc, Canada — lịch khởi hành linh hoạt mỗi tuần."
        />

        {/* Scope Overview Banners */}
        <div className="mt-8 sm:mt-10 grid gap-3.5 sm:gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              onChangeFilter("vietnam");
              onChangeSearch("");
            }}
            className={`group flex items-center justify-between gap-3 sm:gap-4 rounded-3xl border p-4 sm:p-5 text-left transition cursor-pointer ${
              activeFilter === "vietnam"
                ? "border-[#186C42] bg-[#EEF9F2] shadow-md"
                : "border-[#B2DFC4] bg-white hover:bg-[#EEF9F2]/70"
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#186C42] text-white shadow-sm">
                <LuMapPin className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-lg font-bold text-[#103F2B]">
                    Tour Du Lịch Trong Nước (Việt Nam)
                  </h3>
                  <Badge tone="green">{domesticToursCount} tuyến</Badge>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-[#103F2B]/75 leading-relaxed">
                  Đà Lạt • Nha Trang • Đà Nẵng • Hội An • Huế — Tour ghép đoàn
                  &amp; tour gia đình xe riêng.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeFilter("international");
              onChangeSearch("");
            }}
            className={`group flex items-center justify-between gap-3 sm:gap-4 rounded-3xl border p-4 sm:p-5 text-left transition cursor-pointer ${
              activeFilter === "international" ||
              activeFilter === "southeast-asia" ||
              activeFilter === "east-asia" ||
              activeFilter === "americas-oceania"
                ? "border-[#E13D7D] bg-[#FFF5F8] shadow-md"
                : "border-[#FBCFE2] bg-white hover:bg-[#FFF5F8]/70"
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E13D7D] text-white shadow-sm">
                <LuEarth className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-lg font-bold text-[#103F2B]">
                    Tour Du Lịch Ngoài Nước (Quốc Tế)
                  </h3>
                  <Badge tone="pink">{internationalToursCount} tuyến</Badge>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-[#103F2B]/75 leading-relaxed">
                  Singapore • Malaysia • Indonesia • Hàn • Nhật • Mỹ • Úc •
                  Canada — Hỗ trợ Visa.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Filter Tabs + Search Bar */}
        <div className="mt-6 sm:mt-8 rounded-3xl border border-[#FBCFE2] bg-white p-3.5 sm:p-5 shadow-sm">
          {/* Region Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar md:flex-wrap md:pb-0">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeFilter(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#103F2B] text-white shadow-sm"
                      : "bg-[#FFF5F8] text-[#103F2B] hover:bg-[#FCE7F0]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive
                        ? "bg-[#E13D7D] text-white"
                        : "bg-white text-[#C82564]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3.5 flex flex-col gap-3 border-t border-[#FCE7F0]/70 pt-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Destination Search */}
            <div className="relative w-full shrink-0 lg:order-2 lg:w-72 xl:w-80">
              <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#186C42]" />
              <input
                type="text"
                value={externalSearch}
                onChange={(event) => onChangeSearch(event.target.value)}
                placeholder="Tìm điểm đến: Đà Lạt, Mỹ, Úc, Sing..."
                aria-label="Tìm kiếm tour theo điểm đến"
                className="w-full rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2]/40 py-2.5 pl-10 pr-9 text-base sm:text-sm text-[#103F2B] placeholder:text-[#103F2B]/50 focus:border-[#E13D7D] focus:bg-white focus:outline-none"
              />
              {externalSearch && (
                <button
                  type="button"
                  onClick={() => onChangeSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#103F2B]/60 hover:bg-[#FCE7F0] hover:text-[#C82564] cursor-pointer"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <LuX className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Destination Chips */}
            <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:pb-0 lg:order-1">
              <span className="mr-1 shrink-0 text-xs font-semibold text-[#103F2B]/65">
                Gợi ý nhanh:
              </span>
              {QUICK_DESTINATIONS.map((dest) => {
                const isSelected =
                  normalizeText(externalSearch) === normalizeText(dest);
                return (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => {
                      onChangeFilter("all");
                      onChangeSearch(isSelected ? "" : dest);
                    }}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-[#E13D7D] text-white"
                        : "bg-stone-100 text-[#103F2B]/80 hover:bg-[#FCE7F0] hover:text-[#C82564]"
                    }`}
                  >
                    {dest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result summary & Slide Controls */}
        {filteredTours.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#103F2B]/75">
              <span>
                Có{" "}
                <strong className="text-[#103F2B]">
                  {filteredTours.length}
                </strong>{" "}
                tuyến tour
                {totalPages > 1 && (
                  <span className="text-[#103F2B]/60">
                    {" "}
                    • Slide{" "}
                    <strong className="text-[#C82564]">{activePage + 1}</strong>
                    /{totalPages}
                  </span>
                )}
              </span>
              {(activeFilter !== "all" || isSearching) && (
                <button
                  type="button"
                  onClick={() => {
                    onChangeFilter("all");
                    onChangeSearch("");
                  }}
                  className="font-semibold text-[#C82564] hover:underline cursor-pointer"
                >
                  Xem tất cả tuyến tour
                </button>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-[#103F2B]/60 mr-1">
                  Lướt hoặc bấm mũi tên
                </span>
                <button
                  type="button"
                  onClick={() => scrollToPage(activePage - 1)}
                  disabled={!canPrev}
                  aria-label="Slide tour trước"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FBCFE2] bg-white text-[#103F2B] shadow-sm transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <LuChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToPage(activePage + 1)}
                  disabled={!canNext}
                  aria-label="Slide tour tiếp theo"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FBCFE2] bg-white text-[#103F2B] shadow-sm transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <LuChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tour Slide Carousel */}
        {filteredTours.length === 0 ? (
          <Card
            tone="blush"
            className="mt-8 sm:mt-10 py-10 sm:py-12 text-center"
          >
            <p className="text-base font-bold text-[#103F2B]">
              Chưa tìm thấy tuyến tour khớp với “{externalSearch}”
            </p>
            <p className="mt-1.5 text-sm text-[#103F2B]/75">
              {ADVISOR_PROFILE.nickname} nhận thiết kế tour riêng theo mọi điểm
              đến bạn yêu cầu!
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChangeFilter("all");
                  onChangeSearch("");
                }}
              >
                Xem lại tất cả tour
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  onBookTour(
                    externalSearch
                      ? `Tour thiết kế riêng đi ${externalSearch}`
                      : "Tour thiết kế theo yêu cầu",
                  )
                }
              >
                Nhờ {ADVISOR_PROFILE.nickname} báo giá tuyến này
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="relative mt-3">
              {totalPages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollToPage(activePage - 1)}
                    disabled={!canPrev}
                    aria-label="Slide tour trước"
                    className="absolute -left-3 lg:-left-5 top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#FBCFE2] bg-white/95 text-[#103F2B] shadow-lg backdrop-blur-sm transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564] disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                  >
                    <LuChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToPage(activePage + 1)}
                    disabled={!canNext}
                    aria-label="Slide tour tiếp theo"
                    className="absolute -right-3 lg:-right-5 top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#FBCFE2] bg-white/95 text-[#103F2B] shadow-lg backdrop-blur-sm transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564] disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                  >
                    <LuChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div
                ref={trackRef}
                onScroll={handleTrackScroll}
                onMouseDown={handleTrackMouseDown}
                onClickCapture={handleTrackClickCapture}
                className={`flex items-stretch gap-4 lg:gap-6 overflow-x-auto no-scrollbar pt-1.5 pb-4 ${
                  isDragging
                    ? "snap-none select-none cursor-grabbing"
                    : `snap-x snap-proximity ${totalPages > 1 ? "cursor-grab" : ""}`
                }`}
              >
                {filteredTours.map((tour) => {
                  const isDomestic = tour.scope === "domestic";
                  return (
                    <Card
                      key={tour.id}
                      padding="none"
                      hoverable
                      className="w-[86%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)] flex flex-col overflow-hidden"
                    >
                      {/* Image Header */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <SmartImage
                          src={tour.imageUrl}
                          alt={`${tour.title} — ${tour.destination}`}
                          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D1E]/75 via-transparent to-black/20" />

                        <div className="absolute left-3 top-3 sm:left-3.5 sm:top-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2 pr-3">
                          <Badge
                            tone={isDomestic ? "green" : "pink"}
                            icon={
                              isDomestic ? (
                                <LuMapPin className="h-3 w-3" />
                              ) : (
                                <LuPlane className="h-3 w-3" />
                              )
                            }
                          >
                            {isDomestic ? "Trong nước" : "Quốc tế"}
                          </Badge>
                          {tour.badgeText && (
                            <Badge
                              tone="glass"
                              icon={
                                <LuSparkles className="h-3 w-3 text-[#E13D7D]" />
                              }
                            >
                              {tour.badgeText}
                            </Badge>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 sm:left-3.5 sm:right-3.5 flex items-center justify-between gap-2 text-xs font-semibold text-white">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                            <LuClock className="h-3.5 w-3.5 text-[#F8A4C7]" />
                            {tour.duration}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                            <LuStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {tour.rating.toFixed(1)} ({tour.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                            <span
                              className={`truncate ${
                                isDomestic ? "text-[#186C42]" : "text-[#C82564]"
                              }`}
                            >
                              {tour.countryOrProvince}
                            </span>
                            <span className="shrink-0 text-[#103F2B]/55">
                              Mã: {tour.code}
                            </span>
                          </div>

                          <h3 className="mt-1.5 text-base sm:text-lg font-bold leading-snug text-[#103F2B] line-clamp-2">
                            <Link
                              href={`/tours/${tour.slug}`}
                              className="transition-colors hover:text-[#C82564]"
                            >
                              {tour.title}
                            </Link>
                          </h3>

                          <div className="mt-2.5 flex items-center gap-2 text-xs text-[#103F2B]/70">
                            <LuPlaneTakeoff className="h-3.5 w-3.5 shrink-0 text-[#186C42]" />
                            <span>Khởi hành: {tour.departureFrom}</span>
                          </div>

                          <ul className="mt-3.5 space-y-1.5">
                            {tour.highlights.slice(0, 2).map((point) => (
                              <li
                                key={point}
                                className="flex items-start gap-2 text-xs leading-relaxed text-[#103F2B]/80"
                              >
                                <LuCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#186C42]" />
                                <span className="line-clamp-2">{point}</span>
                              </li>
                            ))}
                          </ul>

                          {tour.visaNote && (
                            <div className="mt-3 rounded-xl bg-[#FFF5F8] px-3 py-2 text-[11px] font-medium text-[#A51950] border border-[#FBCFE2]/70">
                              <span className="font-bold">Visa: </span>
                              {tour.visaNote}
                            </div>
                          )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="mt-5 border-t border-[#FCE7F0] pt-4">
                          <div className="grid grid-cols-1 min-[370px]:grid-cols-2 gap-2.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTour(tour)}
                              fullWidth
                            >
                              Xem lịch trình
                            </Button>
                            <Button
                              variant={isDomestic ? "secondary" : "primary"}
                              size="sm"
                              onClick={() => onBookTour(tour.title)}
                              fullWidth
                            >
                              Tư vấn ngay
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Bottom Slide Pagination */}
            {totalPages > 1 && (
              <div className="mt-2 flex items-center justify-between gap-3 sm:justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToPage(activePage - 1)}
                  disabled={!canPrev}
                  leftIcon={<LuChevronLeft className="h-4 w-4" />}
                >
                  <span className="hidden min-[380px]:inline">Trước</span>
                </Button>

                {totalPages <= 8 ? (
                  <div
                    className="flex items-center gap-1.5"
                    role="tablist"
                    aria-label="Chọn trang slide tour"
                  >
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const isCurrent = idx === activePage;
                      return (
                        <button
                          key={idx}
                          type="button"
                          role="tab"
                          onClick={() => scrollToPage(idx)}
                          aria-label={`Xem slide ${idx + 1}`}
                          aria-selected={isCurrent}
                          className={`h-2.5 rounded-full transition-all cursor-pointer ${
                            isCurrent
                              ? "w-7 bg-[#E13D7D]"
                              : "w-2.5 bg-[#FBCFE2] hover:bg-[#F472A8]"
                          }`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-28 sm:w-44 overflow-hidden rounded-full bg-[#FCE7F0]">
                      <div
                        className="h-full rounded-full bg-[#E13D7D] transition-all duration-300"
                        style={{
                          width: `${((activePage + 1) / totalPages) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#C82564]">
                      {activePage + 1}/{totalPages}
                    </span>
                  </div>
                )}

                <Button
                  variant="soft-pink"
                  size="sm"
                  onClick={() => scrollToPage(activePage + 1)}
                  disabled={!canNext}
                  rightIcon={<LuChevronRight className="h-4 w-4" />}
                >
                  <span className="hidden min-[380px]:inline">Tiếp</span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tour Detail Modal */}
      <Modal
        isOpen={selectedTour !== null}
        onClose={() => setSelectedTour(null)}
        title={
          selectedTour
            ? `${selectedTour.code} • ${selectedTour.destination}`
            : undefined
        }
        maxWidthClass="max-w-3xl"
      >
        {selectedTour && (
          <div className="space-y-5 sm:space-y-6">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <SmartImage
                src={selectedTour.imageUrl}
                alt={selectedTour.title}
                loading="eager"
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                <Badge
                  tone={selectedTour.scope === "domestic" ? "green" : "pink"}
                >
                  {selectedTour.regionLabel}
                </Badge>
                <Badge
                  tone="glass"
                  icon={<LuCalendarDays className="h-3.5 w-3.5" />}
                >
                  {selectedTour.duration}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-[#103F2B]">
                {selectedTour.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#103F2B]/80">
                <span>
                  Khởi hành: <strong>{selectedTour.departureFrom}</strong>
                </span>
              </div>
            </div>

            {selectedTour.visaNote && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8] p-3.5 sm:p-4 text-sm text-[#A51950]">
                <LuShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E13D7D]" />
                <div>
                  <span className="font-bold">Lưu ý thủ tục &amp; Visa: </span>
                  {selectedTour.visaNote}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2]/55 p-4">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#145335]">
                  Lịch trình tóm tắt
                </h4>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#103F2B]/85">
                  {selectedTour.itinerarySummary.map((day) => (
                    <li key={day} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#186C42]" />
                      <span>{day}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8]/60 p-4">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A51950]">
                  Dịch vụ bao gồm
                </h4>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#103F2B]/85">
                  {selectedTour.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E13D7D]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2.5 border-t border-[#FCE7F0] pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <Button
                variant="soft-green"
                size="sm"
                href={`/tours/${selectedTour.slug}`}
                onClick={() => setSelectedTour(null)}
                className="w-full sm:w-auto"
              >
                Xem trang chi tiết
              </Button>
              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTour(null)}
                  className="w-full sm:w-auto"
                >
                  Đóng lại
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const title = selectedTour.title;
                    setSelectedTour(null);
                    onBookTour(title);
                  }}
                  className="w-full sm:w-auto"
                >
                  Nhờ {ADVISOR_PROFILE.nickname} tư vấn tour này
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
