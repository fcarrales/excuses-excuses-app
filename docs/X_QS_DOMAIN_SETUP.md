# x-qs.app Domain Setup — Excuses, Excuses!

Production domain: **https://x-qs.app**

Use this guide after your Vercel deploy works on the preview URL.

---

## Step 1 — Find where you registered the domain

You may have registered **x-qs.app** last year. Common registrars:

- **Squarespace Domains** (formerly Google Domains for some accounts)
- **Namecheap**
- **Cloudflare**
- **GoDaddy**
- **Porkbun**, **Hover**, etc.

### How to find your registrar

1. Search your email for:
   - `x-qs.app`
   - `domain renewal`
   - `Squarespace`
   - `Google Domains`
   - `Namecheap`
   - `Cloudflare`
   - `GoDaddy`
2. Or use a WHOIS lookup (e.g. [who.is](https://who.is)) and note the registrar name
3. Log in to that registrar’s dashboard

---

## Step 2 — Add domain in Vercel

1. Open your project on [vercel.com](https://vercel.com)
2. Go to **Settings → Domains**
3. Click **Add**
4. Enter: `x-qs.app`
5. Optional: also add `www.x-qs.app` if you want www to work
6. Vercel will show **DNS records** to add at your registrar

**Use the exact values Vercel displays** if they differ from the common examples below.

---

## Step 3 — Common DNS records

### Root domain (`x-qs.app`)

Usually an **A record**:

| Type | Name / Host | Value |
|------|-------------|--------|
| A | `@` (or blank) | `76.76.21.21` |

### www subdomain (`www.x-qs.app`)

Usually a **CNAME**:

| Type | Name / Host | Value |
|------|-------------|--------|
| CNAME | `www` | `cname.vercel-dns.com` |

### Notes

- DNS changes can take **5 minutes to 48 hours** (often under 1 hour)
- Remove conflicting old A/CNAME records for the same host
- Cloudflare users: try **DNS only** (grey cloud) first if SSL issues occur

---

## Step 4 — Verify in Vercel

In **Settings → Domains**, wait until:

- `x-qs.app` shows **Valid Configuration**
- SSL certificate is issued (HTTPS)

---

## Step 5 — Update environment variable

In Vercel **Environment Variables**:

```
NEXT_PUBLIC_APP_URL=https://x-qs.app
```

Redeploy so share/invite copy uses the real domain.

---

## Step 6 — Verification checklist

Open in your browser:

- [ ] **https://x-qs.app** — app loads, HTTPS lock icon visible
- [ ] **https://www.x-qs.app** — works (if you configured www)
- [ ] **https://x-qs.app/manifest.webmanifest** — JSON manifest
- [ ] **https://x-qs.app/privacy** — privacy page
- [ ] **https://x-qs.app/safety** — safety page
- [ ] Install as PWA (device/browser dependent)
- [ ] Settings → Share the beta shows `https://x-qs.app`

---

## If the domain expired

Renew at your registrar first, then repeat DNS steps. Until renewal, use the Vercel preview URL for testers.

---

## Related docs

- [VERCEL_RELEASE_CHECKLIST.md](./VERCEL_RELEASE_CHECKLIST.md)
- [BETA_LAUNCH_CHECKLIST.md](./BETA_LAUNCH_CHECKLIST.md)
- [BETA_INVITE_COPY.md](./BETA_INVITE_COPY.md)
