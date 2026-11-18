import type { SVGProps } from "react";

interface LotusIconProps extends SVGProps<SVGSVGElement> {
  variant?: "full" | "outline" | "leaf";
}

/**
 * Biểu tượng Hoa Sen Việt Nam vẽ tay vector dùng làm điểm nhấn nhận diện thương hiệu.
 */
export function LotusMotif({
  variant = "full",
  className = "w-8 h-8",
  ...props
}: LotusIconProps) {
  if (variant === "leaf") {
    return (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          d="M40 8C20.118 8 6 22.118 6 41C6 59.882 21.118 72 40 72C58.882 72 74 59.882 74 41C74 23.2 61.5 9.8 43.2 8.1L40 24L36.8 8.1"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 38L20 26M40 38L60 26M40 38L16 46M40 38L64 46M40 38L28 62M40 38L52 62"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
      </svg>
    );
  }

  if (variant === "outline") {
    return (
      <svg
        viewBox="0 0 64 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          d="M32 6C36.5 14.5 39 23.5 32 34C25 23.5 27.5 14.5 32 6Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M32 34C23.5 31.5 17 24.5 15 15.5C22.5 17.5 28.5 24 32 34Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M32 34C40.5 31.5 47 24.5 49 15.5C41.5 17.5 35.5 24 32 34Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M12 37C19 41.5 45 41.5 52 37"
          stroke="#186C42"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10 41C18 47.5 46 47.5 54 41C44 43.2 20 43.2 10 41Z"
        fill="#186C42"
      />
      <path
        d="M15 39C21 43 43 43 49 39"
        stroke="#268955"
        strokeWidth="1.5"
        strokeLinecap="round"
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
  );
}
