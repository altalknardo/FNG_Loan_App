# Insurance Balance Tracker - Implementation Guide

## Overview

The Insurance Balance Tracker is a comprehensive feature that monitors and displays all loan insurance charges collected from customers' upfront payments. This provides transparent revenue tracking for non-refundable insurance fees based on loan type and amount.

## ✅ Feature Implementation

### 1. Storage & Initialization

**File**: `/App.tsx` (Lines 77-79)

```typescript
// Initialize insurance balance if it doesn't exist
if (!localStorage.getItem("insuranceBalance")) {
  localStorage.setItem("insuranceBalance", "0");
}
```

**localStorage Key**: `insuranceBalance`
- **Initial Value**: `0`
- **Type**: String representation of number
- **Updates**: Automatic when upfront costs are paid

---

### 2. Insurance Collection Logic

**File**: `/components/LoanSection.tsx` 

Insurance charges are automatically collected when customers pay upfront costs for loan applications.

#### Scenario 1: Payment via Bank Transfer

```typescript
// Lines 392-399
// Add deposit to loan deposits (refundable)
const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
const newLoanDeposits = currentLoanDeposits + upfrontCosts.deposit;
localStorage.setItem("loanDeposits", newLoanDeposits.toString());

// Add insurance to company insurance balance
const currentInsuranceBalance = parseFloat(localStorage.getItem("insuranceBalance") || "0");
const newInsuranceBalance = currentInsuranceBalance + upfrontCosts.insurance;
localStorage.setItem("insuranceBalance", newInsuranceBalance.toString());
```

#### Scenario 2: Payment from Contribution Balance

```typescript
// Lines 403-412
// Add deposit to loan deposits (refundable)
const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
const newLoanDeposits = currentLoanDeposits + upfrontCosts.deposit;
localStorage.setItem("loanDeposits", newLoanDeposits.toString());

// Add insurance to company insurance balance
const currentInsuranceBalance = parseFloat(localStorage.getItem("insuranceBalance") || "0");
const newInsuranceBalance = currentInsuranceBalance + upfrontCosts.insurance;
localStorage.setItem("insuranceBalance", newInsuranceBalance.toString());
```

---

### 3. Insurance Rate Calculation

**File**: `/lib/utils.ts` (Lines 84-107)

```typescript
export function calculateUpfrontCosts(principal: number, loanType: 'sme' | 'business' | 'jumbo') {
  const depositRate = 0.10; // 10% loan deposit (refundable)
  const serviceCharge = 3500; // ₦3,500 service charge
  
  // Insurance rates by loan type
  const insuranceRates = {
    sme: 0.015,     // 1.5%
    business: 0.02,  // 2%
    jumbo: 0.03      // 3%
  };
  
  const deposit = principal * depositRate;
  const insurance = principal * insuranceRates[loanType];
  const totalUpfront = deposit + insurance + serviceCharge;
  
  return {
    deposit,
    insurance,
    insuranceRate: insuranceRates[loanType] * 100, // For display as percentage
    serviceCharge,
    totalUpfront,
    loanType
  };
}
```

#### Insurance Rates by Loan Type:

| Loan Type | Minimum Amount | Maximum Amount | Insurance Rate |
|-----------|----------------|----------------|----------------|
| **SME Loan** | ₦50,000 | ₦1,499,999 | **1.5%** |
| **Business Loan** | ₦1,500,000 | ₦5,000,000 | **2%** |
| **Jumbo Loan** | ₦5,000,000 | ₦50,000,000 | **3%** |

---

### 4. Display in Company Settings

**File**: `/components/admin/CompanySettings.tsx` (Lines 72-93, 380-441)

#### State Management

```typescript
// Insurance Balance
const [insuranceBalance, setInsuranceBalance] = useState(() => {
  const saved = localStorage.getItem("insuranceBalance");
  return saved ? parseFloat(saved) : 0;
});

// Reload company balance and insurance balance periodically
useEffect(() => {
  const interval = setInterval(() => {
    const savedCompanyBalance = localStorage.getItem("companyBalance");
    setCompanyBalance(savedCompanyBalance ? parseFloat(savedCompanyBalance) : 0);
    
    const savedInsuranceBalance = localStorage.getItem("insuranceBalance");
    setInsuranceBalance(savedInsuranceBalance ? parseFloat(savedInsuranceBalance) : 0);
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

#### Visual Display Card

The Insurance Balance Tracker appears as a **purple gradient card** in Company Settings, featuring:

✅ **Header Section**
- Purple shield icon in rounded background
- "Insurance Balance" title
- Description: "Total loan insurance charges collected from upfront payments"
- Active status badge

✅ **Left Panel - Total Collected**
- Large display of total insurance balance
- Purple color scheme (text-4xl, text-purple-700)
- Formatted with Naira currency symbol
- "From loan insurance charges" subtitle

✅ **Right Panel - Insurance Rates**
- Table showing all three loan types
- Clear percentage breakdown:
  - SME Loan: 1.5% of loan amount
  - Business Loan: 2% of loan amount
  - Jumbo Loan: 3% of loan amount

✅ **Information Alert**
- Purple-themed informational box
- Explains how insurance collection works
- Key points:
  - Calculated based on loan type and amount
  - Collected as part of upfront payment
  - Non-refundable (unlike deposits)
  - Provides loan protection and risk coverage
  - Automatically tracked

---

## Visual Hierarchy in Settings

```
Company Settings Page
├── Company Balance Tracker (🟢 Green - Service charges)
├── Insurance Balance Tracker (🟣 Purple - Loan insurance)  ⬅️ NEW!
├── Customer Management Quick Access (🔵 Blue)
├── Loan Policy Settings (🟠 Orange)
├── Company Bank Account (🔵 Blue)
└── Administrator Management (🟠 Orange)
```

---

## Example Calculations

### Example 1: SME Loan
- **Loan Amount**: ₦500,000
- **Insurance Rate**: 1.5%
- **Insurance Charge**: ₦7,500

### Example 2: Business Loan
- **Loan Amount**: ₦3,000,000
- **Insurance Rate**: 2%
- **Insurance Charge**: ₦60,000

### Example 3: Jumbo Loan
- **Loan Amount**: ₦10,000,000
- **Insurance Rate**: 3%
- **Insurance Charge**: ₦300,000

---

## Transaction Flow

### Customer Applies for Loan with Upfront Payment

```
1. Customer selects loan type (SME/Business/Jumbo)
2. Customer enters loan amount
3. System calculates upfront costs:
   ├── Deposit (10% - refundable)
   ├── Insurance (1.5%/2%/3% - non-refundable)  ⬅️ TRACKED
   └── Service Charge (₦3,500 - flat fee)
4. Customer pays upfront costs
5. System updates:
   ├── loanDeposits ↑ (deposit amount)
   └── insuranceBalance ↑ (insurance amount)  ⬅️ NEW!
6. Loan application submitted for admin approval
```

---

## Real-Time Updates

The insurance balance display updates **every 1 second** via `setInterval`:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const savedInsuranceBalance = localStorage.getItem("insuranceBalance");
    setInsuranceBalance(savedInsuranceBalance ? parseFloat(savedInsuranceBalance) : 0);
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

This ensures admins see the latest balance without needing to refresh the page.

---

## Key Differences: Insurance vs Service Charges

| Feature | Insurance Balance | Service Charge Balance |
|---------|-------------------|------------------------|
| **Source** | Loan upfront payments | Monthly contribution deductions |
| **Rate** | 1.5%/2%/3% (loan-dependent) | One unit (daily contribution amount) |
| **Frequency** | One-time per loan | Monthly (recurring) |
| **Refundable** | ❌ No | ❌ No |
| **Triggers** | Loan application submission | Monthly contribution activity |
| **Color Theme** | 🟣 Purple | 🟢 Green |

---

## Admin Features

### Where to View

1. **Log in as admin**
2. **Navigate to Settings** (sidebar or mobile menu)
3. **Scroll to Insurance Balance Tracker** (second card from top)
4. **View real-time balance**

### Information Available

- ✅ Total insurance collected to date
- ✅ Insurance rates for all loan types
- ✅ Policy explanation
- ✅ Real-time updates
- ✅ No manual tracking required

---

## Technical Integration Points

### 1. App Initialization
- `/App.tsx` - Initialize `insuranceBalance` in localStorage

### 2. Collection Logic
- `/components/LoanSection.tsx` - Add insurance to balance when upfront paid

### 3. Calculation Utility
- `/lib/utils.ts` - `calculateUpfrontCosts()` function determines insurance amount

### 4. Display Interface
- `/components/admin/CompanySettings.tsx` - Visual card with real-time balance

---

## Testing Checklist

### Basic Functionality
- ✅ Insurance balance initializes at ₦0
- ✅ Balance updates when loan upfront costs paid
- ✅ Correct insurance rate applied by loan type
- ✅ Real-time display in Company Settings
- ✅ No errors in browser console

### Payment Scenarios
- ✅ Bank transfer payment updates insurance balance
- ✅ Contribution balance payment updates insurance balance
- ✅ Multiple loans accumulate insurance correctly
- ✅ Balance persists after page refresh

### Display Verification
- ✅ Purple gradient card displays correctly
- ✅ Balance formatted with Naira symbol
- ✅ Insurance rates table accurate
- ✅ Information alert clear and helpful
- ✅ Responsive on mobile and desktop

---

## Future Enhancements

Potential improvements for the insurance balance tracker:

1. **Breakdown by Loan Type**
   - Show separate totals for SME, Business, and Jumbo insurance

2. **Monthly Revenue Chart**
   - Graph insurance collection over time

3. **Export Functionality**
   - Download insurance transaction history as CSV/PDF

4. **Filtering Options**
   - Filter by date range, loan type, or amount

5. **Comparison Metrics**
   - Compare insurance revenue vs service charge revenue
   - Month-over-month growth percentages

---

## Support & Maintenance

### Storage Management
- Insurance balance stored in `localStorage`
- Key: `insuranceBalance`
- Automatic initialization on app mount
- Updates triggered by loan upfront payments

### Error Handling
- Defaults to `0` if localStorage key missing
- `parseFloat` handles string-to-number conversion
- `formatCurrency` utility ensures proper display

### Performance
- Real-time updates every 1 second
- Minimal performance impact
- Efficient localStorage reads
- No API calls required

---

## Summary

✅ **Insurance Balance Tracker is fully implemented and functional**

The feature automatically:
- Tracks all loan insurance charges
- Updates in real-time
- Displays prominently in Company Settings
- Provides transparent revenue monitoring
- Requires no manual intervention

Admins can now easily monitor insurance revenue alongside service charge revenue, providing complete visibility into company income streams from both daily contributions and loan products.
