# Quick Admin Login Access

## 🚀 Development URLs (Copy & Paste)

### ✅ Recommended (Always Works)
```
http://localhost:5173/#/admin
```

### Alternative Options
```
http://localhost:5173/#admin
http://localhost:5173/?admin=true
```

## 🌐 Production URLs

### For Deployed App
```
https://your-domain.com/#/admin
https://your-domain.com/?admin=true
```

## 🔑 Demo Credentials

**Email:** admin@fng.com  
**Phone:** 09012345678  
**Password:** admin123

## 📝 Quick Steps

1. Copy one of the development URLs above
2. Paste into your browser address bar
3. Press Enter
4. You should see the orange/red admin login page
5. Enter the demo credentials above
6. Click "Sign In"

## ⚠️ Troubleshooting

### "localhost refused to connect"
- Make sure your dev server is running (`npm run dev`)
- Use the hash-based URL: `http://localhost:5173/#/admin`
- Check the port number (might be 5174, 5175, etc. if 5173 is taken)

### Admin login not showing
- Clear your browser cache
- Make sure you're not already logged in (logout first)
- Try the query parameter method: `?admin=true`

### Orange/red page not appearing
- You should see a distinct orange/red gradient background
- If you see blue/purple, that's the user login (wrong page)
- Double-check the URL has `#/admin` or `?admin=true`

## 🎨 Visual Confirmation

You're on the correct admin login page if you see:
- ✅ Orange/red gradient background (not blue/purple)
- ✅ "Administrator Portal" badge with shield icon
- ✅ "Secure admin access - All activities are logged" message
- ✅ Demo admin credentials box (orange background)
- ✅ "Back to main site" link at the bottom

## 🔒 Security Note

The admin login is intentionally NOT linked from the public pages. You must access it via one of the URLs above. This prevents unauthorized users from discovering the admin interface.

---

**Need Help?** Check the full guide: [ADMIN_ACCESS_GUIDE.md](ADMIN_ACCESS_GUIDE.md)
