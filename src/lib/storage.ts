import { APP_VERSION } from "@/lib/appInfo";
import type { BackupStatusRecord } from "@/lib/backupStatus";
import type { AppBackup } from "@/lib/backup";
import {
  DEMO_FAVORITES,
  DEMO_HISTORY,
  DEMO_PEOPLE,
  DEMO_PRESETS,
  isDemoId,
} from "@/lib/demoData";
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
const INSTALL_DISMISSED_KEY = "excuses-install-dismissed";
const QA_MODE_KEY = "excuses-qa-mode";
const BACKUP_STATUS_KEY = "excuses-backup-status";
const DEMO_LOADED_KEY = "excuses-demo-loaded";
const BETA_CHECKLIST_KEY = "excuses-beta-checklist";
const LAUNCH_DISMISSED_KEY = "excuses-launch-dismissed";
const SCREENSHOT_MODE_KEY = "excuses-screenshot-mode";
const SMOKE_TEST_KEY = "excuses-smoke-test-checklist";
const PRE_RELEASE_KEY = "excuses-pre-release-checklist";

export const STORAGE_KEYS = [
  HISTORY_KEY,
  FAVORITES_KEY,
  SETTINGS_KEY,
  ONBOARDING_KEY,
  PEOPLE_KEY,
  STYLE_PRESETS_KEY,
  INSTALL_DISMISSED_KEY,
  QA_MODE_KEY,
  BACKUP_STATUS_KEY,
  DEMO_LOADED_KEY,
  BETA_CHECKLIST_KEY,
  LAUNCH_DISMISSED_KEY,
  SCREENSHOT_MODE_KEY,
  SMOKE_TEST_KEY,
  PRE_RELEASE_KEY,
] as const;

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

// ── Install prompt ────────────────────────────────────────────────────

export function isInstallPromptDismissed(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(INSTALL_DISMISSED_KEY) === "true";
}

export function dismissInstallPrompt(): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
  } catch {
    // ignore
  }
}

// ── Backup / restore ──────────────────────────────────────────────────

export function exportAllData(): AppBackup {
  return {
    backupVersion: "1",
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: getSettings(),
    history: getHistory(),
    favorites: getFavorites(),
    savedPeople: getSavedPeople(),
    stylePresets: getStylePresets(),
    onboardingDismissed: isOnboardingDismissed(),
    installPromptDismissed: isInstallPromptDismissed(),
  };
}

export function importAllData(
  backup: AppBackup,
): { success: true; counts: { history: number; favorites: number; people: number; presets: number } } | { success: false; error: string } {
  if (!isBrowser()) {
    return { success: false, error: "Import is only available in the browser." };
  }

  try {
    const settings = normalizeSettings(backup.settings);
    const history = (backup.history ?? []).filter(isValidHistoryEntry);
    const favorites = (backup.favorites ?? []).filter(isValidHistoryEntry);
    const people = (backup.savedPeople ?? []).filter(isValidPerson);
    const presets = (backup.stylePresets ?? []).filter(isValidStylePreset);

    safeWrite(SETTINGS_KEY, settings);
    safeWrite(HISTORY_KEY, history.slice(0, 100));
    safeWrite(FAVORITES_KEY, favorites);
    safeWrite(PEOPLE_KEY, people);
    safeWrite(STYLE_PRESETS_KEY, presets);

    if (backup.onboardingDismissed) {
      dismissOnboarding();
    } else {
      localStorage.removeItem(ONBOARDING_KEY);
    }

    if (backup.installPromptDismissed) {
      dismissInstallPrompt();
    } else {
      localStorage.removeItem(INSTALL_DISMISSED_KEY);
    }

    return {
      success: true,
      counts: {
        history: history.length,
        favorites: favorites.length,
        people: people.length,
        presets: presets.length,
      },
    };
  } catch {
    return {
      success: false,
      error: "Could not restore backup. The file may be corrupted.",
    };
  }
}

export function clearAllAppData(): void {
  if (!isBrowser()) return;
  for (const key of STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

export function isQAModeEnabled(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(QA_MODE_KEY) === "true";
}

export function setQAModeEnabled(enabled: boolean): void {
  if (!isBrowser()) return;
  if (enabled) {
    localStorage.setItem(QA_MODE_KEY, "true");
  } else {
    localStorage.removeItem(QA_MODE_KEY);
  }
  window.dispatchEvent(new CustomEvent("excuses-qa-change"));
}

export interface QaStats {
  localStorageAvailable: boolean;
  favoritesCount: number;
  historyCount: number;
  peopleCount: number;
  presetsCount: number;
  settingsSaved: boolean;
  onboardingDismissed: boolean;
  installDismissed: boolean;
  demoLoaded: boolean;
}

export function getQaStats(): QaStats {
  if (!isBrowser()) {
    return {
      localStorageAvailable: false,
      favoritesCount: 0,
      historyCount: 0,
      peopleCount: 0,
      presetsCount: 0,
      settingsSaved: false,
      onboardingDismissed: false,
      installDismissed: false,
      demoLoaded: false,
    };
  }

  let localStorageAvailable = true;
  try {
    localStorage.setItem("__excuses_test__", "1");
    localStorage.removeItem("__excuses_test__");
  } catch {
    localStorageAvailable = false;
  }

  return {
    localStorageAvailable,
    favoritesCount: getFavorites().length,
    historyCount: getHistory().length,
    peopleCount: getSavedPeople().length,
    presetsCount: getStylePresets().length,
    settingsSaved: localStorage.getItem(SETTINGS_KEY) !== null,
    onboardingDismissed: isOnboardingDismissed(),
    installDismissed: isInstallPromptDismissed(),
    demoLoaded: isDemoDataLoaded(),
  };
}

export function getBackupStatus(): BackupStatusRecord {
  if (!isBrowser()) return {};
  return safeParse<BackupStatusRecord>(
    localStorage.getItem(BACKUP_STATUS_KEY),
    {},
  );
}

export function recordBackupExport(): void {
  if (!isBrowser()) return;
  const prev = getBackupStatus();
  safeWrite(BACKUP_STATUS_KEY, {
    ...prev,
    lastExportAt: new Date().toISOString(),
    lastError: undefined,
  });
}

export function recordBackupImport(
  counts: {
    history: number;
    favorites: number;
    people: number;
    presets: number;
  },
  empty: boolean,
): void {
  if (!isBrowser()) return;
  const prev = getBackupStatus();
  safeWrite(BACKUP_STATUS_KEY, {
    ...prev,
    lastImportAt: new Date().toISOString(),
    lastImportCounts: counts,
    lastError: empty ? "Last import was empty — no data restored." : undefined,
  });
}

export function recordBackupError(message: string): void {
  if (!isBrowser()) return;
  const prev = getBackupStatus();
  safeWrite(BACKUP_STATUS_KEY, {
    ...prev,
    lastError: message,
  });
}

export function isDemoDataLoaded(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(DEMO_LOADED_KEY) === "true";
}

export function loadDemoData(): {
  people: number;
  favorites: number;
  history: number;
  presets: number;
} {
  if (!isBrowser()) {
    return { people: 0, favorites: 0, history: 0, presets: 0 };
  }

  const people = mergeById(getSavedPeople(), DEMO_PEOPLE);
  safeWrite(PEOPLE_KEY, people);

  const favorites = mergeById(
    getFavorites().filter((f) => !isDemoId(f.id)),
    DEMO_FAVORITES,
  );
  safeWrite(FAVORITES_KEY, favorites);

  const history = mergeById(
    getHistory().filter((h) => !isDemoId(h.id)),
    DEMO_HISTORY,
  );
  safeWrite(HISTORY_KEY, history.slice(0, 100));

  const presets = mergeById(
    getStylePresets().filter((p) => !isDemoId(p.id)),
    DEMO_PRESETS,
  );
  safeWrite(STYLE_PRESETS_KEY, presets);

  localStorage.setItem(DEMO_LOADED_KEY, "true");

  return {
    people: DEMO_PEOPLE.length,
    favorites: DEMO_FAVORITES.length,
    history: DEMO_HISTORY.length,
    presets: DEMO_PRESETS.length,
  };
}

export function clearDemoData(): void {
  if (!isBrowser()) return;

  safeWrite(
    PEOPLE_KEY,
    getSavedPeople().filter((p) => !isDemoId(p.id)),
  );
  safeWrite(
    FAVORITES_KEY,
    getFavorites().filter((f) => !isDemoId(f.id)),
  );
  safeWrite(
    HISTORY_KEY,
    getHistory().filter((h) => !isDemoId(h.id)),
  );
  safeWrite(
    STYLE_PRESETS_KEY,
    getStylePresets().filter((p) => !isDemoId(p.id)),
  );
  localStorage.removeItem(DEMO_LOADED_KEY);
}

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of existing) {
    map.set(item.id, item);
  }
  for (const item of incoming) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

export type BetaChecklistId =
  | "generate"
  | "spanish"
  | "spanglish"
  | "favorite"
  | "person"
  | "pack"
  | "preset"
  | "export"
  | "import"
  | "safety"
  | "install";

export function getBetaChecklist(): Record<BetaChecklistId, boolean> {
  const defaults: Record<BetaChecklistId, boolean> = {
    generate: false,
    spanish: false,
    spanglish: false,
    favorite: false,
    person: false,
    pack: false,
    preset: false,
    export: false,
    import: false,
    safety: false,
    install: false,
  };
  if (!isBrowser()) return defaults;
  const stored = safeParse<Partial<Record<BetaChecklistId, boolean>>>(
    localStorage.getItem(BETA_CHECKLIST_KEY),
    {},
  );
  return { ...defaults, ...stored };
}

export function setBetaChecklistItem(
  id: BetaChecklistId,
  checked: boolean,
): void {
  if (!isBrowser()) return;
  const current = getBetaChecklist();
  safeWrite(BETA_CHECKLIST_KEY, { ...current, [id]: checked });
}

export function isLaunchCardDismissed(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(LAUNCH_DISMISSED_KEY) === "true";
}

export function dismissLaunchCard(): void {
  if (!isBrowser()) return;
  localStorage.setItem(LAUNCH_DISMISSED_KEY, "true");
}

export function isScreenshotModeEnabled(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(SCREENSHOT_MODE_KEY) === "true";
}

export function setScreenshotModeEnabled(enabled: boolean): void {
  if (!isBrowser()) return;
  if (enabled) {
    localStorage.setItem(SCREENSHOT_MODE_KEY, "true");
    if (!isDemoDataLoaded()) {
      loadDemoData();
    }
  } else {
    localStorage.removeItem(SCREENSHOT_MODE_KEY);
  }
  window.dispatchEvent(new CustomEvent("excuses-screenshot-change"));
}

export type SmokeTestId =
  | "generate"
  | "copy"
  | "share"
  | "favorite"
  | "person"
  | "pack"
  | "preset"
  | "export"
  | "import"
  | "safety"
  | "pwa";

export function getSmokeTestChecklist(): Record<SmokeTestId, boolean> {
  const defaults: Record<SmokeTestId, boolean> = {
    generate: false,
    copy: false,
    share: false,
    favorite: false,
    person: false,
    pack: false,
    preset: false,
    export: false,
    import: false,
    safety: false,
    pwa: false,
  };
  if (!isBrowser()) return defaults;
  const stored = safeParse<Partial<Record<SmokeTestId, boolean>>>(
    localStorage.getItem(SMOKE_TEST_KEY),
    {},
  );
  return { ...defaults, ...stored };
}

export function setSmokeTestItem(id: SmokeTestId, checked: boolean): void {
  if (!isBrowser()) return;
  const current = getSmokeTestChecklist();
  safeWrite(SMOKE_TEST_KEY, { ...current, [id]: checked });
}

export type PreReleaseId =
  | "install"
  | "privacyRoute"
  | "safetyRoute"
  | "manifestRoute"
  | "backup"
  | "share"
  | "safetyBlock"
  | "mobile"
  | "domain";

export function getPreReleaseChecklist(): Record<PreReleaseId, boolean> {
  const defaults: Record<PreReleaseId, boolean> = {
    install: false,
    privacyRoute: false,
    safetyRoute: false,
    manifestRoute: false,
    backup: false,
    share: false,
    safetyBlock: false,
    mobile: false,
    domain: false,
  };
  if (!isBrowser()) return defaults;
  const stored = safeParse<Partial<Record<PreReleaseId, boolean>>>(
    localStorage.getItem(PRE_RELEASE_KEY),
    {},
  );
  return { ...defaults, ...stored };
}

export function setPreReleaseItem(id: PreReleaseId, checked: boolean): void {
  if (!isBrowser()) return;
  const current = getPreReleaseChecklist();
  safeWrite(PRE_RELEASE_KEY, { ...current, [id]: checked });
}
