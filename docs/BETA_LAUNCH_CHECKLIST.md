# Beta Launch Checklist — Excuses, Excuses!

Use this before and after sharing the beta at **https://x-qs.app** (or your Vercel preview URL until the domain is live).

---

## Before sharing

### Build and deploy

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Latest code pushed to GitHub
- [ ] Vercel deployed successfully
- [ ] `NEXT_PUBLIC_APP_URL` set (preview or `https://x-qs.app`)
- [ ] `NEXT_PUBLIC_FEEDBACK_EMAIL` set
- [ ] Domain **x-qs.app** connected (or using preview URL temporarily)

### App checks

- [ ] **/privacy** page works
- [ ] **/safety** page works
- [ ] **/manifest.webmanifest** works
- [ ] PWA install tested (if browser supports it)
- [ ] Export backup works
- [ ] Import backup works
- [ ] Safety block works (fake doctor note, alibi, etc.)
- [ ] Mobile **390px** layout checked
- [ ] Screenshot Mode checked (optional, for marketing)
- [ ] Demo data load/clear checked (optional)

### In-app checklist

Complete **Settings → About → Pre-release checklist**.

---

## Tester tasks (send to each beta tester)

Ask each person to try:

1. Generate a message (English)
2. Try **Spanish**
3. Try **Spanglish**
4. Save a **favorite**
5. Add a **saved person**
6. Try a **message pack**
7. Open **Message Coach** on a result
8. Try **rewrite** buttons (shorter, nicer, etc.)
9. **Export** a backup
10. Send **feedback** if something breaks

Copy/paste invite text from **[BETA_INVITE_COPY.md](./BETA_INVITE_COPY.md)**.

---

## Post-launch

- [ ] Collect feedback (email or notes)
- [ ] Log bugs and UX issues
- [ ] Fix critical bugs and redeploy
- [ ] Update release notes for next version
- [ ] After stable beta feedback → consider **[Android packaging plan](./ANDROID_PACKAGING_PLAN.md)** (future)

---

## Quick links

| Doc | Purpose |
|-----|---------|
| [VERCEL_RELEASE_CHECKLIST.md](./VERCEL_RELEASE_CHECKLIST.md) | Deploy steps |
| [X_QS_DOMAIN_SETUP.md](./X_QS_DOMAIN_SETUP.md) | Domain DNS |
| [BETA_INVITE_COPY.md](./BETA_INVITE_COPY.md) | Share text |
| [SCREENSHOT_CAPTIONS.md](./SCREENSHOT_CAPTIONS.md) | Store screenshots |
