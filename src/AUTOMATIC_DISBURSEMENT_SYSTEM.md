# Automatic Disbursement System Documentation

## Overview
The FNG app now features a **fully automatic disbursement system** that handles all money movement when admin approves payouts. This includes loan disbursements and withdrawal approvals.

---

## How It Works

### 🔄 Automatic Process Flow

When an admin approves a payout (loan or withdrawal), the system automatically:

1. ✅ **Checks Company Balance** - Verifies sufficient funds exist
2. 💸 **Debits Company Account** - Removes money from company balance
3. 💰 **Credits Customer Account** - Records customer credit
4. 📝 **Creates Transaction Record** - Full audit trail
5. 🔔 **Sends Notification** - Customer receives instant notification
6. 🎯 **Updates All Balances** - Real-time balance updates

---

## 1. Loan Disbursement Process

### What Happens When Admin Approves a Loan

```
BEFORE APPROVAL:
├── Customer applies for loan (e.g., ₦500,000)
├── Customer pays upfront costs (deposit, insurance, service charge)
└── Loan appears in admin "Pending" queue

APPROVAL CLICK:
├── System checks: Company balance >= Loan amount?
│   ├── YES ✅ → Continue
│   └── NO ❌ → Show error: "Insufficient company balance"
│
├── STEP 1: Debit Company Account
│   ├── Current: ₦1,500,000
│   ├── Loan amount: -₦500,000
│   └── New balance: ₦1,000,000
│
├── STEP 2: Create Active Loan Record
│   ├── Principal: ₦500,000
│   ├── Interest (20%): ₦100,000
│   ├── Total repayment: ₦600,000
│   └── Weekly payment: ₦50,000 (12 weeks)
│
├── STEP 3: Record Deposit (Refundable)
│   ├── 10% of principal: ₦50,000
│   └── Held until loan completion
│
├── STEP 4: Create Transaction Record
│   ├── Type: "Loan Disbursement"
│   ├── From: Company Account
│   ├── To: Customer's Bank (Access Bank ****1234)
│   ├── Amount: ₦500,000
│   ├── Status: Completed
│   └── Timestamp: 2025-10-21 14:30:00
│
├── STEP 5: Track Revenue
│   ├── Insurance: ₦40,000 (8%)
│   ├── Service Charge: ₦10,000 (2%)
│   ├── Expected Interest: ₦100,000 (20%)
│   └── Total Revenue: ₦150,000
│
└── STEP 6: Notify Customer
    ├── In-app notification
    ├── Message: "Your loan of ₦500,000 has been disbursed"
    └── Account credited instantly
```

### Code Location
**File**: `/components/admin/LoanApprovals.tsx`

**Key Functions**:
```typescript
handleApprove(application: LoanApplication)
```

### Balance Checks

#### Pre-Approval Validation
```typescript
// Check company balance before approval
const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");

if (companyBalance < application.amount) {
  toast.error(
    `Insufficient company balance. 
    Available: ₦${companyBalance.toLocaleString()}, 
    Required: ₦${application.amount.toLocaleString()}`
  );
  return; // Cannot approve
}
```

#### Automatic Debit
```typescript
// Debit company account
const updatedCompanyBalance = companyBalance - application.amount;
localStorage.setItem("companyBalance", updatedCompanyBalance.toString());
```

### Transaction Record

Every disbursement creates a detailed transaction:

```typescript
{
  id: "DISB-1729516200000",
  type: "loan_disbursement",
  amount: 500000,
  description: "Loan disbursed to John Doe - SME Loan",
  date: "2025-10-21",
  time: "14:30",
  status: "completed",
  recipient: "John Doe",
  recipientId: "USR001",
  loanId: 123,
  fromAccount: "Company Account",
  toAccount: "Access Bank ****1234",
  category: "loan_disbursement"
}
```

---

## 2. Withdrawal Disbursement Process

### What Happens When Admin Approves Withdrawal

```
BEFORE APPROVAL:
├── Customer requests withdrawal (e.g., ₦50,000)
├── From contribution balance: ₦150,000
└── Request appears in admin "Pending" queue

APPROVAL CLICK:
├── System checks: Company balance >= Withdrawal amount?
│   ├── YES ✅ → Continue
│   └── NO ❌ → Show error
│
├── STEP 1: Debit Company Account
│   ├── Current: ₦1,000,000
│   ├── Withdrawal: -₦50,000
│   └── New balance: ₦950,000
│
├── STEP 2: Debit Customer Contribution Balance
│   ├── Current: ₦150,000
│   ├── Withdrawal: -₦50,000
│   └── New balance: ₦100,000
│
├── STEP 3: Update Transaction Status
│   ├── From: "withdrawal_request" (pending)
│   ├── To: "withdrawal" (completed)
│   ├── Add disbursement details
│   └── Record bank account info
│
├── STEP 4: Record Disbursement
│   ├── From: Company Account
│   ├── To: Customer's Bank (GTBank ****5678)
│   ├── Amount: ₦50,000
│   ├── Timestamp: 2025-10-21 15:45:00
│   └── Status: Disbursed
│
└── STEP 5: Notify Customer
    ├── In-app notification
    ├── Message: "Your withdrawal of ₦50,000 has been sent"
    └── Account credited
```

### Code Location
**File**: `/components/admin/WithdrawalApprovals.tsx`

**Key Functions**:
```typescript
handleApprove(request: WithdrawalRequest)
```

### Transaction Update

```typescript
// Update transaction from request to completed
{
  ...originalTransaction,
  status: "completed",
  type: "withdrawal", // Changed from "withdrawal_request"
  fromAccount: "Company Account",
  toAccount: "GTBank ****5678",
  disbursedAt: "2025-10-21T15:45:00.000Z"
}
```

---

## 3. Company Balance Management

### Balance Sources

The company balance is funded by:

1. **Monthly Service Charges** (₦500/customer)
   - Automatically collected every month
   - Non-refundable revenue
   - Directly added to company balance

2. **One-Time Service Charges** (2% of loan)
   - Collected during loan application
   - Part of upfront costs
   - Added to service charge balance

3. **Insurance Fees** (8% of loan)
   - Collected during loan application
   - Non-refundable
   - Tracked separately

4. **Loan Interest** (20% APR)
   - Collected during repayments
   - Major revenue source
   - Tracked by loan type

### Balance Uses

Company balance is used for:

1. **Loan Disbursements** ✅
   - Direct customer credits
   - Largest outflow

2. **Withdrawal Approvals** ✅
   - Customer contribution withdrawals
   - Anytime on request

3. **Deposit Refunds** ✅
   - 10% refundable deposit
   - After loan completion

4. **Operational Expenses** (Manual)
   - Admin managed
   - Not automated

### Low Balance Warning

#### Threshold
- **Warning Level**: Balance < ₦100,000
- **Display**: Orange/Red alert on dashboard
- **Actions**: Fund account or delay approvals

#### Visual Indicator

```
⚠️ LOW BALANCE WARNING
Company balance is low (₦85,000). 
You may not have sufficient funds to disburse loans or process withdrawals.

[Fund Account] [View Pending Loans]
```

#### Balance Display Colors
- **Green** (₦100,000+): Healthy balance
- **Orange/Red** (<₦100,000): Low balance warning

---

## 4. Customer Notifications

### Notification Types

#### Loan Disbursement Notification
```json
{
  "id": 1729516200,
  "userId": "customer@example.com",
  "type": "loan_credited",
  "amount": 500000,
  "message": "Your loan of ₦500,000 has been disbursed to your account",
  "timestamp": "2025-10-21T14:30:00.000Z",
  "read": false
}
```

#### Withdrawal Notification
```json
{
  "id": 1729520700,
  "userId": "customer@example.com",
  "type": "withdrawal_credited",
  "amount": 50000,
  "message": "Your withdrawal of ₦50,000 has been sent to your account",
  "timestamp": "2025-10-21T15:45:00.000Z",
  "read": false
}
```

### Notification Display

Customers see notifications:
- ✅ In-app notification center
- ✅ Transaction history
- ✅ Toast messages (real-time)

---

## 5. Admin Workflow

### Step-by-Step: Approving a Loan

1. **Navigate to Loan Approvals**
   - Click "Loans" in admin sidebar
   - View pending applications

2. **Review Application**
   - Click "View Details" on any loan
   - Review customer info, loan amount, upfront status

3. **Check Balance**
   - System automatically checks company balance
   - Green checkmark if sufficient
   - Red error if insufficient

4. **Approve Loan**
   - Click "Approve Loan" button
   - System processes automatically:
     ✅ Debits company account
     ✅ Creates active loan
     ✅ Records transaction
     ✅ Notifies customer

5. **Confirmation**
   - Success toast message
   - Loan moves to "Approved" tab
   - Customer can start repaying

### Step-by-Step: Approving Withdrawal

1. **Navigate to Withdrawal Approvals**
   - Click "Withdrawals" in admin sidebar
   - View pending requests

2. **Review Request**
   - View customer name, amount, account details
   - Check available contribution balance
   - Verify payment method

3. **Check Balance**
   - System checks company balance
   - Warns if insufficient

4. **Approve Withdrawal**
   - Click "Approve" button
   - System processes:
     ✅ Debits company account
     ✅ Debits customer contribution balance
     ✅ Updates transaction
     ✅ Notifies customer

5. **Confirmation**
   - Success message
   - Request moves to "Approved" tab
   - Customer receives funds

---

## 6. Error Handling

### Insufficient Balance Scenarios

#### Scenario 1: Loan Approval
```
Action: Admin clicks "Approve" on ₦500,000 loan
Company Balance: ₦300,000
Result: ❌ Error

Message:
"Insufficient company balance. 
Available: ₦300,000, Required: ₦500,000"

Solutions:
1. Fund company account
2. Wait for more revenue
3. Approve smaller loans first
```

#### Scenario 2: Withdrawal Approval
```
Action: Admin clicks "Approve" on ₦100,000 withdrawal
Company Balance: ₦75,000
Result: ❌ Error

Message:
"Insufficient company balance.
Available: ₦75,000, Required: ₦100,000"

Solutions:
1. Fund company account
2. Contact customer to reduce amount
3. Wait for more revenue
```

### Upfront Payment Not Received

```
Action: Admin tries to approve loan
Upfront Status: Not paid
Result: ❌ Error

Message:
"Cannot approve: Customer has not paid upfront costs yet"

Solution:
Customer must pay:
- 10% Deposit (refundable)
- 8% Insurance (non-refundable)
- 2% Service charge (non-refundable)
```

---

## 7. Transaction Audit Trail

### Full Transaction History

Every disbursement is recorded with:

1. **Unique ID**: `DISB-{timestamp}`
2. **Transaction Type**: loan_disbursement / withdrawal
3. **Amount**: Exact amount disbursed
4. **Parties**:
   - From: Company Account
   - To: Customer's Bank + Account Number
5. **Timestamp**: Date and time
6. **Status**: Completed
7. **Additional Info**:
   - Recipient name
   - Loan/Request ID
   - Category

### Viewing Transactions

**Admin Dashboard** → **Activity** → **Real-time Activity**
- See all disbursements
- Filter by type
- Export reports

**Admin Dashboard** → **Reports** → **Generate Reports**
- Comprehensive transaction reports
- Date range filtering
- Excel/CSV export

---

## 8. Production Considerations

### Current System (Demo/Development)

The current system uses **localStorage** for:
- ✅ Company balance tracking
- ✅ Transaction records
- ✅ Notifications
- ✅ Balance updates

This is perfect for:
- Testing the flow
- Understanding the process
- Demonstrating to stakeholders
- MVP development

### Production System Requirements

For live production, you'll need:

#### 1. Backend API
```typescript
// Example API endpoints needed
POST /api/loans/disburse
POST /api/withdrawals/process
GET /api/company/balance
POST /api/transactions/record
```

#### 2. Payment Gateway Integration
- **Paystack**: Already integrated ✅
- **OPay**: Already integrated ✅
- **Bank Transfer API**: Required
  - Flutterwave
  - Paystack Transfer API
  - Or direct bank APIs

#### 3. Database
Replace localStorage with:
- PostgreSQL (recommended)
- MySQL
- MongoDB
- Firebase Realtime Database

#### 4. Real-time Bank Transfer
```typescript
// Example production flow
async function disburseLoan(loanId, amount, bankDetails) {
  // 1. Verify company balance (from database)
  const balance = await getCompanyBalance();
  if (balance < amount) throw new Error("Insufficient balance");
  
  // 2. Initiate bank transfer via API
  const transfer = await paystackTransferAPI.send({
    amount: amount * 100, // kobo
    recipient: bankDetails.recipientCode,
    reason: `Loan disbursement - ${loanId}`
  });
  
  // 3. Wait for confirmation
  const status = await transfer.verify();
  
  // 4. Update database
  if (status === 'success') {
    await updateCompanyBalance(balance - amount);
    await recordTransaction({...});
    await notifyCustomer({...});
  }
  
  return status;
}
```

#### 5. Webhook Handlers
Listen for:
- Transfer success
- Transfer failure
- Balance updates
- Bank confirmations

#### 6. Security
- Encrypt sensitive data
- Use HTTPS only
- Implement rate limiting
- Add two-factor auth for approvals
- IP whitelisting for admin access

---

## 9. Revenue Tracking Integration

The disbursement system is fully integrated with revenue tracking:

### Loan Disbursement Revenue

When loan is approved:
```
Insurance Revenue: ₦40,000 (8% of ₦500,000)
├── Added to: insuranceBalance
└── Non-refundable

Service Charge: ₦10,000 (2% of ₦500,000)
├── Added to: loanServiceChargeBalance  
└── Non-refundable

Expected Interest: ₦100,000 (20% of ₦500,000)
├── Added to: loanInterestBalance
├── Tracked by loan type
└── Collected during repayment

Refundable Deposit: ₦50,000 (10% of ₦500,000)
├── Added to: loanDeposits
└── Refunded after completion
```

### Revenue Analytics

View in:
- **Admin Dashboard** → Revenue cards
- **Revenue Analytics** → Detailed breakdown
- **Reports** → Excel/CSV exports

---

## 10. Testing Guide

### Test Scenario 1: Successful Loan Disbursement

**Prerequisites**:
- Company balance: ₦1,000,000
- Pending loan: ₦100,000
- Upfront costs: Paid

**Steps**:
1. Login as admin
2. Navigate to "Loan Approvals"
3. Click "View Details" on pending loan
4. Click "Approve Loan"

**Expected Results**:
✅ Success toast message
✅ Company balance: ₦900,000 (-₦100,000)
✅ Loan moves to "Approved"
✅ Active loan created
✅ Transaction recorded
✅ Customer notified

### Test Scenario 2: Insufficient Balance

**Prerequisites**:
- Company balance: ₦50,000
- Pending loan: ₦100,000

**Steps**:
1. Login as admin
2. Navigate to "Loan Approvals"
3. Click "Approve" on loan

**Expected Results**:
❌ Error toast message
❌ Shows: "Insufficient company balance. Available: ₦50,000, Required: ₦100,000"
❌ Loan remains in "Pending"
❌ Company balance unchanged

### Test Scenario 3: Successful Withdrawal

**Prerequisites**:
- Company balance: ₦500,000
- Pending withdrawal: ₦50,000
- Customer contribution balance: ₦100,000

**Steps**:
1. Login as admin
2. Navigate to "Withdrawal Approvals"
3. Click "Approve" on request

**Expected Results**:
✅ Success toast message
✅ Company balance: ₦450,000 (-₦50,000)
✅ Customer balance: ₦50,000 (-₦50,000)
✅ Transaction updated to "completed"
✅ Customer notified

---

## 11. Troubleshooting

### Issue: "Insufficient balance" but balance looks correct

**Cause**: Balance stored as string instead of number

**Solution**:
```typescript
// Always parse as float
const balance = parseFloat(localStorage.getItem("companyBalance") || "0");
```

### Issue: Transaction not appearing in history

**Cause**: Transaction not pushed to array properly

**Solution**:
```typescript
// Use unshift() to add to beginning
transactions.unshift(newTransaction);
localStorage.setItem("transactions", JSON.stringify(transactions));
```

### Issue: Customer not receiving notification

**Cause**: Notification array not initialized

**Solution**:
```typescript
// Initialize if missing
const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
```

### Issue: Balance not updating in real-time

**Cause**: Need to trigger update event

**Solution**:
```typescript
// Trigger event after balance change
window.dispatchEvent(new Event("balanceUpdated"));
```

---

## 12. API Reference (Future Production)

### Loan Disbursement API

```typescript
POST /api/admin/loans/:loanId/disburse

Request:
{
  "adminId": "admin@fng.com",
  "loanId": 123,
  "bankDetails": {
    "accountNumber": "0123456789",
    "bankCode": "044",
    "accountName": "John Doe"
  }
}

Response (Success):
{
  "success": true,
  "transactionId": "DISB-1729516200000",
  "amount": 500000,
  "companyBalance": 500000,
  "transferReference": "TRF-XXX-YYY",
  "status": "completed"
}

Response (Error):
{
  "success": false,
  "error": "Insufficient company balance",
  "availableBalance": 300000,
  "requiredAmount": 500000
}
```

### Withdrawal Disbursement API

```typescript
POST /api/admin/withdrawals/:requestId/approve

Request:
{
  "adminId": "admin@fng.com",
  "requestId": 456
}

Response (Success):
{
  "success": true,
  "transactionId": "WDRW-1729520700000",
  "amount": 50000,
  "companyBalance": 450000,
  "customerBalance": 50000,
  "status": "completed"
}
```

---

---

## 13. Reverse Flow: Customer Payments → Company Account

### ✅ YES! System Automatically Credits Company Account

When customers make payments (contributions or loan repayments), the system **automatically**:

#### 📥 Customer Contribution Payment Flow

```
Customer Makes Contribution (e.g., ₦500)
    ↓
[Payment Gateway: OPay/Paystack]
    ↓
Payment Verified ✅
    ↓
AUTOMATIC ACTIONS:
├─ 1. Credit Customer Contribution Balance (+₦500)
├─ 2. Update Total Contributions (+₦500)
├─ 3. ✅ CREDIT COMPANY ACCOUNT (+₦500)
├─ 4. Record Transaction
├─ 5. Update UI (Real-time)
└─ 6. Show Success Toast
```

**Code Location**: `/lib/paystack-service.ts` (lines 358-360) & `/lib/opay-service.ts` (lines 310-312)

```typescript
// Automatically credit company account
const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
localStorage.setItem("companyBalance", (companyBalance + amount).toFixed(2));
```

#### 💰 Customer Loan Repayment Flow

```
Customer Makes Loan Repayment (e.g., ₦10,000)
    ↓
[Payment Gateway: OPay/Paystack]
    ↓
Payment Verified ✅
    ↓
AUTOMATIC ACTIONS:
├─ 1. Update Loan Balance (Repaid amount)
├─ 2. ✅ CREDIT COMPANY ACCOUNT (+₦10,000)
├─ 3. Calculate Interest Earned
├─ 4. Update Interest Revenue Balance
├─ 5. Record Transaction
├─ 6. Check if Loan Fully Paid
├─ 7. Update UI (Real-time)
└─ 8. Show Success Toast
```

**Code Location**: `/lib/paystack-service.ts` (lines 387-395) & `/lib/opay-service.ts` (lines 339-347)

```typescript
// Update company revenue (loan repayment goes to company)
const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
localStorage.setItem("companyBalance", (companyBalance + amount).toFixed(2));

// Calculate and update interest earned
const interestRate = 0.20; // 20% APR
const interestAmount = amount * (interestRate / (loan.repaymentPeriod || 8));
const loanInterestBalance = parseFloat(localStorage.getItem("loanInterestBalance") || "0");
localStorage.setItem("loanInterestBalance", (loanInterestBalance + interestAmount).toFixed(2));
```

### Complete Money Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPANY ACCOUNT                          │
│                                                             │
│  Starting Balance: ₦1,000,000                              │
└─────────────────────────────────────────────────────────────┘
                    │                    ▲
                    │                    │
        OUTGOING    │                    │    INCOMING
      (Deductions)  │                    │    (Credits)
                    │                    │
                    ▼                    │
        ┌───────────────────┐    ┌──────────────────┐
        │  DISBURSEMENTS    │    │  CUSTOMER        │
        │                   │    │  PAYMENTS        │
        │ • Loan Approval   │    │                  │
        │   -₦500,000       │    │ • Contributions  │
        │                   │    │   +₦500         │
        │ • Withdrawal      │    │                  │
        │   -₦50,000        │    │ • Loan Repay    │
        │                   │    │   +₦10,000      │
        │ • Deposit Refund  │    │                  │
        │   -₦50,000        │    │ • Upfront Costs │
        │                   │    │   +₦50,000      │
        └───────────────────┘    └──────────────────┘
                    │                    │
                    │                    │
                    ▼                    ▼
        ┌─────────────────────────────────────────┐
        │  REAL-TIME BALANCE UPDATE               │
        │                                         │
        │  Current: ₦1,000,000                   │
        │  Out:     -₦600,000                    │
        │  In:      +₦60,500                     │
        │  New:     ₦460,500                     │
        └─────────────────────────────────────────┘
```

### Transaction Types That Credit Company Account

1. **✅ Daily Contributions**
   - Every customer contribution
   - Instant credit to company
   - Builds company reserves

2. **✅ Loan Repayments**
   - Weekly/monthly payments
   - Principal + Interest
   - Major revenue source

3. **✅ Upfront Costs** (Already tracked separately)
   - Deposit (10% - refundable, held separately)
   - Insurance (8% - revenue)
   - Service Charge (2% - revenue)

4. **✅ Monthly Service Charges**
   - ₦500 per active customer
   - Recurring revenue
   - Auto-collected

### Real-Time Balance Updates

The system uses real-time updates to ensure accuracy:

```typescript
// After every payment
window.dispatchEvent(new Event("storage")); // Update all components
window.dispatchEvent(new Event("balanceUpdated")); // Update balance displays
```

**Result**: Admin sees balance update **instantly** without refresh!

### Viewing Incoming Payments (Admin)

**Admin Dashboard** → **Activity** → **Real-time Activity**
- See all incoming payments live
- Filter by type (contribution/repayment)
- View customer details
- Export reports

**Admin Dashboard** → **Revenue Analytics**
- Contribution revenue chart
- Loan repayment tracking
- Interest revenue breakdown
- Monthly trends

**Admin Dashboard** → **Company Balance Card**
- Shows current balance
- Updates in real-time
- Color-coded (green = healthy)
- Includes all incoming payments

---

## Summary

### ✅ What's Automated

**OUTGOING (Disbursements)**:
- Company account debit ✅
- Customer account credit (record) ✅
- Transaction history ✅
- Balance updates ✅
- Customer notifications ✅
- Revenue tracking ✅
- Audit trail ✅

**INCOMING (Customer Payments)**:
- Customer account debit (via gateway) ✅
- **Company account credit** ✅
- Transaction history ✅
- Balance updates ✅
- Revenue tracking ✅
- Interest calculation ✅
- Real-time UI updates ✅
- Audit trail ✅

### ⚠️ What Requires Setup (Production)

- Actual bank transfers
- Real-time payment processing
- Database storage
- Payment gateway webhooks
- Security measures
- Email/SMS notifications
- Backup systems

### 🎯 Current System Status

**Demo/Development**: ✅ Fully Functional
- Perfect for testing
- Complete bidirectional flow
- All features working
- Real-time balance updates

**Production**: ⏳ Requires Payment Gateway Setup
- Backend API needed
- Bank integration required
- Database migration needed

---

## Quick Reference

### Key Files
- `/components/admin/LoanApprovals.tsx` - Loan disbursement (OUT)
- `/components/admin/WithdrawalApprovals.tsx` - Withdrawal processing (OUT)
- `/components/admin/AdminDashboard.tsx` - Balance monitoring
- `/lib/paystack-service.ts` - Payment processing (IN)
- `/lib/opay-service.ts` - OPay payment processing (IN)
- `/components/PaymentDialog.tsx` - Customer payment UI

### Key Functions

**Disbursement (Money OUT)**:
```typescript
// Debit company account
const updatedBalance = companyBalance - disbursementAmount;
localStorage.setItem("companyBalance", updatedBalance.toString());
```

**Customer Payment (Money IN)**:
```typescript
// Credit company account
const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
localStorage.setItem("companyBalance", (companyBalance + amount).toFixed(2));
```

### Key Storage Keys
- `companyBalance` - Available funds (IN and OUT)
- `contributionBalance` - Customer savings
- `loanDeposits` - Refundable deposits
- `insuranceBalance` - Insurance revenue
- `loanInterestBalance` - Interest revenue
- `loanServiceChargeBalance` - Service charge revenue
- `transactions` - Full transaction history
- `notifications` - Customer alerts

### Balance Flow Formula
```typescript
// Starting balance
let companyBalance = 1000000;

// Customer payments (IN)
companyBalance += customerContribution; // +500
companyBalance += loanRepayment; // +10000
companyBalance += upfrontCosts; // +50000

// Disbursements (OUT)
companyBalance -= loanDisbursement; // -500000
companyBalance -= withdrawalApproval; // -50000

// Final balance
companyBalance = 510500;
```

---

## Conclusion

The automatic payment system provides **complete bidirectional money flow**:

✅ **Financial accuracy** - All balances tracked
✅ **Full audit trail** - Every transaction recorded
✅ **Customer transparency** - Instant notifications
✅ **Admin visibility** - Real-time balance updates
✅ **Revenue tracking** - Complete financial picture
✅ **Bidirectional flow** - Money IN and OUT automated

### Money Movement Summary

| Transaction Type | Direction | Company Account | Customer Account | Auto? |
|------------------|-----------|-----------------|------------------|-------|
| **Contribution** | IN ←  | Credit (+) | Debit (-) | ✅ Yes |
| **Loan Repayment** | IN ←  | Credit (+) | Debit (-) | ✅ Yes |
| **Upfront Costs** | IN ←  | Credit (+) | Debit (-) | ✅ Yes |
| **Monthly Service** | IN ←  | Credit (+) | Debit (-) | ✅ Yes |
| **Loan Disbursement** | OUT → | Debit (-) | Credit (+) | ✅ Yes |
| **Withdrawal** | OUT → | Debit (-) | Credit (+) | ✅ Yes |
| **Deposit Refund** | OUT → | Debit (-) | Credit (+) | ✅ Yes |

**Everything is automated! 🎉**

The system is **production-ready** for the front-end flow and requires only payment gateway integration for live bank transfers.
