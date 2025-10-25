# ✅ Simple Deployment Checklist

Print this and check off each step as you go!

---

## Pre-Deployment ✅

- [ ] Project downloaded from Figma Make
- [ ] Extracted to folder on Desktop
- [ ] Terminal/Command Prompt open
- [ ] Navigated to project folder

---

## Local Setup ✅

- [ ] Run: `npm install`
- [ ] Run: `npm run build`
- [ ] Run: `npm run preview`
- [ ] Test at http://localhost:4173
- [ ] Stop preview (Ctrl+C)

---

## GitHub Setup ✅

**Option A: GitHub Desktop**
- [ ] Downloaded GitHub Desktop
- [ ] Created repository
- [ ] Published to GitHub

**Option B: Command Line**
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Created repo on github.com/new
- [ ] Run: `git remote add origin [URL]`
- [ ] Run: `git push -u origin main`

---

## Netlify Deployment ✅

- [ ] Signed up at app.netlify.com
- [ ] Clicked "Add new site"
- [ ] Imported from GitHub
- [ ] Selected fng-loan-app repo
- [ ] Set build: `npm run build`
- [ ] Set publish: `dist`
- [ ] Clicked "Deploy"
- [ ] Waited for deployment
- [ ] Got live URL

---

## Testing ✅

- [ ] Homepage loads
- [ ] Sign up works
- [ ] Login works
- [ ] Admin access works (#/admin)
- [ ] Mobile responsive
- [ ] PWA installs
- [ ] No console errors

---

## Security ✅

- [ ] Logged into admin
- [ ] Went to Settings
- [ ] Changed admin password
- [ ] Tested new password
- [ ] Logged out old password

---

## Optional Enhancements ✅

- [ ] Added custom domain
- [ ] Set up UptimeRobot monitoring
- [ ] Added Google Analytics
- [ ] Shared URL with team
- [ ] Installed PWA on phone

---

## 🎉 YOU'RE LIVE!

**Live URL:** _________________________

**Admin URL:** _________________________

**New Admin Password:** _________________ (keep secret!)

**Deployed on:** _________________________

**GitHub Repo:** _________________________

---

## Quick Reference

```bash
# Build & Preview
npm install
npm run build
npm run preview

# Git Commands
git add .
git commit -m "Update message"
git push

# Your URLs
Main: https://[site].netlify.app
Admin: https://[site].netlify.app/#/admin
```

---

## Support

- Full guide: `/YOUR_DEPLOYMENT_WALKTHROUGH.md`
- Troubleshooting: Check deployment guides
- Netlify help: docs.netlify.com

---

**Status:** [ ] DEPLOYED ✅

**Notes:**
_________________________________
_________________________________
_________________________________
