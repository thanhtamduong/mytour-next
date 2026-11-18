import myAvatarImg from "@/assets/img-my.jpg";
import type { PersonalPhotoItem } from "@/types/travel";

/**
 * LIST HÌNH ẢNH BẢN THÂN & KHOẢNH KHẮC LÀM NGHỀ SALES TOUR
 * Ảnh cá nhân chính đang sử dụng ảnh nội bộ từ src/assets/img-my.jpg.
 */
export const PERSONAL_GALLERY: PersonalPhotoItem[] = [
  {
    id: "photo-1",
    title: "Thuỳ Linh — Chuyên viên Tư vấn Tour Du lịch",
    caption:
      "Luôn sẵn sàng lắng nghe mong muốn của từng gia đình để thiết kế một hành trình vừa vặn ngân sách nhưng vẫn trọn vẹn cảm xúc.",
    location: "Đà Lạt • TP. Hồ Chí Minh",
    dateLabel: "Ảnh cá nhân",
    category: "portrait",
    categoryLabel: "Ảnh cá nhân",
    imageUrl: myAvatarImg,
    aspect: "square",
  },
  {
    id: "photo-2",
    title: "Khảo sát cung đường Cầu Vàng – Đà Nẵng",
    caption:
      "Trực tiếp kiểm tra khung giờ đẹp nhất đón bình minh tại Bà Nà Hills để đoàn khách của mình có những khung hình ít đông và thoải mái nhất.",
    location: "Đà Nẵng, Việt Nam",
    dateLabel: "Khảo sát thực tế",
    category: "inspection",
    categoryLabel: "Khảo sát điểm đến",
    imageUrl:
      "https://images.unsplash.com/photo-1603852452378-a4e8d84324a2?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
  },
  {
    id: "photo-3",
    title: "Trải nghiệm rừng thông & săn mây Đà Lạt",
    caption:
      "Mỗi điểm check-in, quán cà phê hay homestay mới tại Đà Lạt đều được mình trải nghiệm thực tế trước khi đưa vào lịch trình cho khách.",
    location: "Đà Lạt, Lâm Đồng",
    dateLabel: "Famtrip Đà Lạt",
    category: "inspection",
    categoryLabel: "Khảo sát điểm đến",
    imageUrl:
      "https://images.unsplash.com/photo-1626608017817-211d7c48177d?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
  },
  {
    id: "photo-4",
    title: "Đồng hành cùng đoàn khách tại Phố Cổ Hội An",
    caption:
      "Niềm vui lớn nhất của người làm sales du lịch là đồng hành cùng gia đình và cô chú trong những buổi tối thả đèn hoa đăng rực rỡ.",
    location: "Hội An, Quảng Nam",
    dateLabel: "Dẫn đoàn miền Trung",
    category: "leading-tour",
    categoryLabel: "Dẫn đoàn & Đón khách",
    imageUrl:
      "https://images.unsplash.com/photo-1752154970559-20c5b80b7db2?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
  },
  {
    id: "photo-5",
    title: "Khảo sát tuyến Bắc Mỹ & Dãy núi Rockies",
    caption:
      "Nắm rõ thời tiết, trang phục và quy trình nhập cảnh Mỹ – Canada – Úc để tư vấn hồ sơ Visa 1:1 và lịch bay nhẹ nhàng nhất.",
    location: "Banff National Park, Canada",
    dateLabel: "Tuyến Quốc tế",
    category: "inspection",
    categoryLabel: "Khảo sát điểm đến",
    imageUrl:
      "https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
  },
  {
    id: "photo-6",
    title: "Cảm hứng phục vụ tận tâm như Sen Việt",
    caption:
      "Đi nhiều để hiểu sâu từng vùng đất, từ đó truyền lại cảm hứng khám phá chân thật và chu đáo nhất đến từng vị khách thân quen.",
    location: "Việt Nam & Quốc tế",
    dateLabel: "Phương châm nghề nghiệp",
    category: "leading-tour",
    categoryLabel: "Dẫn đoàn & Đón khách",
    imageUrl:
      "https://images.unsplash.com/photo-1530027644375-9c83053d392e?auto=format&fit=crop&w=1000&q=80",
    aspect: "square",
  },
];
