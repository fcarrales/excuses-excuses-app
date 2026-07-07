# Deployment Guide — Excuses, Excuses!

Beginner-friendly steps to run, test, and deploy the beta locally and on Vercel.

## What you need

- [Node.js](https://nodejs.org/) 20 or newer
- npm (comes with Node)
- A GitHub account (for Vercel deploy)
- Optional: a custom domain later

## 1. Install dependencies

From the project folder:

```bash
npm install
```

## 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3. Environment variables (optional but recommended for deploy)

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local` (never commit this file):

```env
NEXT_PUBLIC_APP_URL=https://your-app-url-here.com
NEXT_PUBLIC_FEEDBACK_EMAIL=feedback@yourdomain.com
```

- **NEXT_PUBLIC_APP_URL** — your live site URL (used in share/invite copy)
- **NEXT_PUBLIC_FEEDBACK_EMAIL** — where testers send feedback (defaults to `feedback@excuses-excuses.app` if unset)

Only `NEXT_PUBLIC_*` variables are used. Do not put secrets in env files for this app.

## 4. Run lint and build (before every deploy)

```bash
npm run lint
npm run build
```

Both should pass with no errors.

Start production server locally to double-check:

```bash
npm start
```

## 5. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — use default settings
4. In **Project → Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL (e.g. `https://excuses-excuses.vercel.app`)
   - `NEXT_PUBLIC_FEEDBACK_EMAIL` = your feedback email
5. Redeploy after adding env vars

## 6. Test PWA install

After deploy:

1. Open the live URL in Chrome (desktop or Android) or Safari (iOS)
2. **Desktop Chrome/Edge:** look for the install icon in the address bar
3. **iPhone:** Safari → Share → **Add to Home Screen**
4. Confirm the app opens standalone and icons look correct

## 7. Check manifest

In Chrome DevTools → **Application** → **Manifest**:

- Name: Excuses, Excuses!
- Icons: 192px, 512px, maskable
- Theme color: `#7c3aed`

Or visit `/manifest.webmanifest` on your deploy.

## 8. Check privacy and safety

In the app: **Settings → Privacy** and **Settings → Safety**

Or open directly:

- `/privacy`
- `/safety`

Full drafts for store/external use are in `docs/PRIVACY_POLICY_DRAFT.md` and `docs/SAFETY_POLICY.md`.

## 9. Smoke test before sharing

Use **Settings → About → Pre-release checklist** and **Settings → Beta tester guide → Beta smoke test**.

Minimum manual checks:

- [ ] Generate a message (English, Spanish, Spanglish)
- [ ] Copy and share a message
- [ ] Save a favorite
- [ ] Export and import backup
- [ ] Type “fake doctor note” in details — should be **blocked**
- [ ] Test layout at 390px width (phone)
- [ ] Copy beta invite text — URL should show your real deploy URL

## 10. Share the beta

**Settings → Share the beta** — copy invite text and send to testers.

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Share text shows `[add app link here]` | Set `NEXT_PUBLIC_APP_URL` and redeploy |
| PWA won’t install | Use HTTPS; try Chrome; on iOS use Add to Home Screen |
| Data disappeared | localStorage is per-browser — use Export backup |
| Build fails | Run `npm run lint` and fix errors first |

## Related docs

- [Android packaging plan](./ANDROID_PACKAGING_PLAN.md)
- [Store listing draft](./STORE_LISTING_DRAFT.md)
- [Privacy policy draft](./PRIVACY_POLICY_DRAFT.md)
- [Safety policy](./SAFETY_POLICY.md)
