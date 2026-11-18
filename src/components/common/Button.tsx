import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "soft-pink"
  | "soft-green"
  | "ghost";

type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#E13D7D] to-[#C82564] text-white shadow-md shadow-[#E13D7D]/25 hover:shadow-lg hover:shadow-[#E13D7D]/35 hover:brightness-105 active:scale-[0.99]",
  secondary:
    "bg-gradient-to-r from-[#186C42] to-[#145335] text-white shadow-md shadow-[#186C42]/20 hover:shadow-lg hover:shadow-[#186C42]/30 hover:brightness-105 active:scale-[0.99]",
  outline:
    "border border-[#186C42]/30 bg-white/90 text-[#103F2B] hover:border-[#E13D7D] hover:bg-[#FFF5F8] hover:text-[#C82564]",
  "soft-pink":
    "bg-[#FCE7F0] text-[#A51950] border border-[#FBCFE2] hover:bg-[#FBCFE2]/80",
  "soft-green":
    "bg-[#EEF9F2] text-[#145335] border border-[#B2DFC4] hover:bg-[#D7F0E0]",
  ghost:
    "bg-transparent text-[#103F2B] hover:bg-[#FCE7F0]/60 hover:text-[#C82564]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-3.5 py-2 text-xs font-semibold rounded-xl gap-1.5",
  md: "min-h-[42px] px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-2xl gap-2",
  lg: "min-h-[46px] px-5 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-base font-semibold rounded-2xl gap-2.5",
};

function isLinkButton(props: ButtonProps): props is ButtonAsLink {
  return typeof props.href === "string";
}

function getButtonClassNames({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: Pick<BaseProps, "variant" | "size" | "fullWidth" | "className">): string {
  return [
    "inline-flex items-center justify-center text-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E13D7D] disabled:opacity-55 disabled:cursor-not-allowed sm:whitespace-nowrap",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function renderButtonContent(
  children: ReactNode,
  leftIcon?: ReactNode,
  rightIcon?: ReactNode
) {
  return (
    <>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  );
}

export function Button(props: ButtonProps) {
  if (isLinkButton(props)) {
    const {
      variant,
      size,
      leftIcon,
      rightIcon,
      fullWidth,
      className,
      children,
      href,
      ...anchorProps
    } = props;

    const classes = getButtonClassNames({
      variant,
      size,
      fullWidth,
      className,
    });
    const isInternalRoute = href.startsWith("/") && !href.startsWith("//");

    if (isInternalRoute) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {renderButtonContent(children, leftIcon, rightIcon)}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} {...anchorProps}>
        {renderButtonContent(children, leftIcon, rightIcon)}
      </a>
    );
  }

  const {
    variant,
    size,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    type = "button",
    ...buttonProps
  } = props;

  return (
    <button
      type={type}
      className={getButtonClassNames({ variant, size, fullWidth, className })}
      {...buttonProps}
    >
      {renderButtonContent(children, leftIcon, rightIcon)}
    </button>
  );
}
