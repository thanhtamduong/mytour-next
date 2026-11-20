"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { LuChevronLeft, LuChevronRight } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";

export interface ResponsivePageSize {
  mobile: number;
  tablet: number;
  desktop: number;
}

type BreakpointTier = keyof ResponsivePageSize;

function getBreakpointTier(): BreakpointTier {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth >= 1024) return "desktop";
  if (window.innerWidth >= 640) return "tablet";
  return "mobile";
}

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function useBreakpointTier(): BreakpointTier {
  return useSyncExternalStore(
    subscribeResize,
    getBreakpointTier,
    () => "desktop"
  );
}

function getElementOffsetLeft(track: HTMLElement, el: HTMLElement): number {
  const trackRect = track.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return elRect.left - trackRect.left + track.scrollLeft;
}

interface PagedSlideCarouselProps<T> {
  items: T[];
  filterKey: string;
  pageSizes: ResponsivePageSize;
  gridClassName: string;
  summaryLabel: string;
  unitLabel?: string;
  topSpacingClassName?: string;
  ariaLabels: {
    prev: string;
    next: string;
    tablist: string;
    pagePrefix: string;
  };
  extraSummaryActions?: ReactNode;
  renderItem: (item: T, globalIndex: number) => ReactNode;
}

export function PagedSlideCarousel<T>({
  items,
  filterKey,
  pageSizes,
  gridClassName,
  summaryLabel,
  unitLabel = "Slide",
  topSpacingClassName = "mt-5",
  ariaLabels,
  extraSummaryActions,
  renderItem,
}: PagedSlideCarouselProps<T>) {
  const tier = useBreakpointTier();
  const pageSize = Math.max(1, pageSizes[tier]);

  const pages = useMemo(() => {
    const chunks: { item: T; globalIndex: number }[][] = [];
    for (let i = 0; i < items.length; i += pageSize) {
      chunks.push(
        items.slice(i, i + pageSize).map((item, offset) => ({
          item,
          globalIndex: i + offset,
        }))
      );
    }
    return chunks;
  }, [items, pageSize]);

  const totalPages = Math.max(1, pages.length);
  const fullKey = `${filterKey}::${pageSize}::${items.length}`;

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

  const activePage =
    slideState.key === fullKey
      ? Math.min(slideState.page, totalPages - 1)
      : 0;
  const canPrev = slideState.key === fullKey ? slideState.canPrev : false;
  const canNext =
    slideState.key === fullKey ? slideState.canNext : totalPages > 1;

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [fullKey]);

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
        key: fullKey,
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
      const pageElements = Array.from(track.children) as HTMLElement[];
      let closestIdx = 0;
      let minDiff = Number.POSITIVE_INFINITY;
      pageElements.forEach((el, idx) => {
        const pageOffset = Math.min(getElementOffsetLeft(track, el), maxScroll);
        const diff = Math.abs(pageOffset - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      nextPage = Math.min(totalPages - 1, closestIdx);
    }

    setSlideState({
      key: fullKey,
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

    const pageEl = track.children[clampedPage] as HTMLElement | undefined;
    if (pageEl) {
      const targetLeft = getElementOffsetLeft(track, pageEl);
      track.scrollTo({
        left: Math.max(0, Math.min(targetLeft, maxScroll)),
        behavior: "smooth",
      });
    }
  };

  const handleTrackMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (
      (event.target as HTMLElement).closest(
        "a, button:not([data-carousel-drag-card])"
      )
    ) {
      return;
    }

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
      const bias = Math.abs(moved) > 45 ? Math.sign(moved) * 140 : 0;
      const targetSearchLeft = Math.max(
        0,
        Math.min(track.scrollLeft + bias, maxScroll)
      );

      const pageElements = Array.from(track.children) as HTMLElement[];
      let nearestLeft = track.scrollLeft;
      let minDiff = Number.POSITIVE_INFINITY;
      pageElements.forEach((el) => {
        const pageOffset = Math.min(getElementOffsetLeft(track, el), maxScroll);
        const diff = Math.abs(pageOffset - targetSearchLeft);
        if (diff < minDiff) {
          minDiff = diff;
          nearestLeft = pageOffset;
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

  return (
    <>
      {/* Result summary & Slide Controls */}
      <div
        className={`${topSpacingClassName} flex flex-wrap items-center justify-between gap-3 px-1`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#103F2B]/75">
          <span>
            Có <strong className="text-[#103F2B]">{items.length}</strong>{" "}
            {summaryLabel}
            {totalPages > 1 && (
              <span className="text-[#103F2B]/60">
                {" "}
                • {unitLabel}{" "}
                <strong className="text-[#C82564]">{activePage + 1}</strong>/
                {totalPages}
              </span>
            )}
          </span>
          {extraSummaryActions}
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
              aria-label={ariaLabels.prev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FBCFE2] bg-white text-[#103F2B] shadow-sm transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <LuChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToPage(activePage + 1)}
              disabled={!canNext}
              aria-label={ariaLabels.next}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FBCFE2] bg-white text-[#103F2B] shadow-sm transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <LuChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Paged Slide Carousel Track */}
      <div className="relative mt-3">
        {totalPages > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToPage(activePage - 1)}
              disabled={!canPrev}
              aria-label={ariaLabels.prev}
              className="absolute -left-3 lg:-left-5 top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#FBCFE2] bg-white/95 text-[#103F2B] shadow-lg backdrop-blur-sm transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564] disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
            >
              <LuChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToPage(activePage + 1)}
              disabled={!canNext}
              aria-label={ariaLabels.next}
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
              : `snap-x snap-mandatory ${totalPages > 1 ? "cursor-grab" : ""}`
          }`}
        >
          {pages.map((pageItems, pageIndex) => (
            <div
              key={pageIndex}
              className={`w-full shrink-0 snap-start ${gridClassName}`}
            >
              {pageItems.map(({ item, globalIndex }) =>
                renderItem(item, globalIndex)
              )}
            </div>
          ))}
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
              aria-label={ariaLabels.tablist}
            >
              {Array.from({ length: totalPages }).map((_, idx) => {
                const isCurrent = idx === activePage;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    onClick={() => scrollToPage(idx)}
                    aria-label={`${ariaLabels.pagePrefix} ${idx + 1}`}
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
  );
}
