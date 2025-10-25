# Account Security - Username & Password Management

## Overview
FNG now includes a comprehensive account security system that allows both regular users and administrators to change their email addresses (username) and passwords with full validation and security checks.

## 🎯 Features

### For Regular Users
- **Change Email Address**: Update login email with verification
- **Change Password**: Set a new secure password with strength requirements
- **Access via Profile**: Available in Profile → Account Security

### For Administrators
- **Change Admin Email**: Update administrative email
- **Change Admin Password**: Set new admin password with enhanced security
- **Access via Settings**: Available in Company Settings → Account Security tab

## 📍 Access Locations

### User Account Settings
1. Log in as a regular user
2. Navigate to **Profile** (bottom navigation)
3. Click **Account Security** in the menu
4. Choose to change email or password

### Admin Account Settings
1. Log in as an administrator
2. Navigate to **Company Settings** (sidebar)
3. Click **Account Security** tab
4. Choose to change email or password

## 🔐 Security Features

### Password Requirements
All new passwords must meet at least 4 of the following 5 criteria:
- ✅ At least 8 characters long
- ✅ One uppercase letter (A-Z)
- ✅ One lowercase letter (a-z)
- ✅ One number (0-9)
- ✅ One special character (!@#$%^&*(),.?":{}|<>)

### Real-time Password Strength Indicator
- Visual feedback as you type your new password
- Green checkmarks for met requirements
- Clear indication of what's still needed

### Email Change Validation
- Must be a valid email format
- Cannot be the same as current email
- Cannot be already registered in the system
- Requires current password confirmation

### Password Change Validation
- Must provide current password
- New password must be different from current
- New password must meet strength requirements
- Confirmation password must match

## 🎨 User Interface

### Account Settings Page
- **Clean, modern design** with card-based layout
- **Current credentials display** showing email and masked password
- **Quick action cards** for email and password changes
- **Security tips** to guide best practices

### Change Email Dialog
- Current email display (read-only)
- New email input
- Email confirmation input
- Password verification
- Clear error messages

### Change Password Dialog
- Current password with show/hide toggle
- New password with strength indicators
- Password confirmation
- Visual feedback for requirements
- Error handling and validation

## 🔄 How It Works

### Change Email Process
1. Click "Change Email Address" card
2. Enter your new email address
3. Re-enter to confirm the new email
4. Provide your current password
5. Click "Update Email"
6. Success! You're logged in with the new email

### Change Password Process
1. Click "Change Password" card
2. Enter your current password
3. Enter your new password (see strength indicators)
4. Re-enter to confirm the new password
5. Click "Update Password"
6. Success! Your password is updated

## 💾 Data Storage

### User Credentials
- Stored in `localStorage` under `registeredUsers` array
- Demo users have predefined credentials
- Remember Me feature updates automatically

### Admin Credentials
- Stored in `localStorage` under `adminUsers` array
- Demo admins: `admin@fng.com`, `manager@fng.com`, `support@fng.com`
- Current admin session tracked separately

## 🎯 Demo Credentials

### Regular Users (for testing)
| Email | Phone | Password |
|-------|-------|----------|
| user@fng.com | 08012345678 | user123 |
| customer@fng.com | 08087654321 | customer123 |
| demo@fng.com | 07011111111 | demo123 |

### Admin Users (for testing)
| Email | Password | Role |
|-------|----------|------|
| admin@fng.com | admin123 | Super Admin |
| manager@fng.com | manager123 | Manager |
| support@fng.com | support123 | Support |

## 🛡️ Security Best Practices

### For Users
1. **Use a unique password** - Don't reuse passwords from other sites
2. **Make it strong** - Meet all 5 security requirements if possible
3. **Change regularly** - Update your password every 90 days
4. **Keep it private** - Never share your credentials
5. **Log out properly** - Especially on shared devices

### For Administrators
1. **Extra strong passwords** - Use all security requirements
2. **Unique admin credentials** - Separate from personal accounts
3. **Regular updates** - Change admin password every 60 days
4. **Secure access** - Only from trusted devices
5. **Monitor activity** - Check for unauthorized access

## 🔔 Future Enhancements

### Coming Soon
- ✨ Two-factor authentication (2FA)
- ✨ Email verification for changes
- ✨ Password reset via email
- ✨ Login activity history
- ✨ Security notifications
- ✨ Biometric authentication (mobile)

## 📱 Mobile Responsive

The account security interface is **fully responsive** and works seamlessly on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

## 🎨 Visual Elements

### Icons Used
- 🔐 **Lock**: Password-related actions
- 📧 **Mail**: Email-related actions
- 👁️ **Eye**: Show/hide password toggle
- ✅ **CheckCircle**: Requirements met
- 🛡️ **Shield**: Security section
- 👑 **Crown**: Admin features
- ⚠️ **AlertCircle**: Warnings and tips

### Color Coding
- 🔵 **Blue**: Email actions
- 🟢 **Green**: Password actions, success states
- 🔴 **Red**: Errors, delete actions
- 🟠 **Orange**: Admin-specific features
- ⚪ **Gray**: Disabled/inactive states

## 💡 Tips & Tricks

### Strong Password Examples
- ✅ `MyD0g!sC00l` - Mix of everything
- ✅ `2024@FNG#App` - Includes year and special chars
- ✅ `P@ssW0rd!123` - Classic format with variation
- ❌ `password` - Too simple
- ❌ `12345678` - Only numbers
- ❌ `ABCDEFGH` - Only uppercase

### Email Change Tips
- Keep your old email accessible in case you need to verify
- Make sure the new email is active and you have access
- Update your email in other connected services
- Remember to use the new email for future logins

### Password Change Tips
- Write down your new password temporarily (keep it secure!)
- Test logging out and back in immediately
- Update saved passwords in your browser
- Clear old "Remember Me" data if changing password

## 🐛 Troubleshooting

### "Incorrect Password" Error
- Double-check you're entering your current password correctly
- Make sure Caps Lock is off
- Try copying from a password manager if you use one

### "Email Already Registered" Error
- This email is already in use by another account
- Try a different email address
- Contact support if you believe this is an error

### "Password Too Weak" Error
- Check the strength indicators
- Make sure you meet at least 4 of the 5 requirements
- Try adding more variety to your password

### Changes Not Saving
- Make sure your browser allows localStorage
- Check that you have a stable internet connection
- Try refreshing the page and attempting again

## 📊 Statistics

### Security Improvements
- **5-point** password validation system
- **Real-time** strength feedback
- **Instant** validation of email format
- **Duplicate** email prevention
- **Secure** password storage (localStorage)

## 🎉 Success Indicators

When you successfully update your credentials:
- ✅ Green toast notification appears
- ✅ Dialog closes automatically
- ✅ You stay logged in
- ✅ Changes take effect immediately
- ✅ Remember Me updates if active

## 📝 Notes

- All changes are **immediate** - no email verification required (coming soon!)
- **Remember Me** feature automatically updates with new credentials
- Demo users cannot change their email to an admin email and vice versa
- Super admins can manage other admin accounts in Company Settings
- Regular users cannot access admin account settings

## 🔗 Related Features

- **Login System**: Uses updated credentials
- **Remember Me**: Syncs with credential changes
- **Profile Management**: Integrated in Profile section
- **Admin Management**: Super admin controls in Company Settings
- **Security Audit**: Activity tracking (coming soon)

---

## Quick Start

### Change Your Email (User)
```
1. Profile → Account Security → Change Email
2. Enter new email twice
3. Enter current password
4. Update Email
```

### Change Your Password (User)
```
1. Profile → Account Security → Change Password
2. Enter current password
3. Enter new password (check strength)
4. Confirm new password
5. Update Password
```

### Change Admin Credentials
```
1. Company Settings → Account Security tab
2. Choose Email or Password
3. Follow the prompts
4. Update when ready
```

---

**Built with security in mind for the FNG platform** 🔐
