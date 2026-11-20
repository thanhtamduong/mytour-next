import { ContactSection } from "@/components/features/ContactSection";
import { Hero } from "@/components/features/Hero";
import { JourneyFeed } from "@/components/features/JourneyFeed";
import { PersonalGallery } from "@/components/features/PersonalGallery";
import { StatsBar } from "@/components/features/StatsBar";
import { TourShowcase } from "@/components/features/TourShowcase";
import { getStoredGallery, getStoredTours } from "@/lib/contentStore";
import { buildHomeJsonLd, serializeJsonLd } from "@/lib/structuredData";

export default async function HomePage() {
  const [tours, gallery] = await Promise.all([
    getStoredTours(),
    getStoredGallery(),
  ]);
  const homeJsonLd = buildHomeJsonLd(tours);

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
        <PersonalGallery photos={gallery} />
        <TourShowcase tours={tours} />
        <JourneyFeed />
        <ContactSection />
      </main>
    </>
  );
}
