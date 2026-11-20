"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuBadgeCheck,
  LuClock,
  LuExternalLink,
  LuImages,
  LuLayoutDashboard,
  LuLogOut,
  LuMapPin,
  LuPencil,
  LuPlane,
  LuPlus,
  LuSearch,
  LuShieldCheck,
  LuTrash2,
} from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import { SmartImage } from "@/components/common/SmartImage";
import { GalleryEditorModal } from "@/components/features/admin/GalleryEditorModal";
import { TourEditorModal } from "@/components/features/admin/TourEditorModal";
import type { PersonalPhotoItem, TourPackage } from "@/types/travel";

interface AdminDashboardProps {
  initialTours: TourPackage[];
  initialGallery: PersonalPhotoItem[];
  adminEmail: string;
  dbError?: string;
}

type AdminTab = "tours" | "gallery";

export function AdminDashboard({
  initialTours,
  initialGallery,
  adminEmail,
  dbError,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("tours");
  const [tours, setTours] = useState<TourPackage[]>(initialTours);
  const [gallery, setGallery] = useState<PersonalPhotoItem[]>(initialGallery);
  const [searchTerm, setSearchTerm] = useState("");

  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PersonalPhotoItem | null>(
    null
  );

  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: "tour"; id: string; label: string }
    | { kind: "gallery"; id: string; label: string }
    | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const filteredTours = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter((item) =>
      `${item.code} ${item.title} ${item.destination} ${item.countryOrProvince}`
        .toLowerCase()
        .includes(q)
    );
  }, [searchTerm, tours]);

  const filteredGallery = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return gallery;
    return gallery.filter((item) =>
      `${item.title} ${item.location} ${item.categoryLabel}`
        .toLowerCase()
        .includes(q)
    );
  }, [searchTerm, gallery]);

  const domesticCount = tours.filter((t) => t.scope === "domestic").length;
  const internationalCount = tours.filter(
    (t) => t.scope === "international"
  ).length;

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setFeedback(null);

    try {
      const endpoint =
        deleteTarget.kind === "tour"
          ? `/api/admin/tours/${encodeURIComponent(deleteTarget.id)}`
          : `/api/admin/gallery/${encodeURIComponent(deleteTarget.id)}`;

      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setFeedback({
          type: "error",
          text: data.error || "Xóa mục này không thành công.",
        });
        return;
      }

      if (deleteTarget.kind === "tour") {
        setTours((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setFeedback({
          type: "success",
          text: `Đã xóa tour “${deleteTarget.label}”.`,
        });
      } else {
        setGallery((prev) =>
          prev.filter((item) => item.id !== deleteTarget.id)
        );
        setFeedback({
          type: "success",
          text: `Đã xóa ảnh “${deleteTarget.label}”.`,
        });
      }

      setDeleteTarget(null);
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        text: "Không thể kết nối tới máy chủ khi xóa.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex-1 lotus-pond-bg py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header Bar */}
        <Card tone="white" padding="lg" className="border-[#FBCFE2]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  tone="pink"
                  icon={<LuLayoutDashboard className="h-3.5 w-3.5" />}
                >
                  Trang quản trị nội dung
                </Badge>
                <Badge
                  tone="green"
                  icon={<LuBadgeCheck className="h-3.5 w-3.5" />}
                >
                  {adminEmail}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#103F2B]">
                Quản lý Tour Du lịch &amp; Hình ảnh
              </h1>
              <p className="mt-1 text-sm text-[#103F2B]/75">
                Tải ảnh mới lên Supabase Storage, cấu hình lịch trình chi tiết
                và đồng bộ trực tiếp lên trang chủ &amp; trang chi tiết tour.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                href="/"
                rightIcon={<LuExternalLink className="h-3.5 w-3.5" />}
              >
                Xem trang chủ
              </Button>
              <Button
                variant="soft-pink"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
                leftIcon={<LuLogOut className="h-4 w-4" />}
              >
                {loggingOut ? "Đang thoát..." : "Đăng xuất"}
              </Button>
            </div>
          </div>

          {dbError ? (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700"
            >
              <span>{dbError}</span>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2]/75 px-4 py-3 text-xs text-[#145335]">
              <LuShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#186C42]" />
              <span>
                Đã kết nối{" "}
                <strong className="font-bold">
                  Supabase (PostgreSQL + Auth + Storage)
                </strong>{" "}
                kèm bảo vệ RLS theo quyền quản trị.
              </span>
            </div>
          )}
        </Card>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card tone="blush" padding="sm" className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#A51950]">
              Tổng tour đang mở
            </p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#C82564]">
              {tours.length}
            </p>
          </Card>
          <Card tone="mint" padding="sm" className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#145335]">
              Tour trong nước
            </p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#186C42]">
              {domesticCount}
            </p>
          </Card>
          <Card tone="blush" padding="sm" className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#A51950]">
              Tour quốc tế
            </p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#C82564]">
              {internationalCount}
            </p>
          </Card>
          <Card tone="mint" padding="sm" className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#145335]">
              Ảnh trong Album
            </p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#186C42]">
              {gallery.length}
            </p>
          </Card>
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div
            role="status"
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              feedback.type === "success"
                ? "border-[#B2DFC4] bg-[#EEF9F2] text-[#145335]"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Toolbar: Tabs + Search + Create CTA */}
        <Card tone="white" padding="md" className="border-[#FBCFE2]">
          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("tours");
                  setSearchTerm("");
                }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === "tours"
                    ? "bg-[#103F2B] text-white shadow-sm"
                    : "bg-[#FFF5F8] text-[#103F2B] hover:bg-[#FCE7F0]"
                }`}
              >
                <LuPlane className="h-4 w-4" />
                <span>Chương trình Tour ({tours.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("gallery");
                  setSearchTerm("");
                }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === "gallery"
                    ? "bg-[#103F2B] text-white shadow-sm"
                    : "bg-[#FFF5F8] text-[#103F2B] hover:bg-[#FCE7F0]"
                }`}
              >
                <LuImages className="h-4 w-4" />
                <span>Album ảnh cá nhân ({gallery.length})</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#186C42]" />
                <input
                  type="text"
                  maxLength={100}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    activeTab === "tours"
                      ? "Tìm mã tour, điểm đến..."
                      : "Tìm tiêu đề, địa điểm..."
                  }
                  className="w-full rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2]/40 py-2 pl-10 pr-3.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:bg-white focus:outline-none"
                />
              </div>

              {activeTab === "tours" ? (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<LuPlus className="h-4 w-4" />}
                  onClick={() => {
                    setEditingTour(null);
                    setTourModalOpen(true);
                  }}
                >
                  Thêm tour mới
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<LuPlus className="h-4 w-4" />}
                  onClick={() => {
                    setEditingPhoto(null);
                    setGalleryModalOpen(true);
                  }}
                >
                  Upload ảnh album mới
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Content List */}
        {activeTab === "tours" ? (
          filteredTours.length === 0 ? (
            <Card tone="white" padding="lg" className="text-center">
              <p className="text-sm font-semibold text-[#103F2B]/75">
                Chưa tìm thấy tour nào khớp với từ khóa tìm kiếm.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour) => {
                const isDomestic = tour.scope === "domestic";
                return (
                  <Card
                    key={tour.id}
                    padding="none"
                    className="flex flex-col overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <SmartImage
                        src={tour.imageUrl}
                        alt={tour.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D1E]/75 via-transparent to-black/15" />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <Badge tone={isDomestic ? "green" : "pink"}>
                          {tour.code}
                        </Badge>
                        {tour.badgeText && (
                          <Badge tone="glass">{tour.badgeText}</Badge>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
                          <LuClock className="h-3.5 w-3.5 text-[#F8A4C7]" />
                          {tour.duration}
                        </span>
                        <span className="rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
                          {tour.priceLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isDomestic ? "text-[#186C42]" : "text-[#C82564]"
                          }`}
                        >
                          {tour.countryOrProvince}
                        </p>
                        <h2 className="mt-1 text-base font-bold text-[#103F2B] line-clamp-2">
                          {tour.title}
                        </h2>
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#103F2B]/70">
                          <LuMapPin className="h-3.5 w-3.5 shrink-0 text-[#E13D7D]" />
                          <span className="truncate">
                            {tour.destination} • {tour.departureFrom}
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#FCE7F0] pt-3.5">
                        <Button
                          variant="outline"
                          size="sm"
                          href={`/tours/${tour.slug}`}
                          rightIcon={<LuExternalLink className="h-3.5 w-3.5" />}
                          className="flex-1"
                        >
                          Xem
                        </Button>
                        <Button
                          variant="soft-green"
                          size="sm"
                          leftIcon={<LuPencil className="h-3.5 w-3.5" />}
                          onClick={() => {
                            setEditingTour(tour);
                            setTourModalOpen(true);
                          }}
                          className="flex-1"
                        >
                          Sửa
                        </Button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              kind: "tour",
                              id: tour.id,
                              label: tour.title,
                            })
                          }
                          aria-label={`Xóa tour ${tour.title}`}
                          className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white cursor-pointer"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : filteredGallery.length === 0 ? (
          <Card tone="white" padding="lg" className="text-center">
            <p className="text-sm font-semibold text-[#103F2B]/75">
              Chưa tìm thấy ảnh nào khớp với từ khóa tìm kiếm.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((photo) => (
              <Card
                key={photo.id}
                padding="none"
                className="flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <SmartImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover ${
                      photo.category === "portrait" ? "object-[50%_22%]" : ""
                    }`}
                  />
                  <div className="absolute left-3 top-3">
                    <Badge
                      tone={photo.category === "portrait" ? "pink" : "green"}
                    >
                      {photo.categoryLabel}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <h2 className="text-base font-bold text-[#103F2B]">
                      {photo.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-[#C82564]">
                      {photo.location} • {photo.dateLabel}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#103F2B]/75 line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-[#FCE7F0] pt-3.5">
                    <Button
                      variant="soft-green"
                      size="sm"
                      leftIcon={<LuPencil className="h-3.5 w-3.5" />}
                      onClick={() => {
                        setEditingPhoto(photo);
                        setGalleryModalOpen(true);
                      }}
                      className="flex-1"
                    >
                      Sửa ảnh &amp; nội dung
                    </Button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          kind: "gallery",
                          id: photo.id,
                          label: photo.title,
                        })
                      }
                      aria-label={`Xóa ảnh ${photo.title}`}
                      className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white cursor-pointer"
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tour Create/Edit Modal */}
      <TourEditorModal
        isOpen={tourModalOpen}
        editingTour={editingTour}
        onClose={() => setTourModalOpen(false)}
        onSaved={(savedTour, mode) => {
          if (mode === "create") {
            setTours((prev) => [savedTour, ...prev]);
            setFeedback({
              type: "success",
              text: `Đã đăng tour mới “${savedTour.title}”.`,
            });
          } else {
            setTours((prev) =>
              prev.map((item) => (item.id === savedTour.id ? savedTour : item))
            );
            setFeedback({
              type: "success",
              text: `Đã cập nhật tour “${savedTour.title}”.`,
            });
          }
          setTourModalOpen(false);
          router.refresh();
        }}
      />

      {/* Gallery Create/Edit Modal */}
      <GalleryEditorModal
        isOpen={galleryModalOpen}
        editingPhoto={editingPhoto}
        onClose={() => setGalleryModalOpen(false)}
        onSaved={(savedPhoto, mode) => {
          if (mode === "create") {
            setGallery((prev) => [savedPhoto, ...prev]);
            setFeedback({
              type: "success",
              text: `Đã thêm ảnh “${savedPhoto.title}” vào Album.`,
            });
          } else {
            setGallery((prev) =>
              prev.map((item) =>
                item.id === savedPhoto.id ? savedPhoto : item
              )
            );
            setFeedback({
              type: "success",
              text: `Đã cập nhật ảnh “${savedPhoto.title}”.`,
            });
          }
          setGalleryModalOpen(false);
          router.refresh();
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Xác nhận xóa dữ liệu"
        maxWidthClass="max-w-md"
      >
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-[#103F2B]/85">
              Bạn có chắc chắn muốn xóa{" "}
              <strong>“{deleteTarget.label}”</strong>? Thao tác này sẽ cập nhật
              lại trang chủ ngay lập tức.
            </p>
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Giữ lại
              </Button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex min-h-[42px] items-center justify-center rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
              >
                {deleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
