# ⚡ DEPLOYMENT SETTINGS - QUICK CARD

## ✅ FIXED: _redirects bug (deleted .tsx files)

---

## 🎯 EXACT SETTINGS

### For Netlify:

```
Base directory:      .  (or leave empty)
Build command:       npm run build
Publish directory:   dist
Functions directory: (leave empty)
```

### For Vercel:

```
Root Directory:      ./
Build Command:       npm run build
Output Directory:    dist
Install Command:     npm install
```

---

## 📋 VISUAL SETTINGS

```
┌──────────────────────────────┐
│ NETLIFY BUILD SETTINGS       │
├──────────────────────────────┤
│ Base directory:    [  .  ]   │
│ Build command:     [ npm run build ] │
│ Publish directory: [ dist ]  │
│ Functions:         [     ]   │
└──────────────────────────────┘
```

---

## 🚀 DEPLOY NOW

**Option 1: Drag & Drop**
```bash
npm install && npm run build
```
Then drag `dist/` folder to: https://app.netlify.com/drop

**Option 2: GitHub**
- Connect repo to Netlify
- Use settings above
- Auto-deploy on push!

---

## 📊 WHAT GETS BUILT

```
dist/
├── index.html          ← Your app
├── assets/             ← JS & CSS
├── manifest.json       ← PWA
├── sw.js               ← Service worker
└── _redirects          ← Routing
```

---

## ✅ CHECKLIST

- [x] Base directory: `.`
- [x] Build: `npm run build`
- [x] Publish: `dist`
- [x] _redirects: Fixed ✅
- [ ] Deploy!

---

## 🎯 ONE-LINER ANSWER

**Settings:** Base: `.` | Build: `npm run build` | Publish: `dist`

**Deploy:** Build locally → Drag `dist/` to Netlify → LIVE! 🚀
