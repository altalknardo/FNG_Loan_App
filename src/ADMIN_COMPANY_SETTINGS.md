# Admin Company Settings Documentation

## Overview
The FNG app now includes a Company Settings page in the Admin Mode where administrators can configure the company bank account details that will be displayed to customers during payment transactions.

## Features

### 1. Company Bank Account Management
Administrators can view, edit, and update the following details:
- **Bank Name**: The name of the company's bank
- **Account Number**: 10-digit company account number
- **Account Name**: The registered account name

### 2. Real-time Updates
- Changes made by admins are saved to localStorage
- Updates reflect immediately in user mode
- All payment transactions show the updated account details

### 3. Customer View Preview
- Shows a live preview of how customers will see the account details
- Helps admins verify information before saving

### 4. Validation
- All fields are required
- Account number must be at least 10 digits
- Prevents saving incomplete or invalid information

## How to Access

### Admin Mode:
1. Click the **"Admin Mode"** button in the header
2. Navigate to **"Settings"** in the sidebar (Building icon)
3. The Company Settings page will display

## Using the Company Settings Page

### Viewing Current Details:
The page displays the current company account details in read-only mode with:
- Bank Name
- Account Number (formatted for easy reading)
- Account Name
- Active status badge

### Editing Account Details:

1. **Click "Edit Account Details"** button
2. The form switches to edit mode with input fields
3. **Modify the details:**
   - Bank Name: Enter the bank name
   - Account Number: Enter 10-digit account number (with character counter)
   - Account Name: Enter the registered account name

4. **Save Changes:**
   - Click "Save Changes" button
   - System validates all fields
   - Shows success message upon saving
   - Switches back to view mode

5. **Cancel or Reset:**
   - **Cancel**: Discards changes and returns to view mode
   - **Reset** (↻ icon): Restores default values

### Validation Rules:
- ✅ All fields must be filled
- ✅ Account number must be exactly 10 digits
- ❌ Cannot save empty fields
- ❌ Cannot save incomplete account numbers

## Impact on User Mode

### Where Customer Sees This Information:

1. **Contributions (Daily Savings):**
   - When customer clicks "Contribute"
   - Payment Dialog shows company account details
   - Customer transfers money to this account

2. **Loan Repayments:**
   - When customer clicks "Make Payment" on active loan
   - Payment Dialog shows company account details
   - Customer transfers weekly installment to this account

### Payment Flow:
```
Customer Initiates Payment
    ↓
Payment Dialog Opens
    ↓
Shows Company Account Details
(From Admin Settings)
    ↓
Customer Transfers to Account
    ↓
Customer Confirms Payment
    ↓
Balance Updated
```

## Data Storage

### LocalStorage Key:
```javascript
"companyAccount"
```

### Data Structure:
```javascript
{
  bankName: string,      // e.g., "First Bank of Nigeria"
  accountNumber: string, // e.g., "0123456789"
  accountName: string    // e.g., "FNG FINANCIAL SERVICES"
}
```

### Default Values:
If no settings exist in localStorage, the system uses these defaults:
- **Bank Name**: First Bank of Nigeria
- **Account Number**: 0123456789
- **Account Name**: FNG FINANCIAL SERVICES

## Additional Settings Display

The page also shows read-only information about:
- Company Name: FNG Financial Services
- Currency: Nigerian Naira (₦)
- Interest Rate: 5% per loan
- Loan Period Options: 4, 8, 12, 16, 20 weeks

*Note: These are informational only and cannot be edited in the current version.*

## Security & Best Practices

### Important Information Section:
The page includes security reminders:
- ✅ Details shown to all customers
- ✅ Ensure accuracy before saving
- ✅ Changes take effect immediately
- ✅ Used for contributions and loan repayments
- ✅ Keep information secure

### Recommendations:
1. **Verify Details**: Double-check account information before saving
2. **Test in User Mode**: Switch to user mode to see how it appears to customers
3. **Regular Reviews**: Periodically review and update if bank details change
4. **Authorized Access**: Only allow authorized personnel to modify these settings
5. **Backup Information**: Keep a record of account details outside the system

## Testing the Feature

### Test Scenario 1: Update Company Account
1. Switch to Admin Mode
2. Navigate to Settings
3. Click "Edit Account Details"
4. Change bank name to "Access Bank"
5. Change account number to "1234567890"
6. Change account name to "FNG SERVICES LTD"
7. Click "Save Changes"
8. Verify success message

### Test Scenario 2: Verify in User Mode
1. Stay in Admin Mode with updated details
2. Switch to User Mode
3. Go to Contributions tab
4. Click "Contribute ₦50"
5. Select payment method
6. Verify new company account details appear
7. Verify account number shows "1234567890"
8. Verify bank name shows "Access Bank"

### Test Scenario 3: Validation
1. Admin Mode → Settings
2. Click "Edit Account Details"
3. Clear account number
4. Try to save
5. Verify error: "All fields are required"
6. Enter only 5 digits in account number
7. Try to save
8. Verify error: "Account number must be at least 10 digits"

### Test Scenario 4: Cancel Changes
1. Admin Mode → Settings
2. Click "Edit Account Details"
3. Change all fields
4. Click "Cancel"
5. Verify changes are discarded
6. Verify original values are shown

### Test Scenario 5: Reset to Defaults
1. Admin Mode → Settings
2. Click "Edit Account Details"
3. Enter custom values
4. Click Reset button (↻)
5. Verify fields reset to default values

## Technical Implementation

### Components Modified:
1. **CompanySettings.tsx** (NEW)
   - Admin settings page
   - Edit/view modes
   - Validation logic
   - LocalStorage integration

2. **PaymentDialog.tsx** (UPDATED)
   - Reads company account from localStorage
   - Auto-updates when settings change
   - Shows dynamic account details

3. **App.tsx** (UPDATED)
   - Added Company Settings route
   - Added Settings navigation item
   - Imported Building2 icon

## Future Enhancements

Potential improvements:
1. **Multiple Accounts**: Support different accounts for loans vs contributions
2. **Account Verification**: Integrate with banking API to verify account details
3. **Change History**: Track who changed settings and when
4. **Email Notifications**: Notify admin when settings are changed
5. **Additional Settings**: Interest rates, loan periods, fees, etc.
6. **Multi-currency Support**: Support for multiple currencies
7. **Company Logo**: Upload and display company logo
8. **Contact Information**: Phone, email, address fields

## Troubleshooting

### Issue: Changes not reflecting in User Mode
**Solution**: 
- Wait 1 second for auto-refresh
- Or switch tabs to force refresh
- Or reload the page

### Issue: Cannot save account details
**Solution**:
- Ensure all fields are filled
- Verify account number is 10 digits
- Check for validation error messages

### Issue: Settings reset to default
**Solution**:
- Check if localStorage is enabled
- Ensure browser is not in private/incognito mode
- Check browser console for errors

## Support

For assistance with Company Settings:
1. Verify you're in Admin Mode
2. Check that you have proper permissions
3. Review validation requirements
4. Test in User Mode to verify changes
5. Check browser console for errors

---

**Last Updated**: October 16, 2025  
**Version**: 1.0  
**Feature**: Admin Company Settings
