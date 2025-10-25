# Admin Access Guide

## Overview
The FNG admin portal has been configured with enhanced security. Admin login is now **completely separate** from the public user login page and can only be accessed via a dedicated private URL.

## Key Security Improvements

### ✅ What Changed
1. **Removed Admin Login Button** - The "Administrator Login" button has been removed from the public login page
2. **Private Admin URL** - Admin access is now only available through a dedicated URL path
3. **No Public Discovery** - Regular users cannot accidentally discover or access the admin login interface
4. **Clear Visual Distinction** - Admin portal has distinct orange/red branding vs. blue/purple user interface

## Accessing the Admin Portal

### Method 1: Hash-based Route (Recommended for Development)
Navigate directly to:
```
http://localhost:5173/#/admin
```
or
```
https://your-domain.com/#/admin
```

### Method 2: Query Parameter (Alternative)
Add `?admin=true` to your URL:
```
http://localhost:5173/?admin=true
```
or
```
https://your-domain.com/?admin=true
```

### Method 3: Direct Path (Production only)
Works when server-side routing is configured:
```
https://your-domain.com/admin
```

### Development Access (Choose One)
During local development, use any of these:
```
http://localhost:5173/#/admin          (Recommended - always works)
http://localhost:5173/#admin           (Also works)
http://localhost:5173/?admin=true      (Query parameter method)
```

## Admin Login Credentials

### Demo Credentials
For testing and demonstration:
- **Email:** admin@fng.com
- **Phone:** 09012345678  
- **Password:** admin123

### Super Admin Accounts
The system supports multiple admin roles with different permission levels. Check the super admin system documentation for role-based access control.

## Visual Indicators

### User Login Page
- **Colors:** Blue and purple gradients
- **Branding:** "Welcome back!" message
- **Features:** Sign up link, forgot password, demo credentials

### Admin Login Page  
- **Colors:** Orange, red, and pink gradients
- **Branding:** "Administrator Portal" badge with shield icon
- **Features:** Security notice, activity logging warning
- **Return:** "Back to main site" link (does NOT go to user login)

## Security Features

### 1. URL-Based Access Control
```typescript
// App checks for admin path
const isAdminPath = window.location.pathname === '/admin' || 
                   window.location.hash === '#/admin';
```

### 2. Activity Logging
All admin activities are logged and tracked for security auditing.

### 3. Session Management
- Admin sessions are tracked separately from user sessions
- Role and permissions stored in localStorage during active session
- Cleared on logout for security

### 4. No Cross-Access
- Regular users cannot switch to admin mode
- Only users who log in through the admin portal receive admin access
- Mode toggle only available to authenticated admin users

## Sharing Admin Access

### ⚠️ Important Security Notes

1. **Private URL** - Only share the `/admin` URL with authorized administrators
2. **Secure Communication** - Send credentials through secure channels (never via email or public chat)
3. **Unique Credentials** - Each admin should have unique login credentials
4. **Regular Audits** - Review admin access logs regularly

### Recommended Process
```
1. Share admin URL privately (e.g., password manager, encrypted message)
2. Provide unique credentials separately
3. Require password change on first login (if implementing)
4. Enable 2FA for admin accounts (future enhancement)
```

## Integration with Existing Features

### User Mode ↔ Admin Mode Toggle
- Only available to authenticated admin users
- Shows in header after admin login
- Allows switching between admin and user views
- User data remains accessible in user mode

### KYC Bypass
- Admin mode automatically bypasses KYC requirements
- Admins can access all features without KYC submission

### Super Admin System
- Role-based permissions (Super Admin, Manager, Analyst, Support, Viewer)
- Customizable access levels
- Managed through Company Settings

## Troubleshooting

### Issue: Cannot Access Admin Portal
**Solution:** 
- Ensure you're using the correct URL: `/admin` or `/#/admin`
- Clear browser cache and try again
- Check if you're already logged in as a regular user (logout first)

### Issue: "Back to main site" doesn't work
**Solution:**
- This button clears the admin login state and returns to home
- It does NOT take you to user login (security feature)
- To access user login, go to main URL without `/admin`

### Issue: Lost Admin Access After Logout
**Expected Behavior:**
- Admin access is session-based
- Must log in through `/admin` URL again
- Regular users don't have admin toggle button

## Production Deployment

### Before Going Live

1. **Change Default Credentials**
   ```javascript
   // Update in AdminLogin.tsx
   // Replace demo credentials with production admin accounts
   ```

2. **Secure the Admin URL**
   - Consider additional authentication layer (IP whitelist, VPN)
   - Implement rate limiting for admin login attempts
   - Enable audit logging

3. **Document Internal Process**
   - Create internal wiki with admin URL
   - Set up admin credential rotation policy
   - Train admin staff on security best practices

4. **Monitor Access**
   - Set up alerts for admin login attempts
   - Review admin activity logs weekly
   - Audit permission changes

## Future Enhancements

### Recommended Security Improvements
- [ ] Two-factor authentication (2FA) for admin accounts
- [ ] IP whitelist for admin access
- [ ] Failed login attempt tracking and temporary lockout
- [ ] Admin password complexity requirements
- [ ] Mandatory password rotation policy
- [ ] Audit log export and review system
- [ ] Admin session timeout (currently 30 minutes)

### UX Improvements
- [ ] Admin-specific forgot password flow
- [ ] Admin account management interface
- [ ] Real-time session monitoring
- [ ] Multi-device admin access control

## Technical Implementation

### File Changes Summary

#### `/App.tsx`
- Added URL path detection for admin access
- Removed `onSwitchToAdmin` from Login component props
- Updated admin login conditional to require admin path
- Added browser navigation event listeners

#### `/components/Login.tsx`
- Removed `onSwitchToAdmin` prop and functionality
- Removed "Administrator Login" button
- Cleaner public login interface

#### `/components/AdminLogin.tsx`
- Changed `onSwitchToUser` to `onBack`
- Updated back button to return to main site
- Enhanced security messaging

## Support

For admin access issues or questions:
- **Email:** admin-support@fng.com
- **Documentation:** Check this guide and related docs
- **Emergency Access:** Contact system administrator

---

**Last Updated:** October 21, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready
