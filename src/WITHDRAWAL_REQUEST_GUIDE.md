# Contribution Withdrawal Request System - Complete Guide

## Overview
The FNG app now includes a comprehensive **contribution withdrawal request system** that allows customers to request withdrawals from their saved contribution balance, with admin approval workflow.

---

## 🎯 Key Features

### For Customers:
✅ **Request Withdrawals** - Submit withdrawal requests anytime  
✅ **Multiple Accounts** - Choose which account receives funds  
✅ **Track Status** - Monitor request status (pending/approved/rejected)  
✅ **Reason Required** - Provide context for withdrawal  
✅ **Balance Protection** - Cannot withdraw more than available  
✅ **Quick Amounts** - Fast selection of common amounts  

### For Admins:
✅ **Review Requests** - See all withdrawal requests in one place  
✅ **Approve/Reject** - Quick approval or rejection with one click  
✅ **View Details** - Complete customer and account information  
✅ **Balance Tracking** - Automatic balance updates on approval  
✅ **Transaction History** - All actions logged  

---

## 📱 Customer Experience

### Accessing the Withdrawal Feature

The withdrawal button appears prominently on the **Contributions** page when the customer has a balance > ₦0.

#### Location:
```
Contributions Tab → Top of page (after stats cards)
```

#### Visual:
- **Green gradient card** showing available balance
- **Large withdrawal amount** in green text
- **"Request Withdrawal" button** in green
- **Info text** explaining approval process

### Step-by-Step: Requesting a Withdrawal

#### Step 1: Click "Request Withdrawal"
Opens a comprehensive dialog with all withdrawal options.

#### Step 2: View Available Balance
The dialog displays your current contribution balance prominently at the top.

#### Step 3: Enter Withdrawal Amount
```
Options:
- Manual input (₦500 minimum)
- Quick select buttons (₦5k, ₦10k, All)
- Maximum: Your available balance
```

#### Step 4: Select Withdrawal Account
Choose from your saved payment methods:
- Bank accounts
- Debit/credit cards
- Shows: Bank name, last 4 digits
- Must have at least one payment method

#### Step 5: Provide Reason
Explain why you need the withdrawal:
- Required field
- Max 200 characters
- Examples:
  - "Medical emergency"
  - "School fees payment"
  - "Business capital"
  - "Personal needs"

#### Step 6: Review Summary
The dialog shows:
- Withdrawal amount
- Remaining balance after withdrawal
- Selected account
- Reason provided

#### Step 7: Submit Request
Click **"Submit Request"** button:
- Request sent to admin
- Status: Pending
- Notification shown
- Added to transaction history

---

## 🎨 User Interface

### Withdrawal Button Card
```
┌─────────────────────────────────────┐
│  Available Balance                  │
│  ₦25,000.00                    ⬇️   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🔽 Request Withdrawal        │ │
│  └───────────────────────────────┘ │
│                                     │
│  Withdraw your savings anytime.     │
│  Subject to admin approval.         │
└─────────────────────────────────────┘
```

### Withdrawal Dialog
```
┌─────────────────────────────────────┐
│  Request Withdrawal              ✕  │
├─────────────────────────────────────┤
│  Available Balance                  │
│  ₦25,000.00                         │
├─────────────────────────────────────┤
│  ⚠️ Important:                      │
│  • Requires admin approval          │
│  • Takes 1-2 business days          │
│  • Sent to selected account         │
├─────────────────────────────────────┤
│  Withdrawal Amount                  │
│  ┌───────────────────────────────┐ │
│  │ ₦ 10000                       │ │
│  └───────────────────────────────┘ │
│  Maximum: ₦25,000.00                │
│                                     │
│  Quick Select                       │
│  [ ₦5k ]  [ ₦10k ]  [ All ]         │
│                                     │
│  Withdrawal Account                 │
│  ┌───────────────────────────────┐ │
│  │ 🏦 GTBank •••• 4532          ▼│ │
│  └───────────────────────────────┘ │
│                                     │
│  Reason for Withdrawal              │
│  ┌───────────────────────────────┐ │
│  │ Need funds for school fees... │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│  45/200 characters                  │
│                                     │
│  💼 Withdrawal Summary              │
│  Withdrawal Amount: ₦10,000.00      │
│  Remaining Balance: ₦15,000.00      │
│                                     │
│  [ Cancel ]  [ Submit Request ]     │
└─────────────────────────────────────┘
```

---

## 👨‍💼 Admin Experience

### Accessing Withdrawal Approvals

Navigate to: **Admin Mode** → **Withdrawals** (sidebar)

### Admin Dashboard View

#### Stats Cards (Top)
```
┌─────────────┬─────────────┬─────────────┐
│ ⏰ Pending  │ ✓ Approved  │ ✗ Rejected  │
│     3       │      15     │      2      │
└─────────────┴─────────────┴─────────────┘
```

#### Tabs
- **Pending** - Requests awaiting approval
- **Approved** - Successfully approved withdrawals
- **Rejected** - Denied withdrawal requests

### Request Card Details

Each withdrawal request shows:

```
┌─────────────────────────────────────────────┐
│  👤 John Doe                    [Pending]   │
│     john@example.com                        │
├─────────────────────────────────────────────┤
│  Withdrawal Amount    Available Balance     │
│  -₦10,000.00         ₦25,000.00            │
│                                             │
│  Bank Account                               │
│  GTBank •••• 4532                          │
│                                             │
│  Request Date         Remaining Balance     │
│  2025-10-19 2:30 PM   ₦15,000.00           │
├─────────────────────────────────────────────┤
│  📄 Reason:                                 │
│  Need funds for school fees payment this    │
│  week. Urgent requirement.                  │
├─────────────────────────────────────────────┤
│  Payment Method Details                     │
│  Type: bank                                 │
│  Account Name: Savings Account              │
│  Bank: GTBank                               │
├─────────────────────────────────────────────┤
│  [ ✓ Approve ]      [ ✗ Reject ]           │
└─────────────────────────────────────────────┘
```

### Admin Actions

#### Approve Withdrawal
1. Click **"Approve"** button
2. System automatically:
   - Updates request status to "approved"
   - Deducts amount from customer's contribution balance
   - Updates transaction history
   - Shows success notification
3. Customer sees approved status in their transactions

#### Reject Withdrawal
1. Click **"Reject"** button
2. System automatically:
   - Updates request status to "rejected"
   - Keeps customer balance unchanged
   - Updates transaction history to "failed"
   - Shows notification
3. Customer sees rejected status

---

## 💾 Data Storage & Management

### LocalStorage Keys

#### Withdrawal Requests
```javascript
Key: "withdrawalRequests"
Type: Array
Structure: [
  {
    id: number,
    userId: string,
    userName: string,
    amount: number,
    accountDetails: string,
    requestDate: string,
    requestTime: string,
    status: "pending" | "approved" | "rejected",
    availableBalance: number,
    reason: string,
    paymentMethod: {
      type: string,
      name: string,
      last4: string,
      bankName?: string,
      cardBrand?: string
    }
  }
]
```

#### Contribution Balance
```javascript
Key: "contributionBalance"
Type: String (number)
Updated: On approval/contributions
```

#### Transactions
```javascript
Key: "transactions"
Type: Array
Includes: withdrawal_request, withdrawal (approved), failed (rejected)
```

---

## 🔄 Workflow Diagram

```
Customer Side:
1. View Balance → 2. Click Withdraw → 3. Fill Form → 4. Submit
                                                         ↓
Admin Side:                                              ↓
5. Review Request ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
         ↓
    6. Decision
         ↓
    ┌────┴────┐
    ↓         ↓
Approve    Reject
    ↓         ↓
7. Deduct  7. Keep
Balance    Balance
    ↓         ↓
8. Update  8. Update
Transaction Transaction
    ↓         ↓
9. Notify  9. Notify
Customer   Customer
```

---

## ✅ Validation Rules

### Customer Side:
- ❌ Amount must be > ₦0
- ❌ Amount cannot exceed available balance
- ❌ Must select a payment account
- ❌ Reason is required (min 1 character)
- ❌ Must have at least one payment method added
- ✅ Can request multiple withdrawals (if balance allows)

### Admin Side:
- ✅ Can approve any pending request
- ✅ Can reject any pending request
- ⚠️ Cannot approve if would result in negative balance
- ✅ Approved/rejected requests cannot be changed

---

## 📊 Transaction History Integration

### Customer View
Withdrawal requests appear in **Transaction History** as:

#### Pending:
```
Type: Withdrawal Request
Status: Pending
Amount: -₦10,000.00
Date: 2025-10-19
Description: Withdrawal Request - School fees
Icon: ⏰ (Clock)
Color: Orange
```

#### Approved:
```
Type: Withdrawal
Status: Completed
Amount: -₦10,000.00
Date: 2025-10-19
Description: School fees
Icon: ✓ (Check)
Color: Green
```

#### Rejected:
```
Type: Withdrawal Request
Status: Failed
Amount: -₦10,000.00
Date: 2025-10-19
Description: Withdrawal Request - School fees
Icon: ✗ (X)
Color: Red
```

---

## 🎯 Use Cases

### Use Case 1: Emergency Withdrawal
**Scenario:** Customer needs funds urgently

1. Customer has ₦50,000 saved
2. Needs ₦20,000 for medical emergency
3. Opens Contributions → Request Withdrawal
4. Enters ₦20,000
5. Selects bank account
6. Reason: "Medical emergency - hospital bill"
7. Submits request
8. Admin reviews within hours
9. Approves request
10. Customer receives funds in 1-2 business days

### Use Case 2: Partial Withdrawal
**Scenario:** Customer wants some savings but not all

1. Balance: ₦100,000
2. Requests: ₦30,000
3. Reason: "Business capital"
4. Remaining: ₦70,000 still saved
5. Can continue making contributions
6. Can request another withdrawal later

### Use Case 3: Full Withdrawal
**Scenario:** Customer wants to withdraw all savings

1. Balance: ₦25,000
2. Clicks "All" quick button
3. Requests: ₦25,000
4. Reason: "Closing account"
5. Remaining: ₦0
6. Can still make new contributions later

---

## 🔐 Security Features

### Data Protection:
- ✅ No sensitive data exposed in UI
- ✅ Only last 4 digits of account shown
- ✅ Amount validation prevents errors
- ✅ Balance checks prevent overdraft
- ✅ Admin approval prevents abuse

### Access Control:
- ✅ Customers can only see own requests
- ✅ Admins see all requests
- ✅ Cannot modify approved/rejected requests
- ✅ Audit trail in transaction history

---

## 📱 Mobile Optimization

### Responsive Design:
- ✅ Full-screen dialog on mobile
- ✅ Large touch targets (buttons)
- ✅ Scrollable content
- ✅ Auto-focus on amount input
- ✅ Quick amount buttons optimized for touch

### Performance:
- ✅ Instant validation feedback
- ✅ No page reloads required
- ✅ Real-time balance updates
- ✅ Optimistic UI updates

---

## 🚀 Future Enhancements

### Planned Features:
- [ ] Withdrawal limits (daily/monthly)
- [ ] Scheduled withdrawals
- [ ] Recurring withdrawal requests
- [ ] Email notifications for status changes
- [ ] SMS confirmation codes
- [ ] Withdrawal history export
- [ ] Admin bulk approval
- [ ] Withdrawal analytics dashboard
- [ ] Auto-rejection after X days
- [ ] Customer withdrawal comments/appeals

---

## 🐛 Troubleshooting

### Issue: "Insufficient Balance" Error
**Solution:** Check your contribution balance. You may have pending loan payments or previous withdrawals.

### Issue: "Please add a payment method first"
**Solution:** Go to Profile → Payment Methods → Add a bank account or card.

### Issue: Withdrawal button not showing
**Solution:** Make sure your contribution balance is > ₦0. Make some contributions first.

### Issue: Request stuck in "Pending"
**Solution:** Contact admin. Approval typically takes 1-2 business days.

### Issue: Cannot select account in dropdown
**Solution:** Ensure you have added at least one payment method in your profile.

---

## 📞 Support Information

### For Customers:
- Check transaction history for request status
- Contact admin if pending > 2 business days
- Ensure payment method is valid before requesting
- Save transaction reference numbers

### For Admins:
- Review each request carefully
- Check customer balance before approving
- Contact customer if reason is unclear
- Keep audit trail of all actions

---

## 📈 Statistics & Reporting

### Admin Dashboard Metrics:
- **Pending Count**: Real-time counter
- **Approved Count**: Lifetime approved
- **Rejected Count**: Lifetime rejected
- **Total Withdrawal Volume**: Sum of approved amounts
- **Average Withdrawal**: Mean approved amount
- **Response Time**: Time from request to decision

---

## 🎓 Best Practices

### For Customers:
1. **Be specific** in withdrawal reasons
2. **Request realistic amounts** based on balance
3. **Keep payment methods updated**
4. **Plan ahead** - allow 2 business days
5. **Check transaction history** for status updates

### For Admins:
1. **Review requests daily**
2. **Verify customer balance** before approval
3. **Read withdrawal reasons** carefully
4. **Document large withdrawals**
5. **Respond within 24-48 hours**
6. **Contact customers** for unclear requests

---

## 📝 Summary

The **Contribution Withdrawal Request System** provides:

✅ **Easy Access** - Prominent button on Contributions page  
✅ **Complete Information** - All details in one dialog  
✅ **Smart Validation** - Prevents errors before submission  
✅ **Quick Selection** - Fast amount and account selection  
✅ **Admin Control** - Full review and approval workflow  
✅ **Transaction Tracking** - Complete audit trail  
✅ **Balance Protection** - Automatic balance management  
✅ **Mobile Optimized** - Perfect for on-the-go requests  

**Customers can now access their savings easily while maintaining financial oversight through the admin approval process.**

---

## 🔗 Related Features

- **Contributions** - Make daily savings contributions
- **Payment Methods** - Manage bank accounts and cards
- **Transaction History** - View all financial activities
- **Admin Approvals** - KYC, loans, and withdrawal management
- **Dashboard** - Overview of all balances and activities

---

**Version:** 1.0  
**Last Updated:** October 19, 2025  
**Status:** ✅ Fully Implemented
