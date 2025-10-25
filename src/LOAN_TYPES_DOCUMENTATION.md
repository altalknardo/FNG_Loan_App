# Loan Types System - v3.6

## 🎯 Overview
Comprehensive loan categorization system with three distinct loan types: SME Loan, Business Loan, and Jumbo Loan, each with specific amount ranges, features, and repayment terms.

---

## 💰 Loan Categories

### 1. SME Loan (Small & Medium Enterprise)

**Amount Range:** ₦50,000 - ₦1,499,999

**Target Audience:**
- Small businesses
- Medium enterprises
- Startups
- Individual entrepreneurs

**Features:**
- ✅ Quick approval within 24 hours
- ✅ Flexible repayment terms
- ✅ Minimal documentation
- ✅ Ideal for business expansion

**Default Repayment Period:** 24 weeks (6 months)

**Available Periods:**
- 12 weeks (3 months)
- 24 weeks (6 months)
- 52 weeks (1 year)
- 104 weeks (2 years)

**Icon:** Briefcase 💼  
**Color Scheme:** Blue gradient (from-blue-600 to-cyan-600)

**Typical Use Cases:**
- Inventory purchase
- Equipment upgrade
- Working capital
- Business expansion
- Marketing campaigns

---

### 2. Business Loan

**Amount Range:** ₦1,500,000 - ₦5,000,000

**Target Audience:**
- Established businesses
- Growing companies
- Corporate entities
- Franchises

**Features:**
- ✅ Competitive interest rates
- ✅ Extended repayment periods
- ✅ Dedicated account manager
- ✅ Business growth support

**Default Repayment Period:** 52 weeks (1 year)

**Available Periods:**
- 12 weeks (3 months)
- 24 weeks (6 months)
- 52 weeks (1 year)
- 104 weeks (2 years)
- 156 weeks (3 years)
- 208 weeks (4 years)

**Icon:** Trending Up 📈  
**Color Scheme:** Purple-Pink gradient (from-purple-600 to-pink-600)

**Typical Use Cases:**
- Factory equipment
- Office expansion
- Fleet purchase
- Major renovations
- New product line launch

---

### 3. Jumbo Loan

**Amount Range:** ₦5,000,000 and above (up to ₦50,000,000)

**Target Audience:**
- Large corporations
- Real estate developers
- Manufacturing companies
- Major enterprises

**Features:**
- ✅ Customized loan packages
- ✅ Priority processing
- ✅ Corporate advisory services
- ✅ Flexible collateral options

**Default Repayment Period:** 104 weeks (2 years)

**Available Periods:**
- 12 weeks (3 months)
- 24 weeks (6 months)
- 52 weeks (1 year)
- 104 weeks (2 years)
- 156 weeks (3 years)
- 208 weeks (4 years)

**Icon:** Rocket 🚀  
**Color Scheme:** Orange-Red gradient (from-orange-600 to-red-600)

**Additional Requirement:**
- May require additional collateral
- Enhanced documentation
- Corporate guarantees

**Typical Use Cases:**
- Real estate development
- Large-scale manufacturing
- Corporate acquisitions
- Major infrastructure projects
- Multi-location expansion

---

## 🎨 UI/UX Design

### Tab Navigation
```
┌─────────────────────────────────────────┐
│  SME Loan  │  Business Loan │ Jumbo Loan │
└─────────────────────────────────────────┘
```

Each tab shows:
- Loan type icon
- Loan type name
- Active state with gradient background

### Loan Card Layout

```
┌──────────────────────────────────────┐
│ 💼 SME Loan                          │
│ Perfect for small and medium         │
│ enterprises looking to grow          │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ Loan Range:                    │  │
│ │ ₦50,000 - ₦1,499,999          │  │
│ └────────────────────────────────┘  │
│                                      │
│ ✓ Quick approval within 24 hours    │
│ ✓ Flexible repayment terms          │
│ ✓ Minimal documentation             │
│ ✓ Ideal for business expansion      │
│                                      │
│ [Apply for SME Loan]                │
└──────────────────────────────────────┘
```

### Color Coding

**SME Loan:**
```css
Background: linear-gradient(to bottom right, #2563eb, #0891b2)
Button: bg-white text-blue-700
Badge: bg-blue-100 text-blue-700
```

**Business Loan:**
```css
Background: linear-gradient(to bottom right, #9333ea, #db2777)
Button: bg-white text-purple-700
Badge: bg-purple-100 text-purple-700
```

**Jumbo Loan:**
```css
Background: linear-gradient(to bottom right, #ea580c, #dc2626)
Button: bg-white text-orange-700
Badge: bg-orange-100 text-orange-700
```

---

## 📋 Application Flow

### Step-by-Step Process:

```
1. Select Loan Type (SME/Business/Jumbo)
   ↓
2. Review loan range and features
   ↓
3. Click "Apply for [Loan Type]"
   ↓
4. Loan Details Section:
   - Select amount (within range)
   - Choose repayment period
   - Enter loan purpose
   - View calculation summary
   ↓
5. Guarantor Information:
   - Full name
   - Phone number
   - Address
   - Relationship
   - Employer (optional)
   ↓
6. Accept Terms & Conditions:
   - Loan terms checkbox
   - Guarantor conditions checkbox
   ↓
7. Submit Application
   ↓
8. Await admin approval (24 hours)
```

---

## 💵 Loan Calculation Example

### SME Loan Example:
```
Amount: ₦500,000
Period: 24 weeks
Interest Rate: 20%

Calculation:
- Principal: ₦500,000
- Interest (20%): ₦100,000
- Total Repayment: ₦600,000
- Weekly Payment: ₦25,000
```

### Business Loan Example:
```
Amount: ₦3,000,000
Period: 52 weeks
Interest Rate: 20%

Calculation:
- Principal: ₦3,000,000
- Interest (20%): ₦600,000
- Total Repayment: ₦3,600,000
- Weekly Payment: ₦69,231
```

### Jumbo Loan Example:
```
Amount: ₦10,000,000
Period: 104 weeks
Interest Rate: 20%

Calculation:
- Principal: ₦10,000,000
- Interest (20%): ₦2,000,000
- Total Repayment: ₦12,000,000
- Weekly Payment: ₦115,385
```

---

## 🔧 Technical Implementation

### Loan Type Configuration:

```typescript
interface LoanTypeConfig {
  name: string;
  minAmount: number;
  maxAmount: number;
  description: string;
  features: string[];
  icon: any;
  gradient: string;
  defaultPeriod: string;
}

const loanTypes: Record<LoanType, LoanTypeConfig> = {
  sme: {
    name: "SME Loan",
    minAmount: 50000,
    maxAmount: 1499999,
    description: "Perfect for small and medium enterprises...",
    features: [...],
    icon: Briefcase,
    gradient: "from-blue-600 to-cyan-600",
    defaultPeriod: "24"
  },
  // ... business and jumbo configs
};
```

### Slider Step Calculation:

```typescript
// Dynamic slider step based on loan amount
step={
  currentLoanConfig.minAmount >= 1000000 ? 100000 :
  currentLoanConfig.minAmount >= 50000 ? 10000 :
  1000
}
```

**SME Loan:** Step of ₦10,000  
**Business Loan:** Step of ₦100,000  
**Jumbo Loan:** Step of ₦100,000

### Loan Type Selection:

```typescript
const handleLoanTypeChange = (type: LoanType) => {
  setSelectedLoanType(type);
  const config = loanTypes[type];
  setLoanAmount([config.minAmount]);
  setLoanPeriod(config.defaultPeriod);
};
```

When switching loan types:
- Amount resets to minimum
- Period resets to default
- UI updates with new gradient
- Slider range updates

---

## 📊 Admin Dashboard Integration

### Loan Type Badges in Admin View:

**SME Loan Badge:**
```html
<Badge className="bg-blue-100 text-blue-700 border-blue-200">
  SME Loan
</Badge>
```

**Business Loan Badge:**
```html
<Badge className="bg-purple-100 text-purple-700 border-purple-200">
  Business Loan
</Badge>
```

**Jumbo Loan Badge:**
```html
<Badge className="bg-orange-100 text-orange-700 border-orange-200">
  Jumbo Loan
</Badge>
```

### Sample Applications:

```typescript
[
  {
    userName: "John Doe",
    amount: 50000,
    loanType: "sme",
    purpose: "Business expansion"
  },
  {
    userName: "Mike Johnson",
    amount: 3000000,
    loanType: "business",
    purpose: "Factory equipment"
  },
  {
    userName: "Sarah Williams",
    amount: 8000000,
    loanType: "jumbo",
    purpose: "Real estate development"
  }
]
```

---

## 📱 User Experience Features

### 1. Visual Distinction
Each loan type has:
- Unique color gradient
- Distinct icon
- Clear badge indicator
- Specific feature list

### 2. Smart Defaults
- Amount starts at minimum for selected type
- Period set to optimal default
- Slider configured for appropriate steps

### 3. Clear Information
- Loan range prominently displayed
- Features clearly listed
- Requirements explicitly stated

### 4. Seamless Switching
- Tab navigation for easy comparison
- No data loss when switching
- Instant visual feedback

---

## 🎯 Business Rules

### Loan Approval Criteria:

**SME Loan:**
- Credit score: 600+
- Minimum contribution history: ₦10,000
- Time as member: 1 month+
- Guarantor required: Yes

**Business Loan:**
- Credit score: 650+
- Minimum contribution history: ₦50,000
- Time as member: 3 months+
- Guarantor required: Yes
- May require business documentation

**Jumbo Loan:**
- Credit score: 700+
- Minimum contribution history: ₦200,000
- Time as member: 6 months+
- Guarantor required: Yes
- Additional collateral may be required
- Corporate documentation required

---

## 📄 Terms & Conditions Variations

### All Loan Types (Common):
- Interest rate: 20% flat
- Weekly repayments
- No early repayment penalty
- Account freeze on default

### Jumbo Loan (Additional):
- Additional collateral may be required
- Enhanced verification process
- Corporate advisory review
- Extended processing time (48-72 hours)

---

## 💾 Data Structure

### Loan Application Object:

```typescript
interface LoanApplication {
  id: number;
  userId: string;
  userName: string;
  amount: number;
  period: number;
  purpose: string;
  loanType: "sme" | "business" | "jumbo";
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
  creditScore: number;
  totalContributions: number;
  loanHistory: number;
  guarantorInfo: {
    name: string;
    phone: string;
    address: string;
    relationship: string;
    employer?: string;
  };
}
```

### Active Loan Object:

```typescript
interface ActiveLoan {
  id: number;
  amount: number;
  repaid: number;
  weeklyPayment: number;
  nextPayment: string;
  status: "active";
  period: number;
  startDate: string;
  loanType: "sme" | "business" | "jumbo";
}
```

---

## 🔍 Comparison Table

| Feature | SME Loan | Business Loan | Jumbo Loan |
|---------|----------|---------------|------------|
| **Min Amount** | ₦50,000 | ₦1,500,000 | ₦5,000,000 |
| **Max Amount** | ₦1,499,999 | ₦5,000,000 | ₦50,000,000+ |
| **Approval Time** | 24 hours | 24-48 hours | 48-72 hours |
| **Max Period** | 2 years | 4 years | 4 years |
| **Interest Rate** | 20% | 20% | 20% |
| **Documentation** | Minimal | Standard | Enhanced |
| **Guarantor** | Required | Required | Required |
| **Collateral** | No | Optional | May be required |
| **Credit Score** | 600+ | 650+ | 700+ |
| **Account Manager** | No | Yes | Yes |
| **Advisory Support** | No | Yes | Yes (Premium) |

---

## 📈 Example Use Cases

### SME Loan Success Story:
```
Customer: Small retail shop owner
Amount: ₦300,000
Purpose: Inventory expansion
Period: 24 weeks
Outcome: Business revenue increased by 40%
```

### Business Loan Success Story:
```
Customer: Manufacturing company
Amount: ₦2,500,000
Purpose: New machinery purchase
Period: 52 weeks
Outcome: Production capacity doubled
```

### Jumbo Loan Success Story:
```
Customer: Real estate developer
Amount: ₦15,000,000
Purpose: Property development
Period: 104 weeks
Outcome: Completed 20-unit housing project
```

---

## 🚀 Future Enhancements

### Planned Features:
1. **Loan Type Recommendations**
   - AI-based loan type suggestions
   - Based on profile and history

2. **Graduated Interest Rates**
   - Lower rates for higher credit scores
   - Loyalty discounts

3. **Flexible Collateral Options**
   - Digital asset collateral
   - Property valuation integration

4. **Custom Loan Packages**
   - Tailored for specific industries
   - Seasonal business loans

5. **Refinancing Options**
   - Loan consolidation
   - Rate renegotiation

---

## ✅ Quality Assurance

### Testing Checklist:

**Loan Selection:**
- ✅ All three tabs are clickable
- ✅ Active tab shows gradient background
- ✅ Correct icon displays for each type
- ✅ Feature list shows correctly

**Amount Slider:**
- ✅ Respects min/max for each type
- ✅ Appropriate step increment
- ✅ Displays formatted amount

**Period Selection:**
- ✅ SME shows 4 options
- ✅ Business/Jumbo show 6 options
- ✅ Default period applies correctly

**Calculation:**
- ✅ 20% interest applies to all types
- ✅ Weekly payment calculates correctly
- ✅ Total repayment is accurate

**Form Validation:**
- ✅ Loan purpose is required
- ✅ Guarantor fields are mandatory
- ✅ Terms checkboxes are enforced

**Admin View:**
- ✅ Loan type badge displays
- ✅ Correct color for each type
- ✅ Badge shows in approvals list

---

## 🎉 Version 3.6 Complete!

### What's New:
✅ **Three Loan Types**: SME, Business, Jumbo
✅ **Specific Amount Ranges**: Defined limits for each
✅ **Unique Features**: Custom benefits per type
✅ **Visual Distinction**: Color-coded gradients
✅ **Extended Periods**: Up to 4 years for larger loans
✅ **Admin Integration**: Loan type badges in dashboard

### Benefits:
- �� **Better Categorization**: Clear loan purpose alignment
- 🎯 **Targeted Marketing**: Specific messaging per segment
- 📊 **Improved Analytics**: Track performance by loan type
- 🎨 **Enhanced UX**: Visual clarity and ease of use
- 🏆 **Professional Image**: Enterprise-grade loan offerings

**Version**: 3.6  
**Release Date**: October 17, 2025  
**Status**: Production Ready 🚀

---

## 📞 Quick Reference

### SME Loan at a Glance:
- **Range**: ₦50K - ₦1.5M
- **Color**: Blue
- **Icon**: 💼
- **Target**: Small businesses

### Business Loan at a Glance:
- **Range**: ₦1.5M - ₦5M
- **Color**: Purple
- **Icon**: 📈
- **Target**: Established companies

### Jumbo Loan at a Glance:
- **Range**: ₦5M+
- **Color**: Orange
- **Icon**: 🚀
- **Target**: Large corporations

---

**FNG - Now with comprehensive loan options for every business size!** 💰✨
