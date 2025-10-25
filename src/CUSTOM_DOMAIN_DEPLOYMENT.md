# 🌐 DEPLOYING FNG APP TO YOUR CUSTOM DOMAIN

## ❌ CAN YOU DEPLOY FROM FIGMA MAKE?

**NO** - You cannot deploy directly from Figma Make to your custom domain.

**Figma Make is a development/prototyping tool, NOT a hosting platform.**

---

## ✅ HOW TO USE YOUR CUSTOM DOMAIN (3 Steps)

### STEP 1: Get Your Code Ready

You need to have your code on your computer. You likely already have it, but if not:

```bash
# Copy all your files from Figma Make to your computer
# Make sure you have all these files:
# - App.tsx
# - components/ folder
# - public/ folder
# - package.json
# - vite.config.ts
# etc.
```

### STEP 2: Choose a Hosting Platform

Pick ONE of these platforms to host your app:

#### 🟢 **Option A: Netlify** (EASIEST - RECOMMENDED)
- **FREE** custom domain support
- **FREE** HTTPS certificate
- **Automatic** deployments
- **Best for beginners**

#### 🔵 **Option B: Vercel**
- **FREE** custom domain support
- **FREE** HTTPS certificate
- **Very fast** deployments
- **Great for React apps**

#### 🟠 **Option C: Your Own Hosting** (cPanel, etc.)
- If you already bought hosting with your domain
- More complex setup
- You manage everything

---

## 🚀 STEP 3: DEPLOY + CONNECT DOMAIN

### If Using NETLIFY (Recommended):

#### A. Deploy Your App
```bash
# On your computer, in your project folder:

# 1. Install dependencies
npm install

# 2. Build your app
npm run build

# 3. Install Netlify CLI
npm install -g netlify-cli

# 4. Login to Netlify
netlify login

# 5. Deploy
netlify deploy --prod --dir=dist
```

#### B. Connect Your Custom Domain

1. **After deployment**, go to your Netlify dashboard
2. Click on your site
3. Go to **"Domain settings"**
4. Click **"Add custom domain"**
5. Enter your domain (e.g., `www.fngloans.com`)
6. Netlify will give you **DNS settings**

#### C. Update Your Domain DNS

Go to where you bought your domain (e.g., Namecheap, GoDaddy, Whogohost):

1. Find **DNS Settings** or **Nameservers**
2. Add the **DNS records** Netlify gave you:
   - Usually an **A Record** pointing to Netlify's IP
   - Or change **Nameservers** to Netlify's nameservers
3. **Save** and wait 24-48 hours for DNS propagation

**DONE!** Your app will be live at `www.yourdomainname.com`

---

### If Using VERCEL:

#### A. Deploy Your App
```bash
# On your computer, in your project folder:

# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

#### B. Connect Your Custom Domain

1. In the Vercel deployment output, click the **dashboard link**
2. Go to **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain (e.g., `www.fngloans.com`)
5. Vercel will give you **DNS settings**

#### C. Update Your Domain DNS

Same process as Netlify - add the DNS records Vercel gives you to your domain registrar.

---

### If Using YOUR OWN HOSTING (cPanel):

#### A. Build Your App Locally
```bash
# On your computer:
npm install
npm run build
```

This creates a `dist` folder.

#### B. Upload to Your Hosting

1. Login to your **cPanel** or **FTP**
2. Go to **public_html** or **www** folder
3. **Upload ALL files** from the `dist` folder
4. Make sure `.htaccess` is configured for SPA routing

#### C. Create .htaccess File

In your hosting's root directory, create/edit `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Your domain is already connected** since you're using your own hosting!

---

## 📱 FOR PLAY STORE (After Domain Deployment)

Once your app is live on your custom domain:

```bash
# Install Bubblewrap (Google's PWA packager)
npm install -g @bubblewrap/cli

# Create Android app
bubblewrap init --manifest https://www.yourdomainname.com/manifest.json

# Build APK
bubblewrap build

# Upload the APK to Google Play Store
```

---

## ⚡ QUICK SUMMARY

| Step | Action |
|------|--------|
| 1 | Get code on your computer |
| 2 | Choose hosting: Netlify/Vercel/Own |
| 3 | Build: `npm run build` |
| 4 | Deploy to hosting platform |
| 5 | Connect domain in platform settings |
| 6 | Update DNS at domain registrar |
| 7 | Wait 24-48 hours for DNS |
| 8 | ✅ Live on custom domain! |

---

## ❓ COMMON QUESTIONS

**Q: How much does it cost?**
- Netlify/Vercel: **FREE** (includes HTTPS)
- Custom domain: **$10-15/year** (you buy this separately)
- Total: **~$15/year**

**Q: How long does deployment take?**
- Building app: **2-5 minutes**
- Deploying: **1-2 minutes**
- DNS propagation: **2-48 hours**

**Q: Do I need to code anything?**
- **NO!** Just run the commands above
- The app is already built and ready

**Q: Can I test before buying a domain?**
- **YES!** Netlify/Vercel give you a **free subdomain**:
  - `yourapp.netlify.app`
  - `yourapp.vercel.app`
- Test with this first, add custom domain later

**Q: What if I already have a domain?**
- **Perfect!** Just follow Step 3C to connect it
- No need to buy a new one

---

## 🆘 NEED HELP?

**Tell me:**
1. Do you already have a domain? (e.g., fngloans.com)
2. Which hosting do you prefer? (Netlify/Vercel/Your own)
3. Are you comfortable running commands on your computer?

**I'll give you exact step-by-step instructions for YOUR situation!**

---

## 🎯 NEXT STEPS

1. ✅ Fix the `_redirects` bug (DONE - just completed)
2. Choose your hosting platform
3. Buy a domain if you don't have one
4. Follow the deployment steps above
5. Your app goes LIVE! 🎉

**Your app is production-ready. Just need to deploy it!**
