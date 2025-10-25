# 🔐 Admin Portal Access Guide

## Overview

The FNG admin portal is **completely separate** from the user application. It can only be accessed through special URLs and has its own dedicated login page.

---

## 🚀 How to Access Admin Portal

### Method 1: Hash-Based URL (Recommended)
Add `#/admin` to your application URL:

```
https://yourapp.com#/admin
```

**Example:**
- Local development: `http://localhost:5173#/admin`
- Production: `https://fng-app.vercel.app#/admin`

### Method 2: Query Parameter
Add `?admin=true` to your URL:

```
https://yourapp.com?admin=true
```

### Method 3: Path-Based (Production)
Navigate directly to the admin path:

```
https://yourapp.com/admin
```

---

## 🔑 Admin Credentials

```
Email: admin@fng.com
Password: admin123
```

**Note:** These are demo credentials. Change them in production!

---

## 📱 Admin Portal Features

Once logged in, you have access to:

### Dashboard
- Total users overview
- Active loans summary
- Pending approvals count
- Revenue metrics

### Customer Management
- **KYC Approvals** - Review and approve customer registrations
- **Customer Profiles** - View all verified customers
- **Customer Management** - Edit or deactivate users
- **Customer Enquiries** - View support requests

### Financial Operations
- **Loan Approvals** - Review and approve loan applications
- **Withdrawal Approvals** - Process withdrawal requests
- **Deposit Refunds** - Handle upfront deposit refunds
- **Balance Offset** - Manage deposit-to-loan offsets

### Analytics & Reports
- **Revenue Analytics** - Track company revenue streams
- **Generate Reports** - Export financial data
- **Real-time Activity** - Monitor system events

### System
- **Data Management** - Export and backup data
- **Company Settings** - Configure bank account and admin profile

---

## 🔒 Security Features

### 1. Separate Login Portal
- Admin and user logins are completely separate
- Different authentication flow
- Prevents accidental admin access

### 2. URL-Based Protection
- Admin portal only loads when accessing special URLs
- No way to access from normal user flow
- Clear separation of concerns

### 3. Session Management
- Admin sessions are isolated
- Logout clears all admin data
- No cross-contamination with user sessions

---

## 🚦 Access Flow

```
1. Navigate to URL
   ↓
   Add #/admin or ?admin=true
   ↓
2. Admin Login Page Loads
   ↓
   Enter admin credentials
   ↓
3. Admin Dashboard
   ↓
   Access all admin features
   ↓
4. Logout
   ↓
   Returns to user login
```

---

## ⚠️ Important Notes

### For Development
- Use `#/admin` for easier testing
- Works immediately without configuration
- Bookmark the URL for quick access

### For Production
1. **Secure the URL**
   - Don't share admin URL publicly
   - Use environment-specific URLs
   - Consider IP whitelisting

2. **Change Credentials**
   - Update admin email and password
   - Use strong passwords
   - Implement 2FA if possible

3. **Monitor Access**
   - Log all admin logins
   - Track admin actions
   - Set up alerts for suspicious activity

---

## 🔧 Troubleshooting

### Can't Access Admin Portal

**Problem:** Adding #/admin doesn't show admin login

**Solutions:**
1. Clear browser cache and try again
2. Make sure you're logged out of user account
3. Try different access method (query param or path)
4. Check browser console for errors

### Wrong Credentials

**Problem:** admin@fng.com / admin123 doesn't work

**Solutions:**
1. Verify you're on the admin login page (not user login)
2. Check for typos in email/password
3. Clear localStorage and try again
4. Verify demo credentials haven't been changed

### Redirected to User Login

**Problem:** Keeps showing user login instead of admin

**Solutions:**
1. Ensure you're using the correct URL format
2. Try accessing directly: `yourapp.com#/admin`
3. Check if admin route is properly configured
4. Verify you're not already logged in as a user

---

## 📚 Related Documentation

- **[LOGIN_CREDENTIALS.md](/LOGIN_CREDENTIALS.md)** - All login credentials
- **[ADMIN_LOGIN_URL.md](/ADMIN_LOGIN_URL.md)** - Technical URL configuration
- **[README.md](/README.md)** - Main documentation

---

## 🎯 Quick Reference

| What | How |
|------|-----|
| **Access URL** | Add `#/admin` to app URL |
| **Admin Email** | admin@fng.com |
| **Admin Password** | admin123 |
| **Logout** | Click Logout button in header |
| **Return to User** | Navigate to base URL without #/admin |

---

## 🔐 Security Best Practices

### DO ✅
- Keep admin URL private
- Use strong passwords in production
- Log out after each session
- Access from secure networks
- Monitor admin activities

### DON'T ❌
- Share admin URL publicly
- Use demo credentials in production
- Stay logged in on shared computers
- Access from public WiFi without VPN
- Allow multiple admins on same account

---

## 🆘 Need Help?

### Common Questions

**Q: Can regular users access admin portal?**  
A: No, they need to know the special URL and have admin credentials.

**Q: Can I have multiple admin accounts?**  
A: Yes, create more in the AdminLogin.tsx component with different credentials.

**Q: Is this secure enough for production?**  
A: For basic demos, yes. For production, implement proper backend authentication.

**Q: Can I access both user and admin at once?**  
A: No, they are separate sessions. Logout from one to access the other.

---

**Version:** 4.1  
**Last Updated:** October 21, 2025  
**Status:** Production-Ready (with proper credential changes)
