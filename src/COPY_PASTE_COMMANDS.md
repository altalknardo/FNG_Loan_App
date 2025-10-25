# 📋 COPY-PASTE DEPLOYMENT COMMANDS

## 🎯 USE THIS EVERY TIME

**Copy and paste these commands in order. That's it!**

---

## Step 1: Fix _redirects (Choose Your OS)

### Mac/Linux (Terminal):
```bash
rm -rf public/_redirects && echo "/* /index.html 200" > public/_redirects && cat public/_redirects
```

### Windows (PowerShell):
```powershell
Remove-Item -Recurse -Force public\_redirects; New-Item -Path public\_redirects -ItemType File -Value "/* /index.html 200"; Get-Content public\_redirects
```

### Windows (Command Prompt):
```cmd
rmdir /s /q public\_redirects && echo /* /index.html 200 > public\_redirects && type public\_redirects
```

**You should see:** `/* /index.html 200`

✅ If you see this, continue to Step 2!

---

## Step 2: Deploy

```bash
git add .
git commit -m "Deploy FNG app"
git push
```

---

## Step 3: Wait

⏳ **Wait 3 minutes**

✅ **Your site is LIVE!**

---

## 🔄 Complete Deployment (All in One)

**Mac/Linux - Copy ALL of this:**
```bash
rm -rf public/_redirects && \
echo "/* /index.html 200" > public/_redirects && \
cat public/_redirects && \
echo "✅ _redirects fixed! Deploying..." && \
git add . && \
git commit -m "Deploy FNG app" && \
git push && \
echo "🚀 Deployed! Check Netlify in 3 minutes."
```

**Windows PowerShell - Copy ALL of this:**
```powershell
Remove-Item -Recurse -Force public\_redirects; `
New-Item -Path public\_redirects -ItemType File -Value "/* /index.html 200"; `
Get-Content public\_redirects; `
Write-Host "✅ _redirects fixed! Deploying..." -ForegroundColor Green; `
git add .; `
git commit -m "Deploy FNG app"; `
git push; `
Write-Host "🚀 Deployed! Check Netlify in 3 minutes." -ForegroundColor Green
```

---

## 📱 THAT'S IT!

**Just copy-paste and wait. Your app will be live in 3 minutes!**

---

## 🆘 If Something Goes Wrong

**Check if _redirects is a file:**
```bash
ls -la public/_redirects
```

**Should show:**
```
-rw-r--r--  1 user  staff  20 Oct 22 10:30 public/_redirects
↑ This dash means it's a FILE ✅
```

**If you see 'd' at the start (drwxr-xr-x), it's a DIRECTORY ❌**
**→ Run Step 1 again!**

---

## ✅ SUCCESS INDICATORS

After pushing, check Netlify logs. You should see:

```
✓ vite v6.3.5 building for production...
✓ built in 5s
✓ Deploying dist directory
✓ Site is live!
```

**If you see "Deploy directory 'dist' does not exist":**
- _redirects is still a directory
- Run Step 1 again
- Then push again

---

**Save this page - you'll use it every time you deploy!** 📌
