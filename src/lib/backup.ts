import { APP_VERSION } from "@/lib/appInfo";
import type {
  AppSettings,
  HistoryEntry,
  SavedPerson,
  StylePreset,
} from "@/types";

export interface AppBackup {
  backupVersion: string;
  appVersion: string;
  exportedAt: string;
  settings: AppSettings;
  history: HistoryEntry[];
  favorites: HistoryEntry[];
  savedPeople: SavedPerson[];
  stylePresets: StylePreset[];
  onboardingDismissed: boolean;
  installPromptDismissed: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
}

export function createBackupFileName(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `excuses-excuses-backup-${date}.json`;
}

export function downloadBackup(data: AppBackup): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = createBackupFileName();
  link.click();
  URL.revokeObjectURL(url);
}

export async function readBackupFile(file: File): Promise<unknown> {
  const text = await file.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("This file is not valid JSON.");
  }
}

export function isAppBackup(data: unknown): data is AppBackup {
  if (!data || typeof data !== "object") return false;
  const b = data as Record<string, unknown>;
  return (
    typeof b.backupVersion === "string" &&
    b.settings !== null &&
    typeof b.settings === "object" &&
    Array.isArray(b.history) &&
    Array.isArray(b.favorites)
  );
}

export function formatImportSuccess(counts: {
  history: number;
  favorites: number;
  people: number;
  presets: number;
}): string {
  return `Backup restored: ${counts.history} history, ${counts.favorites} favorites, ${counts.people} people, ${counts.presets} presets.`;
}

export function buildEmptyBackup(): AppBackup {
  return {
    backupVersion: "1",
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: { defaultLanguage: "english", defaultTone: "casual" },
    history: [],
    favorites: [],
    savedPeople: [],
    stylePresets: [],
    onboardingDismissed: false,
    installPromptDismissed: false,
  };
}
