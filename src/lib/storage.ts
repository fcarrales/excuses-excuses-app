import type { AppSettings, HistoryEntry, Language, Tone } from "@/types";

const HISTORY_KEY = "excuses-history";
const FAVORITES_KEY = "excuses-favorites";
const SETTINGS_KEY = "excuses-settings";
const ONBOARDING_KEY = "excuses-onboarding-dismissed";

const DEFAULT_SETTINGS: AppSettings = {
  defaultLanguage: "english",
  defaultTone: "casual",
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSettings(): AppSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  return safeParse(localStorage.getItem(SETTINGS_KEY), DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  if (!isBrowser()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  return safeParse<HistoryEntry[]>(localStorage.getItem(HISTORY_KEY), []);
}

export function getFavorites(): HistoryEntry[] {
  if (!isBrowser()) return [];
  return safeParse<HistoryEntry[]>(localStorage.getItem(FAVORITES_KEY), []);
}

export function addToHistory(entry: HistoryEntry): void {
  if (!isBrowser()) return;
  const history = getHistory();
  const updated = [entry, ...history.filter((h) => h.id !== entry.id)].slice(
    0,
    100,
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function toggleFavorite(entry: HistoryEntry): HistoryEntry {
  const updated = { ...entry, isFavorite: !entry.isFavorite };

  if (!isBrowser()) return updated;

  const favorites = getFavorites();
  if (updated.isFavorite) {
    const next = [updated, ...favorites.filter((f) => f.id !== entry.id)];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } else {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites.filter((f) => f.id !== entry.id)),
    );
  }

  const history = getHistory();
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(
      history.map((h) => (h.id === entry.id ? updated : h)),
    ),
  );

  return updated;
}

export function removeFavorite(id: string): void {
  if (!isBrowser()) return;
  const favorites = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

  const history = getHistory();
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(
      history.map((h) => (h.id === id ? { ...h, isFavorite: false } : h)),
    ),
  );
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}

export function clearFavorites(): void {
  if (!isBrowser()) return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));

  const history = getHistory();
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.map((h) => ({ ...h, isFavorite: false }))),
  );
}

export function updateDefaultLanguage(language: Language): void {
  saveSettings({ ...getSettings(), defaultLanguage: language });
}

export function updateDefaultTone(tone: Tone): void {
  saveSettings({ ...getSettings(), defaultTone: tone });
}

export function isOnboardingDismissed(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function dismissOnboarding(): void {
  if (!isBrowser()) return;
  localStorage.setItem(ONBOARDING_KEY, "true");
}
