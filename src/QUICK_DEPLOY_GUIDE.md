# 🚀 FNG App - Quick Deployment Guide

## 5-Minute Deployment to Production

### ✅ Prerequisites
- [ ] GitHub account
- [ ] App code pushed to GitHub repository
- [ ] Domain name (optional, but recommended)

---

## 🎯 Option 1: Deploy to Netlify (Recommended)

### Why Netlify?
- ✅ Free SSL certificate
- ✅ Automatic deployments from GitHub
- ✅ Global CDN
- ✅ Built-in PWA support
- ✅ Easy rollbacks
- ✅ Generous free tier

### Steps:

**1. Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - FNG App"
git branch -M main
git remote add origin https://github.com/yourusername/fng-app.git
git push -u origin main
```

**2. Deploy to Netlify**

**Via Netlify Dashboard:**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize
4. Select your FNG repository
5. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. Click "Deploy site"
7. Wait 2-3 minutes for deployment ✅

**Via Netlify CLI (Alternative):**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow prompts and deploy
netlify deploy --prod
```

**3. Configure Custom Domain (Optional)**
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records (provided by Netlify)
4. Wait for DNS propagation (5-30 minutes)

**4. Configure Redirects for SPA**
Already configured in `/public/_redirects`:
```
/* /index.html 200
```

**5. Enable HTTPS**
Automatically enabled by Netlify ✅

**6. Test Your Deployment**
```
�� Open: https://your-site-name.netlify.app
✅ Test login flow
✅ Test admin access: https://your-site-name.netlify.app/#/admin
✅ Install PWA on mobile device
✅ Test offline functionality
```

---

## 🎯 Option 2: Deploy to Vercel

### Why Vercel?
- ✅ Free SSL certificate
- ✅ Fastest global CDN
- ✅ Automatic HTTPS
- ✅ Zero-config deployment
- ✅ Great analytics

### Steps:

**1. Push Code to GitHub** (same as above)

**2. Deploy to Vercel**

**Via Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. Click "Deploy"
6. Wait 2-3 minutes ✅

**Via Vercel CLI (Alternative):**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**3. Configure Custom Domain**
1. Go to Project settings → Domains
2. Add your domain
3. Update DNS records
4. Automatic SSL enabled

**4. Configure Rewrites**
Create `vercel.json` in root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**5. Test Deployment**
```
✅ Open: https://your-project.vercel.app
✅ Test all functionality
✅ Test admin portal
✅ Test PWA features
```

---

## 🎯 Option 3: Deploy to Render

### Why Render?
- ✅ Free static site hosting
- ✅ Automatic SSL
- ✅ GitHub integration
- ✅ Custom domains
- ✅ DDoS protection

### Steps:

1. Go to https://render.com
2. Sign up and connect GitHub
3. Click "New" → "Static Site"
4. Select your repository
5. Configure:
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```
6. Click "Create Static Site"
7. Wait for deployment

---

## 🎯 Option 4: Traditional Hosting (cPanel)

### For Shared Hosting:

**1. Build the App Locally**
```bash
npm install
npm run build
```

**2. Upload Files**
- Upload contents of `dist` folder to `public_html`
- Include `.htaccess` file for routing

**3. Create `.htaccess`** (if not included)
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

**4. Configure SSL**
- Use cPanel SSL/TLS
- Enable "Force HTTPS Redirect"

---

## ⚙️ Post-Deployment Configuration

### 1. Test Admin Access

**URLs to test:**
```
https://yourdomain.com/#/admin
https://yourdomain.com/?admin=true
```

**Default Admin Credentials:**
```
Email: admin@fng.com
Password: Admin123!@#
```

**🚨 IMPORTANT:** Change default admin password immediately!

### 2. Create Additional Admin Users

1. Login as super admin
2. Go to Company Settings
3. Add new admins with appropriate roles:
   - Super Admin (full access)
   - Manager (most features)
   - Approver (approvals only)
   - Viewer (read-only)

### 3. Configure Payment Gateways (Optional)

**For Production Payments:**

**Paystack:**
1. Sign up at https://paystack.com
2. Get your public key
3. Add to environment variables:
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   ```
4. Redeploy app

**OPay:**
1. Contact OPay for merchant account
2. Get credentials
3. Add to environment variables:
   ```
   VITE_OPAY_MERCHANT_ID=xxxxx
   VITE_OPAY_PUBLIC_KEY=xxxxx
   ```
4. Redeploy app

**Current:** App works in simulation mode without API keys ✅

### 4. Enable SMS Verification (Optional)

**For Production SMS:**

**Option A - Termii (Nigeria):**
```bash
# Add to environment variables
VITE_SMS_PROVIDER=termii
VITE_TERMII_API_KEY=your_api_key
VITE_TERMII_SENDER_ID=FNG
```

**Option B - Twilio (Global):**
```bash
VITE_SMS_PROVIDER=twilio
VITE_TWILIO_ACCOUNT_SID=xxxxx
VITE_TWILIO_AUTH_TOKEN=xxxxx
VITE_TWILIO_PHONE_NUMBER=+1234567890
```

**Current:** SMS verification simulated (auto-generates codes) ✅

---

## 🧪 Testing Your Deployment

### Automated Testing
```bash
# Install Playwright
npm install -g playwright

# Run tests
npx playwright test
```

### Manual Testing Checklist

**User Flow:**
- [ ] Open homepage
- [ ] Sign up with phone number
- [ ] Complete SMS verification (simulated)
- [ ] Fill KYC form
- [ ] Make a contribution
- [ ] Apply for a loan
- [ ] Make a payment (simulation mode)
- [ ] View transaction history
- [ ] Test offline mode
- [ ] Install PWA on mobile

**Admin Flow:**
- [ ] Access admin URL
- [ ] Login with admin credentials
- [ ] View dashboard metrics
- [ ] Approve a loan
- [ ] Approve KYC
- [ ] View revenue analytics
- [ ] Generate reports
- [ ] Manage customer data
- [ ] Test all admin features

**Technical:**
- [ ] Check HTTPS works
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Check console for errors
- [ ] Verify service worker registers
- [ ] Test responsive design

---

## 📊 Monitoring Your Deployment

### Free Monitoring Tools

**1. Uptime Monitoring:**
```
Sign up: https://uptimerobot.com
Add monitor for: https://yourdomain.com
Set alert email
```

**2. Error Tracking:**
```
Sign up: https://sentry.io
Install: npm install @sentry/react
Configure in src/main.tsx
```

**3. Analytics:**
```
Sign up: https://analytics.google.com
Add tracking code to index.html
Track user behavior
```

### What to Monitor:

**Critical Metrics:**
- ✅ Site uptime (target: 99.9%)
- ✅ Page load time (target: < 3 seconds)
- ✅ Error rate (target: < 1%)
- ✅ Payment success rate (target: > 95%)

**Business Metrics:**
- ✅ User registrations per day
- ✅ Loan applications per day
- ✅ Average loan amount
- ✅ Contribution frequency
- ✅ Customer support requests

---

## 🔒 Security Hardening

### Immediate Steps:

**1. Change Default Passwords**
```javascript
// Update in Login.tsx and AdminLogin.tsx
// Remove or change default demo accounts
```

**2. Configure Security Headers**

**For Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.paystack.co https://webpay.opayweb.com; style-src 'self' 'unsafe-inline';"
```

**For Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**3. Enable Rate Limiting**
- Use Cloudflare (free tier)
- Configure rate limiting rules
- Protect login endpoints

**4. Regular Security Audits**
```bash
# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

---

## 🚨 Common Issues & Solutions

### Issue 1: 404 on Refresh
**Problem:** Page refreshes return 404
**Solution:** Ensure redirects are configured (see above)

### Issue 2: Admin Page Not Loading
**Problem:** Can't access /#/admin
**Solution:** 
- Clear browser cache
- Try ?admin=true parameter
- Check console for errors

### Issue 3: PWA Not Installing
**Problem:** No install prompt on mobile
**Solution:**
- Verify HTTPS is enabled
- Check manifest.json is accessible
- Test on Chrome Android first
- iOS requires Safari browser

### Issue 4: Payment Gateway Errors
**Problem:** "Library not loaded" errors
**Solution:**
- App works in simulation mode
- Add production API keys when ready
- Test with small amounts first

### Issue 5: Slow Performance
**Problem:** App loads slowly
**Solution:**
```bash
# Analyze bundle
npm run build
# Optimize images
# Enable CDN caching
# Use lazy loading
```

---

## 📱 Mobile App Conversion (Optional)

### Convert to Android App (Play Store)

**Using Trusted Web Activity (TWA):**
1. Follow guide: `/DEPLOYMENT_TO_PLAY_STORE.md`
2. Use Bubblewrap or PWA Builder
3. Generate APK/AAB
4. Submit to Play Store

**Estimated Time:** 2-3 hours

**Cost:** $25 one-time Google Play registration

### Convert to iOS App (App Store)

**Note:** More complex, requires:
- Apple Developer Account ($99/year)
- Xcode and Mac computer
- React Native or Capacitor wrapper

**Alternative:** PWA installation on iOS works well!

---

## 🎉 You're Live!

### After Successful Deployment:

**1. Share Your App**
```
🔗 Website: https://yourdomain.com
📱 PWA: Add to home screen
👨‍💼 Admin: https://yourdomain.com/#/admin
```

**2. Create User Accounts**
- Test with real users
- Gather feedback
- Monitor usage

**3. Marketing**
- Share on social media
- Create demo video
- Write blog post
- Submit to directories

**4. Iterate**
- Monitor metrics
- Fix bugs quickly
- Add requested features
- Improve based on feedback

---

## 📞 Need Help?

### Resources:
- 📖 Full Checklist: `/DEPLOYMENT_CHECKLIST.md`
- 💳 Payment Setup: `/PAYMENT_SETUP_GUIDE.md`
- 📱 Phone Verification: `/PHONE_VERIFICATION_GUIDE.md`
- 🎮 Play Store: `/DEPLOYMENT_TO_PLAY_STORE.md`
- 📊 Admin Guide: `/ADMIN_FEATURES_SUMMARY.md`

### Platform Support:
- **Netlify:** https://docs.netlify.com
- **Vercel:** https://vercel.com/docs
- **Render:** https://render.com/docs

---

## ✅ Deployment Checklist Summary

Before going live, verify:
- [x] ✅ Code is error-free and tested
- [x] ✅ PWA features working
- [x] ✅ Admin portal accessible
- [x] ✅ Payment simulation working
- [ ] Change default admin password
- [ ] Test on mobile devices
- [ ] Set up monitoring
- [ ] Configure custom domain
- [ ] Add production API keys (optional)
- [ ] Enable SMS gateway (optional)

**Your FNG app is ready for production! 🚀**

Good luck with your launch! 🎉
