import type {
  AppSettings,
  HistoryEntry,
  Language,
  SavedPerson,
  StylePreset,
  Tone,
} from "@/types";

const HISTORY_KEY = "excuses-history";
const FAVORITES_KEY = "excuses-favorites";
const SETTINGS_KEY = "excuses-settings";
const ONBOARDING_KEY = "excuses-onboarding-dismissed";
const PEOPLE_KEY = "excuses-saved-people";
const STYLE_PRESETS_KEY = "excuses-style-presets";

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

function isValidStylePreset(item: unknown): item is StylePreset {
  if (!item || typeof item !== "object") return false;
  const p = item as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.tone === "string" &&
    typeof p.language === "string"
  );
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

// ── Style Presets ─────────────────────────────────────────────────────

export function getStylePresets(): StylePreset[] {
  if (!isBrowser()) return [];
  return safeParseArray<unknown>(localStorage.getItem(STYLE_PRESETS_KEY)).filter(
    isValidStylePreset,
  );
}

export function saveStylePreset(preset: StylePreset): void {
  if (!isBrowser()) return;
  const presets = getStylePresets();
  const idx = presets.findIndex((p) => p.id === preset.id);
  const updated =
    idx >= 0
      ? presets.map((p) => (p.id === preset.id ? preset : p))
      : [preset, ...presets];
  safeWrite(STYLE_PRESETS_KEY, updated);
}

export function deleteStylePreset(id: string): void {
  if (!isBrowser()) return;
  safeWrite(
    STYLE_PRESETS_KEY,
    getStylePresets().filter((p) => p.id !== id),
  );
}

export function setDefaultStylePreset(id: string): void {
  if (!isBrowser()) return;
  const updated = getStylePresets().map((p) => ({
    ...p,
    isDefault: p.id === id,
  }));
  safeWrite(STYLE_PRESETS_KEY, updated);
}

export function getDefaultStylePreset(): StylePreset | undefined {
  return getStylePresets().find((p) => p.isDefault);
}

export function seedExampleStylePresets(): void {
  if (!isBrowser() || getStylePresets().length > 0) return;
  const examples: StylePreset[] = [
    {
      id: "preset-professional-short",
      name: "Professional and short",
      tone: "professional",
      language: "english",
      description: "Clean and to the point",
      favoritePhrases: ["Thank you for understanding."],
      avoidPhrases: ["lol", "sorry not sorry"],
      isDefault: true,
    },
    {
      id: "preset-soft-respectful",
      name: "Soft and respectful",
      tone: "soft",
      language: "english",
      description: "Gentle without being vague",
      favoritePhrases: ["Hope that works for you."],
      avoidPhrases: ["whatever", "deal with it"],
    },
    {
      id: "preset-casual-spanglish",
      name: "Casual Spanglish",
      tone: "casual",
      language: "spanglish",
      description: "Relaxed bilingual texting",
      favoritePhrases: ["Let me know!"],
      avoidPhrases: [],
    },
    {
      id: "preset-direct-not-rude",
      name: "Direct but not rude",
      tone: "direct",
      language: "english",
      description: "Clear without extra fluff",
      avoidPhrases: ["I guess", "maybe", "kind of"],
    },
  ];
  safeWrite(STYLE_PRESETS_KEY, examples);
}
