# 📧 Email Verification - Demo Mode Guide

## Important: Demo Mode Active

Your FNG app is currently in **demo/prototype mode** and **does not send real emails**. This is because the app uses localStorage for data storage and has no email backend configured.

---

## How Email Verification Works in Demo Mode

### ✅ What Happens When You Sign Up

1. **You create an account** with your email
2. **Verification code is generated** (6-digit number)
3. **Code is displayed on-screen** instead of being sent via email
4. **You manually enter the code** to verify
5. **Account becomes active**

### 🔍 Where to Find Your Verification Code

When you reach the Email Verification screen:

1. **Look for the green box** that says "Your Verification Code"
2. **Click the "Show" button** to reveal the 6-digit code
3. **Copy or type the code** into the verification field
4. **Click "Verify Email"**

```
┌─────────────────────────────────────┐
│  Your Verification Code:            │
│  ┌───────┐                          │
│  │ Show  │  ← Click here            │
│  └───────┘                          │
│                                     │
│     1 2 3 4 5 6                     │
│     ─────────────                   │
│  Click to copy or type it below     │
└─────────────────────────────────────┘
```

---

## Step-by-Step Visual Guide

### Step 1: Sign Up
```
Create Account Form
    ↓
Fill in details
    ↓
Click "Create Account"
```

### Step 2: Email Verification Screen
```
┌──────────────────────────────────────────┐
│  ⚠️ Demo Mode: Code shown below          │
├──────────────────────────────────────────┤
│                                          │
│  Your Verification Code:                │
│  ┌────────┐                             │
│  │  Show  │  ← Click to reveal          │
│  └────────┘                             │
│                                          │
│  ╔══════════════════════════════╗       │
│  ║  Enter 6-digit code          ║       │
│  ╚══════════════════════════════╝       │
│                                          │
│  [Verify Email]                         │
│                                          │
└──────────────────────────────────────────┘
```

### Step 3: Enter Code
```
1. Click "Show" button
2. See code: 123456
3. Type code in input field
4. Click "Verify Email"
5. ✅ Email verified!
```

---

## Common Issues & Solutions

### ❌ "I didn't receive the verification code"

**Solution:** 
- The app doesn't send emails in demo mode
- Look for the **green box** on the verification screen
- Click **"Show"** to reveal your code
- The code is generated automatically

### ❌ "The code box is not showing"

**Solution:**
1. Refresh the page
2. Log out and sign up again
3. Check browser console (F12) - code is also logged there
4. Look for the green/amber alert box

### ❌ "Code expired"

**Solution:**
- Click **"Resend Code"** button
- New code will be generated
- Click **"Show"** to see the new code

### ❌ "Too many failed attempts"

**Solution:**
- Code automatically resets after 5 failed attempts
- New code is generated
- Look for the new code in the green box

---

## Why No Real Emails?

### Current Setup (Demo Mode)
```
User Signs Up
    ↓
Code Generated Locally
    ↓
Code Stored in localStorage
    ↓
Code Displayed On-Screen  ← You are here
    ↓
User Enters Code
    ↓
Account Verified ✅
```

### Production Setup (With Email Backend)
```
User Signs Up
    ↓
Code Generated
    ↓
Email Sent via SMTP/API
    ↓
User Checks Email Inbox
    ↓
User Enters Code from Email
    ↓
Account Verified ✅
```

**Your app is missing:** Email sending service (SMTP or API like SendGrid, Mailgun, etc.)

---

## How to Enable Real Email Sending

To make your app send real emails, you need to:

### Option 1: Add Email API Service

**Using SendGrid (Recommended):**
```typescript
// Install SendGrid
npm install @sendgrid/mail

// Configure in your backend
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: userEmail,
  from: 'noreply@fng.ng',
  subject: 'Verify Your Email',
  text: `Your verification code is: ${code}`,
  html: `<strong>Your verification code is: ${code}</strong>`,
};

await sgMail.send(msg);
```

**Cost:** Free tier available (100 emails/day)

### Option 2: Use Firebase Authentication

```typescript
// Firebase handles email verification automatically
import { sendEmailVerification } from 'firebase/auth';

await sendEmailVerification(user);
```

**Cost:** Free tier available

### Option 3: Custom SMTP Server

```typescript
// Using Nodemailer
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

await transporter.sendMail({
  from: 'noreply@fng.ng',
  to: userEmail,
  subject: 'Verify Your Email',
  text: `Your verification code is: ${code}`
});
```

**Cost:** Free with Gmail (500 emails/day limit)

---

## Current Workaround (For Testing)

### For Developers/Testers:

1. **Browser Console Method:**
   ```javascript
   // Open browser console (F12)
   // Code is logged automatically:
   // 📧 Verification Code: 123456
   ```

2. **LocalStorage Method:**
   ```javascript
   // In browser console:
   JSON.parse(localStorage.getItem('emailVerifications'))
   // Shows all verification codes
   ```

3. **On-Screen Display (Current):**
   - Green box shows code directly
   - No need to check console

### For End Users:

**Just look at the green box on screen!** 
- Click "Show"
- Copy the 6-digit code
- Enter it
- Done!

---

## Features That Work in Demo Mode

✅ **Account creation**  
✅ **Code generation**  
✅ **Code verification**  
✅ **Account activation**  
✅ **Code expiration (10 minutes)**  
✅ **Code resend functionality**  
✅ **Failed attempt tracking**  
✅ **Automatic code reset**  

### Features That Don't Work:

❌ **Real email delivery**  
❌ **Inbox notifications**  
❌ **Email spam folder check**  

---

## Testing the Email Verification

### Test Scenario 1: Successful Verification
```
1. Sign up with: test@example.com
2. Go to verification screen
3. Click "Show" button
4. See code: 456789
5. Type: 456789
6. Click "Verify Email"
7. ✅ Success!
```

### Test Scenario 2: Wrong Code
```
1. Sign up
2. See code: 123456
3. Type wrong code: 999999
4. Click "Verify"
5. ❌ "Invalid verification code"
6. Try again with correct code
7. ✅ Success!
```

### Test Scenario 3: Code Resend
```
1. On verification screen
2. Click "Resend Code"
3. Wait 60 seconds countdown
4. New code generated
5. Click "Show" to see new code
6. Enter new code
7. ✅ Success!
```

---

## Quick Reference

### Where is My Code?

```
Email Verification Screen
    ↓
Look for green box
    ↓
"Your Verification Code:"
    ↓
[Show] button
    ↓
Click it
    ↓
See: 123456
    ↓
Type in field below
    ↓
Verify ✅
```

### Code Properties

| Property | Value |
|----------|-------|
| **Length** | 6 digits |
| **Format** | Numbers only (000000-999999) |
| **Expiration** | 10 minutes |
| **Resend Cooldown** | 60 seconds |
| **Max Attempts** | 5 before reset |
| **Display Location** | Green box on verification screen |

---

## Security Notes

Even in demo mode, the app still:

✅ **Validates codes** before accepting  
✅ **Expires old codes** (10 min timeout)  
✅ **Limits attempts** (5 max)  
✅ **Enforces cooldown** (60s between resends)  
✅ **Prevents reuse** (codes marked as used)  

The only difference is the **delivery method** (on-screen vs email).

---

## Troubleshooting Checklist

- [ ] Are you on the Email Verification screen?
- [ ] Do you see a green box?
- [ ] Did you click the "Show" button?
- [ ] Is the code visible (6 digits)?
- [ ] Did you type all 6 digits correctly?
- [ ] Is the code still valid (< 10 minutes old)?
- [ ] Did you try fewer than 5 times?

If all checked and still not working:
1. Click "Resend Code"
2. Get new code
3. Try again

---

## For Production Deployment

### Before Going Live:

1. **Choose email service:**
   - SendGrid (Recommended)
   - Mailgun
   - AWS SES
   - Firebase Auth
   - Custom SMTP

2. **Set up backend:**
   - Create API endpoint for sending emails
   - Store API keys securely
   - Configure email templates

3. **Update code:**
   - Replace on-screen display with actual email sending
   - Remove demo mode alerts
   - Add proper error handling

4. **Test thoroughly:**
   - Test with real email addresses
   - Check spam folders
   - Verify delivery rates
   - Test different email providers

5. **Monitor:**
   - Track delivery success rate
   - Monitor bounce rates
   - Check spam complaints
   - Review failed sends

---

## Summary

### Current State (Demo Mode)
```
✅ Works perfectly for testing
✅ No email service needed
✅ Code shown on-screen
✅ Instant verification
✅ No setup required
```

### Future State (Production)
```
⏳ Requires email service
⏳ Backend API needed
⏳ Email templates needed
⏳ SMTP/API credentials needed
⏳ Monitoring required
```

### How to Use Now

1. **Sign up** with any email
2. **Look for green box** on verification screen
3. **Click "Show"** button
4. **Copy the 6-digit code**
5. **Paste in input field**
6. **Click "Verify Email"**
7. **Done!** ✅

---

## Support

**Having trouble?**
- The code is in the **green box**
- Click **"Show"** to reveal it
- Type the **6 digits** exactly
- Click **"Verify Email"**

**Still stuck?**
- Click **"Resend Code"** for a new one
- Check browser console (F12) for logged code
- Sign out and try again

---

**Remember: This is demo mode - the code is shown on your screen, not sent to your email!** 📱✨
