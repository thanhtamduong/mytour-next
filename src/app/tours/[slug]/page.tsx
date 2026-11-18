import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  LuArrowLeft,
  LuCalendarDays,
  LuCheck,
  LuClock,
  LuHouse,
  LuMapPin,
  LuPhoneCall,
  LuPlane,
  LuPlaneTakeoff,
  LuShieldCheck,
  LuSparkles,
  LuStar,
} from "@/components/common/Icons";
import { LotusMotif } from "@/components/common/LotusMotif";
import { SmartImage } from "@/components/common/SmartImage";
import { TourConsultButton } from "@/components/features/TourConsultButton";
import { ADVISOR_PROFILE } from "@/data/profileData";
import {
  TOUR_PACKAGES,
  getRelatedTours,
  getTourBySlug,
} from "@/data/toursData";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { buildTourJsonLd, serializeJsonLd } from "@/lib/structuredData";

interface TourDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TOUR_PACKAGES.map((tour) => ({
    slug: tour.slug,
  }));
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    return {
      title: "Không tìm thấy tour",
      robots: { index: false, follow: false },
    };
  }

  const description = `${tour.title} (${tour.duration}, khởi hành ${tour.departureFrom}). ${tour.highlights[0]}. Tư vấn lịch trình & Visa 1:1 cùng ${ADVISOR_PROFILE.fullName} — ${ADVISOR_PROFILE.brandName}.`;
  const imageUrl =
    typeof tour.imageUrl === "string" ? tour.imageUrl : tour.imageUrl.src;

  return {
    title: `${tour.title} (${tour.duration})`,
    description,
    keywords: [
      `tour ${tour.destination}`,
      tour.title,
      tour.regionLabel,
      "Thuỳ Linh Travel",
      ADVISOR_PROFILE.brandName,
      tour.visaRequired ? `visa ${tour.destination}` : "tour trọn gói",
    ],
    alternates: {
      canonical: `/tours/${tour.slug}`,
    },
    openGraph: {
      type: "article",
      locale: SITE_CONFIG.locale,
      url: `/tours/${tour.slug}`,
      siteName: SITE_CONFIG.siteName,
      title: `${tour.title} | Thuỳ Linh Travel`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1100,
          height: 700,
          alt: tour.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tour.title} | Thuỳ Linh Travel`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const isDomestic = tour.scope === "domestic";
  const relatedTours = getRelatedTours(tour, 3);
  const tourJsonLd = buildTourJsonLd(tour);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(tourJsonLd),
        }}
      />

      <main className="flex-1 lotus-pond-bg pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Đường dẫn trang"
            className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#103F2B]/70"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-semibold text-[#186C42] hover:text-[#C82564] transition-colors"
            >
              <LuHouse className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/#tour-du-lich"
              className="font-medium hover:text-[#C82564] transition-colors"
            >
              Tour đang bán
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#103F2B] truncate">
              {tour.destination}
            </span>
          </nav>

          {/* Back link */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              href="/#tour-du-lich"
              leftIcon={<LuArrowLeft className="h-4 w-4" />}
            >
              Quay lại danh mục tour
            </Button>
          </div>

          {/* Main Tour Hero Card */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border-2 border-white shadow-xl shadow-[#186C42]/10">
                <SmartImage
                  src={tour.imageUrl}
                  alt={`${tour.title} — ${tour.destination}`}
                  preload
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D1E]/75 via-transparent to-black/15" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
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
                    {tour.regionLabel}
                  </Badge>
                  {tour.badgeText && (
                    <Badge
                      tone="glass"
                      icon={<LuSparkles className="h-3 w-3 text-[#E13D7D]" />}
                    >
                      {tour.badgeText}
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-white">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">
                    <LuClock className="h-4 w-4 text-[#F8A4C7]" />
                    {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">
                    <LuStar className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {tour.rating.toFixed(1)} ({tour.reviewCount} đánh giá)
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <Card tone="white" padding="lg">
                <h2 className="text-lg sm:text-xl font-bold text-[#103F2B]">
                  Điểm nhấn nổi bật của hành trình
                </h2>
                <ul className="mt-4 space-y-3">
                  {tour.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-[#103F2B]/85"
                    >
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF9F2] text-[#186C42]">
                        <LuCheck className="h-3.5 w-3.5" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Itinerary & Includes */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Card tone="mint" padding="md">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#145335]">
                    <LuCalendarDays className="h-4 w-4" />
                    <span>Lịch trình tóm tắt</span>
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#103F2B]/85">
                    {tour.itinerarySummary.map((day) => (
                      <li key={day} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#186C42]" />
                        <span>{day}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card tone="blush" padding="md">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#A51950]">
                    <LuSparkles className="h-4 w-4" />
                    <span>Dịch vụ bao gồm</span>
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#103F2B]/85">
                    {tour.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2.5">
                        <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E13D7D]" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            {/* Right Sticky Advisor Booking Sidebar */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              <Card tone="white" padding="lg" className="border-[#FBCFE2]">
                <div className="flex items-center justify-between gap-2 text-xs font-bold">
                  <span
                    className={
                      isDomestic ? "text-[#186C42]" : "text-[#C82564]"
                    }
                  >
                    {tour.countryOrProvince}
                  </span>
                  <span className="rounded-full bg-[#FFF5F8] px-2.5 py-1 text-[#A51950] border border-[#FBCFE2]">
                    Mã tour: {tour.code}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight text-[#103F2B]">
                  {tour.title}
                </h1>

                <div className="mt-4 space-y-2.5 rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2]/60 p-4 text-sm text-[#103F2B]">
                  <div className="flex items-center gap-2.5">
                    <LuClock className="h-4 w-4 shrink-0 text-[#186C42]" />
                    <span>
                      Thời lượng: <strong>{tour.duration}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <LuPlaneTakeoff className="h-4 w-4 shrink-0 text-[#E13D7D]" />
                    <span>
                      Điểm khởi hành: <strong>{tour.departureFrom}</strong>
                    </span>
                  </div>
                </div>

                {tour.visaNote && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8] p-4 text-sm text-[#A51950]">
                    <LuShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E13D7D]" />
                    <div>
                      <span className="font-bold">Thủ tục &amp; Visa: </span>
                      {tour.visaNote}
                    </div>
                  </div>
                )}

                {/* Advisor Strip */}
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#FCE7F0] bg-gradient-to-r from-[#FFF5F8] to-[#EEF9F2] p-3.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#E13D7D]">
                    <SmartImage
                      src={ADVISOR_PROFILE.avatarUrl}
                      alt={ADVISOR_PROFILE.fullName}
                      sizes="48px"
                      className="object-cover object-[50%_22%]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#103F2B]">
                      {ADVISOR_PROFILE.fullName}
                    </p>
                    <p className="truncate text-xs font-medium text-[#C82564]">
                      {ADVISOR_PROFILE.brandName} • Tư vấn lịch trình &amp; Visa
                      1:1
                    </p>
                  </div>
                  <LotusMotif className="h-7 w-7 shrink-0" />
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <TourConsultButton tourTitle={tour.title} fullWidth />
                  <Button
                    variant="soft-green"
                    size="lg"
                    href={`tel:${ADVISOR_PROFILE.phone.replace(/\s+/g, "")}`}
                    leftIcon={<LuPhoneCall className="h-4 w-4" />}
                    fullWidth
                  >
                    Gọi trực tiếp {ADVISOR_PROFILE.phone}
                  </Button>
                </div>

                <p className="mt-3 text-center text-xs text-[#103F2B]/65">
                  {ADVISOR_PROFILE.workingHours} • Báo giá minh bạch, không phí
                  ẩn
                </p>
              </Card>
            </aside>
          </div>

          {/* Related Tours */}
          {relatedTours.length > 0 && (
            <section
              aria-labelledby="related-tours-heading"
              className="mt-14 border-t border-[#FCE7F0] pt-12"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C82564]">
                    Gợi ý tuyến tương tự
                  </p>
                  <h2
                    id="related-tours-heading"
                    className="mt-1 text-2xl sm:text-3xl font-bold text-[#103F2B]"
                  >
                    Khám phá thêm hành trình khác
                  </h2>
                </div>
                <Button variant="outline" size="sm" href="/#tour-du-lich">
                  Xem tất cả {TOUR_PACKAGES.length} tuyến tour
                </Button>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTours.map((item) => {
                  const itemDomestic = item.scope === "domestic";
                  return (
                    <Card
                      key={item.id}
                      padding="none"
                      hoverable
                      className="flex flex-col overflow-hidden"
                    >
                      <Link
                        href={`/tours/${item.slug}`}
                        className="relative aspect-[16/10] w-full overflow-hidden block"
                      >
                        <SmartImage
                          src={item.imageUrl}
                          alt={item.title}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D1E]/75 via-transparent to-transparent" />
                        <div className="absolute left-3.5 top-3.5">
                          <Badge tone={itemDomestic ? "green" : "pink"}>
                            {itemDomestic ? "Trong nước" : "Quốc tế"}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs font-semibold text-white">
                          <span>{item.duration}</span>
                          <span>
                            ★ {item.rating.toFixed(1)} ({item.reviewCount})
                          </span>
                        </div>
                      </Link>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              itemDomestic
                                ? "text-[#186C42]"
                                : "text-[#C82564]"
                            }`}
                          >
                            {item.countryOrProvince}
                          </p>
                          <h3 className="mt-1.5 text-base font-bold text-[#103F2B] line-clamp-2">
                            <Link
                              href={`/tours/${item.slug}`}
                              className="hover:text-[#C82564] transition-colors"
                            >
                              {item.title}
                            </Link>
                          </h3>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#FCE7F0]">
                          <Button
                            variant="outline"
                            size="sm"
                            href={`/tours/${item.slug}`}
                            fullWidth
                          >
                            Xem chi tiết hành trình
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
