# 🚨 CRITICAL: Pre-Deployment Workflow (DO THIS EVERY TIME!)

## ⚠️ THE PROBLEM THAT KEEPS HAPPENING

**Figma Make has a bug where it creates `/public/_redirects` as a DIRECTORY instead of a FILE.**

This causes your Netlify build to fail with:
```
Build script returned non-zero exit code: 2
Failed during stage 'building site'
```

**This WILL happen EVERY time you download from Figma Make!**

---

## ✅ MANDATORY WORKFLOW - DO THIS EVERY SINGLE TIME

### Step 1: Download from Figma Make ✅

### Step 2: FIX _redirects IMMEDIATELY ⚠️

**Choose ONE method:**

#### Method A: Run Fix Script (EASIEST!)

**Mac/Linux:**
```bash
cd your-project-folder
chmod +x fix-redirects.sh
./fix-redirects.sh
```

**Windows:**
```cmd
cd your-project-folder
fix-redirects.bat
```

**The script will:**
- ✅ Delete the `_redirects` directory
- ✅ Create proper `_redirects` file
- ✅ Show you confirmation

---

#### Method B: Manual Fix (If script doesn't work)

**1. Open your project folder**

**2. Navigate to `/public/` directory**

**3. Check if `_redirects` is a folder:**
   - If you see a FOLDER icon (📁) → IT'S WRONG!
   - If you see components inside → IT'S WRONG!

**4. DELETE the entire `_redirects` folder**

**5. Create NEW FILE named `_redirects`**
   - Right-click → New File → Name it `_redirects` (no extension!)
   - Or use command line (see Method C)

**6. Open the file in text editor**

**7. Add ONLY this one line:**
   ```
   /* /index.html 200
   ```

**8. Save and close**

---

#### Method C: Command Line (FASTEST!)

**Mac/Linux:**
```bash
# Navigate to project folder
cd your-project-folder

# Delete directory and create file
rm -rf public/_redirects
echo "/* /index.html 200" > public/_redirects

# Verify it's a file
ls -la public/_redirects
# Should show: -rw-r--r-- (FILE) not drwxr-xr-x (DIRECTORY)
```

**Windows PowerShell:**
```powershell
# Navigate to project folder
cd your-project-folder

# Delete directory and create file
Remove-Item -Recurse -Force public\_redirects
New-Item -Path public\_redirects -ItemType File -Value "/* /index.html 200"

# Verify it's a file
Get-Item public\_redirects
```

**Windows Command Prompt:**
```cmd
cd your-project-folder
rmdir /s /q public\_redirects
echo /* /index.html 200 > public\_redirects
```

---

### Step 3: VERIFY the Fix (CRITICAL!) ✅

**Before you commit and push, VERIFY:**

```bash
# Check if it's a file (not directory)
ls -la public/_redirects
# Windows: dir public\_redirects

# View the content
cat public/_redirects
# Windows: type public\_redirects

# Should ONLY show this line:
# /* /index.html 200
```

**Visual verification:**
- ✅ File icon (📄) in file explorer
- ✅ Opens in text editor
- ✅ Contains: `/* /index.html 200`
- ❌ NOT a folder (📁)
- ❌ NO code components inside

---

### Step 4: Test Build Locally (OPTIONAL but RECOMMENDED) ✅

```bash
# Install dependencies (if first time)
npm install

# Run build
npm run build

# Check if dist folder was created
ls -la dist/
# Windows: dir dist\

# You should see:
# ✅ dist/index.html
# ✅ dist/_redirects
# ✅ dist/manifest.json
# ✅ dist/assets/ folder
```

**If build fails:**
- ❌ `_redirects` is still a directory
- ❌ Fix it and try again

**If build succeeds:**
- ✅ Proceed to Step 5

---

### Step 5: Commit and Push to GitHub ✅

```bash
git add .
git commit -m "Fix _redirects for deployment"
git push
```

**Netlify will auto-deploy in 2-3 minutes** ⏳

---

## 🔍 HOW TO CHECK IF _redirects IS CORRECT

### Visual Check (File Explorer)

**CORRECT ✅:**
```
/public/
  ├── _redirects          ← FILE (📄 icon)
  ├── manifest.json
  ├── sw.js
  └── ...
```

**WRONG ❌:**
```
/public/
  ├── _redirects/         ← FOLDER (📁 icon)
  │   ├── Code-component-xxx.tsx
  │   └── Code-component-xxx.tsx
  ├── manifest.json
  └── ...
```

---

### Command Line Check

```bash
# This command tells you if it's a file or directory
ls -la public/_redirects

# If FILE (correct):
-rw-r--r--  1 user  staff  20 Oct 22 10:30 public/_redirects

# If DIRECTORY (wrong):
drwxr-xr-x  4 user  staff  128 Oct 22 10:30 public/_redirects/
```

**Look for the first character:**
- `-` = FILE ✅ (correct)
- `d` = DIRECTORY ❌ (wrong, fix it!)

---

### Content Check

```bash
cat public/_redirects
```

**Should ONLY show:**
```
/* /index.html 200
```

**If it shows anything else:**
- ❌ File is wrong
- ❌ Recreate it with the correct content

---

## 🚨 WHY THIS HAPPENS

**Figma Make Bug:**
- Figma Make sometimes generates configuration files as React components
- It creates directories instead of files
- This happens with `_redirects` specifically
- There's no fix on Figma Make's side yet

**Why It Breaks Your Build:**
1. Vite tries to compile all `.tsx` files in your project
2. It finds `.tsx` files in `/public/_redirects/` directory
3. These files have invalid import paths
4. Build fails with "non-zero exit code: 2"
5. Netlify can't deploy

---

## ✅ COMPLETE CHECKLIST

**Before EVERY deployment, check these:**

- [ ] Downloaded from Figma Make
- [ ] Fixed `_redirects` using Method A, B, or C
- [ ] Verified `_redirects` is a FILE (not directory)
- [ ] Verified content is: `/* /index.html 200`
- [ ] NO `.tsx` files in `/public/_redirects/`
- [ ] Local build test passed (optional)
- [ ] Committed and pushed to GitHub
- [ ] Netlify deployment started

---

## 📊 EXPECTED DEPLOYMENT OUTPUT

**When everything is correct, Netlify will show:**

```
✓ Installing dependencies
  added 152 packages in 26s

✓ Running npm run build
  vite v6.3.5 building for production...
  transforming...
  rendering chunks...
  computing gzip size...
  dist/index.html                   X.XX kB
  dist/assets/index-[hash].css      XX.XX kB │ gzip: XX.XX kB
  dist/assets/vendor-[hash].js      XXX.XX kB │ gzip: XXX.XX kB
  dist/assets/index-[hash].js       XXX.XX kB │ gzip: XXX.XX kB
  ✓ built in 5.2s

✓ Deploy directory: dist
  dist/_redirects
  dist/index.html
  dist/manifest.json
  dist/sw.js
  dist/assets/...

✓ Site is live!
  https://your-site.netlify.app
```

---

## 🆘 IF DEPLOYMENT STILL FAILS

### Error: "Build script returned non-zero exit code: 2"

**This means `_redirects` is still a directory!**

**Fix:**
1. Go back to Step 2 above
2. Use command line method (most reliable)
3. Verify with Step 3
4. Commit and push again

---

### Error: "Deploy directory 'dist' does not exist"

**This means the build completed but output went to wrong place**

**Check:**
1. `vite.config.ts` exists ✅
2. `vite.config.ts` has `outDir: 'dist'` ✅
3. `_redirects` is fixed ✅

---

### Error: "404 Not Found" when refreshing pages

**This means `_redirects` file wasn't copied to dist**

**Fix:**
1. Verify `_redirects` is in `/public/` (source)
2. Check it's a FILE not directory
3. Rebuild and redeploy

---

## 🎯 QUICK REFERENCE

**Every deployment:**

1. Download → 2. Fix _redirects → 3. Verify → 4. Push → 5. Done!

**Fix command (copy-paste):**

**Mac/Linux:**
```bash
rm -rf public/_redirects && echo "/* /index.html 200" > public/_redirects
```

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force public\_redirects; New-Item -Path public\_redirects -ItemType File -Value "/* /index.html 200"
```

**Verify command:**
```bash
cat public/_redirects
```

---

## 💾 SAVE THIS WORKFLOW

**Print this page or bookmark it!**

You'll need it EVERY time you:
- Download from Figma Make
- Make changes and redeploy
- Create a new build

**This is NOT optional - it's mandatory for successful deployment!**

---

## ✅ CURRENT STATUS

**I just fixed your `_redirects` file (AGAIN!):**

- ✅ Deleted `Code-component-172-66.tsx`
- ✅ Deleted `Code-component-172-86.tsx`
- ✅ Created proper `_redirects` FILE
- ✅ Added content: `/* /index.html 200`

**What you need to do RIGHT NOW:**

1. **Download fresh copy** from Figma Make
2. **Run the fix script** (or manual fix)
3. **Verify** it's correct
4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix _redirects file for deployment"
   git push
   ```
5. **Wait 2-3 minutes** for Netlify to deploy
6. **Check your live site!**

---

## 🚀 DEPLOY NOW COMMANDS

**Complete deployment in one go:**

```bash
# 1. Fix _redirects
rm -rf public/_redirects && echo "/* /index.html 200" > public/_redirects

# 2. Verify
cat public/_redirects

# 3. Test build (optional)
npm run build

# 4. Commit and push
git add .
git commit -m "Fix _redirects and deploy"
git push

# Done! Check Netlify in 2-3 minutes
```

---

**Remember: This workflow is MANDATORY for EVERY deployment from Figma Make!**

**Save the fix script in your project - you'll use it constantly!** 📌
