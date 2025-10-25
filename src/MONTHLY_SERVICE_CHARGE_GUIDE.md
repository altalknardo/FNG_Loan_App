# Monthly Service Charge System

## Overview
The FNG app automatically deducts a monthly service charge from active contributors' savings balances. This charge is equal to one unit of the customer's daily contribution amount and is credited to the company account.

## How It Works

### Automatic Deduction
- **Charge Amount**: Equal to one daily contribution target (e.g., if daily target is ₦500, service charge is ₦500/month)
- **Frequency**: Monthly from the date of first contribution
- **Trigger**: Checked automatically when a user makes a contribution (active contributor check)

### Smart Processing
1. **First Contribution**: When a user makes their first contribution, the system records the date but doesn't charge
2. **Monthly Check**: On subsequent contributions, the system checks if a month has passed since the last service charge
3. **Balance Validation**: Only deducts if the user has sufficient balance
4. **Skip if Insufficient**: If balance is too low, the charge is skipped for that month (no debt accumulation)

### Example Scenarios

#### Scenario 1: Sufficient Balance
- Daily Target: ₦500
- Contribution Balance: ₦5,000
- Month Passed: Yes
- **Result**: ₦500 deducted, new balance ₦4,500

#### Scenario 2: Insufficient Balance
- Daily Target: ₦500
- Contribution Balance: ₦300
- Month Passed: Yes
- **Result**: Charge skipped, balance remains ₦300

#### Scenario 3: Not Yet Time
- Daily Target: ₦500
- Contribution Balance: ₦5,000
- Days Since Last Charge: 20 days
- **Result**: No charge, wait until 30+ days

## For Users

### Transaction History
Service charges appear in your transaction history as:
- **Type**: Service Charge (orange icon)
- **Description**: "Monthly Service Charge"
- **Amount**: Your daily contribution target
- **Status**: Completed

### Notification
When a service charge is deducted, you'll see a toast notification showing the amount deducted.

## For Admins

### Company Balance Tracker
Admins can view the total service charges collected in two places:

1. **Admin Dashboard**
   - Prominent green card showing total company balance
   - Real-time updates
   - Quick link to detailed settings

2. **Company Settings**
   - Detailed breakdown of service charges
   - Policy explanation
   - Total collected amount

### Viewing Details
Navigate to: **Admin → Company Settings → Company Balance Tracker**

The tracker displays:
- Total service charges collected
- How the system works
- Monthly deduction policy
- Active contributor criteria

## Technical Details

### Storage
- `companyBalance`: Total service charges collected (localStorage)
- `firstContributionDate_{userEmail}`: Date of user's first contribution
- `lastServiceChargeDate_{userEmail}`: Date of last service charge deduction

### Processing Logic
```javascript
// Check monthly (30+ days since last charge)
if (monthsSinceLastCharge >= 1) {
  // Verify sufficient balance
  if (contributionBalance >= dailyContributionTarget) {
    // Deduct from user balance
    // Add to company balance
    // Record transaction
    // Update last charge date
  } else {
    // Skip this month
  }
}
```

### Transaction Type
Service charge transactions are recorded with type `service_charge` and appear in the user's transaction history with proper styling.

## Important Notes

- ✅ Only applies to **active contributors** (users who make contributions)
- ✅ **No debt accumulation** - skipped if balance insufficient
- ✅ **Automatic processing** - no manual intervention needed
- ✅ **Transparent tracking** - appears in transaction history
- ✅ **Real-time updates** - company balance updates immediately

## Benefits

### For Company
- Automatic revenue collection
- Transparent tracking system
- Real-time balance visibility
- No manual processing required

### For Users
- Predictable charges
- No surprise deductions
- Transparent transaction history
- Skip protection (insufficient balance)

---

**Last Updated**: October 19, 2025
