import { ContactSection } from "@/components/features/ContactSection";
import { Hero } from "@/components/features/Hero";
import { JourneyFeed } from "@/components/features/JourneyFeed";
import { PersonalGallery } from "@/components/features/PersonalGallery";
import { StatsBar } from "@/components/features/StatsBar";
import { TourShowcase } from "@/components/features/TourShowcase";
import { buildHomeJsonLd, serializeJsonLd } from "@/lib/structuredData";

export default function HomePage() {
  const homeJsonLd = buildHomeJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(homeJsonLd),
        }}
      />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <PersonalGallery />
        <TourShowcase />
        <JourneyFeed />
        <ContactSection />
      </main>
    </>
  );
}
