# Loan Terms & Conditions - Complete Implementation Guide

## 📋 Overview

The FNG Financial Services app now includes a **comprehensive, legally binding Loan Terms & Conditions Agreement** that all borrowers must read and accept before submitting a loan application. This ensures full transparency and legal protection for both the lender (FNG) and the borrower.

---

## 🎯 Key Features

### Mandatory Acceptance System

✅ **Cannot Submit Without Accepting**: Loan applications cannot be submitted until terms are read and accepted
✅ **Explicit Consent**: Two-step verification (read confirmation + acceptance)
✅ **Legally Binding**: Terms include enforceable legal language
✅ **Timestamp Tracking**: Records exact date/time of acceptance
✅ **Clear Presentation**: Professional dialog with scrollable content
✅ **Visual Confirmation**: Green checkmark when accepted

---

## 📜 Terms & Conditions Content

### 1. ASSET CONTROL AND SECURITY

**Key Points:**
- FNG has total control of all borrower's assets as security
- Control remains until full loan repayment
- Assets include both moveable and immovable property

**Legal Language:**
```
By accepting this loan, I hereby acknowledge and agree that Fresh Noble Grand (FNG) 
Financial Services will have total control of all my assets as security for this 
loan until full repayment is completed.
```

---

### 2. COMPLIANCE AND REPAYMENT OBLIGATIONS

**Borrower Commitments:**
- ✓ Abide by all conditions without exception
- ✓ Repay entire loan per agreed schedule
- ✓ Repayment required **regardless** of asset condition
- ✓ Asset depreciation does not reduce obligation

**Key Statement:**
```
I will repay the entire loan regardless of the physical condition of any assets 
acquired or secured by this loan.
```

---

### 3. DEFAULT AND RECOVERY PROVISIONS

#### A. Asset Seizure and Sale Rights

**FNG is authorized to:**

**Moveable Assets:**
- Vehicles
- Equipment
- Inventory
- Personal property
- Any other moveable items

**Immovable Assets:**
- Land
- Buildings
- Property
- Real estate
- Any other immovable property

**Legal Provision:**
```
Fresh Noble Grand (FNG) is hereby authorized and entitled to recover the outstanding 
loan amount and all associated charges through seizure and sale of my moveable and 
immovable assets.
```

#### B. Savings Balance Offset

**FNG can use borrower's savings for:**
- Principal loan amount outstanding
- Accrued interest charges
- Late payment penalties
- Administrative and recovery costs

**Legal Provision:**
```
FNG is authorized to use my entire savings balance in my passbook/account to recover 
any outstanding loan amount.
```

#### C. Legal Action

**FNG reserves the right to take legal action against:**
- The Borrower
- Borrower's heirs
- Borrower's executors and administrators
- Any guarantor(s)

---

### 4. NO OBJECTION AND WAIVER OF RIGHTS

**Borrower Agrees:**
- ✓ No objection to recovery actions
- ✓ Any objections raised are invalid
- ✓ Objections won't be valid in court
- ✓ Waives right to contest FNG's recovery

**Critical Clause:**
```
I will have no objection to such action and if raised will not be valid in the 
court of law.
```

---

### 5. LATE PAYMENT INTEREST AND PENALTIES

#### Grace Period
```
7 calendar days after each installment due date
```

#### Penalty Rate
```
┌─────────────────────────────────────┐
│                                     │
│            10% PER WEEK             │
│                                     │
│   on unpaid installment amounts     │
│                                     │
└─────────────────────────────────────┘
```

#### Calculation Example

**Scenario**: ₦10,000 installment unpaid for 14 days

```
Day 0-7:   ₦10,000 (grace period - no penalty)
Day 8-14:  ₦10,000 + ₦1,000 (10% penalty) = ₦11,000
Day 15-21: ₦11,000 + ₦1,100 (10% on new amount) = ₦12,100
```

**Formula:**
```
Penalty = Unpaid Amount × 0.10 × (Weeks Past Grace Period)
```

**Legal Statement:**
```
At the end of the repayment period, unpaid installment due shall be subject to 10% 
interest rate per week after a grace period of seven (7) days.
```

---

## 🎨 User Interface

### Terms Dialog Design

**Header Section:**
```
┌────────────────────────────────────────────────────┐
│  📄 Loan Terms & Conditions           [X]         │
├────────────────────────────────────────────────────┤
│  Please read carefully before proceeding          │
└────────────────────────────────────────────────────┘
```

**Content Sections:**
1. **Loan Application Summary** (Blue box)
   - Loan Type
   - Loan Amount

2. **Legal Notice** (Amber alert)
   - Binding agreement warning

3. **Main Terms** (Organized sections with icons)
   - Asset Control
   - Repayment Obligations
   - Default Provisions
   - No Objection Clause
   - Late Payment Penalties
   - Governing Law
   - Acknowledgment

4. **Visual Elements:**
   - Color-coded sections
   - Icon indicators
   - Highlighted key phrases
   - Warning boxes for critical terms
   - Example calculations

**Footer Section:**
```
┌────────────────────────────────────────────────────┐
│  ☐ I confirm that I have read and understood      │
│     all the terms and conditions stated above     │
│                                                    │
│  ☐ I accept and agree to be legally bound by      │
│     these terms and conditions                    │
│                                                    │
│  [Cancel Application]  [Accept & Continue]        │
└────────────────────────────────────────────────────┘
```

---

### Application Form Integration

**Before Terms Acceptance:**
```
┌────────────────────────────────────────────────────┐
│  ⚠️ IMPORTANT:                                     │
│  Before submitting your loan application, you     │
│  must read and accept the complete Loan Terms &   │
│  Conditions Agreement.                            │
│                                                    │
│  [ ⚠️ Read & Accept Full Loan Agreement ]         │
│  (Required - Button is RED)                       │
└────────────────────────────────────────────────────┘

[Accept Loan Terms to Continue] (Button DISABLED)
```

**After Terms Acceptance:**
```
┌────────────────────────────────────────────────────┐
│  ⚠️ IMPORTANT:                                     │
│  Before submitting your loan application, you     │
│  must read and accept the complete Loan Terms &   │
│  Conditions Agreement.                            │
│                                                    │
│  [ ✓ Terms Accepted - View Agreement ]            │
│  (Button is GREEN)                                │
│                                                    │
│  ✓ You have accepted the loan terms on 10/19/2025│
└────────────────────────────────────────────────────┘

[Submit SME Loan Application] (Button ENABLED)
```

---

## 🔄 User Flow

### Complete Application Process

```
1. User opens loan application dialog
   ↓
2. Fills in loan details (amount, period, purpose)
   ↓
3. Fills in guarantor information
   ↓
4. Reviews upfront payment options
   ↓
5. Accepts quick terms (interest rate, repayment)
   ↓
6. Accepts guarantor terms
   ↓
7. 🔴 CLICKS "Read & Accept Full Loan Agreement"
   ↓
8. Terms dialog opens - user reads all terms
   ↓
9. Scrolls through entire agreement
   ↓
10. ✓ Checks "I have read and understood"
    ↓
11. ✓ Checks "I accept and agree" (enabled after step 10)
    ↓
12. Clicks "Accept & Continue"
    ↓
13. Dialog closes, button turns green
    ↓
14. Pays upfront costs (if required)
    ↓
15. Submits application
    ↓
16. ✅ APPLICATION SUBMITTED WITH TERMS ACCEPTED
```

---

## 💾 Data Storage

### Loan Application Record

```typescript
{
  id: 1234567890,
  loanType: "sme",
  loanTypeName: "SME Loan",
  principal: 100000,
  period: 12,
  purpose: "Business expansion",
  upfrontCosts: { /* ... */ },
  guarantor: { /* ... */ },
  termsAccepted: true,              // ⬅️ NEW
  termsAcceptedAt: "2025-10-19T15:30:00.000Z",  // ⬅️ NEW
  submittedAt: "2025-10-19T15:35:00.000Z",
  status: "pending"
}
```

**New Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `termsAccepted` | boolean | Whether borrower accepted terms |
| `termsAcceptedAt` | ISO 8601 timestamp | Exact time of acceptance |

---

## 🎯 Validation Rules

### Form Submission Requirements

**All Must Be True:**

```typescript
✓ Loan purpose filled
✓ All guarantor fields filled
✓ Accepted quick terms checkbox
✓ Accepted guarantor terms checkbox
✓ Accepted FULL loan terms (NEW) ⬅️ CRITICAL
✓ Upfront costs paid
```

**Submit Button States:**

| Condition | Button Text | Button State |
|-----------|-------------|--------------|
| Terms not accepted | "Accept Loan Terms to Continue" | Disabled (gray) |
| Terms accepted, no payment | "Pay Upfront Costs to Submit" | Disabled (gray) |
| All complete | "Submit [Loan Type] Application" | Enabled (blue) |

**Error Messages:**

```typescript
if (!termsAccepted) {
  toast.error("Please read and accept the loan terms and conditions");
  setTermsDialogOpen(true);  // Opens dialog automatically
  return;
}
```

---

## 🔒 Legal Protection

### For FNG (Lender)

✅ **Asset Recovery Rights**
- Clear authorization to seize assets
- Both moveable and immovable property
- No ambiguity in legal language

✅ **Savings Offset Rights**
- Explicit permission to use savings
- Covers all costs (principal, interest, penalties)
- Automatic recovery mechanism

✅ **Legal Action Rights**
- Can pursue borrower legally
- Can pursue heirs if necessary
- Waiver of objection clause

✅ **Penalty Provisions**
- 10% weekly penalty clearly stated
- 7-day grace period documented
- Compounding penalty structure

### For Borrower

✅ **Transparency**
- All terms clearly explained
- Examples provided for clarity
- Must explicitly acknowledge understanding

✅ **Fair Process**
- Opportunity to read everything
- Can cancel application anytime
- No pressure to accept immediately

✅ **Legal Awareness**
- Warned about serious consequences
- Encouraged to seek legal advice
- Confirmation of understanding required

---

## 📊 Compliance Features

### Legal Requirements Met

✅ **Explicit Consent**
- Two-step acceptance process
- Separate checkboxes for each confirmation
- Cannot proceed without both

✅ **Informed Agreement**
- Complete terms displayed
- Key points highlighted
- Examples and clarifications provided

✅ **Record Keeping**
- Acceptance timestamp stored
- Associated with loan application
- Audit trail maintained

✅ **Clarity and Accessibility**
- Plain language used
- Professional formatting
- Scrollable, readable layout
- Color-coded importance levels

---

## 🎨 Design Colors

### Color Coding System

| Color | Usage | Hex Code | Purpose |
|-------|-------|----------|---------|
| 🔵 Blue | General information | `#3b82f6` | Loan summary, headers |
| 🟠 Amber | Warnings | `#f59e0b` | Legal notices, caution |
| 🔴 Red | Critical terms | `#ef4444` | Default, penalties, risks |
| 🟢 Green | Success/Accepted | `#10b981` | Acceptance confirmation |
| ⚫ Gray | Secondary info | `#6b7280` | Supporting text |
| 🟣 Purple | Emphasis | `#8b5cf6` | Special provisions |

---

## 📱 Responsive Design

### Desktop View (1024px+)
```
┌────────────────────────────────────────────────────┐
│  Dialog: max-w-2xl (672px)                        │
│  Content: Full width with padding                 │
│  ScrollArea: 450px height                         │
│  Font: Standard size (14-16px)                    │
└────────────────────────────────────────────────────┘
```

### Tablet View (768px - 1023px)
```
┌──────────────────────────────────────┐
│  Dialog: 90% width                  │
│  Content: Adjusted padding          │
│  ScrollArea: 450px height           │
│  Font: Standard size                │
└──────────────────────────────────────┘
```

### Mobile View (320px - 767px)
```
┌────────────────────────┐
│  Dialog: 95% width    │
│  Content: Min padding │
│  ScrollArea: Auto     │
│  Font: Responsive     │
└────────────────────────┘
```

---

## 🔧 Technical Implementation

### Component Structure

```
/components/LoanTermsAndConditions.tsx
├── Props Interface
│   ├── isOpen: boolean
│   ├── onClose: () => void
│   ├── onAccept: () => void
│   ├── loanAmount: number
│   └── loanType: string
├── State Management
│   ├── hasRead: boolean
│   └── hasAccepted: boolean
└── Render Sections
    ├── Dialog Header
    ├── Loan Summary
    ├── Legal Notice
    ├── Terms Content (7 sections)
    └── Acceptance Checkboxes
```

### Integration Points

**1. LoanSection.tsx**
```typescript
import { LoanTermsAndConditions } from "./LoanTermsAndConditions";

// State
const [termsDialogOpen, setTermsDialogOpen] = useState(false);
const [termsAccepted, setTermsAccepted] = useState(false);

// Validation
if (!termsAccepted) {
  toast.error("Please read and accept the loan terms and conditions");
  setTermsDialogOpen(true);
  return;
}

// Component Usage
<LoanTermsAndConditions
  isOpen={termsDialogOpen}
  onClose={() => setTermsDialogOpen(false)}
  onAccept={() => {
    setTermsAccepted(true);
    setTermsDialogOpen(false);
    toast.success("Thank you for accepting the loan terms and conditions");
  }}
  loanAmount={loanAmount[0]}
  loanType={currentLoanConfig.name}
/>
```

---

## 🎯 Testing Checklist

### User Interface Testing

- [ ] Dialog opens when "Read & Accept" button clicked
- [ ] Dialog is scrollable and all content visible
- [ ] Both checkboxes work correctly
- [ ] Second checkbox only enables after first is checked
- [ ] "Accept & Continue" button only enables when both checked
- [ ] Green checkmark shows after acceptance
- [ ] Button text changes after acceptance
- [ ] Can re-open dialog to review terms

### Functional Testing

- [ ] Cannot submit application without accepting terms
- [ ] Error message shows if attempting to submit without acceptance
- [ ] Dialog auto-opens when error occurs
- [ ] Acceptance persists during same session
- [ ] Acceptance resets when form is reset/cleared
- [ ] Timestamp is recorded correctly
- [ ] Terms data saved in loan application

### Integration Testing

- [ ] Works with upfront payment flow
- [ ] Works with guarantor validation
- [ ] Works with other form validations
- [ ] Button states update correctly
- [ ] Toast notifications display properly
- [ ] Form submission succeeds after full validation

### Responsive Testing

- [ ] Desktop (1920px): Full layout
- [ ] Laptop (1366px): Proper scaling
- [ ] Tablet (768px): Adjusted layout
- [ ] Mobile (375px): Compact view
- [ ] Mobile (320px): Minimum width

---

## 📈 Usage Metrics to Track

### Acceptance Metrics
- Number of users who open terms dialog
- Number of users who accept terms
- Average time spent reading terms
- Number of users who cancel after reading

### Compliance Metrics
- Percentage of applications with terms accepted
- Applications rejected due to missing terms
- Terms re-opened count per user

---

## 🚨 Important Legal Considerations

### For Implementation

⚠️ **Jurisdiction**: Terms reference Nigerian law
⚠️ **Legal Review**: Should be reviewed by legal counsel
⚠️ **Updates**: Any changes require user re-acceptance
⚠️ **Record Retention**: Store acceptance records for regulatory period
⚠️ **Data Protection**: Comply with Nigerian data protection regulations

### Recommended Additions

For production use, consider:
1. **Legal counsel review** of all terms
2. **Regulatory compliance** verification
3. **Translation** to local languages
4. **Version control** for terms updates
5. **Signature collection** (digital or physical)

---

## 💡 Best Practices

### For Users

1. **Read Everything**: Take time to understand all terms
2. **Ask Questions**: Contact support if unclear
3. **Save Copy**: Screenshot or print terms for records
4. **Understand Consequences**: Know what you're agreeing to
5. **Seek Advice**: Consult financial/legal advisor if needed

### For Administrators

1. **Monitor Acceptance Rate**: Track how many users accept
2. **Provide Support**: Have staff available for questions
3. **Keep Records**: Maintain acceptance logs
4. **Update Regularly**: Review and update terms as needed
5. **Legal Compliance**: Ensure all terms are enforceable

---

## ✅ Summary

The Loan Terms & Conditions system provides:

✅ **Legal Protection**: Comprehensive terms protecting lender rights
✅ **Transparency**: Clear communication of all obligations
✅ **Mandatory Acceptance**: Cannot proceed without explicit consent
✅ **Professional Presentation**: Well-designed, readable format
✅ **Audit Trail**: Timestamp and record of acceptance
✅ **User-Friendly**: Easy to read and understand
✅ **Mobile Compatible**: Works on all devices
✅ **Validation Integration**: Seamlessly integrated into application flow

---

## 🎉 Result

Users now must:
1. ✅ Read complete loan agreement
2. ✅ Explicitly confirm understanding
3. ✅ Accept all terms and conditions
4. ✅ Acknowledge legal consequences

Before they can submit ANY loan application!

This ensures **full transparency**, **informed consent**, and **legal protection** for all parties involved. 🏦⚖️📋
