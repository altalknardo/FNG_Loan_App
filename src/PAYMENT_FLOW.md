# Payment Flow Documentation

## Overview
The FNG app now has a complete payment integration system that allows users to make contributions and loan payments through their saved bank accounts.

## How It Works

### 1. Payment Methods Setup
- Users can add payment methods (bank accounts or cards) in the **Payment Methods** page
- Payment methods are stored in `localStorage` under the key `paymentMethods`
- Users can set a default payment method
- All payment methods are synced across the app

### 2. Making Contributions
1. User enters an amount in the **Contributions** page
2. Clicks "Contribute" button
3. **PaymentDialog** opens showing saved payment methods
4. User selects a payment method
5. Company bank account details are displayed:
   - **Bank Name:** First Bank of Nigeria
   - **Account Number:** 0123456789
   - **Account Name:** FNG FINANCIAL SERVICES
6. User can copy the account number
7. User transfers money from their bank app to the company account
8. User clicks "I've Completed Transfer"
9. System simulates verification and shows confirmation
10. User clicks "Confirm & Update Balance"
11. Balance is updated immediately

### 3. Making Loan Payments
1. User navigates to **Loans** page
2. Finds their active loan
3. Clicks "Make Payment" button
4. **PaymentDialog** opens with the weekly payment amount
5. Same flow as contributions (steps 4-11 above)
6. Loan repayment amount is updated
7. Next payment date is calculated (7 days from payment)

## Data Storage (localStorage)

### Keys Used:
- `paymentMethods` - Array of user's payment methods
- `userBalance` - Total user balance (number)
- `totalContributions` - Total amount contributed (number)
- `currentMonthTotal` - Current month contributions (number)
- `contributionHistory` - Array of contribution records
- `activeLoans` - Array of active loan objects
- `transactions` - Array of all transactions (contributions + loan payments)

### Transaction Object Structure:
```javascript
{
  id: number,
  type: "contribution" | "loan_payment" | "loan_disbursement",
  amount: number,
  date: "YYYY-MM-DD",
  time: "HH:MM AM/PM",
  description: string,
  status: "completed" | "pending"
}
```

### Active Loan Object Structure:
```javascript
{
  id: number,
  amount: number,
  repaid: number,
  weeklyPayment: number,
  nextPayment: "YYYY-MM-DD",
  status: "active",
  period: number,
  startDate: "YYYY-MM-DD"
}
```

## Real-time Updates

The app uses periodic checks (every 1 second) to update data across different pages:

- **Dashboard** - Updates balance, contributions, and loan repayment progress
- **Transaction History** - Updates transaction list
- **Contributions** - Updates totals
- **Loans** - Updates loan repayment status

## Payment Flow Components

### PaymentDialog.tsx
- Handles the complete payment flow
- 3-step process: Select Method → Transfer → Confirm
- Shows company account details
- Simulates payment verification
- Calls `onPaymentSuccess` callback with amount and payment method

### Contributions.tsx
- Integrates PaymentDialog
- Updates balances and history after successful payment
- Adds transaction to global transactions array

### LoanSection.tsx
- Integrates PaymentDialog for loan payments
- Updates loan repayment amount
- Calculates next payment date
- Adds transaction to global transactions array

### TransactionHistory.tsx
- Displays all transactions from localStorage
- Auto-updates when new transactions are added
- Filters by type (all, contributions, loans)

## Company Bank Account

**Configurable by Admin:**
The company bank account details are now configurable by administrators in Admin Mode.

**How to Configure:**
1. Switch to Admin Mode
2. Navigate to Settings (Company Settings)
3. Edit the company account details
4. Save changes

**Default Settings:**
- Bank Name: First Bank of Nigeria
- Account Number: 0123456789
- Account Name: FNG FINANCIAL SERVICES

**Important:**
- Account details are stored in localStorage under the key `companyAccount`
- Changes made by admin reflect immediately in user mode
- All customer payments will use these configured account details
- See ADMIN_COMPANY_SETTINGS.md for detailed documentation

## Testing the Payment Flow

1. **Add a Payment Method:**
   - Go to Profile → Payment Methods
   - Click "Add Payment Method"
   - Select "Bank Account"
   - Fill in the details
   - Click "Add Payment Method"

2. **Make a Contribution:**
   - Go to Contributions (Save tab)
   - Enter an amount (e.g., 100)
   - Click "Contribute ₦100"
   - Select your payment method
   - Follow the payment flow
   - Verify balance updated in Dashboard

3. **Make a Loan Payment:**
   - Go to Loans tab
   - Click "Make Payment" on Active Loan
   - Follow the payment flow
   - Verify loan repayment amount updated
   - Check Transaction History for the payment

## Notes

- All payments are simulated (no actual bank integration)
- Payment verification happens instantly (2-second delay for UX)
- All data persists in localStorage
- No backend required for this demo version
