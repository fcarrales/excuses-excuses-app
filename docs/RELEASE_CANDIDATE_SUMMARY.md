# Release Candidate Summary — Excuses, Excuses!

**Handoff document for Build 9 (v0.9.0-rc)**

---

## App identity

| Field | Value |
|-------|--------|
| **App name** | Excuses, Excuses! |
| **Tagline** | Perfect messages for awkward moments |
| **Version** | 0.9.0-rc |
| **Build stage** | Beta release candidate |
| **Branch** | `clean-rebuild-2026` (recommended for Vercel preview/beta) |
| **Domain** | https://x-qs.app |

---

## What it is

A **local message assistant** for awkward social situations, work messages, and school messages. Users pick a situation, choose tone and language, and get three **polished, ready-to-send** text options.

---

## Safety position

- Helps write **respectful, honest communication**
- **Refuses** fake proof, fake documents, fake receipts, doctor notes, screenshots, official records, alibis, and similar requests
- Not for impersonation, fraud, harassment, or illegal use
- Serious matters should be handled honestly and directly

See: `docs/SAFETY_POLICY.md`, `/safety` route, in-app Safety section.

---

## Privacy position

- **No account**, **no backend**, **no ads**, **no tracking** in this beta
- All data stored in **browser localStorage** only
- User-controlled **export/import** backup
- Optional feedback email — user-initiated only

See: `docs/PRIVACY_POLICY_DRAFT.md`, `/privacy` route, in-app Privacy section.

---

## Current features

- Message generator (3 styles per situation)
- English, Spanish, Spanglish
- Saved people, favorites, history
- Message packs and quick modes
- Message Coach and rewrite buttons
- Style presets
- Daily message
- PWA install (manifest + service worker)
- Backup export/import
- QA Mode, demo data, Screenshot Mode
- Beta tester guide, pre-release checklist
- Share/invite copy tools

---

## How to run locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_FEEDBACK_EMAIL
npm run dev
```

Open http://localhost:3000

```bash
npm run lint
npm run build
```

---

## How to deploy

1. Follow **[VERCEL_RELEASE_CHECKLIST.md](./VERCEL_RELEASE_CHECKLIST.md)**
2. Connect domain via **[X_QS_DOMAIN_SETUP.md](./X_QS_DOMAIN_SETUP.md)**
3. Use **[BETA_LAUNCH_CHECKLIST.md](./BETA_LAUNCH_CHECKLIST.md)** before sharing
4. Share using **[BETA_INVITE_COPY.md](./BETA_INVITE_COPY.md)**

---

## Known limitations

| Limitation | Notes |
|------------|--------|
| No cloud sync | Data is per-browser only |
| No login | No accounts in this beta |
| No AI | Template-based messages only |
| Local storage only | Clearing browser data loses content unless exported |
| Install prompt varies | Depends on browser/device; iOS uses Add to Home Screen |
| No payments | Free vs Future Pro is ideas only |
| No Android app yet | PWA first; Capacitor planned after beta feedback |

---

## Recommended next steps after Build 9

1. **Deploy to Vercel** with env vars set
2. **Connect x-qs.app** at registrar + Vercel Domains
3. **Share beta with 3–5 testers** using invite copy
4. **Collect feedback** and fix critical bugs
5. **Then decide** Android packaging ([ANDROID_PACKAGING_PLAN.md](./ANDROID_PACKAGING_PLAN.md))

Do **not** install Capacitor until beta feedback is positive and domain is stable.

---

## Key file locations

| Area | Path |
|------|------|
| App config | `src/lib/appInfo.ts`, `src/lib/env.ts` |
| Health check | `src/lib/appHealth.ts` |
| Safety blocks | `src/lib/safety.ts` |
| Storage | `src/lib/storage.ts` |
| Deploy docs | `docs/VERCEL_RELEASE_CHECKLIST.md` |
| Domain docs | `docs/X_QS_DOMAIN_SETUP.md` |
| Store draft | `docs/STORE_LISTING_DRAFT.md` |

---

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · localStorage only

---

*Build 9 complete — ready for Vercel deploy and beta launch.*
