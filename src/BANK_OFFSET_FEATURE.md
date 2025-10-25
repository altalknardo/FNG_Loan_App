# Bank Account Offset Feature - Implementation Guide

## Overview
Added the ability for customers to offset (reduce) their loan balance by paying directly from their linked bank account. This provides customers with more payment flexibility beyond just using loan deposits or savings balance.

## What Changed

### 1. Customer Side (LoanSection.tsx)

#### New Payment Option Added
Customers now see three offset options for active loans:
1. **Deposit Offset** - Use refundable loan deposit
2. **Savings Offset** - Use contribution/savings balance  
3. **Bank Account Offset** - Pay directly from bank account (NEW ✨)

#### Bank Account Offset Card Features
- **Visual Design:** Blue gradient background to distinguish from other options
- **Requirement Check:** Verifies customer has payment methods added
- **Smart Redirect:** If no payment methods, button redirects to Payment Methods page
- **Custom Amount:** Customer can enter any amount up to remaining loan balance
- **Payment Method Display:** Shows which bank account will be debited

#### New Dialog Component
**Bank Offset Dialog** allows customers to:
- View loan details (ID, current balance)
- See selected payment method
- Enter custom payment amount
- View maximum payable amount
- Submit request for admin approval

### 2. Admin Side (DepositOffsetApprovals.tsx)

#### Updated Interface
```typescript
interface DepositOffsetRequest {
  // ... existing fields
  offsetType: "deposit" | "contribution" | "bank"; // Added "bank"
  paymentMethod?: {  // NEW: Bank account details
    type: string;
    name: string;
    last4: string;
    bankName?: string;
  };
}
```

#### Enhanced Display
- **New Badge:** Blue "Bank Account" badge for bank offset requests
- **Payment Info:** Shows bank name and last 4 digits of account
- **Clear Messaging:** Distinct approval messages for bank debits vs balance deductions

#### Review & Approval
Admin can see:
- Payment method details (bank name, account ending)
- Amount to be debited from customer's bank
- Clear warning about bank account debit
- New loan balance after payment

## User Journey

### Customer Flow

#### Step 1: View Active Loan
Customer navigates to Loans tab → Active Loans section

#### Step 2: Choose Payment Method
Three offset options displayed:
- 🟣 **Deposit Offset** - If they have refundable deposits
- 🟢 **Savings Offset** - If they have contribution balance
- 🔵 **Bank Account Offset** - NEW option (requires payment method)

#### Step 3: Enter Amount
If bank account option chosen:
1. Click "Pay from Bank Account"
2. Dialog opens showing loan details
3. Enter desired payment amount (₦)
4. Amount validated against remaining balance
5. Submit request

#### Step 4: Wait for Approval
- Request submitted to admin
- Customer receives toast confirmation
- Request appears in admin's Deposit Offset Approvals

### Admin Flow

#### Step 1: Review Request
Navigate to: Admin → Balance Offset

#### Step 2: Identify Bank Offset
Look for blue "Bank Account" badge

#### Step 3: Review Details
Dialog shows:
- Customer information
- Loan details
- **Payment Method:** Bank name and account
- **Payment Amount:** Amount to debit
- **New Balance:** Loan balance after payment

#### Step 4: Approve/Reject
- **Approve:** Bank account will be debited, loan balance reduced
- **Reject:** No changes made, customer notified

## Technical Implementation

### New State Variables (LoanSection.tsx)
```typescript
const [bankOffsetDialogOpen, setBankOffsetDialogOpen] = useState(false);
const [bankOffsetAmount, setBankOffsetAmount] = useState("");
```

### New Handler Function
```typescript
const handleRequestBankOffset = () => {
  // Validates amount
  // Checks for existing pending requests
  // Gets default payment method
  // Creates offset request with bank type
  // Stores in localStorage
  // Shows success message
}
```

### Request Structure
```typescript
{
  id: timestamp,
  customerId: number,
  customerName: string,
  customerEmail: string,
  loanId: number,
  loanAmount: number,
  currentBalance: number,
  offsetAmount: number,
  offsetType: "bank",
  paymentMethod: {
    type: "bank",
    name: "Account Name",
    last4: "1234",
    bankName: "First Bank"
  },
  requestedAt: ISO string,
  status: "pending"
}
```

## Key Features

### 1. Validation & Error Handling
✅ Checks if payment method exists
✅ Validates amount > 0
✅ Prevents amount exceeding loan balance
✅ Prevents duplicate pending requests
✅ Clear error messages for all scenarios

### 2. User Experience
✅ Consistent design with existing offset options
✅ Clear visual distinction (blue theme)
✅ Real-time amount validation
✅ Maximum amount helper text
✅ Loading states and confirmations

### 3. Admin Control
✅ Full visibility of payment details
✅ Clear approval/rejection workflow
✅ Distinct messaging for bank debits
✅ Audit trail with timestamps

### 4. Safety Features
✅ Requires admin approval (no auto-debit)
✅ Shows exact bank account being charged
✅ Displays new balance before approval
✅ Prevents duplicate requests

## Visual Design

### Color Coding
- **Purple** 🟣 - Deposit offsets
- **Green** 🟢 - Savings offsets  
- **Blue** 🔵 - Bank account offsets (NEW)

### Icons
- **Building2** - Bank account icon
- **TrendingDown** - Offset/reduction icon
- **AlertCircle** - Information alerts

## Benefits

### For Customers
1. **Flexibility:** Choose from multiple payment sources
2. **Convenience:** Pay any custom amount
3. **Speed:** Reduce loan faster than weekly payments
4. **Choice:** Use bank account without withdrawing savings

### For Business
1. **Cash Flow:** Faster loan repayments
2. **Customer Satisfaction:** More payment options
3. **Reduced Defaults:** Easier for customers to pay
4. **Tracking:** All requests logged and auditable

## Data Storage

### LocalStorage Keys Used
- `depositOffsetRequests` - All offset requests (deposit, savings, bank)
- `paymentMethods` - Customer's linked bank accounts
- `activeLoans` - Customer's active loans (updated after approval)

## Important Notes

⚠️ **Admin Approval Required**
All bank offset requests require admin approval before processing. The bank account is NOT automatically debited upon request submission.

⚠️ **Payment Method Requirement**
Customers must have at least one payment method added before they can use bank offset. The system redirects to Payment Methods page if none exist.

⚠️ **Single Pending Request**
Customers can only have one pending offset request per loan at a time. They must wait for approval/rejection before submitting another.

⚠️ **Amount Limits**
Payment amount cannot exceed the remaining loan balance. The system validates this on both customer and admin side.

## Future Enhancements

Potential improvements:
- [ ] Partial approvals (approve different amount than requested)
- [ ] Automatic bank account debit integration
- [ ] Payment scheduling (recurring offsets)
- [ ] Multiple payment methods selection
- [ ] Email notifications on approval/rejection
- [ ] Transaction receipts

## Testing Checklist

Customer Side:
- [x] Can view bank offset option on active loans
- [x] Redirects to payment methods if none added
- [x] Opens dialog when bank account exists
- [x] Validates amount correctly
- [x] Shows loan and payment details
- [x] Submits request successfully
- [x] Prevents duplicate requests
- [x] Shows success toast

Admin Side:
- [x] Displays bank offset with blue badge
- [x] Shows payment method details in list
- [x] Review dialog shows bank account info
- [x] Approval message mentions bank debit
- [x] Updates loan balance on approval
- [x] Stores approval timestamp

## Support

For questions or issues:
1. Check customer has payment methods added
2. Verify loan has remaining balance
3. Check for existing pending requests
4. Review localStorage data structure
5. Test with small amounts first

---

**Feature Status:** ✅ Complete and Ready
**Version:** 1.0
**Date:** October 19, 2025
