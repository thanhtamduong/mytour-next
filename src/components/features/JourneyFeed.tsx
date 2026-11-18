import { LuMapPin, LuQuote, LuStar } from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { SectionTitle } from "@/components/common/SectionTitle";
import { SmartImage } from "@/components/common/SmartImage";
import { JOURNEY_STORIES } from "@/data/journeyData";

export function JourneyFeed() {
  return (
    <section id="hanh-trinh" className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Nhật ký đoàn khách"
          title="Niềm vui khách hàng sau"
          highlight="mỗi chuyến đi"
          subtitle="Sự hài lòng của gia đình, nhóm bạn và các cô chú lớn tuổi là động lực lớn nhất giúp mình gắn bó và tận tâm với nghề Sales Tour."
        />

        <div className="mt-8 sm:mt-10 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 md:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
          {JOURNEY_STORIES.map((story) => (
            <Card
              key={story.id}
              padding="none"
              hoverable
              className="flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <SmartImage
                  src={story.imageUrl}
                  alt={`${story.tourTitle} — ${story.destination}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D1E]/75 via-transparent to-transparent" />
                <div className="absolute left-3.5 top-3.5">
                  <Badge tone="glass">{story.groupType}</Badge>
                </div>
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-xs font-medium text-white">
                  <span className="inline-flex min-w-0 items-center gap-1">
                    <LuMapPin className="h-3.5 w-3.5 shrink-0 text-[#F8A4C7]" />
                    <span className="truncate">{story.destination}</span>
                  </span>
                  <span className="shrink-0">{story.dateLabel}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex items-center gap-0.5 text-amber-400"
                      aria-label={`Đánh giá ${story.rating} trên 5 sao`}
                    >
                      {Array.from({ length: story.rating }).map((_, idx) => (
                        <LuStar key={idx} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <LuQuote className="h-5 w-5 text-[#F26B9F]/60" />
                  </div>

                  <h3 className="mt-2.5 text-base font-bold text-[#103F2B]">
                    {story.tourTitle}
                  </h3>
                  <p className="mt-2 text-sm italic leading-relaxed text-[#103F2B]/80">
                    “{story.quote}”
                  </p>
                </div>

                <div className="mt-4 border-t border-[#FCE7F0] pt-3.5">
                  <p className="text-xs font-bold text-[#C82564]">
                    {story.customerName}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
