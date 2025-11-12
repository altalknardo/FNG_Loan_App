# Complete Signup & Verification Flow

## Overview
This document describes the complete user journey from signup to phone verification and authentication.

---

## 📋 **SIGNUP FLOW (4 Steps)**

### **Step 1: Basic Information**
**User Actions:**
- Enters full name (required - must have first and last name)
- Enters phone number (required - Nigerian format)
- Enters email (optional - for account recovery)

**Validation:**
1. ✅ Full name validation (must have at least 2 words)
2. ✅ Phone number format validation (`/^(\+?234|0)?[789]\d{9}$/`)
3. ✅ Email format validation (if provided)
4. ✅ **API Call: `checkPhoneExists(phoneNumber)`**
   - Checks if phone number is already registered
   - Shows loading state: "Checking..."
   - If exists → Error: "This phone number is already registered. Please login instead."
   - If API fails → Falls back to localStorage check

**Phone Normalization:**
- Converts phone to standard format: `+234XXXXXXXXXX`
- Handles: `08012345678`, `2348012345678`, `+2348012345678`

**UI State:**
- Phone input disabled during check
- "Next" button shows "Checking..." spinner

---

### **Step 2: Create Password**
**User Actions:**
- Enters password
- Confirms password

**Validation:**
1. ✅ Password required
2. ✅ Minimum 6 characters
3. ✅ Must contain letters AND numbers
4. ✅ Passwords must match

**Features:**
- Password strength indicator (Weak/Medium/Strong)
- Show/hide password toggle
- Real-time password match confirmation

**UI State:**
- Password strength bar with color coding
- Green checkmark when passwords match

---

### **Step 3: Address Details**
**User Actions:**
- Enters street address
- Enters city
- Enters state

**Validation:**
1. ✅ All fields required
2. ✅ No empty strings

**UI State:**
- Simple form with 3 fields

---

### **Step 4: Terms & Agreement**
**User Actions:**
- Reviews entered information
- Accepts Terms and Conditions
- Accepts Privacy Policy

**Validation:**
1. ✅ Both checkboxes must be checked

**UI State:**
- Shows review summary of all entered data
- Two checkboxes for agreements

---

## 🚀 **SUBMISSION & API CALL**

### **When User Clicks "Create Account":**

1. **Final Validation:**
   - Validates Step 4 (terms acceptance)
   - If invalid → Shows error, stops

2. **Prepare Data:**
   ```typescript
   {
     fullName: "John Doe",
     email: "john@example.com" (optional),
     phoneNumber: "+2348012345678",
     password: "password123",
     address: "123 Main Street",
     city: "Lagos",
     state: "Lagos"
   }
   ```

3. **API Call: `signUp(signupData)`**
   - **Endpoint:** `POST /auth/signup`
   - **Loading State:** Button shows "Creating Account..." spinner
   - **Request:** Sends user data to backend

4. **Backend Processing (Expected):**
   - Creates user account
   - Hashes password
   - Generates OTP code
   - **Sends OTP via SMS to user's phone**
   - Returns user data with `phoneVerified: false`

5. **Success Response Handling:**
   ```typescript
   {
     success: true,
     message: "Account created successfully! Please verify your phone number.",
     data: {
       user: {
         id: "user-id",
         fullName: "John Doe",
         phoneNumber: "+2348012345678",
         phoneVerified: false,
         // ... other fields
       },
       token: "jwt-token" // optional
     }
   }
   ```

6. **Local Storage (Backward Compatibility):**
   - Stores auth token (if provided)
   - Saves user to `registeredUsers` array
   - Saves user to `users` array
   - ⚠️ **Note:** Password stored in plain text (for backward compatibility only)

7. **Success Toast:**
   - Shows: "Account created successfully! Please verify your phone number."

8. **Navigation:**
   - Calls `onSignUp(phoneNumber, userData)`
   - App.tsx receives this and shows SMS verification screen

---

## 📱 **PHONE VERIFICATION FLOW**

### **Component: SMSVerification**

### **Initialization (On Mount):**
1. **Demo Code Generation:**
   - Generates 6-digit code for demo/fallback
   - Logs to console: "📱 SMS Verification Code (Demo): XXXXXX"
   - Stores in localStorage for fallback

2. **UI Display:**
   - Shows phone number (formatted: `+234 XXX XXX XXXX`)
   - Shows message: "We've sent a 6-digit verification code to [phone]"
   - Input field for 6-digit code

---

### **User Enters OTP Code:**

1. **Input Validation:**
   - Only accepts digits
   - Maximum 6 digits
   - Auto-focus on input
   - Shows remaining digits count

2. **When User Clicks "Verify Phone Number":**

   **Validation:**
   - ✅ Code must be 6 digits
   - ✅ Code must not be empty

   **API Call: `verifyPhone(phoneNumber, otp)`**
   - **Endpoint:** `POST /auth/verify-phone`
   - **Request Body:**
     ```json
     {
       "phoneNumber": "+2348012345678",
       "otp": "123456"
     }
     ```
   - **Loading State:** Button shows "Verifying..." spinner
   - **Attempt Counter:** Increments on each attempt

   **Backend Processing (Expected):**
   - Validates OTP code
   - Checks expiration (should be within 10 minutes)
   - Marks user as verified: `phoneVerified: true`
   - Returns success response

   **Success Response:**
   ```json
   {
     "success": true,
     "message": "Phone verified successfully"
   }
   ```

   **Success Handling:**
   1. Updates localStorage:
      - Sets `phoneVerified: true` in users array
      - Marks verification as complete
   2. Shows success toast
   3. Calls `onVerificationComplete()`

   **Error Handling:**
   - If OTP invalid → Shows error message
   - If OTP expired → Shows error message
   - After 5 failed attempts → Auto-triggers resend

---

### **Resend OTP Flow:**

1. **When User Clicks "Resend Code":**

   **Validation:**
   - ✅ 60-second cooldown (prevents spam)
   - ✅ Button disabled during cooldown
   - ✅ Shows countdown: "Resend Code (45s)"

   **API Call: `resendOTP(phoneNumber)`**
   - **Endpoint:** `POST /auth/resend-otp`
   - **Request Body:**
     ```json
     {
       "phoneNumber": "+2348012345678"
     }
     ```
   - **Loading State:** Button shows "Sending..." spinner

   **Backend Processing (Expected):**
   - Generates new OTP code
   - Sends new OTP via SMS
   - Updates expiration time
   - Rate limiting (recommended: 3-5 per hour)

   **Success Response:**
   ```json
   {
     "success": true,
     "message": "OTP sent successfully"
   }
   ```

   **Success Handling:**
   1. Generates demo code for fallback
   2. Resets attempt counter
   3. Clears verification code input
   4. Starts 60-second cooldown
   5. Shows success toast

   **Error Handling:**
   - If API fails → Falls back to localStorage method
   - Generates code locally for demo
   - Shows: "New verification code generated (fallback mode)"

---

## ✅ **VERIFICATION COMPLETE**

### **When Verification Succeeds:**

1. **`onVerificationComplete()` Called:**
   - App.tsx receives callback

2. **Authentication Setup:**
   ```typescript
   // Find user in localStorage
   const user = users.find(u => u.phoneNumber === phoneNumber);
   
   // Set user email/phone as identifier
   setUserEmail(user.email || user.phoneNumber);
   
   // Authenticate user
   setIsAuthenticated(true);
   setIsAdmin(false);
   
   // Hide verification screen
   setShowSMSVerification(false);
   setPendingVerificationPhone("");
   
   // Reset KYC status (user needs to complete KYC)
   setKycStatus("not_submitted");
   ```

3. **Navigation:**
   - User is now authenticated
   - App shows KYC registration screen (if not submitted)
   - Or shows dashboard (if KYC already submitted)

---

## 🔄 **COMPLETE FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER STARTS SIGNUP                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Basic Information                                 │
│  • Full Name                                                │
│  • Phone Number → API: checkPhoneExists()                   │
│  • Email (optional)                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Create Password                                    │
│  • Password (with strength indicator)                       │
│  • Confirm Password                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Address Details                                    │
│  • Street Address                                           │
│  • City                                                     │
│  • State                                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Terms & Agreement                                  │
│  • Review Information                                       │
│  • Accept Terms & Privacy                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  SUBMIT: API Call signUp()                                  │
│  POST /auth/signup                                           │
│  ↓                                                           │
│  Backend:                                                    │
│  • Creates account                                           │
│  • Generates OTP                                            │
│  • Sends OTP via SMS ←─── IMPORTANT                         │
│  • Returns user data                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  SMS VERIFICATION SCREEN                                    │
│  • Shows phone number                                       │
│  • User enters 6-digit OTP                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  VERIFY: API Call verifyPhone()                             │
│  POST /auth/verify-phone                                    │
│  ↓                                                           │
│  Backend:                                                    │
│  • Validates OTP                                            │
│  • Checks expiration                                        │
│  • Marks user as verified                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  VERIFICATION SUCCESS                                        │
│  • User authenticated                                       │
│  • phoneVerified: true                                      │
│  • Redirect to KYC or Dashboard                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔁 **RESEND OTP FLOW**

```
User clicks "Resend Code"
        │
        ▼
60-second cooldown check
        │
        ▼
API Call: resendOTP()
POST /auth/resend-otp
        │
        ▼
Backend sends new OTP via SMS
        │
        ▼
Success → New code generated
        │
        ▼
60-second cooldown starts
```

---

## ⚠️ **IMPORTANT BACKEND REQUIREMENTS**

### **1. Signup Endpoint (`POST /auth/signup`)**
- ✅ Create user account
- ✅ Hash password (never store plain text)
- ✅ **Generate OTP code**
- ✅ **Send OTP via SMS to user's phone** ← CRITICAL
- ✅ Return user data with `phoneVerified: false`

### **2. Verify Phone Endpoint (`POST /auth/verify-phone`)**
- ✅ Validate OTP code
- ✅ Check OTP expiration (10 minutes recommended)
- ✅ Check if OTP matches
- ✅ Mark user as verified: `phoneVerified: true`
- ✅ Return success/error response

### **3. Resend OTP Endpoint (`POST /auth/resend-otp`)**
- ✅ Generate new OTP code
- ✅ **Send new OTP via SMS** ← CRITICAL
- ✅ Update expiration time
- ✅ Rate limiting (3-5 per hour recommended)
- ✅ Return success/error response

### **4. Check Phone Endpoint (`GET /auth/check-phone/:phoneNumber`)**
- ✅ Check if phone number exists in database
- ✅ Return `{ exists: true/false }`

---

## 🛡️ **SECURITY CONSIDERATIONS**

1. **OTP Expiration:** 10 minutes recommended
2. **OTP Attempts:** Lock after 5 failed attempts
3. **Resend Rate Limit:** 3-5 per hour per phone number
4. **Password:** Never store in plain text (backend should hash)
5. **Token:** Store JWT token securely in localStorage
6. **HTTPS:** All API calls should use HTTPS in production

---

## 📊 **STATE MANAGEMENT**

### **SignUp Component States:**
- `step`: Current step (1-4)
- `fullName`, `email`, `phone`: Step 1 data
- `password`, `confirmPassword`: Step 2 data
- `address`, `city`, `state`: Step 3 data
- `acceptTerms`, `acceptPrivacy`: Step 4 data
- `isLoading`: API call in progress
- `checkingPhone`: Phone validation in progress
- `error`: Error message

### **SMSVerification Component States:**
- `verificationCode`: User-entered OTP
- `isVerifying`: Verification API call in progress
- `isResending`: Resend API call in progress
- `resendDisabled`: Cooldown active
- `countdown`: Seconds remaining for resend
- `attempts`: Number of verification attempts
- `error`: Error message

### **App.tsx States:**
- `isAuthenticated`: User authentication status
- `userEmail`: Current user identifier
- `showSMSVerification`: Show verification screen
- `pendingVerificationPhone`: Phone number to verify
- `kycStatus`: KYC submission status

---

## 🎯 **KEY POINTS**

1. **Multi-step form** with validation at each step
2. **API integration** for all operations (signup, verification, resend)
3. **Real-time phone validation** before proceeding
4. **Automatic OTP sending** by backend on signup
5. **Secure verification** via API with expiration
6. **Fallback support** to localStorage if API unavailable
7. **User-friendly errors** with clear messages
8. **Loading states** for all API operations
9. **Rate limiting** for resend functionality
10. **Seamless flow** from signup → verification → authentication

---

## 🔍 **ERROR SCENARIOS**

### **Signup Errors:**
- Phone already exists → "This phone number is already registered. Please login instead."
- Network error → "Network error. Please check your connection and try again."
- Validation error → Field-specific error messages
- Server error → "Registration failed. Please try again."

### **Verification Errors:**
- Invalid OTP → "Invalid verification code. Please try again."
- Expired OTP → "Verification code has expired. Please request a new one."
- Too many attempts → "Too many failed attempts. Please request a new code."
- Network error → "Network error. Please check your connection and try again."

### **Resend Errors:**
- Rate limit exceeded → "Too many requests. Please try again later."
- Network error → Falls back to localStorage method

---

This completes the entire signup and verification flow! 🎉

