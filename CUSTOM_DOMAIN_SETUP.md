# 🌐 Custom Domain Setup Guide: xqs.app

## 🎯 **Step 1: Register xqs.app Domain**

### **Recommended Registrars for .app domains:**
1. **Google Domains** - Best for .app (Google manages .app TLD)
   - Go to: https://domains.google.com
   - Search: `xqs.app`
   - Price: ~$12-20/year

2. **Namecheap** - Popular alternative
   - Go to: https://www.namecheap.com
   - Search: `xqs.app` 
   - Price: ~$15-25/year

3. **Cloudflare** - Great for developers
   - Go to: https://www.cloudflare.com/products/registrar/
   - At-cost pricing (no markup)

---

## 🚀 **Step 2: Configure Domain in Vercel**

### **Add Domain to Vercel Project:**
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `excuses-excuses-app` project
3. Go to **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter: `xqs.app`
6. Click **"Add"**

### **Vercel will provide DNS records:**
- **A Record**: `76.76.19.61` (or similar IP)
- **AAAA Record**: `2600:1f18:...` (IPv6)
- **CNAME**: For www subdomain (optional)

---

## 🔧 **Step 3: Configure DNS at Your Registrar**

### **At your domain registrar (Google Domains, etc.):**
1. Go to **DNS Settings** or **DNS Management**
2. Add these records (Vercel will show exact values):

```
Type: A
Name: @ (or root/blank)
Value: 76.76.19.61 (use exact IP from Vercel)
TTL: 300

Type: AAAA  
Name: @ (or root/blank)
Value: [IPv6 from Vercel]
TTL: 300

Type: CNAME (optional)
Name: www
Value: xqs.app
TTL: 300
```

---

## ⚡ **Step 4: Update GitHub Actions for New Domain**

### **Modify deployment workflow:**
Update `.github/workflows/deploy.yml` to use new domain in alias command:

```yaml
- name: Update Alias to Latest Deployment
  run: vercel alias --token=${{ secrets.VERCEL_TOKEN }} xqs.app
```

---

## 🔒 **Step 5: SSL Certificate (Automatic)**

Vercel automatically provides SSL certificates for custom domains:
- ✅ **HTTPS enforced** (required for .app domains)
- ✅ **Auto-renewal**
- ✅ **CDN optimization**

---

## ✅ **Step 6: Verify Setup**

### **Test your domain:**
1. Wait 10-60 minutes for DNS propagation
2. Visit: `https://xqs.app`
3. Should redirect to your app automatically
4. Check SSL certificate (green lock in browser)

### **Troubleshooting:**
- DNS changes can take up to 48 hours
- Use `nslookup xqs.app` to check DNS propagation
- Vercel will show verification status in dashboard

---

## 🎯 **Final Result:**

Once complete, you'll have:
- ✅ **Primary URL:** `https://xqs.app`
- ✅ **Auto-deployments** update the domain
- ✅ **SSL/HTTPS** automatically configured
- ✅ **CDN** for global fast loading
- ✅ **Professional domain** for your app

---

## 💡 **Pro Tips:**

1. **Enable www redirect** - So `www.xqs.app` → `xqs.app`
2. **Set up monitoring** - Check domain uptime
3. **Update social links** - Use new domain everywhere
4. **SEO redirect** - Set up 301 redirects from old Vercel URLs

**Your excuse generator will be live at a professional, memorable domain!** 🚀