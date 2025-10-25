# 🎨 FNG App - Cursor AI Design Reference

## 📋 Quick Reference for AI Assistants

This document provides a complete design system reference for AI assistants (Cursor AI, GitHub Copilot, etc.) to maintain consistency when modifying or extending the FNG loan and contribution app.

---

## 🏗️ Application Architecture

### App Type
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **State Management**: React useState/useEffect + localStorage
- **Build Tool**: Vite
- **Progressive Web App**: Yes (PWA enabled)

### User Modes
1. **User Mode**: Mobile-first, bottom navigation
2. **Admin Mode**: Desktop-first, left sidebar navigation

---

## 🎨 Design System

### Color Palette

#### Primary Colors
```css
--primary: #030213 (Near black - primary actions)
--primary-foreground: #ffffff (White text on primary)
--secondary: oklch(0.95 0.0058 264.53) (Light gray)
--accent: #e9ebef (Light blue-gray)
```

#### Semantic Colors
```css
--background: #ffffff (Page background)
--foreground: oklch(0.145 0 0) (Text color)
--muted: #ececf0 (Muted background)
--muted-foreground: #717182 (Muted text)
--destructive: #d4183d (Error/danger red)
--border: rgba(0, 0, 0, 0.1) (Border color)
```

#### Brand Colors
```css
Blue: #2563eb (Used for active states)
Orange: #f97316 (Used for admin badges, warnings)
Green: #10b981 (Success states)
Red: #ef4444 (Error states)
```

#### Chart Colors
```css
--chart-1: oklch(0.646 0.222 41.116) (Orange)
--chart-2: oklch(0.6 0.118 184.704) (Blue)
--chart-3: oklch(0.398 0.07 227.392) (Purple)
--chart-4: oklch(0.828 0.189 84.429) (Green)
--chart-5: oklch(0.769 0.188 70.08) (Yellow)
```

### Typography

**IMPORTANT**: Do NOT use Tailwind font classes (text-xl, font-bold, etc.) unless explicitly requested. Typography is controlled via CSS variables.

#### Base Settings
```css
--font-size: 16px (Root font size)
--font-weight-normal: 400
--font-weight-medium: 500
```

#### Default Element Styles
```css
h1: text-2xl, font-medium, line-height 1.5
h2: text-xl, font-medium, line-height 1.5
h3: text-lg, font-medium, line-height 1.5
h4: text-base, font-medium, line-height 1.5
p: text-base, font-normal, line-height 1.5
label: text-base, font-medium, line-height 1.5
button: text-base, font-medium, line-height 1.5
input: text-base, font-normal, line-height 1.5
```

### Spacing System

#### Margins & Padding
- `px-3 sm:px-4 lg:px-6` - Standard horizontal padding
- `py-4 sm:py-6` - Standard vertical padding
- `gap-2 sm:gap-3` - Standard gap between elements
- `space-y-4 sm:space-y-6` - Standard vertical spacing

#### Component Spacing
- Cards: `p-4 sm:p-6`
- Modals: `p-4 sm:p-6`
- Forms: `space-y-4`
- Button groups: `gap-2 sm:gap-3`

### Border Radius
```css
--radius: 0.625rem (10px - standard)
--radius-sm: 6px (Small elements)
--radius-md: 8px (Medium elements)
--radius-lg: 10px (Large elements)
--radius-xl: 14px (Extra large elements)
```

### Responsive Breakpoints
```css
xs: 480px (Extra small phones)
sm: 640px (Small tablets)
md: 768px (Tablets)
lg: 1024px (Small desktops)
xl: 1280px (Large desktops)
2xl: 1536px (Extra large screens)
```

#### Custom Breakpoints
```css
@custom-media --xs (width >= 480px)
```

---

## 📱 Layout Patterns

### User Mode Layout
```tsx
Structure:
- Fixed header (sticky top, z-30)
- Main content (max-w-md, px-4, py-4, pb-20)
- Fixed bottom navigation (z-40)

Container: max-w-md mx-auto
Padding: px-4 sm:px-6
Bottom padding: pb-20 (for nav clearance)
```

### Admin Mode Layout
```tsx
Structure:
- Fixed header (sticky top, z-30)
- Collapsible left sidebar (fixed, z-20)
- Main content (ml-64 or ml-16 when collapsed)
- Mobile: hamburger menu with drawer

Container: max-w-7xl mx-auto
Sidebar: w-64 (expanded) or w-16 (collapsed)
Mobile: Full-width drawer overlay
```

---

## 🎯 Component Patterns

### Cards
```tsx
<Card className="p-4 sm:p-6">
  <CardHeader className="pb-4">
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Buttons
```tsx
// Primary action
<Button className="w-full">Action</Button>

// Secondary action
<Button variant="outline">Action</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Small button
<Button size="sm">Action</Button>

// Icon button
<Button size="icon">
  <Icon className="h-4 w-4" />
</Button>
```

### Forms
```tsx
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field">Label</Label>
    <Input 
      id="field" 
      type="text" 
      placeholder="Placeholder"
    />
  </div>
  
  <Button type="submit" className="w-full">
    Submit
  </Button>
</form>
```

### Dialogs/Modals
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      {/* Content */}
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Alerts
```tsx
<Alert className="bg-blue-50 border-blue-200">
  <Icon className="h-4 w-4 text-blue-600" />
  <AlertDescription className="text-blue-800 text-sm">
    Message here
  </AlertDescription>
</Alert>
```

### Status Badges
```tsx
// Success
<Badge className="bg-green-100 text-green-700">Active</Badge>

// Warning
<Badge className="bg-orange-100 text-orange-700">Pending</Badge>

// Error
<Badge className="bg-red-100 text-red-700">Rejected</Badge>

// Info
<Badge className="bg-blue-100 text-blue-700">Info</Badge>
```

### Tables (Mobile-First)
```tsx
// Desktop: Standard table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Mobile: Card-based layout
<div className="space-y-3">
  {items.map(item => (
    <Card key={item.id} className="p-4">
      {/* Card content */}
    </Card>
  ))}
</div>
```

---

## 💰 Currency Formatting

### Always Use Naira Symbol
```tsx
// Correct
₦{amount.toLocaleString("en-NG")}
₦{parseFloat(amount).toLocaleString("en-NG", { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
})}

// Incorrect
${amount} or N{amount}
```

### Number Formatting
```tsx
// Large numbers with commas
amount.toLocaleString("en-NG") // 1,000,000

// Currency with decimals
parseFloat(amount).toLocaleString("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) // 1,000,000.00
```

---

## 📊 Data Storage Patterns

### localStorage Keys

#### User Data
```typescript
"users" // Array of user objects
"currentUser" // Current logged-in user email/phone
"kycSubmissions" // Array of KYC submissions
"contributionBalance" // String: user's contribution balance
"loanDeposits" // String: user's loan deposits
```

#### Admin Data
```typescript
"admins" // Array of admin users
"adminRoles" // Array of admin role definitions
"currentAdminRole" // String: current admin's role
"currentAdminEmail" // String: current admin's email
"currentAdminPermissions" // Array: current admin's permissions
```

#### Financial Data
```typescript
"companyBalance" // String: company balance
"insuranceBalance" // String: insurance balance
"loanInterestBalance" // String: total loan interest
"loanServiceChargeBalance" // String: total service charges
"loanInterest_sme" // String: SME loan interest
"loanInterest_business" // String: Business loan interest
"loanInterest_jumbo" // String: Jumbo loan interest
"interestTransactions" // Array: interest transaction history
```

#### Transactions
```typescript
"transactions" // Array of all transactions
"loanApplications" // Array of loan applications
"withdrawalRequests" // Array of withdrawal requests
"upfrontRefundRequests" // Array of refund requests
"depositOffsetRequests" // Array of offset requests
```

#### Settings
```typescript
"hasSeenSplash" // Boolean: session storage
"hasCompletedOnboarding" // Boolean: per user
"paymentMethods" // Array of payment methods
"notificationSettings" // Object: notification preferences
```

### Data Structure Examples

#### User Object
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // Primary identifier
  email?: string; // Optional
  password: string; // Hashed
  phoneVerified: boolean;
  emailVerified?: boolean;
  createdAt: string;
  lastLogin: string;
}
```

#### Transaction Object
```typescript
interface Transaction {
  id: string;
  type: "contribution" | "loan_disbursement" | "loan_repayment" | "withdrawal";
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  description: string;
  userEmail: string;
  reference?: string;
  paymentMethod?: string;
  paymentGateway?: "paystack" | "opay" | "simulated";
}
```

#### Loan Application Object
```typescript
interface LoanApplication {
  id: string;
  userEmail: string;
  loanType: "sme" | "business" | "jumbo";
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "disbursed";
  appliedAt: string;
  approvedAt?: string;
  disbursedAt?: string;
  weeklyPayment: number;
  totalRepayment: number;
  dueDate: string;
  guarantor?: {
    name: string;
    phone: string;
    nin: string;
    ninVerified: boolean;
  };
}
```

---

## 🔐 Authentication Flow

### User Authentication (Phone-First)
```typescript
1. User enters phone number
2. System checks if user exists
3. If new: Sign up flow
   - Collect: phone, firstName, lastName, password
   - Send SMS verification code
   - Verify code
   - Create account
4. If existing: Login flow
   - Check if phone verified
   - If not verified: Show SMS verification
   - If verified: Proceed to login
5. After login: Check KYC status
   - not_submitted: Show KYC form
   - pending: Show pending banner, limited access
   - approved: Full access
   - rejected: Show rejection banner, allow resubmission
```

### Admin Authentication
```typescript
1. Access via special URL:
   - Hash: #/admin or #admin
   - Query: ?admin=true
   - Path: /admin
2. Show admin login page
3. Validate admin credentials
4. Check admin role and permissions
5. Load admin dashboard
6. Store: currentAdminRole, currentAdminEmail, currentAdminPermissions
```

---

## 💳 Payment Integration

### Supported Gateways
1. **Paystack** (Primary)
2. **OPay** (Secondary)
3. **Simulation** (Fallback)

### Payment Flow
```typescript
1. User initiates payment
2. Show PaymentDialog with gateway selection
3. Load payment gateway script
4. Process payment:
   - Success: Record transaction, update balances
   - Failed: Show error, allow retry
   - Pending: Show pending status
5. Auto-credit company accounts
6. Update all relevant balances
7. Show success/error message
```

### Payment Gateway Detection
```typescript
// Automatic fallback chain
1. Try Paystack (if public key available)
2. Try OPay (if credentials available)
3. Fallback to simulation (always works)

// Simulation mode automatically enabled for testing
```

---

## 🏦 Loan Types & Calculations

### SME Loan
```typescript
Max Amount: ₦100,000
Duration: 15 weeks
Interest Rate: 12.5%
Service Charge: 5%
Upfront Costs: Insurance + Service Charge
Weekly Payment: (Amount + Interest) / 15
```

### Business Loan
```typescript
Max Amount: ₦500,000
Duration: 24 weeks
Interest Rate: 15%
Service Charge: 7%
Upfront Costs: Insurance + Service Charge
Weekly Payment: (Amount + Interest) / 24
```

### Jumbo Loan
```typescript
Max Amount: ₦5,000,000
Duration: 36 weeks
Interest Rate: 20%
Service Charge: 10%
Upfront Costs: Insurance + Service Charge
Monthly Service Charge: ₦5,000 (first 6 months)
Requires: 2 guarantors with NIN
Weekly Payment: (Amount + Interest) / 36
```

### Calculation Formulas
```typescript
// Interest
const interest = amount * (interestRate / 100);

// Service Charge (one-time)
const serviceCharge = amount * (serviceChargeRate / 100);

// Insurance (one-time, 1.5% of loan)
const insurance = amount * 0.015;

// Upfront Costs
const upfrontCosts = insurance + serviceCharge;

// Weekly Payment
const weeklyPayment = (amount + interest) / weeks;

// Total Repayment
const totalRepayment = amount + interest;

// Net Disbursement
const netDisbursement = amount - upfrontCosts;
```

---

## 📅 Contributions System

### Contribution Types
```typescript
1. Single Contribution: One-time payment
2. Bulk Contributions: Multiple payments (up to 7 days)
3. Scheduled: Daily reminders
```

### Calendar System
```typescript
// Visual calendar showing:
- Days with contributions (green dot)
- Amount per day
- Month overview
- Total monthly contributions
```

### Balance Tracking
```typescript
contributionBalance: Total saved
Displayed in: Dashboard, Contributions page
Updated on: Every contribution payment
Withdrawable: Yes (with approval)
```

---

## 👨‍💼 Admin Features

### Role-Based Access Control (RBAC)
```typescript
Roles:
1. Super Admin: Full access to everything
2. Manager: Most features except critical settings
3. Approver: Loan, KYC, withdrawal approvals only
4. Viewer: Read-only access

Permissions checked on:
- Navigation items
- Action buttons
- Data access
```

### Admin Navigation Structure
```typescript
Core:
- Dashboard (Overview metrics)
- Revenue Analytics (Income analysis)
- Accounting Reports (P&L, Balance Sheet, Cash Flow)
- Generate Reports (Custom reports)

Operations:
- Loan Approvals
- Withdrawal Approvals
- Deposit Refunds
- Balance Offset
- KYC Approvals

Customers:
- Customer Profiles (View all)
- Manage Customers (Edit, deactivate)
- Customer Enquiries (Support tickets)

System:
- Real-time Activity
- Data Management (Import/export)
- Company Settings (Admin users, company info)
```

### Revenue Tracking
```typescript
Auto-tracked on every transaction:
- Loan interest (by loan type)
- Service charges
- Insurance premiums
- Late fees

Displayed in:
- Revenue Analytics dashboard
- Accounting Reports
- Report Generator
```

---

## 🎨 UI Component Library (shadcn/ui)

### Available Components
```typescript
// Layout
Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
Tabs, TabsList, TabsTrigger, TabsContent

// Forms
Button, Input, Label, Textarea
Select, SelectTrigger, SelectValue, SelectContent, SelectItem
Checkbox, RadioGroup, RadioGroupItem
Switch

// Feedback
Alert, AlertDescription
Badge
Progress
Skeleton
Toaster (from sonner)

// Data Display
Table, TableHeader, TableHead, TableBody, TableRow, TableCell
Avatar, AvatarImage, AvatarFallback
Separator

// Navigation
ScrollArea
Collapsible, CollapsibleTrigger, CollapsibleContent

// Overlay
Popover, PopoverTrigger, PopoverContent
Tooltip, TooltipTrigger, TooltipContent
AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle
```

---

## 📱 Mobile-First Principles

### Always Design Mobile First
```tsx
1. Start with mobile layout (320px+)
2. Add tablet breakpoints (sm:, md:)
3. Add desktop breakpoints (lg:, xl:)

Example:
<div className="px-4 sm:px-6 lg:px-8">
  <h2 className="text-lg sm:text-xl lg:text-2xl">Title</h2>
</div>
```

### Touch Targets
```tsx
Minimum: 44x44px
Standard buttons: h-10 or h-11
Icon buttons: h-9 w-9 (size="icon")
Navigation items: py-3 (min-height 48px)
```

### Mobile Navigation
```tsx
User Mode:
- Bottom tab bar (fixed)
- 5 main items max
- Icons + labels
- Active state highlighting

Admin Mode:
- Hamburger menu (mobile)
- Sidebar drawer overlay
- Collapsible sections
```

---

## ♿ Accessibility Guidelines

### ARIA Labels
```tsx
// Always include for icon-only buttons
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// Form inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Keyboard Navigation
```tsx
// Ensure all interactive elements are keyboard accessible
- Tab order logical
- Enter/Space for actions
- Escape to close modals
- Arrow keys for navigation
```

### Screen Readers
```tsx
// Use sr-only class for screen reader only text
<span className="sr-only">Description for screen readers</span>
```

---

## 🚀 Performance Best Practices

### Code Splitting
```tsx
// Lazy load admin components
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### Image Optimization
```tsx
// Use ImageWithFallback component
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

<ImageWithFallback 
  src="/images/logo.png" 
  alt="FNG Logo"
  className="w-32 h-32"
/>
```

### Memo & Callbacks
```tsx
// Memoize expensive computations
const totalBalance = useMemo(() => 
  transactions.reduce((sum, t) => sum + t.amount, 0),
  [transactions]
);

// Memoize callbacks
const handleClick = useCallback(() => {
  // Handler
}, [dependencies]);
```

---

## 🧪 Testing Patterns

### Manual Testing Checklist
```typescript
User Flow:
✓ Sign up with phone number
✓ Verify SMS code
✓ Complete KYC registration
✓ View dashboard
✓ Make contribution
✓ Apply for loan
✓ Make payment
✓ View transaction history
✓ Request withdrawal

Admin Flow:
✓ Login via #/admin
✓ View dashboard metrics
✓ Approve loan application
✓ Approve KYC submission
✓ View revenue analytics
✓ Generate report
✓ Manage customer data
✓ Export data
```

---

## 🔧 Common Patterns & Snippets

### Toast Notifications
```tsx
import { toast } from "sonner@2.0.3";

// Success
toast.success("Operation successful!");

// Error
toast.error("Operation failed. Please try again.");

// Info
toast.info("Information message");

// Warning
toast.warning("Warning message");
```

### Date Formatting
```tsx
// Standard date format
new Date().toLocaleDateString("en-NG")

// With time
new Date().toLocaleString("en-NG", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
})
```

### Loading States
```tsx
const [isLoading, setIsLoading] = useState(false);

{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
) : (
  <Content />
)}
```

### Empty States
```tsx
{items.length === 0 ? (
  <Card className="p-8 text-center">
    <Icon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
    <h3 className="mb-2">No items found</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Get started by creating your first item.
    </p>
    <Button onClick={onCreate}>Create Item</Button>
  </Card>
) : (
  <ItemsList items={items} />
)}
```

---

## 📝 Code Style Guidelines

### Component Structure
```tsx
// 1. Imports
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";

// 2. Interface/Types
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export function Component({ title, onAction }: ComponentProps) {
  // 4. State
  const [isOpen, setIsOpen] = useState(false);
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Naming Conventions
```typescript
// Components: PascalCase
ComponentName.tsx

// Hooks: camelCase with "use" prefix
useCustomHook.ts

// Utilities: camelCase
formatCurrency.ts

// Constants: UPPER_SNAKE_CASE
const MAX_LOAN_AMOUNT = 5000000;

// Variables: camelCase
const totalAmount = 1000;

// Interfaces: PascalCase with "I" prefix (optional)
interface LoanApplication { }
```

---

## 🎯 Quick Reference Commands

### Start Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

### Type Checking
```bash
npx tsc --noEmit
```

### Lint
```bash
npm run lint
```

---

## 📚 Important Files Reference

### Entry Points
```typescript
/index.html - HTML entry, PWA config
/src/main.tsx - React entry point
/App.tsx - Main application component
```

### Styling
```typescript
/styles/globals.css - Global styles, design tokens
```

### Utilities
```typescript
/lib/utils.ts - Utility functions (cn, etc.)
/lib/paystack-service.ts - Paystack integration
/lib/opay-service.ts - OPay integration
/lib/nigerian-banks.ts - 90+ Nigerian banks
```

### PWA
```typescript
/public/manifest.json - PWA manifest
/public/sw.js - Service worker
/public/_redirects - SPA routing (Netlify)
```

---

## 🔥 Hot Tips for AI Assistants

### DO ✅
- Always use Naira (₦) symbol for currency
- Design mobile-first, then scale up
- Use shadcn/ui components (don't recreate)
- Follow existing patterns in codebase
- Maintain responsive breakpoints
- Use localStorage for data persistence
- Include loading and empty states
- Add proper error handling
- Use toast notifications for feedback
- Maintain accessibility (ARIA, keyboard nav)

### DON'T ❌
- Don't use font classes (text-xl, font-bold) unless requested
- Don't create custom versions of shadcn components
- Don't use dollar signs ($) for currency
- Don't break mobile layouts
- Don't remove existing functionality
- Don't hardcode values (use localStorage)
- Don't skip error handling
- Don't ignore accessibility
- Don't remove comments or documentation

---

## 📊 Key Metrics & KPIs

### User Metrics
```typescript
Total Users
Active Users (last 30 days)
KYC Approval Rate
Average Contribution Amount
Total Contributions
```

### Loan Metrics
```typescript
Total Loans Issued
Loan Approval Rate
Average Loan Amount
Total Outstanding Loans
Repayment Rate
Default Rate
```

### Financial Metrics
```typescript
Total Revenue
Loan Interest Revenue (by type)
Service Charge Revenue
Insurance Revenue
Company Balance
Contribution Balance
```

### Admin Metrics
```typescript
Pending Approvals (Loans, KYC, Withdrawals)
Daily Transactions
Response Time
System Uptime
```

---

## 🎨 Brand Identity

### Logo
- Compact: Shows in header
- Full: Shows in splash screen, login pages
- Colors: Blue gradient with orange accent

### Voice & Tone
- Professional yet friendly
- Clear and concise
- Supportive and helpful
- Nigerian context (use local terms)

### Messaging
- "Save daily, borrow weekly"
- "Your trusted financial partner"
- "Quick loans, easy repayments"

---

## 🚨 Critical Don'ts

### Security
- ❌ Never expose API keys in code
- ❌ Never store passwords in plain text
- ❌ Never skip input validation
- ❌ Never trust user input

### Data
- ❌ Never delete user data without confirmation
- ❌ Never modify financial records without audit trail
- ❌ Never skip balance calculations
- ❌ Never allow negative balances

### UX
- ❌ Never hide errors from users
- ❌ Never skip loading states
- ❌ Never make buttons too small (< 44px)
- ❌ Never break mobile layouts

---

## ✅ Production Checklist

### Before Deployment
- [ ] All TypeScript errors resolved
- [ ] No console.log statements
- [ ] Build completes successfully
- [ ] PWA features working
- [ ] Responsive on all devices
- [ ] All payments tested (simulation mode)
- [ ] Admin portal accessible
- [ ] Default passwords changed
- [ ] Error handling in place
- [ ] Loading states implemented

---

## 📞 Support Resources

### Documentation
- `/START_HERE.md` - Quick start guide
- `/QUICK_DEPLOY_GUIDE.md` - Deployment guide
- `/ADMIN_FEATURES_SUMMARY.md` - Admin features
- `/PAYMENT_SETUP_GUIDE.md` - Payment setup

### Key Guides
- Loans: `/LOAN_TYPES_DOCUMENTATION.md`
- Contributions: `/CONTRIBUTIONS_QUICK_START.md`
- KYC: `/KYC_QUICK_START.md`
- Admin: `/ADMIN_QUICK_CARD.md`
- Revenue: `/REVENUE_ANALYTICS_GUIDE.md`

---

## 🎯 Current State

### ✅ Complete Features
- Phone number authentication with SMS verification
- Email verification (fallback method)
- KYC registration with BVN & bank verification
- 3 loan types (SME, Business, Jumbo)
- Weekly loan repayment schedules
- Daily contributions with calendar
- Transaction history
- Payment methods management
- Dual payment gateway (Paystack + OPay)
- Admin portal with RBAC
- Revenue analytics & accounting reports
- Customer management
- Approval workflows
- Data export/import
- PWA with offline support
- Session timeout
- Onboarding tutorial

### 🔄 Simulation Mode
- SMS verification (auto-generates codes)
- Payment processing (instant success)
- BVN verification (UI complete)

### 🚀 Production Ready
- Error-free build
- Mobile responsive
- Accessible
- Secure
- Performant
- SEO optimized
- PWA enabled

---

## 🎨 Design Philosophy

**Mobile-First**: Design for mobile, enhance for desktop
**User-Centric**: Prioritize user needs and experience
**Consistent**: Maintain design patterns across app
**Accessible**: Everyone can use the app
**Performant**: Fast load times, smooth interactions
**Secure**: Protect user data and financial info
**Nigerian Context**: Built for Nigerian users

---

## 💡 Tips for Cursor AI

### When Adding Features
1. Check existing components first
2. Maintain consistent patterns
3. Update both user and admin views
4. Add to navigation if needed
5. Update localStorage keys
6. Add documentation
7. Test on mobile first

### When Fixing Bugs
1. Identify root cause
2. Check related components
3. Test fix thoroughly
4. Update documentation
5. Ensure no regressions

### When Refactoring
1. Don't break existing functionality
2. Maintain API compatibility
3. Update all references
4. Test thoroughly
5. Update documentation

---

**Last Updated**: January 2025
**Version**: v1.0.0
**Status**: ✅ Production Ready

---

This reference should provide everything needed to understand and maintain the FNG app design system. Use it as your source of truth when making changes or adding features.
