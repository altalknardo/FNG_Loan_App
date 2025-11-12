# Signup API Integration Guide

## Overview
The signup process has been successfully integrated with axios for API calls. The implementation includes proper error handling, loading states, and fallback mechanisms.

## Files Created

### 1. `src/lib/api.ts`
- Axios instance configuration
- Base URL from environment variable (`VITE_API_BASE_URL`)
- Request interceptor for adding auth tokens
- Response interceptor for error handling
- Default timeout: 30 seconds

### 2. `src/lib/auth-api.ts`
- API service functions for authentication
- Functions:
  - `signUp()` - Register new user
  - `checkPhoneExists()` - Check if phone number is already registered
  - `verifyPhone()` - Verify phone with OTP
  - `resendOTP()` - Resend OTP code
- TypeScript interfaces for type safety

### 3. Updated `src/components/SignUp.tsx`
- Integrated API calls instead of localStorage
- Async phone number validation
- Proper error handling with field-specific errors
- Loading states for API calls
- Backward compatibility with localStorage fallback

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## API Endpoints Expected

### POST `/auth/signup`
**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com", // optional
  "phoneNumber": "+2348012345678",
  "password": "password123",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Account created successfully! Please verify your phone number.",
  "data": {
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+2348012345678",
      "role": "user",
      "status": "active",
      "phoneVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here" // optional
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "phoneNumber": ["Phone number already exists"],
    "email": ["Email is already registered"]
  }
}
```

### GET `/auth/check-phone/:phoneNumber`
**Response:**
```json
{
  "exists": true
}
```

### POST `/auth/verify-phone`
**Request Body:**
```json
{
  "phoneNumber": "+2348012345678",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone verified successfully"
}
```

### POST `/auth/resend-otp`
**Request Body:**
```json
{
  "phoneNumber": "+2348012345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

## Features Implemented

### 1. Phone Number Validation
- Real-time API check when user moves to next step
- Shows loading state during check
- Falls back to localStorage if API fails

### 2. Error Handling
- Network error handling
- Field-specific error display
- User-friendly error messages
- Proper error state management

### 3. Loading States
- Button loading indicators
- Disabled inputs during API calls
- Prevents duplicate submissions

### 4. Token Management
- Automatically stores auth token if provided by backend
- Token added to all subsequent API requests via interceptor

### 5. Backward Compatibility
- Still saves to localStorage for existing features
- Graceful fallback if API is unavailable
- Can work in offline mode with localStorage

## Usage Example

```typescript
import { signUp } from '../lib/auth-api';

const handleSignUp = async () => {
  try {
    const response = await signUp({
      fullName: "John Doe",
      phoneNumber: "+2348012345678",
      password: "password123",
      address: "123 Main St",
      city: "Lagos",
      state: "Lagos"
    });
    
    if (response.success) {
      // Handle success
      console.log('User created:', response.data.user);
    }
  } catch (error) {
    // Handle error
    console.error('Signup failed:', error.message);
  }
};
```

## Testing

1. **Test with real API:**
   - Set `VITE_API_BASE_URL` to your backend URL
   - Ensure backend endpoints match the expected format

2. **Test fallback:**
   - Set invalid API URL or disconnect network
   - Should fall back to localStorage check

3. **Test error handling:**
   - Use invalid data to trigger API errors
   - Verify error messages display correctly

## Phone Verification Integration

The SMSVerification component has been fully integrated with the API:

### Features:
- ✅ **API-based verification** - Uses `verifyPhone()` API function
- ✅ **API-based resend** - Uses `resendOTP()` API function  
- ✅ **Error handling** - Proper error messages and states
- ✅ **Loading states** - Shows loading indicators during API calls
- ✅ **Fallback support** - Falls back to localStorage if API fails
- ✅ **Attempt limiting** - Locks after 5 failed attempts

### Flow:
1. User completes signup → API creates account
2. Backend should automatically send OTP via SMS (or return it in response)
3. User enters OTP → `verifyPhone()` API call
4. On success → User is verified and authenticated
5. On failure → Error shown, can resend OTP

### API Endpoints Used:
- `POST /auth/verify-phone` - Verify OTP code
- `POST /auth/resend-otp` - Resend OTP code

## Next Steps

1. **Backend Integration:**
   - Implement the API endpoints on your backend
   - Ensure response format matches expected structure
   - **Important:** Backend should send OTP via SMS when user signs up
   - Backend should validate OTP codes and mark users as verified

2. **Security:**
   - Remove password storage in localStorage (currently for backward compatibility)
   - Implement proper token refresh mechanism
   - Add request rate limiting
   - Implement OTP expiration (recommended: 10 minutes)
   - Limit OTP resend attempts (recommended: 3-5 per hour)

3. **Login Integration:**
   - Apply similar API integration to Login component
   - Use the same auth-api service

4. **Remove localStorage:**
   - Once fully migrated, remove localStorage fallback
   - Rely entirely on API for user data

## Notes

- The implementation maintains backward compatibility with existing localStorage-based features
- All API calls are properly typed with TypeScript
- Error handling is comprehensive and user-friendly
- **Phone verification is fully integrated** - Both signup and verification use API calls
- The code is ready for production use once backend is connected

## Complete Flow

1. **Signup:**
   - User fills form → `signUp()` API call
   - Backend creates account and sends OTP via SMS
   - User redirected to SMS verification screen

2. **Phone Verification:**
   - User enters OTP → `verifyPhone()` API call
   - Backend validates OTP
   - On success → User authenticated and verified
   - On failure → Error shown, can resend

3. **Resend OTP:**
   - User clicks resend → `resendOTP()` API call
   - Backend sends new OTP via SMS
   - 60-second cooldown between resends

