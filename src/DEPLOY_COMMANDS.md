# ⚡ Quick Deployment Commands

## 🚀 Deploy in 5 Steps

### Step 1: Test Locally
```bash
npm install
npm run build
npm run preview
```
Open http://localhost:4173 and test ✅

---

### Step 2: Push to GitHub
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "FNG App v1.0 - Production Ready"

# Create repo on GitHub: https://github.com/new
# Repository name: fng-loan-app

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fng-loan-app.git

# Push
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Netlify

**Via Dashboard** (Easiest):
1. Go to https://app.netlify.com
2. "Add new site" → "Import from GitHub"
3. Select repository: `fng-loan-app`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy"

**Via CLI**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify init

# When prompted:
# - Build command: npm run build
# - Publish directory: dist

# Deploy to production
netlify deploy --prod
```

---

### Step 4: Test Live Site

Your URL: `https://[site-name].netlify.app`

**Test checklist:**
```
✓ Homepage loads
✓ Signup works
✓ Login works  
✓ Admin: https://[site-name].netlify.app/#/admin
✓ Mobile responsive
✓ PWA installs
```

---

### Step 5: Go Live! 🎉

**Share your app:**
```
Main: https://[site-name].netlify.app
Admin: https://[site-name].netlify.app/#/admin

Admin Login:
Email: admin@fng.com
Password: Admin123!@#
(⚠️ CHANGE THIS IMMEDIATELY!)
```

---

## 🔄 Making Updates

```bash
# Make changes to code
# Test locally
npm run build
npm run preview

# Push to GitHub
git add .
git commit -m "Description of changes"
git push

# Netlify auto-deploys! ✅
```

---

## 📱 Install as Mobile App

**iOS (Safari):**
1. Share → Add to Home Screen

**Android (Chrome):**
1. Menu → Install App

---

## 🎯 Quick Links

**Documentation:**
- Full Guide: `/DEPLOY_TO_PRODUCTION_NOW.md`
- Quick Deploy: `/DEPLOY_NOW.md`
- Launch Checklist: `/LAUNCH_DAY_CHECKLIST.md`

**Netlify:**
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com
- Status: https://www.netlifystatus.com

**GitHub:**
- New Repo: https://github.com/new
- Your Repos: https://github.com/[username]

---

## ⏱️ Time Estimates

- Test locally: 2 min
- Push to GitHub: 3 min
- Deploy to Netlify: 3 min
- Test live site: 2 min
- **Total: ~10 minutes**

---

## ✅ Deployment Checklist

```
[ ] npm run build successful
[ ] npm run preview tested
[ ] Code pushed to GitHub
[ ] Netlify deployment complete
[ ] Live URL accessible
[ ] Admin portal works
[ ] Mobile responsive verified
[ ] PWA installs correctly
[ ] Admin password changed
[ ] Monitoring set up (optional)
```

---

**You're ready to deploy! 🚀**

Follow `/DEPLOY_TO_PRODUCTION_NOW.md` for detailed instructions.
