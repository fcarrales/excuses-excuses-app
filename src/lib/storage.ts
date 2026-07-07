import type {
  AppSettings,
  HistoryEntry,
  Language,
  SavedPerson,
  Tone,
} from "@/types";

const HISTORY_KEY = "excuses-history";
const FAVORITES_KEY = "excuses-favorites";
const SETTINGS_KEY = "excuses-settings";
const ONBOARDING_KEY = "excuses-onboarding-dismissed";
const PEOPLE_KEY = "excuses-saved-people";

const DEFAULT_SETTINGS: AppSettings = {
  defaultLanguage: "english",
  defaultTone: "casual",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function safeParseArray<T>(value: string | null): T[] {
  const parsed = safeParse<unknown>(value, []);
  return Array.isArray(parsed) ? (parsed as T[]) : [];
}

function safeWrite(key: string, data: unknown): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

function isValidPerson(item: unknown): item is SavedPerson {
  if (!item || typeof item !== "object") return false;
  const p = item as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.relationship === "string" &&
    typeof p.defaultTone === "string" &&
    typeof p.defaultLanguage === "string"
  );
}

function isValidHistoryEntry(item: unknown): item is HistoryEntry {
  if (!item || typeof item !== "object") return false;
  const e = item as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.message === "string" &&
    typeof e.createdAt === "number"
  );
}

function normalizeSettings(raw: unknown): AppSettings {
  if (!raw || typeof raw !== "object") return DEFAULT_SETTINGS;
  const s = raw as Record<string, unknown>;
  const languages: Language[] = ["english", "spanish", "spanglish"];
  const tones: Tone[] = [
    "casual",
    "professional",
    "funny",
    "respectful",
    "soft",
    "direct",
    "believable",
  ];
  return {
    defaultLanguage: languages.includes(s.defaultLanguage as Language)
      ? (s.defaultLanguage as Language)
      : DEFAULT_SETTINGS.defaultLanguage,
    defaultTone: tones.includes(s.defaultTone as Tone)
      ? (s.defaultTone as Tone)
      : DEFAULT_SETTINGS.defaultTone,
  };
}

export function getSettings(): AppSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  return normalizeSettings(safeParse(localStorage.getItem(SETTINGS_KEY), null));
}

export function saveSettings(settings: AppSettings): void {
  safeWrite(SETTINGS_KEY, settings);
}

export function updateDefaultLanguage(language: Language): void {
  saveSettings({ ...getSettings(), defaultLanguage: language });
}

export function updateDefaultTone(tone: Tone): void {
  saveSettings({ ...getSettings(), defaultTone: tone });
}

export function getHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  return safeParseArray<unknown>(localStorage.getItem(HISTORY_KEY))
    .filter(isValidHistoryEntry)
    .map((e) => ({ ...e, isFavorite: Boolean(e.isFavorite) }));
}

export function addToHistory(entry: HistoryEntry): void {
  if (!isBrowser()) return;
  const history = getHistory();
  const updated = [entry, ...history.filter((h) => h.id !== entry.id)].slice(
    0,
    100,
  );
  safeWrite(HISTORY_KEY, updated);
}

export function clearHistory(): void {
  safeWrite(HISTORY_KEY, []);
}

export function getFavorites(): HistoryEntry[] {
  if (!isBrowser()) return [];
  return safeParseArray<unknown>(localStorage.getItem(FAVORITES_KEY))
    .filter(isValidHistoryEntry)
    .map((e) => ({ ...e, isFavorite: true }));
}

export function toggleFavorite(entry: HistoryEntry): HistoryEntry {
  const updated = { ...entry, isFavorite: !entry.isFavorite };

  if (!isBrowser()) return updated;

  const favorites = getFavorites();
  if (updated.isFavorite) {
    const next = [updated, ...favorites.filter((f) => f.id !== entry.id)];
    safeWrite(FAVORITES_KEY, next);
  } else {
    safeWrite(
      FAVORITES_KEY,
      favorites.filter((f) => f.id !== entry.id),
    );
  }

  const history = getHistory();
  safeWrite(
    HISTORY_KEY,
    history.map((h) => (h.id === entry.id ? updated : h)),
  );

  return updated;
}

export function removeFavorite(id: string): void {
  if (!isBrowser()) return;
  safeWrite(
    FAVORITES_KEY,
    getFavorites().filter((f) => f.id !== id),
  );

  const history = getHistory();
  safeWrite(
    HISTORY_KEY,
    history.map((h) => (h.id === id ? { ...h, isFavorite: false } : h)),
  );
}

export function clearFavorites(): void {
  if (!isBrowser()) return;
  safeWrite(FAVORITES_KEY, []);

  const history = getHistory();
  safeWrite(
    HISTORY_KEY,
    history.map((h) => ({ ...h, isFavorite: false })),
  );
}

export function isOnboardingDismissed(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function dismissOnboarding(): void {
  if (!isBrowser()) return;
  localStorage.setItem(ONBOARDING_KEY, "true");
}

export function getSavedPeople(): SavedPerson[] {
  if (!isBrowser()) return [];
  return safeParseArray<unknown>(localStorage.getItem(PEOPLE_KEY)).filter(
    isValidPerson,
  );
}

export function savePerson(person: SavedPerson): void {
  if (!isBrowser()) return;
  const people = getSavedPeople();
  const idx = people.findIndex((p) => p.id === person.id);
  const updated =
    idx >= 0
      ? people.map((p) => (p.id === person.id ? person : p))
      : [person, ...people];
  safeWrite(PEOPLE_KEY, updated);
}

export function deletePerson(id: string): void {
  if (!isBrowser()) return;
  safeWrite(
    PEOPLE_KEY,
    getSavedPeople().filter((p) => p.id !== id),
  );
}

export function getSavedPerson(id: string): SavedPerson | undefined {
  return getSavedPeople().find((p) => p.id === id);
}
