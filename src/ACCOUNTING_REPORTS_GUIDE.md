# 📊 Accounting Reports with Tax Calculations

## Overview

The FNG app now includes comprehensive **Monthly** and **Annual Accounting Reports** with automatic tax calculations including:

- **7.5% VAT** on monthly service charges
- **Progressive Income Tax** on annual revenue (20% above ₦25M, 30% above ₦100M)
- Complete revenue and expense breakdowns
- Net profit calculations
- Export to Word, Excel, and Print

---

## Tax Structure

### 1. Value Added Tax (VAT)

**Rate**: 7.5%  
**Applied to**: Monthly Service Charges  
**Frequency**: Monthly  

```
VAT Calculation:
Monthly Service Charges × 7.5% = VAT Amount

Example:
Service Charges: ₦500,000
VAT: ₦500,000 × 0.075 = ₦37,500
```

### 2. Company Income Tax

**Applied to**: Annual Revenue (at financial year-end)  
**Progressive Tax Rates**:

| Annual Revenue | Tax Rate | Tax Amount |
|---------------|----------|------------|
| ≤ ₦25,000,000 | **0%** | ₦0 |
| > ₦25,000,000 | **20%** | Revenue × 20% |
| > ₦100,000,000 | **30%** | Revenue × 30% |

```
Income Tax Calculation Examples:

Example 1: Revenue = ₦20,000,000
Tax Rate: 0% (below threshold)
Tax: ₦0

Example 2: Revenue = ₦50,000,000
Tax Rate: 20%
Tax: ₦50,000,000 × 0.20 = ₦10,000,000

Example 3: Revenue = ₦150,000,000
Tax Rate: 30%
Tax: ₦150,000,000 × 0.30 = ₦45,000,000
```

---

## Report Types

### Monthly Accounting Report

**Purpose**: Track monthly financial performance  
**Includes**:
- Revenue breakdown
- Expense breakdown
- Monthly VAT calculation (7.5%)
- Net profit after VAT

**What it shows**:

```
REVENUE BREAKDOWN
├─ Customer Contributions
├─ Loan Interest (20% APR)
├─ Loan Service Charges
├─ Insurance Fees
└─ Monthly Service Charges
    └─ VAT: 7.5% automatically calculated

EXPENSES BREAKDOWN
├─ Loan Disbursements
├─ Customer Withdrawals
├─ Deposit Refunds
└─ Operating Expenses

TAX CALCULATIONS
└─ VAT on Service Charges: ₦XX,XXX (7.5%)

NET PROFIT
Revenue - Expenses - VAT = Net Profit
```

### Annual Accounting Report

**Purpose**: End-of-year financial statements with tax compliance  
**Includes**:
- Full year revenue breakdown
- Full year expense breakdown
- Annual VAT total (sum of monthly VATs)
- **Company Income Tax** (progressive rates)
- Net profit after all taxes

**What it shows**:

```
REVENUE BREAKDOWN (Full Year)
├─ Customer Contributions
├─ Loan Interest (20% APR)
├─ Loan Service Charges
├─ Insurance Fees
└─ Monthly Service Charges
    └─ Annual VAT: Sum of all monthly VATs

EXPENSES BREAKDOWN (Full Year)
├─ Loan Disbursements
├─ Customer Withdrawals
├─ Deposit Refunds
└─ Operating Expenses

TAX CALCULATIONS
├─ Total VAT (7.5%): ₦XX,XXX
├─ Income Tax Rate: XX% (based on revenue)
└─ Income Tax Amount: ₦XX,XXX

NET PROFIT (After All Taxes)
Revenue - Expenses - VAT - Income Tax = Net Profit
```

---

## How to Generate Reports

### Step 1: Access Accounting Reports

**Admin Panel** → **Accounting Reports**

### Step 2: Select Report Type

Choose between:
- **Monthly Report** - For specific month
- **Annual Report** - For entire year

### Step 3: Select Period

**For Monthly Reports**:
- Use month picker to select month/year
- Example: "October 2024"

**For Annual Reports**:
- Select year from dropdown
- Example: "2024"

### Step 4: Review Preview

The system automatically generates:
- Summary cards (Revenue, Expenses, Net Profit)
- Tax calculations
- Detailed breakdowns

### Step 5: Export Report

Choose export format:
- **Download Word** - Professional .doc report
- **Export Excel** - Spreadsheet with formulas
- **Print Report** - Formatted printable version

---

## Revenue Streams Tracked

### 1. Customer Contributions
Monthly savings from customers

### 2. Loan Interest (20% APR)
Interest earned on active loans

### 3. Loan Service Charges
One-time processing fees on loans

### 4. Insurance Fees
One-time insurance fees (8% of loan)

### 5. Monthly Service Charges
₦500/month per active customer (subject to 7.5% VAT)

---

## Expense Categories Tracked

### 1. Loan Disbursements
Money lent to customers

### 2. Customer Withdrawals
Approved withdrawal requests

### 3. Deposit Refunds
Refundable deposits returned

### 4. Operating Expenses
Other business expenses (can be added manually)

---

## Tax Compliance Features

### Automatic VAT Calculation

```typescript
// System automatically calculates:
const monthlyServiceCharges = ₦500,000;
const vatRate = 0.075; // 7.5%
const vatAmount = monthlyServiceCharges × vatRate;
// VAT = ₦37,500
```

### Automatic Income Tax Calculation

```typescript
// System automatically determines rate:
function calculateIncomeTax(revenue: number) {
  if (revenue > 100_000_000) {
    return revenue × 0.30; // 30%
  } else if (revenue > 25_000_000) {
    return revenue × 0.20; // 20%
  } else {
    return 0; // No tax
  }
}
```

### Tax Summary Display

Every report includes:
- Gross Profit
- VAT breakdown with calculation
- Income Tax (annual only) with rate explanation
- Total Tax Liability
- Net Profit after all taxes

---

## Report Examples

### Example 1: Monthly Report (October 2024)

```
OCTOBER 2024 ACCOUNTING REPORT
════════════════════════════════

REVENUE BREAKDOWN
Customer Contributions:        ₦2,500,000
Loan Interest:                 ₦1,800,000
Loan Service Charges:          ₦   500,000
Insurance Fees:                ₦   400,000
Monthly Service Charges:       ₦   300,000
                               ───────────
TOTAL REVENUE:                 ₦5,500,000

EXPENSE BREAKDOWN
Loan Disbursements:            ₦3,000,000
Customer Withdrawals:          ₦   500,000
Deposit Refunds:               ₦   200,000
Operating Expenses:            ₦   100,000
                               ───────────
TOTAL EXPENSES:                ₦3,800,000

TAX CALCULATIONS
Gross Profit:                  ₦1,700,000
VAT (7.5% on ₦300,000):       ₦    22,500
                               ───────────
TOTAL TAX LIABILITY:           ₦    22,500

NET PROFIT (After Tax):        ₦1,677,500
Profit Margin: 30.5%
```

### Example 2: Annual Report (2024)

```
FINANCIAL YEAR 2024 ACCOUNTING REPORT
══════════════════════════════════════

REVENUE BREAKDOWN
Customer Contributions:        ₦30,000,000
Loan Interest:                 ₦25,000,000
Loan Service Charges:          ₦ 8,000,000
Insurance Fees:                ₦ 5,000,000
Monthly Service Charges:       ₦ 3,600,000
                               ────────────
TOTAL REVENUE:                 ₦71,600,000

EXPENSE BREAKDOWN
Loan Disbursements:            ₦40,000,000
Customer Withdrawals:          ₦ 8,000,000
Deposit Refunds:               ₦ 2,500,000
Operating Expenses:            ₦ 1,500,000
                               ────────────
TOTAL EXPENSES:                ₦52,000,000

TAX CALCULATIONS
Gross Profit:                  ₦19,600,000
VAT (7.5% on ₦3.6M):          ₦   270,000
Income Tax (20% on ₦71.6M):   ₦14,320,000
(Revenue > ₦25M, Tax Rate: 20%)
                               ────────────
TOTAL TAX LIABILITY:           ₦14,590,000

NET PROFIT (After All Taxes):  ₦ 5,010,000
Profit Margin: 7.0%

TAX RATE BREAKDOWN
• Revenue: ₦71,600,000
• Threshold: > ₦25,000,000
• Rate Applied: 20%
• Tax Amount: ₦14,320,000
```

### Example 3: High Revenue Annual Report (2024)

```
FINANCIAL YEAR 2024 ACCOUNTING REPORT
══════════════════════════════════════

REVENUE BREAKDOWN
Customer Contributions:        ₦ 50,000,000
Loan Interest:                 ₦ 45,000,000
Loan Service Charges:          ₦ 15,000,000
Insurance Fees:                ₦ 10,000,000
Monthly Service Charges:       ₦  5,000,000
                               ─────────────
TOTAL REVENUE:                 ₦125,000,000

EXPENSE BREAKDOWN
Loan Disbursements:            ₦ 70,000,000
Customer Withdrawals:          ₦ 12,000,000
Deposit Refunds:               ₦  3,000,000
Operating Expenses:            ₦  2,000,000
                               ─────────────
TOTAL EXPENSES:                ₦ 87,000,000

TAX CALCULATIONS
Gross Profit:                  ₦ 38,000,000
VAT (7.5% on ₦5M):            ₦    375,000
Income Tax (30% on ₦125M):    ₦ 37,500,000
(Revenue > ₦100M, Tax Rate: 30%)
                               ─────────────
TOTAL TAX LIABILITY:           ₦ 37,875,000

NET PROFIT (After All Taxes):  ₦    125,000
Profit Margin: 0.1%

⚠️ HIGH TAX BURDEN WARNING
Revenue exceeded ₦100M threshold
Tax rate increased to 30%
Total tax liability: ₦37,875,000
```

---

## Export Formats

### Word Document (.doc)

**Features**:
- Professional formatting
- Company letterhead
- Tables with colored headers
- Tax calculation explanations
- Footer with report ID

**Use for**: Official records, audits, presentations

### Excel Spreadsheet (.csv)

**Features**:
- Structured data in columns
- Compatible with Excel, Google Sheets
- Easy to analyze and manipulate
- Formulas can be added

**Use for**: Data analysis, accounting software import

### Print Format

**Features**:
- Optimized for A4 paper
- Professional layout
- Print-friendly colors
- Page breaks for sections

**Use for**: Physical filing, board meetings

---

## Where Tax Data Comes From

### VAT Calculation Source

```typescript
// Monthly service charges are tracked in:
localStorage.getItem("contributionServiceChargeBalance")

// VAT is calculated as:
monthlyServiceCharges × 0.075
```

### Income Tax Calculation Source

```typescript
// Total revenue is sum of:
- contributions (customer savings)
- loanInterest (20% APR tracked)
- loanServiceCharges (one-time fees)
- insurance (upfront fees)
- monthlyServiceCharges (₦500/month)

// Tax rate determined by total:
if (totalRevenue > 100_000_000) rate = 30%
else if (totalRevenue > 25_000_000) rate = 20%
else rate = 0%
```

---

## Key Features

### ✅ Automatic Calculations

- All tax calculations are automatic
- No manual entry needed
- Formulas built-in

### ✅ Tax Compliance Ready

- Follows Nigerian tax regulations
- Progressive tax rates
- VAT on service charges
- Clear audit trail

### ✅ Professional Reports

- Beautiful formatting
- Company branding
- Detailed breakdowns
- Export-ready

### ✅ Real-Time Data

- Pulls from live system data
- Always up-to-date
- No data lag

### ✅ Multiple Formats

- Word for official use
- Excel for analysis
- Print for filing

---

## Tax Planning Tips

### Optimize Tax Liability

**For Revenue Near ₦25M**:
```
Current: ₦24.5M → Tax: ₦0
If you add ₦1M revenue → ₦25.5M → Tax: ₦5.1M (20%)

Consider:
- Timing large transactions
- Deferring revenue to next year
- Maximizing deductible expenses
```

**For Revenue Near ₦100M**:
```
Current: ₦99M → Tax: ₦19.8M (20%)
If you add ₦2M revenue → ₦101M → Tax: ₦30.3M (30%)

Big jump! Consider:
- Strategic timing
- Revenue deferral
- Investment in deductibles
```

### VAT Planning

```
Monthly Service Charges: ₦500,000
VAT (7.5%): ₦37,500/month = ₦450,000/year

This is fixed and unavoidable
Budget accordingly!
```

---

## Accessing Reports

### Admin Navigation

```
Login as Admin
    ↓
Admin Dashboard
    ↓
Accounting Reports (sidebar)
    ↓
Select Report Type & Period
    ↓
View Preview
    ↓
Export (Word/Excel/Print)
```

### Quick Access

The Accounting Reports section is prominently placed in the admin sidebar for easy access.

---

## Report Contents Summary

### Every Report Includes:

1. **Header**
   - Company name (FNG Financial Services)
   - Report type
   - Period covered
   - Generation date/time

2. **Summary Cards**
   - Total Revenue
   - Total Expenses
   - Net Profit

3. **Revenue Breakdown**
   - All revenue streams
   - Amounts and percentages

4. **Expense Breakdown**
   - All expense categories
   - Amounts and percentages

5. **Tax Calculations**
   - VAT breakdown
   - Income tax (annual)
   - Tax rates and formulas
   - Total tax liability

6. **Net Profit**
   - After all taxes
   - Profit margin percentage

7. **Footer**
   - Report ID
   - Disclaimer
   - Contact info

---

## Troubleshooting

### "No data found for period"

**Solution**: Ensure transactions exist for selected period

### "Tax calculation seems wrong"

**Check**:
1. Total revenue amount
2. Which tax bracket applies
3. VAT calculation (7.5% of service charges only)

### "Export not working"

**Try**:
1. Allow popups for print
2. Check download permissions
3. Try different format

---

## Best Practices

### Monthly Reports

- Generate at end of each month
- Review VAT liability
- Track profit trends
- Export for bookkeeper

### Annual Reports

- Generate after financial year-end
- Review income tax liability
- Prepare for tax filing
- Share with accountant

### Data Accuracy

- Ensure all transactions are recorded
- Verify revenue and expense amounts
- Double-check dates
- Keep reports for audit trail

---

## Future Enhancements

Potential additions:
- Quarterly reports
- Comparative analysis (year-over-year)
- Tax projection calculator
- Expense categorization
- Budget vs. actual reporting

---

## Summary

The Accounting Reports feature provides:

✅ **Monthly Reports** with VAT calculations  
✅ **Annual Reports** with income tax  
✅ **Progressive tax rates** (0%, 20%, 30%)  
✅ **7.5% VAT** on service charges  
✅ **Professional exports** (Word, Excel, Print)  
✅ **Automatic calculations** - no manual work  
✅ **Tax compliance ready** - Nigerian regulations  
✅ **Real-time data** - always current  

**Perfect for**: Tax filing, audits, financial planning, investor reports, board meetings

---

## Support

For questions about:
- **Tax calculations**: Consult licensed tax professional
- **Report generation**: Check this guide
- **Technical issues**: Contact system administrator

---

**The FNG Accounting Reports: Making tax compliance simple! 📊💰**
