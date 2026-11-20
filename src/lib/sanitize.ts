const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/;
const CONTROL_CHARS_GLOBAL_REGEX = /[\u0000-\u001F\u007F]/g;
const SAFE_EMAIL_REGEX = /^[^\s@<>?#"']+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function stripControlChars(value: string): string {
  return value.replace(CONTROL_CHARS_GLOBAL_REGEX, "").trim();
}

/**
 * Chuẩn hóa và kiểm tra URL gốc của website (chỉ chấp nhận http/https).
 * Trả về giá trị mặc định nếu biến môi trường sai định dạng.
 */
export function normalizeSiteUrl(
  rawUrl: string | undefined,
  fallback: string
): string {
  const candidate = rawUrl ? stripControlChars(rawUrl) : "";
  if (!candidate) return fallback;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return fallback;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}

/**
 * Kiểm tra liên kết ngoài, chỉ cho phép giao thức http: hoặc https:.
 */
export function sanitizeExternalUrl(rawUrl: string | undefined): string {
  const candidate = rawUrl ? stripControlChars(rawUrl) : "";
  if (!candidate) return "";

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Chuẩn hóa số điện thoại thành liên kết tel: an toàn.
 */
export function buildTelHref(rawPhone: string | undefined): string {
  const cleaned = rawPhone
    ? stripControlChars(rawPhone).replace(/[^\d+]/g, "")
    : "";
  const normalized = cleaned.startsWith("+")
    ? `+${cleaned.slice(1).replace(/\+/g, "")}`
    : cleaned.replace(/\+/g, "");

  return /\d{6,}/.test(normalized) ? `tel:${normalized}` : "#";
}

/**
 * Chuẩn hóa địa chỉ email thành liên kết mailto: an toàn, chặn ký tự điều khiển và query injection.
 */
export function sanitizeMailtoHref(rawEmail: string | undefined): string {
  if (!rawEmail || CONTROL_CHARS_REGEX.test(rawEmail)) return "";
  const cleaned = rawEmail.trim();
  if (!cleaned || !SAFE_EMAIL_REGEX.test(cleaned)) return "";
  return `mailto:${cleaned}`;
}

/**
 * Kiểm tra và làm sạch href dùng cho thẻ <a>, chặn javascript:, data:, vbscript: và protocol-relative //.
 */
export function sanitizeHref(
  rawHref: string | undefined,
  options: { allowTel?: boolean; allowMailto?: boolean } = {}
): string {
  const candidate = rawHref ? stripControlChars(rawHref) : "";
  if (!candidate) return "#";

  if (
    (candidate.startsWith("/") && !candidate.startsWith("//")) ||
    candidate.startsWith("#")
  ) {
    return candidate;
  }

  const lower = candidate.toLowerCase();
  if (options.allowTel && lower.startsWith("tel:")) {
    return buildTelHref(candidate.slice(4));
  }
  if (options.allowMailto && lower.startsWith("mailto:")) {
    return sanitizeMailtoHref(candidate.slice(7)) || "#";
  }

  const safeExternal = sanitizeExternalUrl(candidate);
  return safeExternal || "#";
}

/**
 * Chuẩn hóa số điện thoại dạng quốc tế E.164 cho JSON-LD Schema.
 */
export function normalizePhoneE164(
  rawPhone: string,
  callingCode = "+84"
): string {
  const digits = stripControlChars(rawPhone).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) {
    return `${callingCode}${digits.slice(1)}`;
  }
  return `+${digits}`;
}
