import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import { ConsultModal } from "@/components/features/ConsultModal";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PeachBlossomRain } from "@/components/layout/PeachBlossomRain";
import { SeasonSwitcher } from "@/components/layout/SeasonSwitcher";
import { TravelProfileProvider } from "@/components/providers/TravelProfileContext";
import { ADVISOR_PROFILE } from "@/data/profileData";
import { SITE_CONFIG, SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFF5F8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: SITE_CONFIG.titleTemplate,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  applicationName: SITE_CONFIG.siteName,
  authors: [{ name: ADVISOR_PROFILE.fullName, url: SITE_URL }],
  creator: ADVISOR_PROFILE.fullName,
  publisher: SITE_CONFIG.siteName,
  category: "travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: "/",
    siteName: SITE_CONFIG.siteName,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${playfairDisplay.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FFFDFC] text-[#103F2B] antialiased selection:bg-[#FCE7F0] selection:text-[#B9285D]">
        <TravelProfileProvider>
          <div className="min-h-screen flex flex-col bg-[#FFFDFC] text-[#103F2B]">
            <Navbar />
            {children}
            <Footer />
            <PeachBlossomRain />
            <SeasonSwitcher />
            <FloatingContact />
            <ConsultModal />
          </div>
        </TravelProfileProvider>
      </body>
    </html>
  );
}
