"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  LuArrowLeft,
  LuEye,
  LuEyeOff,
  LuLock,
} from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { LotusMotif } from "@/components/common/LotusMotif";

interface AdminLoginFormProps {
  isConfigured: boolean;
}

export function AdminLoginForm({ isConfigured }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setErrorMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(
          data.error || "Đăng nhập không thành công. Vui lòng thử lại.",
        );
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 lotus-pond-bg px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-md">
        <Card tone="white" padding="lg" className="border-[#FBCFE2] shadow-xl">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FBCFE2] bg-gradient-to-br from-[#FFF5F8] to-[#EEF9F2] shadow-sm">
              <LotusMotif className="h-9 w-9" />
            </span>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#FBCFE2] bg-[#FFF5F8] px-3 py-1 text-xs font-bold text-[#C82564]">
              <LuLock className="h-3.5 w-3.5" />
              <span>Quản trị</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-[#103F2B]">
              Đăng nhập Quản lý Tour
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-[#103F2B]/75">
              Đăng nhập bằng tài khoản Supabase Admin để tải ảnh lên Storage,
              thêm chương trình tour mới và cập nhật trang chủ.
            </p>
          </div>

          {!isConfigured && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900"
            >
              Chưa cấu hình{" "}
              <code className="font-bold">NEXT_PUBLIC_SUPABASE_URL</code> và{" "}
              <code className="font-bold">
                NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
              </code>{" "}
              (hoặc{" "}
              <code className="font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>).
              Nếu chạy trên máy hãy kiểm tra{" "}
              <code className="font-bold">.env.local</code>; nếu deploy trên
              Vercel hãy thêm trong{" "}
              <strong>Project Settings → Environment Variables</strong> rồi bấm{" "}
              <strong>Redeploy</strong>.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#103F2B]/80"
              >
                Email quản trị
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8]/40 px-4 py-2.5 text-base sm:text-sm font-medium text-[#103F2B] focus:border-[#E13D7D] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#103F2B]/80"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={200}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu ..."
                  className="w-full rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8]/40 py-2.5 pl-4 pr-11 text-base sm:text-sm font-medium text-[#103F2B] focus:border-[#E13D7D] focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-[#103F2B]/60 hover:bg-[#FCE7F0] hover:text-[#C82564] cursor-pointer"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <LuEyeOff className="h-4 w-4" />
                  ) : (
                    <LuEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700"
              >
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={submitting || !isConfigured}
              leftIcon={<LuLock className="h-4 w-4" />}
            >
              {submitting ? "Đang xác thực..." : "Đăng nhập vào trang quản lý"}
            </Button>
          </form>

          <div className="mt-5 border-t border-[#FCE7F0] pt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              href="/"
              leftIcon={<LuArrowLeft className="h-4 w-4" />}
            >
              Quay lại trang chủ Thuỳ Linh Travel
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
