# 🧪 Payment Integration Testing Guide

Complete testing guide for OPay & Paystack payment gateways in FNG.

---

## 🎯 Quick Test (5 Minutes)

### Step-by-Step Test

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Login:**
   - Email: `user@fng.com`
   - Password: `user123`

3. **Navigate to Contributions:**
   - Click "Save" in bottom navigation

4. **Make a contribution:**
   - Click "Contribute" button
   - Amount: ₦500
   - Click "Pay Now (Instant)"

5. **Select Gateway:**
   - You'll see two options:
     ```
     🟢 OPay        [Most Popular]
     🔵 Paystack    [Trusted]
     ```
   - **Select OPay**

6. **Complete Payment:**
   - In development mode, you'll see a simulation dialog
   - Click **OK** to simulate success
   - Or click **Cancel** to test cancellation

7. **Verify Success:**
   - ✅ Success message appears
   - ✅ Balance updated
   - ✅ Transaction appears in history
   - ✅ Reference number shown

---

## 📋 Comprehensive Testing Checklist

### 1. OPay Payment Testing

#### Test Case 1: Successful Payment
- [ ] Start payment flow
- [ ] Select OPay gateway
- [ ] Complete payment (click OK in simulation)
- [ ] Verify success message
- [ ] Check balance increased by correct amount
- [ ] Find transaction in Transaction History
- [ ] Verify reference starts with `FNG_OPAY_`

#### Test Case 2: Cancelled Payment
- [ ] Start payment flow
- [ ] Select OPay gateway
- [ ] Cancel payment (click Cancel in simulation)
- [ ] Verify cancellation message
- [ ] Check balance unchanged
- [ ] Verify no transaction recorded

#### Test Case 3: Multiple Payments
- [ ] Make 3 consecutive payments
- [ ] Each for different amounts (₦500, ₦1000, ₦250)
- [ ] Verify all 3 recorded
- [ ] Verify total balance correct
- [ ] Check transaction history order (newest first)

### 2. Paystack Payment Testing

#### Test Case 1: Successful Payment
- [ ] Start payment flow
- [ ] Select Paystack gateway
- [ ] Complete payment
- [ ] Verify success
- [ ] Check balance updated
- [ ] Find transaction in history

#### Test Case 2: Gateway Switching
- [ ] Start payment with OPay
- [ ] Cancel
- [ ] Start new payment
- [ ] Choose Paystack instead
- [ ] Complete payment
- [ ] Verify gateway recorded correctly

### 3. Contribution Testing

#### Test Case 1: Daily Contribution
- [ ] Navigate to Contributions
- [ ] Click "Contribute"
- [ ] Enter ₦500 (minimum target)
- [ ] Pay with OPay
- [ ] Verify streak updated
- [ ] Check calendar shows contribution

#### Test Case 2: Bulk Contribution
- [ ] Click "Bulk Add"
- [ ] Enter ₦5000 total
- [ ] Select 10 days
- [ ] Pay with OPay
- [ ] Verify ₦500 per day distributed
- [ ] Check calendar shows all days

### 4. Loan Repayment Testing

#### Test Case 1: Loan Payment
- [ ] Navigate to Loans
- [ ] Create a loan (if needed)
- [ ] Click "Make Payment"
- [ ] Enter amount
- [ ] Pay with OPay
- [ ] Verify loan balance reduced
- [ ] Check remaining balance correct

### 5. UI/UX Testing

#### Test Case 1: Mobile Responsiveness
- [ ] Open browser DevTools
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1920px)
- [ ] Verify payment dialog fits screen
- [ ] Check buttons accessible

#### Test Case 2: Gateway Selection UI
- [ ] Verify OPay shows "Most Popular" badge
- [ ] Verify OPay shows "90% of users" badge
- [ ] Check Paystack shows "Trusted" badge
- [ ] Verify payment channels listed correctly
- [ ] Test hover effects on cards

### 6. Error Handling Testing

#### Test Case 1: Network Error Simulation
- [ ] Open DevTools → Network tab
- [ ] Set to "Offline"
- [ ] Try to make payment
- [ ] Verify error message shown
- [ ] Check graceful failure

#### Test Case 2: Invalid Amount
- [ ] Try to pay ₦0
- [ ] Try to pay negative amount
- [ ] Try to pay non-numeric value
- [ ] Verify validation messages

---

## 🔍 Detailed Test Scenarios

### Scenario 1: New User Journey

```
1. New user signs up
   → Email verification
   → KYC registration
   
2. First contribution
   → Navigate to Contributions
   → See empty balance
   → Click "Contribute"
   → Enter ₦500
   → Choose OPay (sees it's popular)
   → Complete payment
   → Success! Balance now ₦500
   → Streak: 1 day 🔥
```

**Verify:**
- ✅ Payment gateway selection clear
- ✅ OPay recommended for first-time users
- ✅ Balance updates immediately
- ✅ Streak counter starts
- ✅ Transaction recorded

### Scenario 2: Regular User

```
1. Existing user logs in
   → Has ₦5,000 balance
   → 15-day streak
   
2. Daily contribution
   → Quick contribute ₦500
   → Uses OPay (familiar)
   → Pays in 2 seconds
   → Streak now 16 days
   
3. Checks history
   → Sees all OPay payments
   → All successful
   → References saved
```

**Verify:**
- ✅ Quick payment flow
- ✅ Gateway preference saved
- ✅ Streak maintained
- ✅ History accurate

### Scenario 3: Loan Repayment

```
1. User has active loan
   → Borrowed ₦50,000
   → Weekly payment: ₦7,500
   → Due in 2 days
   
2. Makes early payment
   → Navigate to Loans
   → Click "Make Payment"
   → Enter ₦7,500
   → Select Paystack (prefers card)
   → Complete payment
   
3. Loan updated
   → Balance reduced
   → Next payment date updated
   → Payment recorded
```

**Verify:**
- ✅ Both gateways work for loans
- ✅ Loan balance correct
- ✅ Payment schedule updated
- ✅ History shows loan payment

### Scenario 4: Power User

```
1. User manages multiple activities
   → Daily contribution (₦500)
   → Loan repayment (₦7,500)
   → Bulk contribution (₦10,000)
   
2. Uses both gateways
   → OPay for quick contributions
   → Paystack for large payments
   
3. Reviews analytics
   → Total via OPay: ₦25,000
   → Total via Paystack: ₦15,000
   → Success rate: 100%
```

**Verify:**
- ✅ Multiple payment types work
- ✅ Gateway switching smooth
- ✅ Analytics accurate
- ✅ No conflicts

---

## 🎨 Visual Testing

### Payment Dialog States

#### 1. Gateway Selection Screen
```
┌────────────────────────────────┐
│  Choose Payment Gateway        │
├────────────────────────────────┤
│  🟢 OPay    [Most Popular]     │
│     90% of users               │
│     • OPay Wallet              │
│     • Bank Card                │
│     • Transfer                 │
│     • USSD                     │
│                                │
│  🔵 Paystack    [Trusted]      │
│     • Visa/Mastercard          │
│     • Bank Transfer            │
│     • USSD                     │
└────────────────────────────────┘
```

**Check:**
- [ ] OPay card highlighted
- [ ] Badges visible
- [ ] Icons clear
- [ ] Text readable
- [ ] Colors distinct

#### 2. Processing Screen
```
┌────────────────────────────────┐
│  ⚡ Processing Payment          │
├────────────────────────────────┤
│                                │
│  Please complete the payment   │
│  in the OPay window            │
│                                │
│  [Loading spinner]             │
│                                │
└────────────────────────────────┘
```

**Check:**
- [ ] Loading indicator animates
- [ ] Message clear
- [ ] Can't close accidentally

#### 3. Success Screen
```
┌────────────────────────────────┐
│  ✓ Payment Successful!         │
├────────────────────────────────┤
│  Amount Paid:    ₦500.00       │
│  Gateway:        OPay          │
│  Reference:      FNG_OPAY_...  │
│  Status:         ✓ Verified    │
│                                │
│  Your balance has been updated!│
│                                │
│  [Done]                        │
└────────────────────────────────┘
```

**Check:**
- [ ] Success icon visible
- [ ] Amount correct
- [ ] Gateway name shown
- [ ] Reference copyable
- [ ] Close button works

---

## 📊 Data Validation

### Transaction Record Structure

After each payment, verify localStorage:

```javascript
// Check transaction recorded correctly
const transactions = JSON.parse(
  localStorage.getItem("transactions") || "[]"
);

const lastTransaction = transactions[0];

// Should contain:
{
  id: 1729516800123,
  date: "2025-10-20T10:30:00.000Z",
  type: "contribution",
  amount: 500,
  balance: 5500,
  status: "completed",
  reference: "FNG_OPAY_1729516800_123456",
  orderNo: "OPAY_1729516800123",
  paymentMethod: "OPay",
  userId: "user@fng.com",
  gateway: "opay",
  timestamp: 1729516800123
}
```

**Validate:**
- [ ] `id` is unique
- [ ] `date` is ISO format
- [ ] `type` is correct
- [ ] `amount` matches payment
- [ ] `balance` updated correctly
- [ ] `status` is "completed"
- [ ] `reference` starts with "FNG_OPAY_"
- [ ] `gateway` is "opay" or "paystack"

### Balance Calculation

```javascript
// Verify balance math
const contributions = JSON.parse(
  localStorage.getItem("transactions") || "[]"
).filter(t => t.type === "contribution");

const total = contributions.reduce(
  (sum, t) => sum + t.amount, 
  0
);

const balance = parseFloat(
  localStorage.getItem("contributionBalance") || "0"
);

console.assert(
  total === balance,
  "Balance mismatch! Total: " + total + " Balance: " + balance
);
```

**Check:**
- [ ] Balance equals sum of contributions
- [ ] No duplicate transactions
- [ ] No negative balances
- [ ] Decimal precision correct (2 places)

---

## 🔧 Developer Testing Tools

### Browser Console Commands

```javascript
// 1. Check OPay configuration
console.log("OPay Config:", {
  publicKey: import.meta.env.VITE_OPAY_PUBLIC_KEY?.substring(0, 10) + "...",
  hasPrivateKey: !!import.meta.env.VITE_OPAY_PRIVATE_KEY,
  merchantId: import.meta.env.VITE_OPAY_MERCHANT_ID
});

// 2. View all transactions
console.table(
  JSON.parse(localStorage.getItem("transactions") || "[]")
);

// 3. Check gateway usage
const txs = JSON.parse(localStorage.getItem("transactions") || "[]");
const opayCount = txs.filter(t => t.gateway === "opay").length;
const paystackCount = txs.filter(t => t.gateway === "paystack").length;
console.log("OPay:", opayCount, "Paystack:", paystackCount);

// 4. Verify balance
console.log("Balance:", 
  localStorage.getItem("contributionBalance")
);

// 5. Clear test data (use with caution!)
// localStorage.removeItem("transactions");
// localStorage.removeItem("contributionBalance");
```

### Network Tab Monitoring

1. Open DevTools (F12)
2. Go to Network tab
3. Make a payment
4. Look for:
   - API calls to OPay/Paystack
   - Response status codes
   - Response times
   - Error messages

### React DevTools

1. Install React DevTools extension
2. Inspect PaymentDialog component
3. Check state values:
   - `selectedGateway`
   - `isProcessing`
   - `step`
   - `confirmationCode`

---

## 🚨 Common Issues & Solutions

### Issue 1: Payment Dialog Not Opening

**Symptoms:**
- Click "Pay Now" but nothing happens
- No error message shown

**Check:**
1. Console for JavaScript errors
2. `userEmail` prop passed to component
3. Payment method selected
4. Amount entered

**Fix:**
```javascript
// Verify props in parent component
<Contributions userEmail={userEmail} />
```

### Issue 2: Balance Not Updating

**Symptoms:**
- Payment succeeds
- No balance change

**Check:**
1. localStorage in DevTools
2. Transaction recorded
3. Balance calculation logic

**Fix:**
```javascript
// Manually trigger storage event
window.dispatchEvent(new Event("storage"));
```

### Issue 3: Gateway Selection Not Showing

**Symptoms:**
- Goes directly to processing
- Skips gateway selection

**Check:**
1. PaymentDialog component version
2. `handlePayNow` function logic
3. State management

**Fix:**
Ensure latest PaymentDialog.tsx with gateway selection step.

---

## ✅ Test Completion Checklist

### Basic Tests (Required)
- [ ] OPay payment successful
- [ ] Paystack payment successful
- [ ] Payment cancellation works
- [ ] Balance updates correctly
- [ ] Transaction recorded
- [ ] Reference generated
- [ ] Success message shown

### Advanced Tests (Recommended)
- [ ] Multiple consecutive payments
- [ ] Gateway switching
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Offline behavior
- [ ] Network errors
- [ ] Invalid inputs

### Production Tests (Before Launch)
- [ ] Real small payment (₦10)
- [ ] Verify settlement in bank account
- [ ] Test with real OPay account
- [ ] Webhook integration (if applicable)
- [ ] Load testing
- [ ] Security audit
- [ ] User acceptance testing

---

## 📈 Performance Testing

### Metrics to Track

1. **Payment Completion Time**
   - Target: < 5 seconds
   - Measure: Click "Pay Now" to success message

2. **Success Rate**
   - Target: > 95%
   - Track: Successful payments / Total attempts

3. **User Drop-off**
   - Track: Where users abandon payment
   - Optimize: High drop-off points

4. **Gateway Preference**
   - Track: OPay vs Paystack usage
   - Analyze: User preference trends

### Load Testing

```javascript
// Simulate multiple rapid payments (for testing only!)
async function loadTest() {
  for (let i = 0; i < 10; i++) {
    // Simulate payment
    console.log("Payment", i + 1);
    await new Promise(r => setTimeout(r, 100));
  }
}

// Run load test
// loadTest();
```

---

## 🎓 Test Reports

### Sample Test Report

```
FNG Payment Integration Test Report
Date: October 20, 2025
Tester: [Your Name]

SUMMARY:
✅ OPay Integration: PASS (10/10 tests)
✅ Paystack Integration: PASS (10/10 tests)
✅ UI/UX: PASS (15/15 tests)
✅ Error Handling: PASS (8/8 tests)
✅ Performance: PASS (< 2s average)

ISSUES FOUND: 0
CRITICAL: 0
MAJOR: 0
MINOR: 0

RECOMMENDATIONS:
1. Add loading state improvement
2. Consider adding payment history filter
3. Implement payment analytics dashboard

STATUS: READY FOR PRODUCTION ✅
```

---

**Last Updated:** October 20, 2025  
**Status:** Complete Testing Guide  
**Next Step:** Run through Quick Test (5 min)
