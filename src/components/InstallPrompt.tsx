"use client";

import { useEffect, useState } from "react";
import {
  dismissInstallPrompt,
  isInstallPromptDismissed,
} from "@/lib/storage";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => isInstallPromptDismissed());
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  function handleDismiss() {
    dismissInstallPrompt();
    setDismissed(true);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  }

  if (installed || dismissed || !deferredPrompt) return null;

  return (
    <div className="rounded-2xl border border-violet-200/80 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-lg text-white"
          aria-hidden
        >
          📲
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-violet-900">Install the app</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Add Excuses, Excuses! to your home screen for quick access.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleInstall}
              className="min-h-[44px] flex-1 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
            >
              Install app
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="min-h-[44px] flex-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:flex-none"
              aria-label="Dismiss install prompt"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
