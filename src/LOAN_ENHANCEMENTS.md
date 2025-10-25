# Loan Enhancement Features Documentation

## Version 3.8 - Loan Management Enhancements

This document describes the new loan management features added to the FNG loan and contribution app.

---

## New Features Overview

### 1. Direct Loan Amount Input
**Feature**: Customers can now enter the exact loan amount they want instead of only using the slider.

**How it Works**:
- A numeric input field is displayed above the slider in the loan application dialog
- Customers can type the exact amount they need (e.g., ₦150,000)
- The slider automatically updates to match the typed amount
- The amount is validated to ensure it's within the loan type's min/max range
- Both input methods (typing and sliding) work seamlessly together

**User Experience**:
- Input field accepts numbers only
- Currency symbol (₦) is displayed as a prefix
- Real-time validation ensures amount stays within valid range
- Current formatted amount is displayed below the input for clarity

**Implementation Details**:
- Uses `loanAmountInput` state to track the typed value
- `handleLoanAmountInputChange()` function validates and clamps values
- Slider and input are synchronized via `handleSliderChange()`

---

### 2. Guarantor SMS Notification
**Feature**: Automatic SMS notification sent to guarantor when a loan application is submitted.

**How it Works**:
1. When customer submits loan application with guarantor details
2. System sends SMS to guarantor's phone number
3. Guarantor receives notification about being listed as guarantor
4. Guarantor is informed they will be contacted for verification

**SMS Message Format**:
```
Dear [Guarantor Name], you have been listed as a guarantor for a loan 
application of ₦[Amount] on FNG. You will be contacted for verification. 
If you did not consent to this, please contact us immediately.
```

**Implementation**:
- `sendGuarantorSMS()` function handles SMS sending
- In demo mode, notifications are stored in localStorage under "smsNotifications"
- In production, this would integrate with SMS API (Twilio, Africa's Talking, etc.)
- SMS details include: phone number, guarantor name, loan amount, timestamp

**Data Storage** (Demo):
```json
{
  "id": 1697812345678,
  "phone": "08012345678",
  "name": "John Doe",
  "message": "Dear John Doe, you have been...",
  "timestamp": "2025-10-18T10:30:00.000Z",
  "type": "guarantor_notification"
}
```

**Success Message**:
- Toast notification confirms SMS was sent
- Shows: "Loan application submitted! Guarantor has been notified via SMS."

---

### 3. Loan Repayment Reminder System
**Feature**: Automated reminder system that notifies customers about upcoming and overdue loan payments.

**Reminder Schedule**:
- **3 days before**: Advance notice
- **1 day before**: Final reminder
- **On payment day**: Urgent reminder
- **After due date**: Overdue alert with auto-deduction

**How it Works**:
1. System checks all active loans every minute
2. Calculates days until next payment for each loan
3. Sends notifications at appropriate times
4. Displays reminder cards on dashboard

**Reminder Display**:
- Shows on Dashboard component
- Card with loan details, due date, and amount
- Color-coded badges:
  - **Orange "Due Today"**: Payment due today
  - **Yellow "Due Tomorrow"**: Payment due tomorrow
  - **Blue**: Payment due in 2-7 days
- "Pay Now" button navigates directly to loans page
- Dismiss button to hide reminder temporarily

**Notification Types**:
- **Info Toast**: 3+ days before (5 second duration)
- **Warning Toast**: Payment due today (10 second duration with action button)
- **Error Toast**: Overdue payment detected

**Data Storage**:
```json
{
  "id": 1697812345678,
  "loanId": 1,
  "amount": 100,
  "paymentDate": "2025-10-20",
  "timing": "today",
  "timestamp": "2025-10-18T08:00:00.000Z",
  "message": "Loan payment of ₦100 is due today"
}
```

---

### 4. Auto-Deduction from Contributions on Default
**Feature**: Automatic deduction from contribution balance when loan payment is overdue.

**How it Works**:
1. System detects when a loan payment becomes overdue (past due date)
2. Checks customer's contribution balance
3. If sufficient funds available:
   - Automatically deducts payment amount from contributions
   - Updates loan repayment amount
   - Moves next payment date forward by 7 days
   - Records transaction in history
   - Logs deduction for audit trail
4. If insufficient funds:
   - Shows error notification
   - Advises customer to make payment immediately

**Auto-Deduction Process**:
```
1. Check if payment is overdue (nextPayment < today)
2. Verify auto-deduction hasn't been done already
3. Check contribution balance >= weekly payment amount
4. Deduct from contributions
5. Update loan status
6. Log transaction
7. Notify customer
```

**Transaction Log**:
```json
{
  "id": 1697812345678,
  "type": "loan_payment",
  "amount": 100,
  "date": "2025-10-18",
  "time": "10:30 AM",
  "description": "Auto-deduction from contributions for Loan #1",
  "status": "completed"
}
```

**Auto-Deduction Log**:
```json
{
  "loanId": 1,
  "paymentDate": "2025-10-13",
  "amount": 100,
  "timestamp": "2025-10-18T10:30:00.000Z",
  "type": "auto_deduction"
}
```

**Customer Notifications**:
- **Success**: "Auto-deducted ₦100 from your contributions for overdue Loan #1"
- **Failure**: "Insufficient contribution balance to cover overdue payment for Loan #1. Please make a payment immediately."

**Safeguards**:
- Deduction only happens once per missed payment
- Checks deduction log to prevent duplicate deductions
- Only applies to active loans
- Maintains full audit trail

---

## Component Integration

### LoanSection.tsx
**Changes**:
- Added `loanAmountInput` state for direct input
- Added `handleLoanAmountInputChange()` function
- Added `handleSliderChange()` function for slider updates
- Added `sendGuarantorSMS()` function
- Modified `handleApplyLoan()` to send SMS notification
- Updated loan application dialog with input field

**New UI Elements**:
- Numeric input field with ₦ prefix
- Synchronized slider below input
- Range display showing min-max values

### LoanReminderSystem.tsx (New Component)
**Purpose**: Manages all loan payment reminders and auto-deductions

**Key Functions**:
- `checkReminders()`: Scans loans and sends reminders
- `checkOverduePayments()`: Identifies overdue loans
- `handleAutoDeduction()`: Processes automatic deductions
- `sendPaymentReminder()`: Creates and displays reminders

**Props**:
- `onNavigate`: Function to navigate between tabs

**Renders**:
- Overdue payment alerts (red)
- Upcoming payment cards (blue)
- Action buttons (Pay Now, Dismiss)

### Dashboard.tsx
**Changes**:
- Imported `LoanReminderSystem` component
- Added `<LoanReminderSystem onNavigate={onNavigate} />` after balance card

---

## localStorage Keys Used

| Key | Purpose | Data Type |
|-----|---------|-----------|
| `smsNotifications` | Stores sent SMS records | Array of SMS objects |
| `paymentReminders` | Stores sent reminder records | Array of reminder objects |
| `autoDeductions` | Logs all auto-deductions | Array of deduction records |
| `activeLoans` | Current active loans | Array of loan objects |
| `totalContributions` | Contribution balance | Number (string) |
| `transactions` | Transaction history | Array of transaction objects |

---

## User Flow Examples

### Example 1: Applying for a Loan with Direct Input
1. Customer selects "SME Loan" tab
2. Clicks "Apply for SME Loan" button
3. Types "₦250000" in the amount input field
4. Slider automatically adjusts to ₦250,000
5. Selects 24-week repayment period
6. Enters loan purpose
7. Fills in guarantor details (name, phone, address)
8. Accepts terms and conditions
9. Clicks "Submit Application"
10. SMS sent to guarantor: "Dear John Doe, you have been listed..."
11. Success message: "SME Loan application submitted! Guarantor has been notified via SMS."

### Example 2: Receiving Payment Reminder
1. Customer has active loan with payment due October 20
2. On October 17 (3 days before):
   - Info toast appears: "Loan payment of ₦100 is due in 3 days"
3. On October 19 (1 day before):
   - Info toast appears: "Loan payment of ₦100 is due tomorrow"
4. On October 20 (payment day):
   - Dashboard shows reminder card with "Due Today" badge
   - Warning toast with "Pay Now" action button
5. Customer clicks "Pay Now" → navigates to Loans tab
6. Makes payment successfully

### Example 3: Auto-Deduction on Default
1. Customer has active loan with payment due October 13
2. Customer forgets to make payment
3. On October 14:
   - System detects overdue payment
   - Checks contribution balance: ₦3,200
   - Weekly payment due: ₦100
   - Automatically deducts ₦100 from contributions
   - New contribution balance: ₦3,100
   - Loan repaid amount increases by ₦100
   - Next payment date moves to October 20
4. Transaction added to history:
   - "Auto-deduction from contributions for Loan #1"
5. Customer sees notification:
   - "Auto-deducted ₦100 from your contributions for overdue Loan #1"

### Example 4: Insufficient Funds for Auto-Deduction
1. Customer has overdue payment of ₦100
2. Contribution balance is only ₦50
3. System attempts auto-deduction
4. Insufficient funds detected
5. Error notification:
   - "Insufficient contribution balance to cover overdue payment for Loan #1. Please make a payment immediately."
6. Red alert banner on dashboard:
   - "You have 1 overdue payment(s)"
   - "Please make a payment immediately to avoid account suspension"

---

## Admin Integration

### Viewing SMS Notifications (Admin)
Admins can view sent SMS notifications in localStorage:
```javascript
const sms = JSON.parse(localStorage.getItem("smsNotifications") || "[]");
console.table(sms);
```

### Viewing Auto-Deductions (Admin)
```javascript
const deductions = JSON.parse(localStorage.getItem("autoDeductions") || "[]");
console.table(deductions);
```

### Viewing Payment Reminders (Admin)
```javascript
const reminders = JSON.parse(localStorage.getItem("paymentReminders") || "[]");
console.table(reminders);
```

---

## Production Integration Guide

### SMS API Integration
Replace the mock `sendGuarantorSMS()` function with real SMS API:

**Example using Africa's Talking**:
```typescript
const sendGuarantorSMS = async (phone: string, name: string, amount: number) => {
  const message = `Dear ${name}, you have been listed as a guarantor for a loan application of ${formatCurrency(amount)} on FNG. You will be contacted for verification. If you did not consent to this, please contact us immediately.`;
  
  const response = await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': process.env.AFRICASTALKING_API_KEY
    },
    body: new URLSearchParams({
      username: process.env.AFRICASTALKING_USERNAME,
      to: phone,
      message: message
    })
  });
  
  return response.json();
};
```

### Email Integration (Alternative/Additional)
Send email notifications alongside SMS:
```typescript
const sendGuarantorEmail = async (email: string, name: string, amount: number) => {
  // Use SendGrid, AWS SES, or similar
  await sendEmail({
    to: email,
    subject: 'Guarantor Notification - FNG Loan Application',
    body: `Dear ${name}...`
  });
};
```

---

## Testing Guide

### Test Scenario 1: Direct Loan Amount Input
1. Open loan application dialog
2. Type various amounts (valid and invalid)
3. Verify slider updates correctly
4. Try amounts below minimum (should clamp to minimum)
5. Try amounts above maximum (should clamp to maximum)
6. Verify formatted amount displays correctly

### Test Scenario 2: Guarantor SMS
1. Fill loan application with guarantor details
2. Submit application
3. Check localStorage: `localStorage.getItem("smsNotifications")`
4. Verify SMS record exists with correct phone, name, amount
5. Verify success toast message appears

### Test Scenario 3: Payment Reminders
1. Create active loan with next payment in 3 days
2. Wait or manually change system date
3. Verify reminder appears on dashboard
4. Click "Pay Now" → should navigate to loans
5. Dismiss reminder → should hide card
6. Check localStorage: `localStorage.getItem("paymentReminders")`

### Test Scenario 4: Auto-Deduction
1. Create active loan with overdue payment
2. Set contribution balance to ₦500
3. Set weekly payment to ₦100
4. Reload page or trigger check
5. Verify ₦100 deducted from contributions
6. Verify loan repaid amount increased
7. Check transaction history for auto-deduction record
8. Check localStorage: `localStorage.getItem("autoDeductions")`

### Test Scenario 5: Insufficient Funds
1. Create overdue loan payment
2. Set contribution balance to ₦50
3. Set weekly payment to ₦100
4. Trigger auto-deduction check
5. Verify error notification appears
6. Verify no deduction occurred
7. Verify overdue alert shows on dashboard

---

## Best Practices

### For Users
1. **Enter Exact Amount**: Use the input field when you know the exact amount needed
2. **Use Slider for Exploration**: Use slider to explore different loan amounts
3. **Verify Guarantor Contact**: Ensure guarantor phone number is correct before submitting
4. **Act on Reminders**: Pay attention to payment reminders to avoid auto-deductions
5. **Maintain Contribution Balance**: Keep sufficient balance for emergency auto-deductions

### For Developers
1. **Validate Input**: Always validate loan amounts against min/max ranges
2. **Prevent Duplicates**: Check deduction logs before processing auto-deductions
3. **Audit Trail**: Maintain comprehensive logs of all automated actions
4. **Error Handling**: Gracefully handle SMS API failures
5. **Testing**: Test all edge cases (insufficient funds, duplicate deductions, etc.)

---

## Troubleshooting

### SMS Not Sending
**Issue**: SMS notification not appearing in localStorage
**Solution**: 
- Check browser console for errors
- Verify `sendGuarantorSMS()` is called in `handleApplyLoan()`
- Check if localStorage has space available

### Auto-Deduction Not Working
**Issue**: Overdue payment not auto-deducting
**Solution**:
- Check if loan is marked as "active"
- Verify contribution balance is sufficient
- Check if deduction already logged for this payment date
- Verify `checkOverduePayments()` is being called

### Reminders Not Showing
**Issue**: Payment reminders not appearing on dashboard
**Solution**:
- Check if `LoanReminderSystem` is imported in Dashboard
- Verify active loans exist with upcoming payments
- Check if reminders were dismissed
- Verify date calculations are correct

### Input Field Not Syncing with Slider
**Issue**: Typing amount doesn't update slider
**Solution**:
- Verify `handleLoanAmountInputChange()` is bound to input
- Check if value is being clamped correctly
- Ensure state updates are not being batched incorrectly

---

## Future Enhancements

### Planned Features
1. **Multi-Channel Notifications**: SMS + Email + Push notifications
2. **Flexible Auto-Deduction**: Allow customers to opt-in/opt-out
3. **Partial Auto-Deduction**: Deduct what's available, track remaining balance
4. **Payment Plans**: Allow customers to reschedule missed payments
5. **Guarantor Dashboard**: Portal for guarantors to view their obligations
6. **Smart Reminders**: ML-based reminder timing based on customer behavior
7. **Grace Period**: Configurable grace period before auto-deduction
8. **Payment Prediction**: Predict likelihood of default and send early warnings

---

## Version History

**v3.8** - October 18, 2025
- Added direct loan amount input field
- Implemented guarantor SMS notification system
- Created comprehensive loan payment reminder system
- Implemented auto-deduction from contributions on default
- Added LoanReminderSystem component
- Enhanced loan application dialog
- Added comprehensive audit logging

---

## Support

For questions or issues:
- Check this documentation first
- Review code comments in LoanSection.tsx and LoanReminderSystem.tsx
- Test in browser console using localStorage inspection
- Contact development team for production SMS API integration

---

*This feature set significantly improves the loan management experience by providing more flexibility in loan amount selection, better communication with guarantors, proactive payment reminders, and automated default handling.*
