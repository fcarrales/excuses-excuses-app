export interface ReleaseNote {
  version: string;
  date: string;
  highlights: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "0.7.0-beta",
    date: "Current",
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
