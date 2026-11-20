"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { LuX } from "@/components/common/Icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidthClass?: string;
  preventClose?: boolean;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  maxWidthClass = "max-w-3xl",
  preventClose = false,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !preventClose) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  const handleBackdropClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#0B2D1E]/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Cửa sổ thông tin"}
      onClick={handleBackdropClose}
    >
      <div
        className={`relative w-full ${maxWidthClass} max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#FFFDFC] border border-[#FBCFE2] shadow-2xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#FCE7F0] bg-[#FFFDFC]/95 backdrop-blur-md px-4 py-3.5 sm:px-5 sm:py-4">
          {title ? (
            <h3 className="text-base sm:text-lg font-bold text-[#103F2B] line-clamp-1">
              {title}
            </h3>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleBackdropClose}
            disabled={preventClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCE7F0] text-[#A51950] transition hover:bg-[#E13D7D] hover:text-white disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
