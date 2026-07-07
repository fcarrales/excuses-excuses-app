# Excuses, Excuses!

**Tagline:** Perfect messages for awkward moments  
**Version:** 0.9.0-rc  
**Stage:** Beta release candidate  
**Domain:** https://x-qs.app

A local, privacy-first message assistant that helps you write respectful, ready-to-send texts for awkward social situations, work messages, and school messages.

## What it does

- Generates three polished message options per situation
- Supports English, Spanish, and Spanglish
- Saved people, favorites, history, and style presets
- Message Coach with clarity and tone tips
- Message packs and rewrite buttons
- PWA install — add to home screen
- Backup export/import — all data stays on your device

## What it does not do

- No OpenAI or external AI APIs
- No authentication, payments, ads, or backend
- No fake proof, fake documents, fake receipts, or doctor notes
- No location tracking, weather, or traffic APIs

Risky requests (e.g. fake doctor note, alibi, official document) are **blocked** by safety guardrails.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- localStorage only — no database

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — set app URL and feedback email
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |

## Environment variables

Copy `.env.example` to `.env.local` (do not commit `.env.local`):

```env
NEXT_PUBLIC_APP_URL=https://x-qs.app
NEXT_PUBLIC_FEEDBACK_EMAIL=feedback@yourdomain.com
```

- If `NEXT_PUBLIC_APP_URL` is missing, share copy uses `[add app link here]`
- If `NEXT_PUBLIC_FEEDBACK_EMAIL` is missing, defaults to `feedback@excuses-excuses.app`

Config helper: `src/lib/env.ts`

## localStorage note

All user data (history, favorites, people, presets, settings) is stored in **this browser only**. Clearing site data or switching browsers will delete it unless you **Export backup** from Settings.

## Deployment

See **[docs/VERCEL_RELEASE_CHECKLIST.md](docs/VERCEL_RELEASE_CHECKLIST.md)** for Vercel deploy steps.

See **[docs/X_QS_DOMAIN_SETUP.md](docs/X_QS_DOMAIN_SETUP.md)** for connecting **https://x-qs.app**.

See **[docs/BETA_LAUNCH_CHECKLIST.md](docs/BETA_LAUNCH_CHECKLIST.md)** before sharing with testers.

See **[docs/RELEASE_CANDIDATE_SUMMARY.md](docs/RELEASE_CANDIDATE_SUMMARY.md)** for the full handoff summary.

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for general deployment notes.

## Android / Play Store (future)

See **[docs/ANDROID_PACKAGING_PLAN.md](docs/ANDROID_PACKAGING_PLAN.md)** — planning only; Capacitor not installed yet.

## Store and legal drafts

- [Store listing draft](docs/STORE_LISTING_DRAFT.md)
- [Privacy policy draft](docs/PRIVACY_POLICY_DRAFT.md)
- [Safety policy](docs/SAFETY_POLICY.md)

In-app pages: `/privacy` and `/safety`

## Project structure (high level)

```
src/
  app/           # Next.js routes (/, /privacy, /safety)
  components/    # UI panels and cards
  lib/           # Templates, storage, safety, env config
docs/            # Deployment and store prep
public/          # PWA icons, service worker
```

## License

Private beta — all rights reserved unless otherwise specified.
