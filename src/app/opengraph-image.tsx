/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ADVISOR_PROFILE } from "@/data/profileData";

export const alt =
  "Thuỳ Linh Travel — Chuyên viên Tư vấn Tour Du lịch Trong nước & Quốc tế";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const avatarData = await readFile(
  join(process.cwd(), "src/assets/img-my.jpg"),
  "base64",
);
const avatarSrc = `data:image/jpeg;base64,${avatarData}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "56px 64px",
        background:
          "linear-gradient(135deg, #FFF5F8 0%, #FFFDFC 48%, #EEF9F2 100%)",
        color: "#103F2B",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "62%",
          height: "100%",
          paddingRight: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#FCE7F0",
              color: "#A51950",
              border: "2px solid #FBCFE2",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            <span>{ADVISOR_PROFILE.brandName} • Sắc Sen Việt</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#103F2B",
            }}
          >
            {ADVISOR_PROFILE.fullName}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#E13D7D",
              lineHeight: 1.3,
            }}
          >
            {ADVISOR_PROFILE.roleTitle}
          </div>
          <div
            style={{
              fontSize: 23,
              color: "#145335",
              lineHeight: 1.45,
            }}
          >
            Đà Lạt • Nha Trang • Đà Nẵng • Huế • Singapore • Malaysia • Bali •
            Hàn Quốc • Nhật Bản • Mỹ • Úc • Canada
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            fontWeight: 700,
            color: "#186C42",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#186C42",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: 16,
            }}
          >
            Hotline / Zalo: {ADVISOR_PROFILE.phone}
          </div>
          <span>Hỗ trợ Visa tận tâm</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "35%",
          height: "100%",
          padding: 12,
          borderRadius: 36,
          backgroundColor: "#FFFFFF",
          border: "3px solid #FBCFE2",
          boxShadow: "0 20px 50px rgba(16, 63, 43, 0.14)",
        }}
      >
        <img
          src={avatarSrc}
          alt={ADVISOR_PROFILE.fullName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 26,
          }}
        />
      </div>
    </div>,
    {
      ...size,
    },
  );
}
