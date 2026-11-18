import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF5F8 0%, #EEF9F2 100%)",
          borderRadius: 40,
        }}
      >
        <svg
          width="126"
          height="112"
          viewBox="0 0 64 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 41C18 47.5 46 47.5 54 41C44 43.2 20 43.2 10 41Z"
            fill="#186C42"
          />
          <path
            d="M32 39C19 39 10 34 7 26C16 26.5 25 31.5 32 39Z"
            fill="#F8A4C7"
          />
          <path
            d="M32 39C45 39 54 34 57 26C48 26.5 39 31.5 32 39Z"
            fill="#F8A4C7"
          />
          <path
            d="M32 39C22.5 36.5 16 28.5 14.5 17.5C23 19.5 29 27.5 32 39Z"
            fill="#F26B9F"
          />
          <path
            d="M32 39C41.5 36.5 48 28.5 49.5 17.5C41 19.5 35 27.5 32 39Z"
            fill="#F26B9F"
          />
          <path
            d="M32 7C37.5 16.5 40 27.5 32 39C24 27.5 26.5 16.5 32 7Z"
            fill="#E13D7D"
          />
          <circle cx="32" cy="34.5" r="2.2" fill="#FBBF24" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
