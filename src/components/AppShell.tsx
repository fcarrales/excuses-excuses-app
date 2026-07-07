"use client";

import type { ReactNode } from "react";
import type { Tab } from "@/types";

interface AppShellProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
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
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/80 px-4 py-4 backdrop-blur-lg">
        <div className="mx-auto max-w-md sm:max-w-lg">
          <h1 className="text-xl font-bold tracking-tight text-violet-900">
            Excuses, Excuses!
          </h1>
          <p className="text-sm text-violet-600/90">
            Perfect messages for awkward moments
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-5 pb-28 sm:max-w-lg sm:py-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-white/40 bg-white/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-lg">
        <div className="mx-auto max-w-md overflow-x-auto sm:max-w-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex min-h-[56px] min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-semibold transition-colors active:scale-95 sm:min-w-0 sm:text-[11px] ${
                    isActive
                      ? "text-violet-700"
                      : "text-slate-500 hover:text-violet-600"
                  }`}
                  aria-current={isActive ? "page" : undefined}
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
