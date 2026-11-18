"use client";

import {
  LuArrowRight,
  LuBadgeCheck,
  LuCamera,
  LuCompass,
  LuMapPin,
  LuPlaneTakeoff,
  LuSparkles,
} from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { LotusMotif } from "@/components/common/LotusMotif";
import { SmartImage } from "@/components/common/SmartImage";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";
import { ADVISOR_PROFILE } from "@/data/profileData";

export function Hero() {
  const { selectDestination, openConsult } = useTravelProfile();

  return (
    <section
      id="top"
      className="relative overflow-hidden lotus-pond-bg border-b border-[#FCE7F0]"
    >
      {/* Decorative Lotus Watermarks */}
      <LotusMotif
        variant="leaf"
        className="pointer-events-none absolute -left-16 top-14 h-52 w-52 sm:h-64 sm:w-64 text-[#268955]/12"
      />
      <LotusMotif
        variant="outline"
        className="pointer-events-none absolute right-8 top-10 h-44 w-44 text-[#E13D7D]/15 hidden md:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Content */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="pink" icon={<LotusMotif className="h-4 w-4" />}>
                {ADVISOR_PROFILE.brandName} • Sắc Sen Việt
              </Badge>
              <Badge
                tone="green"
                icon={<LuBadgeCheck className="h-3.5 w-3.5" />}
              >
                {ADVISOR_PROFILE.roleTitle}
              </Badge>
            </div>

            <h1 className="mt-4 sm:mt-5 text-[1.8rem] leading-[1.2] font-extrabold tracking-tight text-[#103F2B] sm:text-4xl lg:text-5xl xl:text-[3.35rem] lg:leading-[1.12]">
              Gửi trọn tâm huyết vào{" "}
              <span className="font-display italic text-[#E13D7D]">
                từng hành trình
              </span>{" "}
              khám phá Việt Nam &amp; Thế Giới
            </h1>

            <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#103F2B]/80">
              {ADVISOR_PROFILE.bioIntro}
            </p>

            {/* Featured Route Pills */}
            <div className="mt-5 sm:mt-6">
              <p className="mb-2.5 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#186C42]">
                <LuCompass className="h-4 w-4 shrink-0 text-[#E13D7D]" />
                <span>Tuyến điểm chuyên sâu (Bấm để lọc nhanh tour):</span>
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {ADVISOR_PROFILE.featuredDestinations.map((place, index) => {
                  const isDomestic = index < 4;
                  return (
                    <a
                      key={place}
                      href="#tour-du-lich"
                      onClick={() => selectDestination(place)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition hover:-translate-y-0.5 cursor-pointer ${
                        isDomestic
                          ? "border-[#B2DFC4] bg-[#EEF9F2] text-[#145335] hover:bg-[#186C42] hover:text-white"
                          : "border-[#FBCFE2] bg-[#FFF5F8] text-[#A51950] hover:bg-[#E13D7D] hover:text-white"
                      }`}
                    >
                      {isDomestic ? (
                        <LuMapPin className="h-3 w-3 shrink-0" />
                      ) : (
                        <LuPlaneTakeoff className="h-3 w-3 shrink-0" />
                      )}
                      <span>{place}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-7 sm:mt-8 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3.5">
              <Button
                variant="primary"
                size="lg"
                href="#tour-du-lich"
                rightIcon={<LuArrowRight className="h-5 w-5" />}
                className="w-full sm:w-auto"
              >
                Khám phá Tour đang bán
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="#anh-ca-nhan"
                leftIcon={<LuCamera className="h-5 w-5" />}
                className="w-full sm:w-auto"
              >
                Xem hồ sơ &amp; Ảnh cá nhân
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => openConsult()}
                className="w-full sm:w-auto"
              >
                Nhận báo giá riêng
              </Button>
            </div>
          </div>

          {/* Right Showcase Frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Outer lotus gradient halo */}
              <div
                className="absolute -inset-2 sm:-inset-3 rounded-[2.25rem] sm:rounded-[2.5rem] bg-gradient-to-tr from-[#F8A4C7]/45 via-[#FFF5F8] to-[#B2DFC4]/55 blur-xl"
                aria-hidden="true"
              />

              <div className="relative rounded-[1.85rem] sm:rounded-[2.25rem] border-2 border-white bg-white p-2.5 sm:p-3 shadow-2xl shadow-[#186C42]/12">
                <div className="relative aspect-[4/4.2] sm:aspect-[4/4.6] lg:aspect-[4/5] overflow-hidden rounded-[1.4rem] sm:rounded-[1.75rem]">
                  <SmartImage
                    src={ADVISOR_PROFILE.avatarUrl}
                    alt={`${ADVISOR_PROFILE.fullName} - ${ADVISOR_PROFILE.roleTitle}`}
                    preload
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 448px, 42vw"
                    className="object-cover object-[50%_22%]"
                    fallbackLabel={ADVISOR_PROFILE.fullName}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B2D1E]/90 via-[#0B2D1E]/45 to-transparent p-4 sm:p-5 text-white">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#49A875] ring-4 ring-[#49A875]/30" />
                      <span className="text-xs font-semibold text-[#D7F0E0]">
                        Sẵn sàng tư vấn lịch trình
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-lg sm:text-xl font-bold text-white">
                      {ADVISOR_PROFILE.fullName}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#FCE7F0]/90">
                      Chuyên tour Việt Nam • Đông Nam Á • Nhật – Hàn • Mỹ – Úc –
                      Canada
                    </p>
                  </div>
                </div>

                {/* Floating Preview Card: Destination Spotlight */}
                <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2.5 sm:gap-3 rounded-2xl border border-[#FCE7F0] bg-gradient-to-r from-[#FFF5F8] to-[#EEF9F2] p-2.5 sm:p-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border border-white shadow-sm">
                      <SmartImage
                        src={ADVISOR_PROFILE.lotusAccentImageUrl}
                        alt="Biểu tượng hoa sen Việt Nam"
                        loading="eager"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-xs font-bold text-[#C82564]">
                        <LuSparkles className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          Cam kết đồng hành tận tâm
                        </span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#103F2B]/80 line-clamp-2 sm:truncate">
                        Báo giá rõ ràng • Hỗ trợ Visa &amp; vé bay trọn gói
                      </p>
                    </div>
                  </div>
                  <LotusMotif className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
