# Deposit Offset System - Complete Guide

## Overview
The Deposit Offset System allows customers to apply their refundable loan deposits (10% of loan amount) to reduce their active loan balance. This feature is accessible from multiple locations throughout the app for maximum convenience.

## Where to Find the Deposit Offset Button

### 1. **Dashboard (Home Screen)**
**Location:** Main dashboard, appears as a prominent card when conditions are met

**When it shows:**
- Customer has loan deposits available (loanDeposits > 0)
- Customer has an active loan with remaining balance

**Features:**
- Eye-catching purple gradient card
- Shows available deposit amount
- Shows current loan balance
- Calculates and displays balance after offset
- Direct link to loans section
- Visual indicator with coin icon

**Button Text:** "Apply Deposit to Loan Balance"

---

### 2. **Loans Section - Top Banner**
**Location:** Top of the loans page, before loan type selection

**When it shows:**
- Customer has loan deposits available
- Customer has an active loan with remaining balance

**Features:**
- Full-width purple gradient banner
- Shows available deposit and current balance in grid layout
- Displays new balance after offset in green
- "Available Now" badge
- Smooth scroll to active loans section below

**Button Text:** "View Offset Options Below"

---

### 3. **Loans Section - Active Loan Card**
**Location:** Within each active loan card, after "Make Payment" button

**When it shows:**
- Customer has loan deposits available
- Specific loan has remaining balance

**Features:**
- Detailed breakdown section with purple gradient background
- Shows:
  - Available Deposit amount
  - Current Balance
  - Offset Amount (will be applied)
  - New Balance (after offset)
- Information alert explaining admin approval requirement
- Most detailed view of the offset calculation

**Button Text:** "Request Deposit Offset"

---

### 4. **Profile Page**
**Location:** After stats cards, before achievements section

**When it shows:**
- Customer has loan deposits available
- Customer has an active loan with remaining balance

**Features:**
- Purple gradient alert card
- "Action Required" badge
- Quick explanation of benefit
- Information alert about savings
- Direct navigation to loans page

**Button Text:** "Apply Deposit Now"

---

## How It Works

### For Customers:

1. **Check Availability**
   - Look for deposit offset options in any of the 4 locations listed above
   - System automatically calculates if you're eligible

2. **Review Details**
   - See your available deposit amount
   - See your current loan balance
   - Preview your new balance after offset

3. **Submit Request**
   - Click any of the deposit offset buttons
   - Request is sent to admin for approval
   - You'll see a success message

4. **Wait for Approval**
   - Admin reviews your request
   - You cannot submit duplicate requests for the same loan
   - Notification when approved or rejected

5. **Automatic Update**
   - Upon approval, your loan balance is reduced
   - Your deposit amount is deducted
   - Transaction history is updated
   - Dashboard reflects new balance

### For Admins:

1. **Access Deposit Offset Approvals**
   - Navigate to "Deposit Offset" in admin sidebar
   - See all requests (pending, approved, rejected)

2. **Review Requests**
   - View customer details
   - See loan information
   - Review offset calculations
   - Check balance impacts

3. **Approve or Reject**
   - Click "Review & Approve" or "Reject" button
   - See detailed breakdown before approving
   - System updates everything automatically on approval

4. **Dashboard Monitoring**
   - Pending request count shown on admin dashboard
   - Quick access card for fast navigation

---

## Visual Design

### Color Scheme:
- **Primary:** Purple (#7C3AED) to Indigo (#4F46E5) gradient
- **Success:** Green for new balance display
- **Info:** Blue for informational alerts
- **Warning:** Orange for offset amount

### Icons:
- **Coins** (main icon for deposits)
- **TrendingDown** (indicates reducing balance)
- **AlertCircle** (for information alerts)

### Button Styles:
- Gradient background (purple to indigo)
- White text
- Icon on the left
- Full width in most contexts
- Hover effects for better UX

---

## Calculation Logic

```
Available Deposit: Amount from upfront payment (10% of loan)
Current Balance: Loan Amount - Amount Repaid
Offset Amount: min(Available Deposit, Current Balance)
New Balance: Current Balance - Offset Amount
```

**Example:**
- Loan Amount: ₦100,000
- Amount Repaid: ₦30,000
- Current Balance: ₦70,000
- Available Deposit: ₦10,000
- Offset Amount: ₦10,000 (minimum of deposit and balance)
- New Balance: ₦60,000

---

## User Experience Benefits

1. **Multiple Access Points**
   - Can't miss the feature
   - Available wherever users manage their finances
   - Contextual placement (shows when relevant)

2. **Clear Information**
   - All calculations shown upfront
   - No surprises
   - Transparent process

3. **Visual Appeal**
   - Attractive gradient designs
   - Consistent purple theme
   - Professional appearance

4. **Smart Detection**
   - Only shows when applicable
   - Prevents duplicate requests
   - Validates before submission

5. **Seamless Integration**
   - Fits naturally into existing UI
   - Doesn't disrupt user flow
   - Easy to understand and use

---

## Technical Details

### Data Storage:
- **loanDeposits:** Stored in localStorage as float
- **depositOffsetRequests:** Array in localStorage
- **activeLoans:** Array with loan details

### Request Structure:
```json
{
  "id": 1634567890000,
  "customerId": 1,
  "customerName": "Current User",
  "customerEmail": "user@example.com",
  "loanId": 1,
  "loanAmount": 100000,
  "currentBalance": 70000,
  "depositAmount": 10000,
  "offsetAmount": 10000,
  "loanType": "SME Loan",
  "requestedAt": "2025-10-18T10:30:00.000Z",
  "status": "pending"
}
```

### Status Flow:
1. **pending** - Awaiting admin review
2. **approved** - Admin approved, balance updated
3. **rejected** - Admin rejected, no changes made

---

## Admin Permissions

The Deposit Offset feature respects the role-based access control system:

- **Super Admins:** Full access to approve/reject
- **Regular Admins:** Access based on assigned permissions
  - View deposit offset requests
  - Approve deposit offset requests
  - Reject deposit offset requests

---

## Best Practices

### For Customers:
- Review the calculation carefully before submitting
- Only submit when you're sure you want to use your deposit
- Remember that this requires admin approval
- Check transaction history after approval

### For Admins:
- Review customer account status before approving
- Verify loan details match the request
- Ensure calculations are correct
- Approve requests promptly for better customer experience

---

## Troubleshooting

**Button doesn't appear:**
- Check if you have loan deposits available
- Verify you have an active loan
- Ensure loan has remaining balance
- Refresh the page

**Request fails:**
- Check for duplicate pending requests
- Verify loan is still active
- Ensure deposit amount is available
- Contact admin if issue persists

**After approval, balance not updating:**
- Refresh the page
- Check transaction history
- Verify in loans section
- Wait a few seconds for localStorage sync

---

## Future Enhancements

Potential improvements for future versions:

1. **Partial Offsets**
   - Allow customers to choose offset amount
   - Apply only portion of deposit
   - Save remaining deposit for later

2. **Automated Approvals**
   - Set rules for automatic approval
   - Instant processing for eligible requests
   - Faster customer experience

3. **Notifications**
   - Email notifications on approval/rejection
   - SMS alerts for status changes
   - In-app notification center

4. **History Tracking**
   - View all past offset requests
   - Track approval timeline
   - Download offset receipts

5. **Bulk Operations**
   - Admin bulk approve/reject
   - Process multiple requests at once
   - Export request data

---

## Summary

The Deposit Offset System provides customers with a powerful tool to reduce their loan burden by applying their refundable deposits. With **4 prominent access points** throughout the app, clear calculations, and a simple approval workflow, it enhances the overall user experience while giving admins full control over the process.

**Key Locations:**
1. ✅ Dashboard - Quick action card
2. ✅ Loans Section (Top) - Banner alert
3. ✅ Loans Section (Active Loan) - Detailed breakdown
4. ✅ Profile Page - Action reminder

All locations feature consistent purple/indigo gradient design, clear calculations, and easy-to-understand interfaces.
