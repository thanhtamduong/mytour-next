import { LuArrowLeft, LuCompass } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { LotusMotif } from "@/components/common/LotusMotif";

export default function NotFound() {
  return (
    <main className="flex-1 lotus-pond-bg flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-lg w-full rounded-3xl border border-[#FBCFE2] bg-white/95 p-7 sm:p-10 text-center shadow-xl shadow-[#186C42]/10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF5F8] to-[#EEF9F2] border border-[#FBCFE2]">
          <LotusMotif className="h-10 w-10" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#C82564]">
          Không tìm thấy trang (404)
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#103F2B]">
          Hành trình bạn tìm kiếm hiện chưa có hoặc đã đổi liên kết
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#103F2B]/75">
          Quay lại trang chủ Thuỳ Linh Travel để khám phá các tuyến tour trong
          nước &amp; quốc tế đang mở bán hoặc nhận tư vấn lịch trình riêng.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="primary"
            href="/"
            leftIcon={<LuArrowLeft className="h-4 w-4" />}
          >
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            href="/#tour-du-lich"
            leftIcon={<LuCompass className="h-4 w-4" />}
          >
            Xem tour đang bán
          </Button>
        </div>
      </div>
    </main>
  );
}
