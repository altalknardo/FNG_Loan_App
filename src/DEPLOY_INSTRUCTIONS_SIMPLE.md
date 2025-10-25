# 🚀 Deploy Your FNG App (3 Commands)

## ⚡ Quick Deploy

**Open your terminal and run these 3 commands:**

### 1. Fix the _redirects bug
```bash
rm -rf public/_redirects && echo "/* /index.html 200" > public/_redirects
```

### 2. Commit
```bash
git add . && git commit -m "Deploy"
```

### 3. Push
```bash
git push
```

**Done! ✅ Your site will be live in 3 minutes.**

---

## 📱 Windows Users

**Use PowerShell and run:**

```powershell
Remove-Item -Recurse -Force public\_redirects
New-Item -Path public\_redirects -ItemType File -Value "/* /index.html 200"
git add .
git commit -m "Deploy"
git push
```

---

## ⚠️ IMPORTANT

**Run command #1 EVERY TIME before you deploy!**

Figma Make creates `_redirects` as a folder (bug). You must fix it before every deployment.

---

## ✅ What to Expect

After pushing, check https://app.netlify.com

**Build logs should show:**
```
✓ Installing dependencies
✓ Running npm run build
✓ built in 5s
✓ Site is live!
```

**If you see error "Deploy directory 'dist' does not exist":**
- Run command #1 again
- Then run commands #2 and #3

---

## 🎯 Deployment Workflow

```
Download from Figma Make
         ↓
Fix _redirects (command #1)
         ↓
Commit (command #2)
         ↓
Push (command #3)
         ↓
Wait 3 minutes
         ↓
✅ LIVE!
```

---

## 💡 Pro Tip

**Save this command in a file called `deploy.sh`:**

```bash
#!/bin/bash
rm -rf public/_redirects
echo "/* /index.html 200" > public/_redirects
git add .
git commit -m "Deploy"
git push
echo "✅ Deployed! Check Netlify in 3 minutes."
```

**Then just run:** `bash deploy.sh`

---

## 🆘 Need Help?

**Check these guides:**
- `/STOP_DO_THIS_NOW.md` - Critical info
- `/COPY_PASTE_COMMANDS.md` - All commands
- `/CRITICAL_PRE_DEPLOY_WORKFLOW.md` - Detailed guide

---

**Your app is ready to deploy RIGHT NOW!**

**Just run the 3 commands above!** 🚀🇳🇬
