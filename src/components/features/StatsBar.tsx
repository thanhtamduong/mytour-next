import { Card } from "@/components/common/Card";
import { PROFILE_STATS } from "@/data/profileData";

export function StatsBar() {
  return (
    <section
      aria-label="Thống kê kinh nghiệm tư vấn tour"
      className="relative z-10 mx-auto -mt-4 sm:-mt-6 max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {PROFILE_STATS.map((stat) => {
          const isPink = stat.accent === "pink";
          return (
            <Card
              key={stat.id}
              tone={isPink ? "blush" : "mint"}
              padding="sm"
              hoverable
              className="relative h-full overflow-hidden border-2 bg-white/95 backdrop-blur-md p-3.5 sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className={`text-xl sm:text-3xl font-extrabold tracking-tight ${
                      isPink ? "text-[#C82564]" : "text-[#186C42]"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[#103F2B] leading-snug">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-[#103F2B]/70 leading-snug">
                    {stat.detail}
                  </p>
                </div>
                <span
                  className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full shrink-0 mt-1 ${
                    isPink
                      ? "bg-[#E13D7D] ring-4 ring-[#FCE7F0]"
                      : "bg-[#186C42] ring-4 ring-[#D7F0E0]"
                  }`}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
