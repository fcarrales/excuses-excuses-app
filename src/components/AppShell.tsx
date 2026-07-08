"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import type { Tab } from "@/types";
import { APP_NAME, APP_TAGLINE, APP_VERSION } from "@/lib/appInfo";
import { isQAModeEnabled, isScreenshotModeEnabled } from "@/lib/storage";

interface AppShellProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onOpenFeedback?: () => void;
  children: ReactNode;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "generator", label: "Generate", icon: "✨" },
  { id: "people", label: "People", icon: "👤" },
  { id: "packs", label: "Packs", icon: "📦" },
  { id: "favorites", label: "Saved", icon: "⭐" },
  { id: "history", label: "History", icon: "🕐" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function AppShell({
  activeTab,
  onTabChange,
  onOpenFeedback,
  children,
}: AppShellProps) {
  const [qaMode, setQaMode] = useState(() => isQAModeEnabled());
  const [screenshotMode, setScreenshotMode] = useState(() =>
    isScreenshotModeEnabled(),
  );

  useEffect(() => {
    function onQaChange() {
      setQaMode(isQAModeEnabled());
    }
    function onScreenshotChange() {
      setScreenshotMode(isScreenshotModeEnabled());
    }
    window.addEventListener("excuses-qa-change", onQaChange);
    window.addEventListener("excuses-screenshot-change", onScreenshotChange);
    return () => {
      window.removeEventListener("excuses-qa-change", onQaChange);
      window.removeEventListener("excuses-screenshot-change", onScreenshotChange);
    };
  }, []);

  const showQaBadge = qaMode && !screenshotMode;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/85 px-4 py-3.5 backdrop-blur-lg">
        <div className="mx-auto flex max-w-md items-center gap-3 sm:max-w-lg">
          <Image
            src="/favicon.svg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-xl shadow-sm"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-bold tracking-tight text-violet-900">
                {APP_NAME}
              </h1>
              <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                Beta
              </span>
              {screenshotMode && (
                <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-800">
                  Screenshot
                </span>
              )}
              {showQaBadge && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                  QA
                </span>
              )}
            </div>
            <p className="truncate text-xs text-violet-600/90">{APP_TAGLINE}</p>
          </div>
          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="shrink-0 min-h-[40px] rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
            >
              Feedback
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-5 pb-32 sm:max-w-lg sm:py-6">
        {children}
      </main>

      <footer className="fixed bottom-14 left-0 right-0 z-[5] pointer-events-none">
        <p className="text-center text-[10px] text-slate-400">
          v{APP_VERSION}
          {screenshotMode && activeTab === "settings" && (
            <span className="ml-1.5 text-sky-600">· Screenshot</span>
          )}
          {showQaBadge && activeTab === "settings" && (
            <span className="ml-1.5 text-amber-600">· QA</span>
          )}
        </p>
      </footer>

      <nav
        className="fixed bottom-0 left-0 right-0 z-10 border-t border-white/40 bg-white/92 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-lg"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-md overflow-x-auto overscroll-x-contain sm:max-w-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max px-0.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex min-h-[56px] min-w-[58px] flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-600 active:scale-95 sm:min-w-0 sm:px-1 sm:text-[11px] ${
                    isActive
                      ? "text-violet-700"
                      : "text-slate-500 hover:text-violet-600"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={tab.label}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-base transition-colors ${
                      isActive ? "bg-violet-100" : ""
                    }`}
                    aria-hidden
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
