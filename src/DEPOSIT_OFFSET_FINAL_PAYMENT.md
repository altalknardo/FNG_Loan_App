# Deposit Offset for Final Loan Payment

## Overview
Users can now use their refundable loan deposit (10% of loan amount) to offset their remaining loan balance during the final payment stage.

## Feature Details

### When It Activates
- The deposit offset option appears when the loan is within 2 payments of completion
- Only shows if the loan has an active deposit amount > 0
- Displays for loans with remaining balance > 0

### How It Works

1. **Detection**: System automatically detects when user is near final payment (within 2 weekly payments)

2. **Option Display**: Shows a green alert box with:
   - Information about available deposit amount
   - Checkbox to enable deposit usage
   - Breakdown of payment calculation

3. **Payment Calculation**:
   - Deposit amount is applied first
   - User only pays the remaining difference (if any)
   - If deposit covers full balance, payment is processed immediately
   - If deposit covers partial balance, user proceeds to pay the difference

4. **Processing**:
   - **Full Coverage** (deposit ≥ remaining balance):
     - Payment processed immediately without payment dialog
     - Loan marked as fully paid
     - Deposit marked as refunded/used
   
   - **Partial Coverage** (deposit < remaining balance):
     - User proceeds to payment dialog
     - Only pays the difference
     - Deposit + payment amount applied together

### Financial Tracking

#### Deposit Management
- Deducted from `loanDeposits` balance
- Transaction record created for deposit usage
- Loan deposit marked as `depositRefunded: true`

#### Interest Calculation
- Interest calculated on total payment (deposit + cash payment)
- Tracked in loan interest revenue
- Recorded in interest transaction history
- Properly attributed to loan type (SME/Business/Jumbo)

#### Transaction Records
- Creates transaction of type `deposit_offset`
- Shows in transaction history
- Includes deposit amount and loan ID

### User Experience

#### Visual Feedback
```
┌─────────────────────────────────────────┐
│ ✓ Final Payment Option                  │
│   You can use your refundable deposit   │
│   (₦50,000) to offset your remaining    │
│   balance.                               │
└─────────────────────────────────────────┘

☐ Use my deposit (₦50,000) to offset 
  remaining balance

┌─────────────────────────────────────────┐
│ Remaining Balance:        ₦75,000       │
│ Deposit Applied:         -₦50,000       │
│ ─────────────────────────────────────   │
│ Amount to Pay:            ₦25,000       │
└─────────────────────────────────────────┘

[Pay Remaining Amount]
```

### Button States
- **Not checked**: "Make Payment" - normal payment flow
- **Checked + Zero balance**: "Complete with Deposit" - immediate processing
- **Checked + Partial balance**: "Pay Remaining Amount" - payment dialog opens

## Technical Implementation

### State Variables
```typescript
const [useDepositForPayment, setUseDepositForPayment] = useState(false);
const [depositAmountToUse, setDepositAmountToUse] = useState(0);
```

### Key Logic
1. **Detection**: `remainingBalance <= weeklyPayment * 2`
2. **Calculation**: `Math.min(loanDepositAmount, remainingBalance)`
3. **Payment**: `totalPayment = cashPayment + depositAmount`

### localStorage Updates
- `loanDeposits` - Reduced by deposit amount used
- `activeLoans` - Loan marked with `depositRefunded: true`
- `transactions` - New transaction for deposit offset
- `loanInterestBalance` - Updated with interest portion
- `interestTransactions` - Transaction includes `depositUsed` field

## Benefits

1. **Customer Convenience**
   - One-click final payment option
   - Reduces out-of-pocket expense
   - Clear visibility of deposit application

2. **Financial Clarity**
   - Transparent breakdown of payment
   - Proper interest calculation
   - Complete audit trail

3. **Automatic Processing**
   - No admin approval needed for final payment usage
   - Instant completion for full deposit coverage
   - Seamless integration with existing payment flow

## Edge Cases Handled

1. **Deposit > Remaining Balance**: Only uses exact amount needed
2. **Multiple Active Loans**: Each loan tracks its own deposit
3. **Zero Payment**: Processes immediately without payment gateway
4. **Interest Calculation**: Correctly calculates interest on total payment
5. **Transaction History**: Properly records both deposit offset and cash payment

## User Flow Example

### Scenario 1: Deposit Covers Full Balance
- Remaining balance: ₦40,000
- Deposit available: ₦50,000
- User checks "Use deposit" box
- Amount to pay: ₦0
- Clicks "Complete with Deposit"
- ✓ Loan immediately marked as paid
- ✓ Deposit reduced by ₦40,000

### Scenario 2: Partial Coverage
- Remaining balance: ₦75,000
- Deposit available: ₦50,000
- User checks "Use deposit" box
- Amount to pay: ₦25,000
- Clicks "Pay Remaining Amount"
- Opens payment dialog for ₦25,000
- After payment: Total ₦75,000 applied (₦50,000 deposit + ₦25,000 cash)
- ✓ Loan fully paid
- ✓ Deposit fully used

## Related Features

- Works alongside existing deposit offset requests (admin approval)
- Compatible with contribution balance offset
- Integrated with bank account offset
- Part of complete loan repayment system

## Notes

- This feature is automatic and requires no configuration
- Admin can still see deposit usage in transaction history
- Maintains all existing deposit refund functionality
- Does not interfere with completed loan deposit claims
