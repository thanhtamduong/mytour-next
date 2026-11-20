export type SeasonKey = "spring" | "summer" | "autumn" | "winter";
export type SeasonMode = "auto" | SeasonKey | "off";

export const VALID_SEASONS: ReadonlySet<SeasonKey> = new Set<SeasonKey>([
  "spring",
  "summer",
  "autumn",
  "winter",
]);

const VALID_MODES: ReadonlySet<SeasonMode> = new Set<SeasonMode>([
  "auto",
  "spring",
  "summer",
  "autumn",
  "winter",
  "off",
]);

export interface SeasonOptionMeta {
  key: SeasonKey;
  shortLabel: string;
  title: string;
  description: string;
  accentHex: string;
}

export const SEASON_OPTIONS: readonly SeasonOptionMeta[] = [
  {
    key: "spring",
    shortLabel: "Xuân",
    title: "Mùa Xuân",
    description: "Hoa đào & hoa mai",
    accentHex: "#E13D7D",
  },
  {
    key: "summer",
    shortLabel: "Hạ",
    title: "Mùa Hạ",
    description: "Lá xanh & phượng đỏ",
    accentHex: "#16A34A",
  },
  {
    key: "autumn",
    shortLabel: "Thu",
    title: "Mùa Thu",
    description: "Lá phong & ngân hạnh",
    accentHex: "#EA580C",
  },
  {
    key: "winter",
    shortLabel: "Đông",
    title: "Mùa Đông",
    description: "Bông tuyết pha lê",
    accentHex: "#0284C7",
  },
];

export const SEASON_META_BY_KEY: Record<SeasonKey, SeasonOptionMeta> = {
  spring: SEASON_OPTIONS[0],
  summer: SEASON_OPTIONS[1],
  autumn: SEASON_OPTIONS[2],
  winter: SEASON_OPTIONS[3],
};

/**
 * Xác định mùa theo thời gian thực dựa trên tiết khí Việt Nam / Đông Á:
 * - Xuân (04/02 – 04/05): hoa đào hồng & hoa mai vàng
 * - Hạ (05/05 – 06/08): lá xanh non & cánh hoa phượng đỏ
 * - Thu (07/08 – 06/11): lá phong đỏ, lá ngân hạnh & lá vàng rơi
 * - Đông (07/11 – 03/02): bông tuyết pha lê & hạt tuyết lấp lánh
 */
export function getSeasonByDate(date: Date = new Date()): SeasonKey {
  const monthDay = (date.getMonth() + 1) * 100 + date.getDate();

  if (monthDay >= 204 && monthDay <= 504) return "spring";
  if (monthDay >= 505 && monthDay <= 806) return "summer";
  if (monthDay >= 807 && monthDay <= 1106) return "autumn";
  return "winter";
}

const SEASON_STORAGE_KEY = "thuylinh_season_mode";
const modeListeners = new Set<() => void>();
let sessionModeOverride: SeasonMode | null = null;

function readUrlSeasonParam(): SeasonMode | null {
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search)
    .get("season")
    ?.trim()
    .toLowerCase();
  if (param && VALID_MODES.has(param as SeasonMode)) {
    return param as SeasonMode;
  }
  return null;
}

function readStoredSeasonMode(): SeasonMode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(SEASON_STORAGE_KEY);
    if (stored && VALID_MODES.has(stored as SeasonMode)) {
      return stored as SeasonMode;
    }
  } catch {
    // Ignore storage access errors in private browsing mode
  }
  return null;
}

export function getSeasonModeSnapshot(): SeasonMode {
  if (typeof window === "undefined") return "auto";
  if (sessionModeOverride !== null) return sessionModeOverride;
  return readUrlSeasonParam() ?? readStoredSeasonMode() ?? "auto";
}

export function getSeasonModeServerSnapshot(): SeasonMode {
  return "auto";
}

export function subscribeSeasonMode(callback: () => void): () => void {
  modeListeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SEASON_STORAGE_KEY) {
      sessionModeOverride = null;
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    modeListeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function setSeasonMode(nextMode: SeasonMode): void {
  sessionModeOverride = nextMode;
  if (typeof window !== "undefined") {
    try {
      if (nextMode === "auto") {
        window.localStorage.removeItem(SEASON_STORAGE_KEY);
      } else {
        window.localStorage.setItem(SEASON_STORAGE_KEY, nextMode);
      }
    } catch {
      // Ignore storage access errors
    }
  }
  modeListeners.forEach((listener) => listener());
}

export function getClockSeasonSnapshot(): SeasonKey {
  return getSeasonByDate(new Date());
}

export function getClockSeasonServerSnapshot(): SeasonKey | null {
  return null;
}

export function subscribeClockSeason(callback: () => void): () => void {
  const intervalId = window.setInterval(callback, 60_000);
  const handleVisibility = () => {
    if (!document.hidden) callback();
  };
  document.addEventListener("visibilitychange", handleVisibility);
  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}
