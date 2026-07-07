export interface BackupStatusRecord {
  lastExportAt?: string;
  lastImportAt?: string;
  lastImportCounts?: {
    history: number;
    favorites: number;
    people: number;
    presets: number;
  };
  lastError?: string;
}

export function formatBackupTimestamp(iso?: string): string {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "Unknown";
  }
}

export function isEmptyBackupCounts(counts: {
  history: number;
  favorites: number;
  people: number;
  presets: number;
}): boolean {
  return (
    counts.history === 0 &&
    counts.favorites === 0 &&
    counts.people === 0 &&
    counts.presets === 0
  );
}
