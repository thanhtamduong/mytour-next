import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

function parseSupabaseHostInfo(): { origin: string; hostname: string } | null {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    if (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".supabase.co")
    ) {
      return { origin: parsed.origin, hostname: parsed.hostname };
    }
    return null;
  } catch {
    return null;
  }
}

const supabaseHostInfo = parseSupabaseHostInfo();
const supabaseImgOrigin = supabaseHostInfo
  ? supabaseHostInfo.origin
  : "https://*.supabase.co";
const supabaseConnectOrigin = supabaseHostInfo
  ? supabaseHostInfo.origin
  : "https://*.supabase.co";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: https://images.unsplash.com ${supabaseImgOrigin}`,
  "font-src 'self'",
  `connect-src 'self' ${supabaseConnectOrigin}${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  {
    key: "Content-Security-Policy",
    value: CONTENT_SECURITY_POLICY,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    dangerouslyAllowSVG: false,
    dangerouslyAllowLocalIP: false,
    minimumCacheTTL: 14400,
    maximumRedirects: 0,
    maximumResponseBody: 10_000_000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-*",
      },
      {
        protocol: "https",
        hostname: supabaseHostInfo ? supabaseHostInfo.hostname : "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/tour-media/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
