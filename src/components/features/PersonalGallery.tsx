"use client";

import { useMemo, useState } from "react";
import {
  LuAward,
  LuCamera,
  LuChevronLeft,
  LuChevronRight,
  LuHeart,
  LuImages,
  LuMapPin,
  LuMaximize2,
  LuQuote,
  LuShieldCheck,
} from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { LotusMotif } from "@/components/common/LotusMotif";
import { Modal } from "@/components/common/Modal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { SmartImage } from "@/components/common/SmartImage";
import { PERSONAL_GALLERY } from "@/data/galleryData";
import { ADVISOR_PROFILE } from "@/data/profileData";
import type { GalleryCategory, PersonalPhotoItem } from "@/types/travel";

const GALLERY_FILTERS: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "Tất cả khoảnh khắc" },
  { id: "portrait", label: "Ảnh chân dung" },
  { id: "leading-tour", label: "Dẫn đoàn & Đón khách" },
  { id: "inspection", label: "Khảo sát điểm đến" },
];

export function PersonalGallery() {
  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategory>("all");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "all") return PERSONAL_GALLERY;
    return PERSONAL_GALLERY.filter(
      (item) => item.category === selectedCategory
    );
  }, [selectedCategory]);

  const activePhoto: PersonalPhotoItem | null =
    activePhotoIndex !== null ? (filteredPhotos[activePhotoIndex] ?? null) : null;

  const handleNext = () => {
    if (activePhotoIndex === null || filteredPhotos.length === 0) return;
    setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    if (activePhotoIndex === null || filteredPhotos.length === 0) return;
    setActivePhotoIndex(
      (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  return (
    <section id="gioi-thieu" className="relative py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Giới thiệu bản thân"
          title="Người đồng hành tin cậy trên"
          highlight="mỗi dặm đường"
          subtitle={ADVISOR_PROFILE.bioStory}
        />

        {/* Personal Story + Service Pillars */}
        <div className="mt-9 sm:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Quote & Lotus Identity Card */}
          <Card
            tone="blush"
            padding="lg"
            className="relative flex flex-col justify-between overflow-hidden p-5 sm:p-7 lg:col-span-5"
          >
            <LotusMotif
              variant="leaf"
              className="pointer-events-none -right-8 -bottom-8 absolute h-44 w-44 text-[#186C42]/12"
            />
            <div className="relative">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E13D7D] text-white shadow-md shadow-[#E13D7D]/25">
                <LuQuote className="h-5 w-5" />
              </div>

              <h3 className="mt-4 sm:mt-5 text-lg sm:text-2xl font-bold text-[#103F2B] leading-snug">
                Làm nghề du lịch bằng chữ “Tâm” và sự chỉn chu của người bản
                địa
              </h3>

              <blockquote className="mt-4 rounded-2xl border border-[#FBCFE2] bg-white/85 p-3.5 sm:p-4 text-sm sm:text-base italic leading-relaxed text-[#A51950]">
                “{ADVISOR_PROFILE.philosophyQuote}”
              </blockquote>

              <div className="mt-5 space-y-2.5 text-sm text-[#103F2B]/85">
                <div className="flex items-start gap-2.5">
                  <LuShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#186C42]" />
                  <span>
                    Tư vấn trung thực theo đúng nhu cầu (gia đình có người lớn
                    tuổi, trẻ nhỏ, cặp đôi hay đoàn công ty).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <LuAward className="mt-0.5 h-4 w-4 shrink-0 text-[#E13D7D]" />
                  <span>
                    Cập nhật trực tiếp giá tour nội địa &amp; quốc tế tốt nhất
                    từ các hãng hàng không và đối tác landtour uy tín.
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-6 flex items-center gap-3 border-t border-[#FBCFE2]/80 pt-5">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#E13D7D]">
                <SmartImage
                  src={ADVISOR_PROFILE.avatarUrl}
                  alt={ADVISOR_PROFILE.fullName}
                  sizes="48px"
                  className="object-cover object-[50%_22%]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#103F2B]">
                  {ADVISOR_PROFILE.fullName}
                </p>
                <p className="text-xs font-medium text-[#186C42]">
                  {ADVISOR_PROFILE.officeAddress}
                </p>
              </div>
            </div>
          </Card>

          {/* 4 Service Pillars */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {ADVISOR_PROFILE.servicePillars.map((pillar, idx) => {
              const isPink = pillar.accent === "pink";
              return (
                <Card
                  key={pillar.id}
                  tone={isPink ? "blush" : "mint"}
                  hoverable
                  className="flex flex-col justify-between p-5 sm:p-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-extrabold ${
                          isPink
                            ? "bg-[#FCE7F0] text-[#C82564]"
                            : "bg-[#D7F0E0] text-[#145335]"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <LotusMotif
                        variant="outline"
                        className={`h-6 w-6 ${
                          isPink ? "text-[#E13D7D]/60" : "text-[#186C42]/60"
                        }`}
                      />
                    </div>
                    <h4 className="mt-3.5 sm:mt-4 text-base sm:text-lg font-bold text-[#103F2B]">
                      {pillar.title}
                    </h4>
                    <p className="mt-1.5 sm:mt-2 text-sm leading-relaxed text-[#103F2B]/75">
                      {pillar.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Personal Photo List */}
        <div id="anh-ca-nhan" className="mt-14 sm:mt-20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B2DFC4] bg-[#EEF9F2] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#145335]">
                <LuImages className="h-4 w-4 text-[#186C42]" />
                <span>Album Hình Ảnh Bản Thân</span>
              </div>
              <h3 className="mt-2.5 text-2xl sm:text-3xl font-bold text-[#103F2B]">
                Khoảnh khắc làm nghề &amp;{" "}
                <span className="font-display italic text-[#E13D7D]">
                  chuyến đi thực tế
                </span>
              </h3>
              <p className="mt-1.5 text-sm text-[#103F2B]/75">
                Bấm vào từng ảnh để phóng to và xem câu chuyện đằng sau mỗi
                chuyến khảo sát, đón đoàn.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap lg:justify-end">
              {GALLERY_FILTERS.map((filter) => {
                const active = selectedCategory === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(filter.id);
                      setActivePhotoIndex(null);
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-[#E13D7D] to-[#C82564] text-white shadow-md shadow-[#E13D7D]/25"
                        : "border border-[#186C42]/20 bg-white text-[#103F2B] hover:border-[#E13D7D] hover:bg-[#FFF5F8]"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo List Grid */}
          <div className="mt-7 sm:mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#FBCFE2]/80 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E13D7D]/12 cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <SmartImage
                    src={item.imageUrl}
                    alt={`${item.title} — ${item.location}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                      item.category === "portrait" ? "object-[50%_22%]" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D1E]/75 via-transparent to-transparent opacity-80 transition group-hover:opacity-95" />

                  <div className="absolute left-3 top-3 sm:left-3.5 sm:top-3.5 flex items-center gap-2">
                    <Badge
                      tone={item.category === "portrait" ? "pink" : "green"}
                      icon={<LuCamera className="h-3 w-3" />}
                    >
                      {item.categoryLabel}
                    </Badge>
                  </div>

                  <span className="absolute right-3 top-3 sm:right-3.5 sm:top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#103F2B] opacity-90 shadow-sm transition lg:opacity-0 lg:group-hover:opacity-100">
                    <LuMaximize2 className="h-4 w-4" />
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 flex items-center justify-between gap-2 text-[11px] sm:text-xs font-medium text-white">
                    <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                      <LuMapPin className="h-3 w-3 shrink-0 text-[#F8A4C7]" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[#FCE7F0]">
                      <LuHeart className="h-3.5 w-3.5 fill-[#F26B9F] text-[#F26B9F]" />
                      <span className="hidden min-[380px]:inline">
                        {item.dateLabel}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <h4 className="text-base font-bold text-[#103F2B] group-hover:text-[#C82564] transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#103F2B]/75 line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Personal Photos */}
      <Modal
        isOpen={activePhoto !== null}
        onClose={() => setActivePhotoIndex(null)}
        title={activePhoto?.title}
        maxWidthClass="max-w-3xl"
      >
        {activePhoto && (
          <div>
            <div className="relative aspect-[4/3] sm:aspect-[16/10] max-h-[56dvh] sm:max-h-[68vh] w-full overflow-hidden rounded-2xl bg-[#EEF9F2]">
              <SmartImage
                key={activePhoto.id}
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                loading="eager"
                sizes="(max-width: 768px) 100vw, 768px"
                className={`object-cover ${
                  activePhoto.category === "portrait" ? "object-[50%_22%]" : ""
                }`}
              />
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#103F2B] shadow-lg transition hover:bg-[#E13D7D] hover:text-white cursor-pointer"
                    aria-label="Ảnh trước"
                  >
                    <LuChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#103F2B] shadow-lg transition hover:bg-[#E13D7D] hover:text-white cursor-pointer"
                    aria-label="Ảnh tiếp theo"
                  >
                    <LuChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="pink">{activePhoto.categoryLabel}</Badge>
                <Badge tone="green" icon={<LuMapPin className="h-3 w-3" />}>
                  {activePhoto.location}
                </Badge>
              </div>
              <span className="text-xs font-semibold text-[#103F2B]/60">
                {(activePhotoIndex ?? 0) + 1} / {filteredPhotos.length}
              </span>
            </div>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#103F2B]/85">
              {activePhoto.caption}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
}
