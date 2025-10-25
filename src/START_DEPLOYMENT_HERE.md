# ⚡ START HERE - Deploy Your FNG App in 10 Minutes

## 🎯 The Problem You're Having

Your **_redirects file keeps becoming a DIRECTORY** instead of a file when you download from Figma Make. This causes Netlify deployment to fail.

---

## ✅ THE FIX (Choose One Method)

### Method 1: Use the Fix Script (EASIEST!)

**After downloading from Figma Make:**

**On Mac/Linux:**
```bash
cd your-project-folder
chmod +x fix-redirects.sh
./fix-redirects.sh
```

**On Windows:**
```cmd
cd your-project-folder
fix-redirects.bat
```

✅ **Done!** The script automatically fixes the _redirects file.

---

### Method 2: Manual Fix (2 minutes)

1. **Go to** your project folder
2. **Navigate to** `/public/` directory
3. **Delete** the `_redirects` FOLDER (yes, delete the whole folder)
4. **Create** a NEW FILE named `_redirects` (no extension!)
5. **Open** it in a text editor
6. **Type** this ONE line:
   ```
   /* /index.html 200
   ```
7. **Save** and close

---

### Method 3: Command Line (FASTEST!)

**Mac/Linux:**
```bash
rm -rf public/_redirects
echo "/* /index.html 200" > public/_redirects
```

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force public/_redirects
New-Item -Path public/_redirects -ItemType File -Value "/* /index.html 200"
```

---

## 🚀 DEPLOY NOW (5 Steps)

### Step 1: Fix _redirects (use method above) ✅

### Step 2: Initialize Git

```bash
git init
git add .
git commit -m "FNG App - Ready for deployment"
```

### Step 3: Create GitHub Repo

1. Go to: **github.com/new**
2. Name: **fng-loan-app**
3. Click: **"Create repository"**
4. Copy the URL (e.g., `https://github.com/yourusername/fng-loan-app.git`)

### Step 4: Push to GitHub

```bash
git remote add origin YOUR_GITHUB_URL_HERE
git branch -M main
git push -u origin main
```

### Step 5: Deploy to Netlify

1. Go to: **app.netlify.com**
2. Click: **"Add new site"** → **"Import an existing project"**
3. Choose: **GitHub**
4. Select: **fng-loan-app**
5. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click: **"Deploy site"**

⏳ **Wait 2-3 minutes...**

🎉 **YOUR APP IS LIVE!**

---

## 📋 Quick Checklist

Before deploying, verify these files exist:

- ✅ `/public/_redirects` (FILE, not folder!)
- ✅ `/vite.config.ts`
- ✅ `/tsconfig.json`
- ✅ `/tsconfig.node.json`
- ✅ `/index.html`
- ✅ `/App.tsx`

**If any are missing, re-download from Figma Make.**

---

## 🆘 Common Errors & Fixes

### Error: "Deploy directory 'dist' does not exist"

**Cause:** _redirects is still a directory (not fixed)

**Fix:**
1. Use one of the 3 methods above to fix _redirects
2. Verify it's a FILE: `ls -la public/_redirects`
3. Re-commit and push
4. Redeploy on Netlify

---

### Error: "404 on page refresh"

**Cause:** _redirects file doesn't have correct content

**Fix:**
1. Open `/public/_redirects`
2. Ensure it contains: `/* /index.html 200`
3. Save, commit, push
4. Redeploy

---

### Error: "Module not found: vite"

**Cause:** Missing dependencies

**Fix:**
```bash
npm install --save-dev vite @vitejs/plugin-react
git add package.json package-lock.json
git commit -m "Add vite dependencies"
git push
```

---

## 🎯 What Makes This Deploy Work

1. **`/public/_redirects`** - Routes all URLs to index.html (SPA routing)
2. **`/vite.config.ts`** - Tells Vite to output to `dist` folder
3. **`/tsconfig.json`** - TypeScript configuration
4. **Netlify settings** - Build command and publish directory

**All of these are NOW in your project!**

---

## 💡 Pro Tips

**Tip 1:** Always use the fix script after downloading from Figma Make

**Tip 2:** Keep the fix scripts in your project for quick fixes

**Tip 3:** Verify _redirects is a FILE before every deployment:
```bash
ls -la public/_redirects
# Should show: -rw-r--r-- (file)
# NOT: drwxr-xr-x (directory)
```

**Tip 4:** Test locally before deploying:
```bash
npm install
npm run build
ls -la dist/  # Should show files
```

---

## 🌐 After Deployment

### Test Your Live Site

1. ✅ Visit your Netlify URL
2. ✅ Sign up / Login
3. ✅ Navigate between pages
4. ✅ Refresh the page (should NOT give 404)
5. ✅ Test on mobile
6. ✅ Install as PWA

### Access Admin Panel

**URL:** `https://your-site.netlify.app/#/admin`

**Credentials:**
- Email: `admin@fng.com`
- Password: `Admin123!@#`

**⚠️ CHANGE THE PASSWORD IMMEDIATELY!**

---

## 📊 Expected Build Output

When deployment succeeds, you'll see:

```
✓ Installing dependencies
✓ Running npm run build
✓ vite v6.3.5 building for production...
✓ built in 5s
✓ Deploying dist directory
  dist/_redirects
  dist/index.html
  dist/manifest.json
  dist/assets/...
✓ Site is live!
```

---

## 🎉 YOU'RE DONE!

**If you followed the steps above, your FNG app is now LIVE!**

**Your free Netlify URL:**
```
https://random-name-12345.netlify.app
```

**You can customize it to:**
```
https://fng-loan-app.netlify.app
```

**Or add a custom domain later:**
```
https://yourdomainname.com
```

---

## 📚 Additional Guides

- **Full deployment guide:** `/FINAL_DEPLOYMENT_FIX.md`
- **Domain setup:** `/DOMAIN_DEPLOYMENT_GUIDE.md`
- **Quick deploy:** `/DEPLOY_NOW_FIXED.md`
- **Netlify steps:** `/NETLIFY_DEPLOYMENT_STEPS.md`

---

## 🚀 Next Steps

1. ✅ Deploy your app (10 minutes)
2. ✅ Test all features
3. ✅ Change admin password
4. ✅ Share with team
5. ⬜ Buy custom domain (optional, ~₦8,000/year)
6. ⬜ Submit to Play Store (optional)

---

**Time to live site:** 10 minutes  
**Cost:** ₦0 (free tier)  
**Difficulty:** Easy (with fix script)

---

## ⚡ Quick Commands Reference

**Fix _redirects:**
```bash
chmod +x fix-redirects.sh && ./fix-redirects.sh
```

**Deploy:**
```bash
git add . && git commit -m "Deploy" && git push
```

**Test locally:**
```bash
npm run build && ls dist/
```

---

**Ready? Let's deploy! 🇳🇬🚀**

**Start with Method 1 (fix script) above!**
