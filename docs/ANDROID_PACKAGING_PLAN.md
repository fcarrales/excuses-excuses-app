# Android Packaging Plan — Excuses, Excuses!

**Status:** Planning only. Capacitor and Android Studio are **not** set up in this build.

This document describes the recommended path from PWA → Play Store internal testing.

## Strategy overview

| Phase | What | When |
|-------|------|------|
| 1 | PWA on the web | **Now** — deploy to Vercel, share link |
| 2 | Capacitor wrapper | Later — wrap the built web app |
| 3 | Android Studio | Later — build signed APK/AAB |
| 4 | Google Play internal testing | Later — small tester group |

## App identity (planned)

| Field | Value |
|-------|--------|
| Package name | `com.excusesexcuses.app` |
| Display name | Excuses, Excuses! |
| Short name | Excuses |

## Prerequisites checklist (do before Capacitor)

- [ ] PWA works on HTTPS deploy (install, offline shell, icons)
- [ ] App icons present (`icon-192.png`, `icon-512.png`, `maskable-icon-512.png`)
- [ ] Privacy text finalized (`docs/PRIVACY_POLICY_DRAFT.md`)
- [ ] Safety policy finalized (`docs/SAFETY_POLICY.md`)
- [ ] No fake-proof features — safety blocks confirmed
- [ ] `npm run lint` and `npm run build` pass
- [ ] Store listing draft reviewed (`docs/STORE_LISTING_DRAFT.md`)

## Future steps (not done yet)

### Step 1 — Confirm PWA baseline

Deploy to Vercel. Test install on Android Chrome and iOS Safari.

### Step 2 — Add Capacitor (future build)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Excuses, Excuses!" com.excusesexcuses.app
```

Configure `webDir` to point at Next.js static export **or** use a hosted URL in the WebView (team decision needed).

> **Note:** Next.js App Router apps often use `output: 'export'` for static hosting inside Capacitor, or load the live Vercel URL. Decide before implementing.

### Step 3 — Build Android project

```bash
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

### Step 4 — Android Studio

- Open the `android/` folder
- Set min SDK (recommend API 24+)
- Test on emulator and physical device
- Create signed release build (keystore) when ready

### Step 5 — Google Play internal testing

- Create Play Console app
- Upload AAB to **Internal testing** track
- Add tester emails
- Link privacy policy URL (host `PRIVACY_POLICY_DRAFT` on your site)

## What we are NOT doing in this beta

- No Capacitor install yet
- No Android project folder
- No Google Play account setup
- No in-app payments or subscriptions

## Safety reminder for store review

Google Play will ask about app purpose. Emphasize:

- Message assistant for awkward social situations
- Template-based, respectful communication help
- **Does not** generate fake proof, documents, or official records
- Local-first, no account required in beta

## Related docs

- [Deployment guide](./DEPLOYMENT.md)
- [Store listing draft](./STORE_LISTING_DRAFT.md)
- [Privacy policy draft](./PRIVACY_POLICY_DRAFT.md)
- [Safety policy](./SAFETY_POLICY.md)
