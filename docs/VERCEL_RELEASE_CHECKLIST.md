# Vercel Release Checklist — Excuses, Excuses!

Beginner-friendly steps to deploy the beta to Vercel before connecting **https://x-qs.app**.

## Before you start

- [ ] `npm run lint` passes locally
- [ ] `npm run build` passes locally
- [ ] Code is pushed to GitHub
- [ ] You have a Vercel account (free tier is fine)

## 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New… → Project**
3. Import your GitHub repository (`excuses-excuses-app`)
4. If asked for a branch, use **`clean-rebuild-2026`** for preview/beta (or your main release branch)

## 2. Framework settings

Vercel should auto-detect **Next.js**. Keep defaults:

| Setting | Value |
|---------|--------|
| Framework | Next.js |
| Build Command | `npm run build` |
| Output | (default) |
| Install Command | `npm install` |

## 3. Environment variables

In **Project → Settings → Environment Variables**, add for **Production** and **Preview**:

| Name | Value | Notes |
|------|--------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://x-qs.app` | Use preview URL until domain is live |
| `NEXT_PUBLIC_FEEDBACK_EMAIL` | your chosen feedback email | e.g. your Gmail |

**Do not** add API keys or secrets — this app has no backend.

> Until `x-qs.app` is connected, you can temporarily set `NEXT_PUBLIC_APP_URL` to your Vercel preview URL (e.g. `https://excuses-excuses.vercel.app`).

## 4. Deploy

1. Click **Deploy**
2. Wait for the build to finish
3. Open **Build Logs** — confirm no errors

## 5. Test the preview URL

Visit your `*.vercel.app` URL and check:

- [ ] Home / generator loads
- [ ] Generate a message works
- [ ] **`/privacy`** loads
- [ ] **`/safety`** loads
- [ ] **`/manifest.webmanifest`** returns JSON
- [ ] Settings → Share the beta shows your URL (not `[add app link here]`)
- [ ] Safety block: type **fake doctor note** in details → blocked
- [ ] Export backup downloads a JSON file
- [ ] PWA install (Chrome: install icon, or iOS: Share → Add to Home Screen)

## 6. Connect production domain

After preview looks good, follow **[X_QS_DOMAIN_SETUP.md](./X_QS_DOMAIN_SETUP.md)** to point **x-qs.app** to Vercel.

Then:

1. Update `NEXT_PUBLIC_APP_URL` to `https://x-qs.app` if you used a preview URL earlier
2. Redeploy
3. Visit **https://x-qs.app** and repeat the tests above

## 7. Pre-launch in the app

Open **Settings → About → Pre-release checklist** and work through all items.

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Build fails on Vercel | Compare with local `npm run build`; check Node version |
| Share text shows placeholder | Set `NEXT_PUBLIC_APP_URL` and redeploy |
| PWA won’t install | Must be HTTPS; try Chrome on Android or Safari on iOS |
| 404 on /privacy | Redeploy; confirm latest build includes those routes |

## Related docs

- [X_QS_DOMAIN_SETUP.md](./X_QS_DOMAIN_SETUP.md)
- [BETA_LAUNCH_CHECKLIST.md](./BETA_LAUNCH_CHECKLIST.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [RELEASE_CANDIDATE_SUMMARY.md](./RELEASE_CANDIDATE_SUMMARY.md)
