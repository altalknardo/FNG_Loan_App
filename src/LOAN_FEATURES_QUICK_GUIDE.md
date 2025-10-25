# Loan Features Quick Reference Guide

## 🚀 Quick Start - New Loan Features

### 1. Direct Loan Amount Entry
**What**: Type exact loan amount instead of using slider only

**How to Use**:
- Open loan application
- Find the input field with ₦ symbol
- Type your desired amount (e.g., 250000)
- Slider updates automatically
- Amount is validated and clamped to valid range

**Example**:
```
Input: 250000
Range: ₦50,000 - ₦1,499,999
Result: ₦250,000 (displayed and applied)
```

---

### 2. Guarantor SMS Notification
**What**: Automatic SMS sent to guarantor when loan is applied

**When It Happens**:
- Immediately after clicking "Submit Application"
- Only if all guarantor details are provided
- Only if terms are accepted

**SMS Format**:
```
Dear [Name], you have been listed as a guarantor 
for a loan application of ₦[Amount] on FNG. 
You will be contacted for verification. 
If you did not consent to this, please contact us.
```

**Verification**:
- Check localStorage: `smsNotifications`
- Look for success toast message
- SMS record includes phone, name, amount, timestamp

---

### 3. Payment Reminders
**What**: Automatic notifications for upcoming loan payments

**Reminder Schedule**:
| Timing | Notification Type | Duration |
|--------|------------------|----------|
| 3 days before | Info Toast | 5 seconds |
| 1 day before | Info Toast | 5 seconds |
| Payment day | Warning Toast + Dashboard Card | 10 seconds |
| Overdue | Error Toast + Alert Banner | Persistent |

**Dashboard Display**:
- Card shows loan details
- Color-coded badges (Due Today, Due Tomorrow)
- "Pay Now" button → navigates to loans
- "Dismiss" button → hides reminder

**Check Reminders**:
```javascript
const reminders = JSON.parse(localStorage.getItem("paymentReminders") || "[]");
console.table(reminders);
```

---

### 4. Auto-Deduction on Default
**What**: Automatic payment from contributions when loan payment is overdue

**When It Happens**:
- Payment date has passed
- No payment made
- Sufficient contribution balance

**Process**:
1. Detect overdue payment
2. Check contribution balance
3. Deduct payment amount if sufficient
4. Update loan status
5. Log transaction
6. Show notification

**Success Notification**:
```
Auto-deducted ₦100 from your contributions 
for overdue Loan #1
```

**Failure Notification**:
```
Insufficient contribution balance to cover 
overdue payment for Loan #1. 
Please make a payment immediately.
```

**Check Auto-Deductions**:
```javascript
const deductions = JSON.parse(localStorage.getItem("autoDeductions") || "[]");
console.table(deductions);
```

---

## 📊 Data Storage Reference

### SMS Notifications
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

### Payment Reminders
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

### Auto-Deductions
```json
{
  "loanId": 1,
  "paymentDate": "2025-10-13",
  "amount": 100,
  "timestamp": "2025-10-18T10:30:00.000Z",
  "type": "auto_deduction"
}
```

---

## 🎯 Common Use Cases

### Use Case 1: Apply for Specific Loan Amount
```
1. Select loan type (SME/Business/Jumbo)
2. Click "Apply for [Type] Loan"
3. Type exact amount in input field: 350000
4. Verify slider matches
5. Complete rest of form
6. Submit → Guarantor receives SMS
```

### Use Case 2: Handle Payment Reminder
```
1. See reminder on dashboard (3 days before)
2. Note payment date and amount
3. Get warning toast on payment day
4. Click "Pay Now" on dashboard card
5. Make payment on Loans tab
6. Reminder disappears
```

### Use Case 3: Auto-Deduction Scenario
```
1. Loan payment due: October 13
2. Current date: October 14 (overdue)
3. Contribution balance: ₦500
4. Weekly payment: ₦100
5. System auto-deducts ₦100
6. New balance: ₦400
7. Notification shown
8. Transaction logged
```

---

## 🛠️ Testing Commands

### View All SMS Notifications
```javascript
const sms = JSON.parse(localStorage.getItem("smsNotifications") || "[]");
console.table(sms);
```

### View Payment Reminders
```javascript
const reminders = JSON.parse(localStorage.getItem("paymentReminders") || "[]");
console.table(reminders);
```

### View Auto-Deductions
```javascript
const deductions = JSON.parse(localStorage.getItem("autoDeductions") || "[]");
console.table(deductions);
```

### Clear All Notifications (Testing)
```javascript
localStorage.removeItem("smsNotifications");
localStorage.removeItem("paymentReminders");
localStorage.removeItem("autoDeductions");
```

### Simulate Overdue Loan
```javascript
const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
loans[0].nextPayment = "2025-10-01"; // Past date
localStorage.setItem("activeLoans", JSON.stringify(loans));
location.reload();
```

---

## ⚠️ Important Notes

### For Direct Input
- ✅ Accepts numbers only
- ✅ Auto-clamps to valid range
- ✅ Syncs with slider bidirectionally
- ❌ Cannot exceed loan type maximum
- ❌ Cannot go below loan type minimum

### For SMS Notifications
- ✅ Sent immediately on application
- ✅ Stored in localStorage (demo mode)
- ✅ Includes all guarantor details
- ⚠️ Production requires SMS API integration
- ⚠️ Verify phone number format before sending

### For Payment Reminders
- ✅ Checks every minute
- ✅ Shows on dashboard
- ✅ Can be dismissed temporarily
- ❌ Dismissed reminders don't persist on refresh
- ⚠️ System time must be accurate

### For Auto-Deduction
- ✅ Only triggers once per missed payment
- ✅ Requires sufficient contribution balance
- ✅ Full audit trail maintained
- ❌ Cannot be reversed automatically
- ⚠️ Contributions must be >= payment amount

---

## 🔍 Troubleshooting

### Problem: Input field not updating slider
**Fix**: Check that `handleLoanAmountInputChange` is called on input change

### Problem: SMS not stored
**Fix**: Check browser console, verify localStorage is enabled

### Problem: Reminders not showing
**Fix**: Verify active loans exist, check loan dates, reload dashboard

### Problem: Auto-deduction not working
**Fix**: Check contribution balance, verify loan is overdue, check deduction log

### Problem: Duplicate auto-deductions
**Fix**: System prevents this - check `autoDeductions` log for duplicates

---

## 📱 Customer Support Scenarios

### Customer: "Can I type the exact loan amount?"
**Answer**: Yes! Use the input field above the slider to type your exact amount.

### Customer: "Will my guarantor be notified?"
**Answer**: Yes! They receive an SMS immediately after you submit your application.

### Customer: "How will I know when my payment is due?"
**Answer**: You'll receive reminders 3 days before, 1 day before, and on the payment day.

### Customer: "What happens if I miss a payment?"
**Answer**: The system will automatically deduct from your contributions if you have sufficient balance. Otherwise, you'll need to pay immediately to avoid account issues.

### Customer: "Can I stop auto-deduction?"
**Answer**: Currently, it's automatic for overdue payments. Contact support for special arrangements.

---

## 🔄 Version & Updates

**Current Version**: 3.8
**Last Updated**: October 18, 2025
**Components Modified**: 
- LoanSection.tsx
- Dashboard.tsx
- LoanReminderSystem.tsx (new)

**Related Documentation**:
- LOAN_ENHANCEMENTS.md (Full documentation)
- README.md (General app guide)
- WHATS_NEW.md (Recent updates)

---

*For detailed implementation details, see LOAN_ENHANCEMENTS.md*
