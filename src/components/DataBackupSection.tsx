"use client";

import { useRef, useState } from "react";
import {
  downloadBackup,
  formatImportSuccess,
  isAppBackup,
  readBackupFile,
} from "@/lib/backup";
import {
  formatBackupTimestamp,
  isEmptyBackupCounts,
} from "@/lib/backupStatus";
import {
  clearAllAppData,
  clearFavorites,
  clearHistory,
  exportAllData,
  getBackupStatus,
  importAllData,
  recordBackupError,
  recordBackupExport,
  recordBackupImport,
} from "@/lib/storage";
import DemoDataTools from "@/components/DemoDataTools";
import Toast from "@/components/Toast";

interface DataBackupSectionProps {
  onDataChange: () => void;
  showDemoTools?: boolean;
}

export default function DataBackupSection({
  onDataChange,
  showDemoTools = false,
}: DataBackupSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [status, setStatus] = useState(() => getBackupStatus());

  function refreshStatus() {
    setStatus(getBackupStatus());
  }

  function showMessage(msg: string) {
    setToast(msg);
    setImportError("");
    setImportSuccess("");
  }

  function handleExport() {
    try {
      const data = exportAllData();
      downloadBackup(data);
      recordBackupExport();
      refreshStatus();
      showMessage("Backup downloaded successfully");
    } catch {
      recordBackupError("Could not create backup — try again");
      refreshStatus();
      showMessage("Could not create backup — try again");
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    setImportSuccess("");

    try {
      const raw = await readBackupFile(file);
      if (!isAppBackup(raw)) {
        const msg =
          "This file doesn't look like a valid Excuses, Excuses! backup.";
        setImportError(msg);
        recordBackupError(msg);
        refreshStatus();
        return;
      }

      const result = importAllData(raw);
      if (!result.success) {
        setImportError(result.error);
        recordBackupError(result.error);
        refreshStatus();
        return;
      }

      const empty = isEmptyBackupCounts(result.counts);
      recordBackupImport(result.counts, empty);
      refreshStatus();

      if (empty) {
        setImportError(
          "This backup file is empty — no messages, people, or presets were restored.",
        );
      } else {
        setImportSuccess(formatImportSuccess(result.counts));
      }

      onDataChange();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not read this file.";
      setImportError(msg);
      recordBackupError(msg);
      refreshStatus();
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
      refreshStatus();
      showMessage("All app data cleared");
      onDataChange();
    }
  }

  return (
    <>
      <section className="space-y-4" aria-labelledby="data-heading">
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

        {(status.lastExportAt || status.lastImportAt || status.lastError) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
            <p>
              <span className="font-medium text-slate-700">Last export:</span>{" "}
              {formatBackupTimestamp(status.lastExportAt)}
            </p>
            <p className="mt-1">
              <span className="font-medium text-slate-700">Last import:</span>{" "}
              {formatBackupTimestamp(status.lastImportAt)}
            </p>
            {status.lastImportCounts && (
              <p className="mt-1 text-slate-500">
                Restored: {status.lastImportCounts.history} history,{" "}
                {status.lastImportCounts.favorites} favorites,{" "}
                {status.lastImportCounts.people} people,{" "}
                {status.lastImportCounts.presets} presets
              </p>
            )}
            {status.lastError && (
              <p role="alert" className="mt-2 text-amber-800">
                {status.lastError}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleExport}
            className="min-h-[44px] flex-1 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
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
            className="flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-600"
          >
            Import backup
          </label>
        </div>

        {importSuccess && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
          >
            {importSuccess}
          </p>
        )}

        {importError && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {importError}
          </p>
        )}

        {showDemoTools && (
          <DemoDataTools
            onChange={() => {
              refreshStatus();
              onDataChange();
            }}
          />
        )}

        <div className="space-y-2 border-t border-slate-100 pt-4">
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
        </div>
      </section>
      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </>
  );
}
