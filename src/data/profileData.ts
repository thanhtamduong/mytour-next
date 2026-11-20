import myAvatarImg from "@/assets/img-my.jpg";
import { sanitizeExternalUrl } from "@/lib/sanitize";
import type { AdvisorProfile, StatItem } from "@/types/travel";

/**
 * HỒ SƠ CÁ NHÂN CHUYÊN VIÊN SALES TOUR DU LỊCH
 * Bạn có thể dễ dàng thay tên, số điện thoại, Zalo, email và ảnh chân dung thật của mình tại file này.
 */
export const ADVISOR_PROFILE: AdvisorProfile = {
  brandName: "VIETOURIST",
  fullName: "Nguyễn Thị Thuỳ Linh",
  nickname: "Thuỳ Linh",
  roleTitle: "Chuyên Viên Tư Vấn & Điều Hành Tour Du Lịch",
  tagline:
    "Tận tâm như đóa sen Việt — Đồng hành trọn vẹn từ chuyến đi đầu tiên đến hành trình xuyên lục địa.",
  bioIntro:
    "Xin chào! Mình là Thuỳ Linh — người trực tiếp tư vấn, thiết kế lịch trình và đồng hành cùng hàng trăm đoàn khách Việt mỗi năm trên cả tuyến du lịch trong nước và quốc tế.",
  bioStory:
    "Từ những cung đường mộng mơ tại Đà Lạt, vịnh biển Nha Trang, di sản Đà Nẵng – Huế cho đến hành trình vươn ra thế giới tại Mỹ, Úc, Canada, Indonesia, Malaysia, Singapore, Hàn Quốc và Nhật Bản — mình luôn đặt sự an tâm, minh bạch chi phí và trải nghiệm văn hóa bản địa lên hàng đầu.",
  philosophyQuote:
    "Mỗi chuyến đi không chỉ là check-in một vùng đất mới, mà là những ký ức rực rỡ nở hoa cùng gia đình và người thương.",
  avatarUrl: myAvatarImg,
  heroSecondaryImageUrl:
    "https://images.unsplash.com/photo-1603852452378-a4e8d84324a2?auto=format&fit=crop&w=1000&q=80",
  lotusAccentImageUrl:
    "https://images.unsplash.com/photo-1530027644375-9c83053d392e?auto=format&fit=crop&w=900&q=80",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "070 3003 986",
  zaloLink:
    sanitizeExternalUrl(process.env.NEXT_PUBLIC_ZALO_LINK) ||
    "https://zalo.me/0703003986",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  facebookUrl:
    sanitizeExternalUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL) ||
    "https://www.facebook.com/thuy.linh.960691",
  instagramUrl: sanitizeExternalUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL) || "",
  officeAddress:
    process.env.NEXT_PUBLIC_OFFICE_ADDRESS?.trim() ||
    "242 Trần Hưng Đạo, Cầu Ông Lãnh, Hồ Chí Minh (Hỗ trợ tư vấn Online toàn quốc)",
  workingHours: "08:00 – 22:00 (Tất cả các ngày trong tuần)",
  featuredDestinations: [
    "Đà Lạt",
    "Nha Trang",
    "Đà Nẵng",
    "Huế",
    "Singapore",
    "Malaysia",
    "Indonesia",
    "Hàn Quốc",
    "Nhật Bản",
    "Mỹ",
    "Úc",
    "Canada",
  ],
  servicePillars: [
    {
      id: "pillar-1",
      title: "Tour Nội Địa Chuẩn Resort",
      description:
        "Chuyên tuyến Đà Lạt, Nha Trang, Đà Nẵng, Huế trọn gói vé máy bay, xe du lịch đời mới và khách sạn view đẹp.",
      accent: "green",
    },
    {
      id: "pillar-2",
      title: "Tour Châu Á & Đông Nam Á",
      description:
        "Lịch khởi hành hàng tuần đi Singapore – Malaysia, Bali (Indonesia), Hàn Quốc và Nhật Bản, tối ưu lịch trình cho cả gia đình.",
      accent: "pink",
    },
    {
      id: "pillar-3",
      title: "Hỗ Trợ Visa Mỹ – Úc – Canada",
      description:
        "Kinh nghiệm xử lý hồ sơ du lịch, thăm thân chuyên sâu; hướng dẫn phỏng vấn tự tin và chọn tuyến đường đẹp nhất.",
      accent: "green",
    },
    {
      id: "pillar-4",
      title: "Thiết Kế Tour Riêng Theo Ngân Sách",
      description:
        "Nhận thiết kế tour gia đình, nhóm bạn, team building công ty với báo giá minh bạch, không phát sinh chi phí ẩn.",
      accent: "pink",
    },
  ],
};

export const PROFILE_STATS: StatItem[] = [
  {
    id: "stat-exp",
    value: "5+ Năm",
    label: "Kinh nghiệm Sales Tour",
    detail: "Chuyên sâu nội địa & outbound",
    accent: "pink",
  },
  {
    id: "stat-guests",
    value: "2.400+",
    label: "Khách hàng đã đồng hành",
    detail: "Gia đình, nhóm bạn & doanh nghiệp",
    accent: "green",
  },
  {
    id: "stat-routes",
    value: "12+ Tuyến",
    label: "Việt Nam & Quốc tế",
    detail: "Á – Âu – Mỹ – Úc – Canada",
    accent: "pink",
  },
  {
    id: "stat-visa",
    value: "98%",
    label: "Hài lòng & Tỷ lệ đậu Visa",
    detail: "Hỗ trợ hồ sơ tận tâm",
    accent: "green",
  },
];
