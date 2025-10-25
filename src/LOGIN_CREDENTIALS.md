# 🔐 Login Credentials - Quick Reference

## Demo Accounts

### 👤 Regular User Account

**For testing user features only**

```
Phone:    08012345678  (Primary - Use this!)
Email:    user@fng.com (Optional)
Password: user123
```

**💡 Pro Tip:** Login with phone number (08012345678) - it's faster!

**Access:**
- ✅ User dashboard
- ✅ Loan applications
- ✅ Daily contributions/savings
- ✅ Customer support
- ✅ Profile management
- ❌ No admin access
- ❌ No admin toggle button

---

### 👑 Admin User Account

**For testing both user AND admin features**

```
Email:    admin@fng.com
Phone:    09012345678
Password: admin123
```

**Access:**
- ✅ **User Mode (Default):**
  - User dashboard
  - Loan applications
  - Daily contributions/savings
  - Customer support
  - Profile management
  
- ✅ **Admin Mode (Toggle):**
  - Admin dashboard
  - Revenue analytics
  - Report generation
  - Loan approvals
  - Withdrawal approvals
  - Deposit refunds
  - Balance offset
  - KYC approvals
  - Customer management
  - Customer enquiries
  - Real-time activity
  - Data management
  - Company settings

**Special Feature:**
- 🔄 **Mode Toggle Button** - Switch between user and admin interfaces instantly!

---

## 🎯 How to Use

### Testing Regular User Experience
```bash
1. Go to http://localhost:5173
2. Enter: user@fng.com / user123
3. Click "Sign In"
4. ✅ User interface only
```

### Testing Admin Features
```bash
1. Go to http://localhost:5173
2. Enter: admin@fng.com / admin123
3. Click "Sign In"
4. ✅ Start in User Mode
5. Click "Admin Mode" button in header
6. ✅ Switch to Admin Dashboard
7. Click "User Mode" to switch back
```

---

## 📋 Quick Comparison

| Feature | Regular User | Admin User |
|---------|--------------|------------|
| **Login Page** | Same | Same |
| **User Dashboard** | ✅ Yes | ✅ Yes |
| **Loan Application** | ✅ Yes | ✅ Yes |
| **Daily Savings** | ✅ Yes | ✅ Yes |
| **Profile Management** | ✅ Yes | ✅ Yes |
| **Admin Toggle** | ❌ No | ✅ Yes |
| **Admin Dashboard** | ❌ No | ✅ Yes |
| **Approvals** | ❌ No | ✅ Yes |
| **Analytics** | ❌ No | ✅ Yes |
| **Reports** | ❌ No | ✅ Yes |
| **Management Tools** | ❌ No | ✅ Yes |

---

## 🎨 Visual Indicators

### Regular User Header
```
┌──────────────────────────────────┐
│ [FNG]  user@fng.com    [Logout]  │ ← No admin badge
└──────────────────────────────────┘
```

### Admin User Header (User Mode)
```
┌────────────────────────────────────────────────┐
│ [FNG] [Admin] admin@fng.com                    │ ← Admin badge
│                [Admin Mode] [Logout]           │ ← Toggle!
└────────────────────────────────────────────────┘
```

### Admin User Header (Admin Mode)
```
┌────────────────────────────────────────────────┐
│ [FNG] [Admin] admin@fng.com                    │
│                [User Mode] [Logout]            │ ← Toggle back
└────────────────────────────────────────────────┘
```

---

## 💡 Pro Tips

### ✅ DO:
- Use `admin@fng.com` to test both user and admin features
- Toggle between modes to verify functionality
- Use `user@fng.com` to test pure user experience
- Log in with phone numbers as alternative (08012345678 or 09012345678)

### ❌ DON'T:
- Don't create new accounts just to test admin features (use admin@fng.com)
- Don't forget which mode you're in when testing
- Don't share admin credentials in production
- Don't modify the demo user passwords

---

## 🔒 Security Notes

### Session Storage
```javascript
// When admin user logs in:
localStorage.setItem("currentUserIsAdmin", "true")

// When regular user logs in:
// No special flag is set

// On logout:
localStorage.removeItem("currentUserIsAdmin")
```

### Access Control
- Admin access is tied to user account
- `isAdmin` flag stored in user object
- Toggle button only appears if flag is true
- Regular users cannot access admin features

---

## 🚀 Quick Testing Flow

### Test Flow #1: Regular User
```
1. Login: user@fng.com / user123
2. See user dashboard (mobile layout)
3. Try loan application
4. Make a contribution
5. Check transaction history
6. Verify no admin toggle exists
7. Logout
```

### Test Flow #2: Admin User (User Mode)
```
1. Login: admin@fng.com / admin123
2. See user dashboard (mobile layout)
3. Notice "Admin" badge
4. Notice "Admin Mode" button
5. Try user features (loans, savings, etc.)
6. Verify everything works like regular user
```

### Test Flow #3: Admin User (Toggle to Admin)
```
1. From user dashboard
2. Click "Admin Mode" button
3. See layout expand to desktop
4. See sidebar appear
5. Navigate admin features
6. Click "User Mode" to return
7. Verify back to mobile layout
```

### Test Flow #4: Admin User (Full Journey)
```
1. Login: admin@fng.com / admin123
2. Start in User Mode
3. Apply for a loan as a user
4. Toggle to Admin Mode
5. Approve your own loan (demo only!)
6. Toggle back to User Mode
7. See approved loan
8. Make payment
9. Toggle to Admin Mode
10. See payment in analytics
11. Logout
```

---

## 📱 Alternative Login Methods

### Using Phone Numbers

**Regular User:**
```
Phone:    08012345678
Password: user123
```

**Admin User:**
```
Phone:    09012345678
Password: admin123
```

Both email and phone work interchangeably!

---

## ❓ Troubleshooting

### Problem: "I don't see the Admin Mode button"
**Solution:** You're logged in as a regular user. Logout and login with `admin@fng.com`

### Problem: "Admin Mode button disappeared"
**Solution:** You logged out. The flag is cleared on logout. Login again with admin credentials.

### Problem: "Can't remember which account has admin access"
**Solution:** Look for the "Admin" badge next to the FNG logo. It only appears for admin users.

### Problem: "Want to test admin without affecting user data"
**Solution:** The admin account is separate from the regular user account. They have different data.

---

## 📚 Related Guides

- **[ADMIN_USER_ACCOUNT.md]** - Technical documentation
- **[ADMIN_USER_VISUAL_GUIDE.md]** - Visual step-by-step guide
- **[START_HERE.md]** - Quick start guide
- **[README.md]** - Full feature list

---

## 📞 Need Help?

1. Check if you're using the correct email: `admin@fng.com` (not `user@fng.com`)
2. Check if password is correct: `admin123` (not `user123`)
3. Look for the "Admin" badge in the header after login
4. Check if "Admin Mode" button appears in the top-right
5. Try clearing browser cache and localStorage

---

## 🎓 Summary

| Credential | Purpose | Admin Toggle? |
|------------|---------|---------------|
| `user@fng.com` / `user123` | Test user features only | ❌ No |
| `admin@fng.com` / `admin123` | Test user + admin features | ✅ Yes |

**Remember:** Both accounts exist for testing. Admin account gives you the best of both worlds! 🚀

---

**Last Updated:** Version 4.0  
**Date:** October 21, 2025
