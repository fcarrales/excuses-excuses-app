"use client";

import { useRef, useState } from "react";
import {
  downloadBackup,
  formatImportSuccess,
  isAppBackup,
  readBackupFile,
} from "@/lib/backup";
import {
  clearAllAppData,
  clearFavorites,
  clearHistory,
  exportAllData,
  importAllData,
} from "@/lib/storage";
import Toast from "@/components/Toast";

interface DataBackupSectionProps {
  onDataChange: () => void;
}

export default function DataBackupSection({
  onDataChange,
}: DataBackupSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState("");
  const [importError, setImportError] = useState("");

  function showMessage(msg: string) {
    setToast(msg);
    setImportError("");
  }

  function handleExport() {
    try {
      const data = exportAllData();
      downloadBackup(data);
      showMessage("Backup downloaded");
    } catch {
      showMessage("Could not create backup — try again");
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");

    try {
      const raw = await readBackupFile(file);
      if (!isAppBackup(raw)) {
        setImportError(
          "This file doesn't look like a valid Excuses, Excuses! backup.",
        );
        return;
      }

      const result = importAllData(raw);
      if (!result.success) {
        setImportError(result.error);
        return;
      }

      showMessage(formatImportSuccess(result.counts));
      onDataChange();
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : "Could not read this file.",
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleClearAll() {
    if (
      window.confirm(
        "Clear ALL app data? This removes history, favorites, people, presets, and settings. Export a backup first if you want to keep anything.",
      )
    ) {
      clearAllAppData();
      showMessage("All app data cleared");
      onDataChange();
    }
  }

  return (
    <>
      <section className="space-y-3" aria-labelledby="data-heading">
        <h3
          id="data-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          Your data
        </h3>
        <p className="text-sm text-slate-600">
          Everything stays on your device. Export a backup before switching
          browsers or clearing site data.
        </p>

        <button
          type="button"
          onClick={handleExport}
          className="min-h-[44px] w-full rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
        >
          Export backup
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImportFile}
          className="sr-only"
          id="import-backup"
          aria-label="Import backup file"
        />
        <label
          htmlFor="import-backup"
          className="flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-600"
        >
          Import backup
        </label>

        {importError && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {importError}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all message history?")) {
              clearHistory();
              onDataChange();
              showMessage("History cleared");
            }
          }}
          className="min-h-[44px] w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 active:scale-[0.98]"
        >
          Clear history
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Remove all favorites?")) {
              clearFavorites();
              onDataChange();
              showMessage("Favorites cleared");
            }
          }}
          className="min-h-[44px] w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 active:scale-[0.98]"
        >
          Clear favorites
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="min-h-[44px] w-full rounded-xl border border-red-300 bg-red-100 px-4 py-3 text-sm font-bold text-red-800 transition-colors hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:scale-[0.98]"
        >
          Clear all app data
        </button>
      </section>
      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </>
  );
}
