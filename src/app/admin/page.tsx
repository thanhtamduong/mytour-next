import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminDashboard } from "@/components/features/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/features/admin/AdminLoginForm";
import { getAdminSession, isAdminAuthConfigured } from "@/lib/adminAuth";
import { getAdminStoreSnapshot } from "@/lib/contentStore";

export const metadata: Metadata = {
  title: "Quản trị Tour & Hình ảnh",
  description:
    "Trang đăng nhập và quản lý chương trình tour, hình ảnh cho Thuỳ Linh Travel.",
  robots: {
    index: false,
    follow: false,
  },
};

function AdminLoadingFallback() {
  return (
    <main className="flex-1 lotus-pond-bg px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-md animate-pulse rounded-3xl border border-[#FBCFE2] bg-white/90 p-8 shadow-xl">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#FCE7F0]" />
        <div className="mx-auto mt-4 h-6 w-48 rounded-full bg-[#FCE7F0]" />
        <div className="mt-6 space-y-3">
          <div className="h-11 rounded-2xl bg-[#FFF5F8]" />
          <div className="h-11 rounded-2xl bg-[#FFF5F8]" />
          <div className="h-12 rounded-2xl bg-[#FBCFE2]" />
        </div>
      </div>
    </main>
  );
}

async function AdminGate() {
  const isConfigured = isAdminAuthConfigured();
  const session = await getAdminSession();

  if (!session) {
    return <AdminLoginForm isConfigured={isConfigured} />;
  }

  let dbError: string | undefined;
  let tours: Awaited<ReturnType<typeof getAdminStoreSnapshot>>["tours"] = [];
  let gallery: Awaited<ReturnType<typeof getAdminStoreSnapshot>>["gallery"] =
    [];

  try {
    const snapshot = await getAdminStoreSnapshot();
    tours = snapshot.tours;
    gallery = snapshot.gallery;
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : "Không thể tải dữ liệu từ Supabase PostgreSQL.";
  }

  return (
    <AdminDashboard
      initialTours={tours}
      initialGallery={gallery}
      adminEmail={session.email}
      dbError={dbError}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminGate />
    </Suspense>
  );
}
