# 🚀 FNG App - AI Quick Reference Card

> **Quick context for AI assistants working on this project**

---

## 📱 What is This?
**FNG Loan & Contribution App** - A Progressive Web App for loans and daily savings in Nigeria.

**Stack**: React 18 + TypeScript + Tailwind v4 + shadcn/ui + Vite + PWA

---

## ⚡ Critical Rules (Read First!)

### 🚫 Typography - DON'T DO THIS
```tsx
// ❌ WRONG - Never use these
<h1 className="text-2xl font-bold">Title</h1>
<p className="text-sm font-medium leading-tight">Text</p>

// ✅ CORRECT - Just use semantic HTML
<h1>Title</h1>
<p>Text</p>
```
**Why?** Typography is controlled by CSS variables. Adding classes breaks the design system.

### 💰 Currency - Always Naira
```tsx
// ❌ WRONG
${amount}
N{amount}

// ✅ CORRECT
₦{amount.toLocaleString("en-NG")}
₦{parseFloat(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
```

### 📦 Components - Use shadcn/ui
```tsx
// ❌ WRONG - Don't create custom versions
function MyCustomButton() { ... }

// ✅ CORRECT - Use existing components
import { Button } from "./components/ui/button";
<Button>Click Me</Button>
```

---

## 🎨 Design System Cheat Sheet

### Colors
```typescript
Primary: #030213 (Near black)
Secondary: oklch(0.95 0.0058 264.53) (Light gray)
Blue: #2563eb (Active states)
Orange: #f97316 (Warnings, admin badges)
Green: #10b981 (Success)
Red: #ef4444 (Errors)
```

### Spacing
```tsx
// Standard patterns
px-4 sm:px-6     // Horizontal padding
py-4 sm:py-6     // Vertical padding
gap-2 sm:gap-3   // Gap between elements
space-y-4        // Vertical spacing
```

### Breakpoints
```typescript
xs: 480px   // Extra small phones
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Small desktops
xl: 1280px  // Large desktops
```

### Touch Targets
```typescript
Minimum: 44x44px
Buttons: h-10 or h-11
Icon buttons: h-9 w-9
Navigation: py-3 (min 48px)
```

---

## 📐 Layout Patterns

### User Mode (Mobile-First)
```tsx
<div className="max-w-md mx-auto px-4 sm:px-6 py-4 pb-20">
  {/* Content */}
</div>
// pb-20 for bottom nav clearance
```

### Admin Mode (Desktop-First)
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {/* Content */}
</div>
// Sidebar: w-64 (collapsed: w-16)
```

---

## 🧩 Common Components

### Card
```tsx
<Card className="p-4 sm:p-6">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Button
```tsx
<Button className="w-full">Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon className="h-4 w-4" /></Button>
```

### Alert
```tsx
<Alert className="bg-blue-50 border-blue-200">
  <Icon className="h-4 w-4 text-blue-600" />
  <AlertDescription className="text-blue-800 text-sm">
    Message here
  </AlertDescription>
</Alert>
```

### Badge
```tsx
<Badge className="bg-green-100 text-green-700">Active</Badge>
<Badge className="bg-orange-100 text-orange-700">Pending</Badge>
<Badge className="bg-red-100 text-red-700">Rejected</Badge>
```

### Toast
```tsx
import { toast } from "sonner@2.0.3";

toast.success("Success!");
toast.error("Error occurred");
toast.info("Info message");
toast.warning("Warning");
```

---

## 💾 Data Storage (localStorage)

### Common Keys
```typescript
// User Data
"users"                 // Array of users
"currentUser"           // Current user email/phone
"kycSubmissions"        // Array of KYC submissions

// Financial
"contributionBalance"   // String: user balance
"loanDeposits"          // String: user deposits
"companyBalance"        // String: company balance
"insuranceBalance"      // String: insurance
"loanInterestBalance"   // String: interest earned

// Transactions
"transactions"          // Array: all transactions
"loanApplications"      // Array: loan applications
"withdrawalRequests"    // Array: withdrawals

// Admin
"admins"                // Array: admin users
"adminRoles"            // Array: role definitions
"currentAdminRole"      // String: current role
```

### Usage Pattern
```typescript
// Read
const users = JSON.parse(localStorage.getItem("users") || "[]");

// Write
localStorage.setItem("users", JSON.stringify(updatedUsers));
```

---

## 🏦 Loan Calculations

### Loan Types
```typescript
SME:      ₦100,000 max  | 15 weeks | 12.5% interest | 5% service
Business: ₦500,000 max  | 24 weeks | 15% interest   | 7% service
Jumbo:    ₦5M max       | 36 weeks | 20% interest   | 10% service
```

### Formulas
```typescript
interest = amount × (rate / 100)
insurance = amount × 0.015
serviceCharge = amount × (serviceRate / 100)
upfrontCosts = insurance + serviceCharge
weeklyPayment = (amount + interest) / weeks
totalRepayment = amount + interest
netDisbursement = amount - upfrontCosts
```

---

## 🔐 Authentication

### User Flow
1. Enter phone number
2. Send SMS code (simulated)
3. Verify code
4. Check KYC status:
   - not_submitted → Show KYC form
   - pending → Limited access + banner
   - approved → Full access
   - rejected → Show error + allow resubmit

### Admin Flow
1. Access via: `#/admin`, `?admin=true`, or `/admin`
2. Show admin login
3. Validate credentials
4. Check role & permissions
5. Load admin dashboard

---

## 💳 Payment System

### Gateways
1. **Paystack** (Primary)
2. **OPay** (Secondary)
3. **Simulation** (Fallback - always works)

### Flow
```typescript
1. User initiates payment
2. Show gateway selection
3. Load payment script
4. Process payment
5. Auto-credit accounts
6. Update balances
7. Show confirmation
```

---

## 🎯 UI States

### Loading
```tsx
{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
) : (
  <Content />
)}
```

### Empty
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

### Error
```tsx
try {
  // Operation
} catch (error) {
  console.error("Error:", error);
  toast.error("Operation failed. Please try again.");
}
```

---

## 📱 Mobile Patterns

### Bottom Navigation (User Mode)
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40">
  <div className="max-w-md mx-auto flex justify-around">
    {items.map(item => (
      <button className="flex flex-col items-center gap-1 py-3 px-4">
        <Icon className="h-5 w-5" />
        <span className="text-xs">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

### Sidebar (Admin Mode)
```tsx
// Desktop: Fixed left sidebar
<aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r">
  {/* Navigation */}
</aside>

// Mobile: Drawer overlay
<aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50">
  {/* Navigation */}
</aside>
```

---

## ♿ Accessibility

### Must-Haves
```tsx
// Icon buttons
<button aria-label="Close">
  <X className="h-4 w-4" />
</button>

// Form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Screen reader only
<span className="sr-only">Description</span>
```

---

## 🚀 Performance

### Memoization
```tsx
const result = useMemo(() => 
  expensiveCalculation(data),
  [data]
);

const handler = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### Lazy Loading
```tsx
const AdminDashboard = lazy(() => 
  import("./components/admin/AdminDashboard")
);

<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

---

## 🔧 Common Imports

```tsx
// UI Components
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";

// Icons
import { Icon } from "lucide-react";

// Toast
import { toast } from "sonner@2.0.3";

// Utils
import { cn } from "./lib/utils";
```

---

## 📂 File Structure

```
/App.tsx                    - Main app component
/components/                - User components
/components/admin/          - Admin components
/components/ui/             - shadcn/ui components
/styles/globals.css         - Design tokens & global styles
/lib/utils.ts               - Utility functions
/lib/paystack-service.ts    - Paystack integration
/lib/opay-service.ts        - OPay integration
/public/manifest.json       - PWA manifest
/public/sw.js               - Service worker
```

---

## 🎯 Development Workflow

### 1. Understand the Change
- What feature/fix is needed?
- Which component(s) to modify?
- User mode or admin mode?

### 2. Check Existing Patterns
- Look at similar components
- Follow existing structure
- Maintain consistency

### 3. Make Changes
- Mobile-first approach
- Use existing components
- Add loading/error states
- Update localStorage if needed

### 4. Test
- Build: `npm run build`
- Preview: `npm run preview`
- Test on mobile (320px+)
- Test all breakpoints
- Check console for errors

### 5. Document (if significant)
- Update relevant .md files
- Add inline comments
- Update this reference if needed

---

## ⚠️ Common Mistakes

### Typography
```tsx
❌ <h1 className="text-2xl font-bold">
✅ <h1>Title</h1>
```

### Currency
```tsx
❌ ${amount}
✅ ₦{amount.toLocaleString("en-NG")}
```

### Components
```tsx
❌ Create custom button component
✅ Import { Button } from "./components/ui/button"
```

### Mobile
```tsx
❌ Only test on desktop
✅ Test mobile first (320px+)
```

### Data
```tsx
❌ const users = localStorage.getItem("users")
✅ const users = JSON.parse(localStorage.getItem("users") || "[]")
```

---

## 🎨 Brand Guidelines

### Logo
- Compact: Header usage
- Full: Login/splash screens
- Colors: Blue gradient + orange

### Voice
- Professional yet friendly
- Clear and concise
- Nigerian context

### Messaging
- "Save daily, borrow weekly"
- "Your trusted financial partner"

---

## ✅ Pre-Commit Checklist

```bash
# 1. Build succeeds
npm run build

# 2. No errors in console
npm run preview

# 3. Mobile responsive
# Test at 320px, 375px, 768px, 1024px

# 4. No console.log
# Remove all debugging logs

# 5. TypeScript happy
# No type errors

# 6. Accessibility OK
# ARIA labels, keyboard nav

# 7. Loading states present
# Show loading UI

# 8. Error handling
# Try-catch, error messages
```

---

## 📚 Full Documentation

- **Complete Design System**: `/CURSOR_AI_DESIGN_REFERENCE.md`
- **Getting Started**: `/START_HERE.md`
- **Deployment**: `/QUICK_DEPLOY_GUIDE.md`
- **Admin Guide**: `/ADMIN_FEATURES_SUMMARY.md`
- **Payment Setup**: `/PAYMENT_SETUP_GUIDE.md`

---

## 🎯 Current Status

**Version**: v1.0.0
**Status**: ✅ Production Ready
**Build**: Error-free
**PWA**: Enabled
**Mobile**: Fully responsive
**Payments**: Dual gateway + simulation
**Admin**: Complete with RBAC
**Revenue**: Tracking active

---

## 💡 Pro Tips

1. **Mobile First**: Always start with mobile layout
2. **Use Existing**: Don't recreate what exists
3. **Be Consistent**: Follow existing patterns
4. **Test Early**: Test as you build
5. **Document**: Add comments for complex logic
6. **Accessibility**: Don't skip ARIA labels
7. **Performance**: Memoize expensive operations
8. **User Feedback**: Always show loading/success/error states

---

## 🆘 When Stuck

1. Search similar components in codebase
2. Check `/CURSOR_AI_DESIGN_REFERENCE.md`
3. Look at existing patterns
4. Maintain consistency
5. Test on mobile first
6. Don't break existing features

---

## 🎉 You're Ready!

This reference covers 90% of what you need. For deep dives, check the full documentation files. Remember: **consistency > creativity** in this production app.

**Happy coding! 🚀**

---

**Quick Commands**:
```bash
npm run dev      # Start development
npm run build    # Build for production
npm run preview  # Preview production build
```

**Admin URLs**:
```
https://yourapp.com/#/admin
https://yourapp.com/?admin=true
```

**Test Credentials**:
```
Admin: admin@fng.com / Admin123!@#
User: Sign up with any phone number
```

---

**Last Updated**: January 2025
