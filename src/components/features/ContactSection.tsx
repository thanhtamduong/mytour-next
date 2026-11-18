"use client";

import {
  LuCheck,
  LuClock,
  LuMail,
  LuMapPin,
  LuMessageCircleHeart,
  LuPhoneCall,
} from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { LotusMotif } from "@/components/common/LotusMotif";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useTravelProfile } from "@/components/providers/TravelProfileContext";
import { ADVISOR_PROFILE } from "@/data/profileData";

export function ContactSection() {
  const { selectedTourTopic } = useTravelProfile();
  const hasEmail = ADVISOR_PROFILE.email.trim().length > 0;

  return (
    <section
      id="lien-he"
      className="relative border-t border-[#FCE7F0] bg-gradient-to-b from-[#EEF9F2]/60 via-[#FFFDFC] to-[#FFF5F8] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Kết nối tư vấn"
          title="Nhận báo giá & lịch trình"
          highlight="riêng cho chuyến đi của bạn"
          subtitle={`Để lại thông tin hoặc nhắn trực tiếp qua Zalo/Hotline, ${ADVISOR_PROFILE.nickname} sẽ gửi lịch trình chi tiết kèm ưu đãi vé tốt nhất trong vòng 15 phút.`}
        />

        <div className="mt-9 sm:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-12">
          <Card
            tone="mint"
            padding="lg"
            className="relative flex flex-col overflow-hidden p-5 sm:p-7 lg:col-span-12"
          >
            <LotusMotif
              variant="leaf"
              className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 text-[#186C42]/12"
            />
            <div className="relative">
              <div className="flex items-center gap-2.5">
                <LotusMotif className="h-8 w-8 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#103F2B]">
                    {ADVISOR_PROFILE.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-[#C82564]">
                    {ADVISOR_PROFILE.roleTitle}
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
                <a
                  href={`tel:${ADVISOR_PROFILE.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 rounded-2xl border border-[#B2DFC4] bg-white p-3.5 sm:p-4 transition hover:border-[#E13D7D]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FCE7F0] text-[#C82564]">
                    <LuPhoneCall className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#103F2B]/65">
                      Hotline / Zalo trực tiếp
                    </p>
                    <p className="text-base font-extrabold text-[#103F2B]">
                      {ADVISOR_PROFILE.phone}
                    </p>
                  </div>
                </a>

                {hasEmail && (
                  <a
                    href={`mailto:${ADVISOR_PROFILE.email}`}
                    className="flex items-center gap-3.5 rounded-2xl border border-[#B2DFC4] bg-white p-3.5 sm:p-4 transition hover:border-[#E13D7D]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF9F2] text-[#186C42]">
                      <LuMail className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#103F2B]/65">
                        Email nhận lịch trình
                      </p>
                      <p className="truncate text-sm font-bold text-[#103F2B]">
                        {ADVISOR_PROFILE.email}
                      </p>
                    </div>
                  </a>
                )}

                <div className="rounded-2xl border border-[#B2DFC4] bg-white/85 p-3.5 sm:p-4 space-y-2.5 text-sm text-[#103F2B]/85">
                  <div className="flex items-start gap-2.5">
                    <LuMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#186C42]" />
                    <span>{ADVISOR_PROFILE.officeAddress}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <LuClock className="mt-0.5 h-4 w-4 shrink-0 text-[#E13D7D]" />
                    <span>{ADVISOR_PROFILE.workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 space-y-2 text-xs font-medium text-[#145335]">
                <p className="flex items-start gap-2">
                  <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E13D7D]" />
                  <span>
                    Báo giá trọn gói rõ ràng, cam kết không phát sinh chi phí ẩn
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E13D7D]" />
                  <span>
                    Tư vấn hồ sơ Visa Mỹ, Úc, Canada, Hàn, Nhật hoàn toàn miễn
                    phí
                  </span>
                </p>
              </div>
            </div>

            <div className="relative mt-6 space-y-3">
              {selectedTourTopic && (
                <div className="rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8] px-3.5 py-2.5 text-xs text-[#103F2B]">
                  <span className="font-semibold text-[#C82564]">
                    Tuyến đang quan tâm:{" "}
                  </span>
                  <span className="font-bold">{selectedTourTopic}</span>
                </div>
              )}
              <Button
                variant="secondary"
                size="lg"
                href={ADVISOR_PROFILE.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<LuMessageCircleHeart className="h-5 w-5" />}
                fullWidth
              >
                Nhắn Zalo nhận ưu đãi ngay
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
