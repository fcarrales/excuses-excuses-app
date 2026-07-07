"use client";

import type { ReactNode } from "react";
import type { Tab } from "@/types";

interface AppShellProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: ReactNode;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "generator", label: "Generator", icon: "✨" },
  { id: "favorites", label: "Favorites", icon: "⭐" },
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
      <header className="sticky top-0 z-10 border-b border-white/20 bg-white/70 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-lg">
          <h1 className="text-xl font-bold tracking-tight text-violet-900">
            Excuses, Excuses!
          </h1>
          <p className="text-sm text-violet-600/80">
            Perfect messages for awkward moments
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 pb-28">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-white/20 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-violet-700"
                    : "text-slate-500 hover:text-violet-600"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-lg" aria-hidden>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
