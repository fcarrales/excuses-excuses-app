import Link from "next/link";
import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE, APP_VERSION } from "@/lib/appInfo";

interface LegalPageShellProps {
  title: string;
  children: ReactNode;
}

export default function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="min-h-full">
      <header className="border-b border-white/30 bg-white/85 px-4 py-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Link
            href="/"
            className="text-sm font-semibold text-violet-600 hover:text-violet-800"
          >
            ← Back to {APP_NAME}
          </Link>
          <p className="mt-2 text-xs text-slate-500">
            {APP_TAGLINE} · v{APP_VERSION}
          </p>
          <h1 className="mt-1 text-xl font-bold text-violet-900">{title}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
    </div>
  );
}
