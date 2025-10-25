# 🚨 Loan Defaulters - Quick Reference Card

## 📍 Access

**Admin Dashboard → Loan Defaulters** (sidebar menu with ⚠️ icon)

---

## 📊 Dashboard Overview

```
┌────────────────────────────────────────────────────┐
│  LOAN DEFAULTERS STATISTICS                        │
├────────────────────────────────────────────────────┤
│                                                    │
│  ⚠️  Total Defaulters: 12                         │
│                                                    │
│  🟡 Mild (≤1 week): 4 customers                   │
│  🟠 Moderate (2-4 weeks): 5 customers             │
│  🔴 Severe (>4 weeks): 3 customers                │
│                                                    │
│  💰 Total Overdue: ₦125,000                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🎯 Severity Levels

| Level | Badge | Days Overdue | Action Required |
|-------|-------|--------------|-----------------|
| 🟡 Mild | Yellow | 1-7 days | Friendly reminder |
| 🟠 Moderate | Orange | 8-30 days | Formal notice |
| 🔴 Severe | Red | 30+ days | Final warning/Suspend |

---

## 👤 Defaulter Card Layout

```
┌─────────────────────────────────────────────────┐
│ 👤 John Doe               🔴 Severely Overdue  │
│ ─────────────────────────────────────────────  │
│ Loan #101 • 35 days overdue • 5 missed         │
│                                                 │
│ Overdue: ₦12,500                               │
│ Contacted: 3 times                             │
│                                                 │
│ [👁️ View] [💬 Contact]                        │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Quick Actions

### 1️⃣ View Details
**Button:** 👁️ View
- See complete customer info
- Review loan details
- Check overdue information
- Read admin notes

### 2️⃣ Contact Customer
**Button:** 💬 Contact
- Send reminder message
- Track contact attempts
- Add admin notes
- Log contact date

### 3️⃣ Mark as Paid
**Available in:** Detail view
- Update loan status
- Clear defaulter record
- Log payment receipt
- Adjust payment schedule

### 4️⃣ Suspend Account
**Available in:** Detail view
- For severe cases (30+ days)
- Requires confirmation
- Logs suspension
- Blocks customer access

---

## 🔍 Search & Filter

### Search Box:
```
🔍 [Search by name, email, phone, or loan ID...]
```

### Filter Dropdown:
```
📊 Filter: [All Severity ▼]
         [Mild]
         [Moderate]
         [Severe]
```

### Export Button:
```
[📥 Export] → Downloads CSV report
```

---

## 💬 Contact Message Template

```
Dear [Customer Name],

This is a reminder that your loan payment of ₦[Amount] 
was due on [Date].

You are currently [X] days overdue with [Y] missed 
payment(s).

Total overdue amount: ₦[Total]

Please make payment immediately to avoid suspension 
of your account.

Thank you.
```

**✏️ Editable before sending**

---

## 📋 Detailed View Sections

### 1. Customer Information
- Name, User ID
- Phone, Email

### 2. Loan Information
- Loan ID, Type
- Original amount, Balance
- Weekly payment, Disbursed date

### 3. Overdue Information (Red Box)
- Days overdue
- Missed payments
- Overdue amount
- Severity level
- Expected payment date
- Contact attempts

### 4. Admin Notes
- Previous notes
- Contact history

---

## 📥 CSV Export Format

```
Loan ID | Customer | Phone | Email | Amount | Overdue | Days | Missed | Severity | Contacts
101     | John Doe | 0801... | john@... | 50000  | 12500   | 35   | 5      | Severe   | 3
```

**Auto-downloads as:** `loan-defaulters-2025-10-23.csv`

---

## ⚡ Keyboard Shortcuts

None currently - all click/tap based

---

## 📱 Mobile View

**Optimizations:**
- Compact cards
- Icon-only buttons
- Touch targets (32px min)
- Scrollable content
- Bottom sheets for dialogs

---

## 🔄 Auto-Refresh

**Frequency:** Every 60 seconds  
**Purpose:** Keep data up-to-date  
**Indicator:** Silent background refresh

---

## 📊 How Overdue Is Calculated

```javascript
Days Overdue = Today - Next Payment Date

If Days Overdue > 0:
  Missed Payments = Math.ceil(Days / 7)
  Overdue Amount = Weekly Payment × Missed Payments
  
Severity:
  if days ≤ 7   → Mild
  if days ≤ 30  → Moderate  
  if days > 30  → Severe
```

---

## ✅ Admin Workflow

### Daily Routine:

```
1. Check Dashboard
   ↓
2. Review New Defaulters
   ↓
3. Prioritize Severe Cases
   ↓
4. Contact Customers
   ↓
5. Document Actions
   ↓
6. Mark Payments Received
   ↓
7. Suspend if Necessary
```

---

## 📞 Contact Strategy

| Stage | Timing | Message Type | Tone |
|-------|--------|--------------|------|
| 1st | Day 1-3 | Friendly reminder | Polite |
| 2nd | Day 7-10 | Formal notice | Firm |
| 3rd | Day 14-21 | Warning | Serious |
| 4th | Day 30+ | Suspension | Final |

---

## 🎯 Success Metrics

Track these:
- [ ] Default rate (%)
- [ ] Average recovery time (days)
- [ ] Contact success rate (%)
- [ ] Total overdue trend (₦)
- [ ] Suspension rate (%)

---

## ⚠️ Important Reminders

1. **Check daily** - Don't let mild cases become severe
2. **Document everything** - Add notes after each contact
3. **Be professional** - Maintain respectful communication
4. **Prioritize** - Severe cases need immediate attention
5. **Follow up** - Track customer promises to pay

---

## 🐛 Quick Troubleshooting

**Problem:** No defaulters showing  
**Fix:** Check if active loans exist, refresh page

**Problem:** Can't export  
**Fix:** Ensure defaulters exist, check browser settings

**Problem:** Contact not tracked  
**Fix:** Verify message sent, check admin permissions

---

## 📚 Full Documentation

For complete details, see:
- **Full Guide:** `/LOAN_DEFAULTERS_GUIDE.md`
- **Summary:** `/LOAN_DEFAULTERS_SUMMARY.md`

---

## 🎓 Quick Training

**Day 1:** Understand severity levels  
**Day 2:** Navigate the interface  
**Day 3:** Contact customers  
**Day 4:** Document properly  
**Day 5:** Export reports

---

## 🚀 Pro Tips

💡 **Tip 1:** Sort by severity - tackle red badges first  
💡 **Tip 2:** Use search for specific customers  
💡 **Tip 3:** Export weekly for management reports  
💡 **Tip 4:** Add detailed notes for context  
💡 **Tip 5:** Monitor trends over time

---

## ⚙️ System Requirements

**Access Level:**
- Super Admin: Full access
- Finance Admin: All except suspend
- Regular Admin: View only

**Browser:**
- Chrome, Firefox, Safari (latest)
- Mobile browsers supported

**Data:**
- Stored in localStorage
- Auto-syncs across tabs

---

## 📱 Mobile Quick View

```
┌──────────────────────┐
│ 🚨 Loan Defaulters  │
├──────────────────────┤
│                      │
│ ⚠️  Total: 12       │
│ 🟡 Mild: 4          │
│ 🟠 Moderate: 5      │
│ 🔴 Severe: 3        │
│ 💰 ₦125,000         │
│                      │
│ [🔍 Search...]      │
│ [📊 All] [📥]       │
│                      │
│ ┌──────────────────┐ │
│ │ 👤 John Doe      │ │
│ │ 🔴 35 days       │ │
│ │ ₦12,500          │ │
│ │ [👁️] [💬]       │ │
│ └──────────────────┘ │
│                      │
└──────────────────────┘
```

---

## 🎉 You're Ready!

**Remember:**
- Monitor daily ✅
- Contact promptly ✅
- Document thoroughly ✅
- Escalate wisely ✅
- Stay professional ✅

**Keep your loan portfolio healthy! 🚀🇳🇬**
