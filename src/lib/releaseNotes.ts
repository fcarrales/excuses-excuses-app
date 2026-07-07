export interface ReleaseNote {
  version: string;
  date: string;
  highlights: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "0.9.0-rc",
    date: "Current",
    highlights: [
      "Final beta release candidate",
      "Domain and deployment prep for x-qs.app",
      "Privacy and safety routes",
      "Store listing drafts",
      "PWA install readiness",
      "Backup, export, and import",
      "QA and demo tools",
      "Screenshot mode",
      "No backend or API required",
    ],
  },
  {
    version: "0.8.0-beta",
    date: "Jul 2026",
    highlights: [
      "Environment config for app URL and feedback email",
      "Deployment guide, Android packaging plan, and store listing draft",
      "Privacy and safety policy drafts for external use",
      "Pre-release checklist and /privacy / /safety pages",
      "README and release-candidate prep polish",
    ],
  },
  {
    version: "0.7.0-beta",
    date: "Jul 2026",
    highlights: [
      "Launch landing card and feature highlights for public beta sharing",
      "Screenshot Mode for clean marketing captures with demo data",
      "Beta release notes, share/invite tools, and smoke test checklist",
      "Free vs Future Pro comparison (no payments — ideas only)",
      "Improved metadata for sharing and first-run polish",
    ],
  },
  {
    version: "0.6.0-beta",
    date: "Jul 2026",
    highlights: [
      "Beta tester guide with persistent checklist",
      "QA Mode with localStorage status and counts",
      "Demo data load/clear with stable IDs",
      "Backup import/export status and empty-backup warnings",
      "Production readiness checklist and PNG PWA icons",
    ],
  },
  {
    version: "0.5.0-beta",
    date: "Jul 2026",
    highlights: [
      "PWA manifest, service worker, and install prompt",
      "About, Privacy, Safety, and Feedback sections",
      "Full backup export/import and clear-all data",
      "Message Coach, rewrites, and style presets",
      "Saved people, message packs, and daily message",
    ],
  },
];
