# 📅 Contributions Calendar System Guide

## Overview

The FNG app now features a comprehensive daily contributions tracking system with a calendar view, allowing customers to manage their savings goals, track daily contributions, view contribution history, and maintain streaks across multiple months.

---

## 🎯 Key Features

### 1. **Minimum Contribution: ₦500**
- All contributions must be at least ₦500
- Daily contribution target defaults to ₦500 but can be customized
- Quick select buttons: ₦500, ₦1,000, ₦2,000, ₦5,000

### 2. **Interactive Calendar View**
- Full monthly calendar showing all contributions
- Visual indicators for:
  - **Target Met** (Green with border): Days where total contributions ≥ daily target
  - **Contributed** (Blue): Days with contributions below target
  - **No Contribution**: Default calendar appearance
- Navigate between months using arrow buttons
- Select any date to view detailed contribution history

### 3. **Daily Contribution Target**
- Customizable daily savings goal (minimum ₦500)
- Monthly goal automatically calculated: `Daily Target × Days in Month`
- Settings dialog to update target amount
- Suggested amounts: ₦500, ₦1,000, ₦2,000

### 4. **Multi-Month Support**
- Contribute to any date (past, present, or future)
- Navigate through different months
- Contributions carry forward - balance is retained
- Monthly totals calculated independently
- Each month has its own progress tracking

### 5. **Streak Tracking**
- Automatic calculation of consecutive contribution days
- Streak counter displayed prominently
- Motivational reminder to maintain streak
- Streak continues across month boundaries

### 6. **Per-Day Contribution Details**
- Click any date on calendar to view:
  - All contributions made that day
  - Time of each contribution
  - Total amount for the day
  - Target achievement status
- Multiple contributions per day are supported

### 7. **Bulk Contribution Mode (NEW!)**
- Automatically distribute lump sum across multiple days
- Enter amount and system divides by daily target
- Visual preview shows which days will be marked
- Calendar displays purple indicators for bulk preview
- Confirmation dialog before processing
- Example: ₦5,000 ÷ ₦500/day = 10 consecutive days marked
- Handles remainders automatically

---

## 📱 User Interface Components

### Stats Overview
```
┌─────────────────────┬─────────────────────┐
│ Total Saved         │ Current Streak      │
│ ₦3,200.00          │ 14 days             │
└─────────────────────┴─────────────────────┘
```

### Daily Contribution Target Card
```
┌──────────────────────────────────────┐
│ Daily Contribution Target    [Change]│
│ Your daily savings goal              │
│ ┌──────────────────────────────────┐ │
│ │         ₦500.00                  │ │
│ │         per day                  │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Contribution Calendar
```
┌────────────────────────────────────────┐
│ Contribution Calendar                  │
│ [◀] October 2025 [▶]                   │
│                                        │
│ Legend:                                │
│ [🟢] Target Met  [🔵] Contributed     │
│                                        │
│   S  M  T  W  T  F  S                 │
│         1  2  3  4  5                 │
│   6 [7][8][9][10][11]12               │
│  [13][14]15 16 17 18 19               │
│                                        │
└────────────────────────────────────────┘
```

### Selected Date Details
```
┌────────────────────────────────────────┐
│ Monday, October 14, 2025  [Target Met] │
│                                        │
│ Total for this day                     │
│ ₦500.00                                │
│                                        │
│ Contributions:                         │
│ 09:30 AM               +₦500.00       │
└────────────────────────────────────────┘
```

### Make Contribution Form
```
┌────────────────────────────────────────┐
│ Make a Contribution      [Oct 14]      │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 📅 Bulk Contribution Mode    [OFF]│ │
│ │ Distribute lump sum across days   │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Amount (Min: ₦500)                     │
│ ₦ [500____________]                    │
│                                        │
│ Quick Select                           │
│ [₦500][₦1000][₦2000][₦5000]          │
│                                        │
│ [+ Contribute ₦500.00]                │
│                                        │
│ Contributing to 10/14/2025             │
└────────────────────────────────────────┘
```

### Bulk Contribution Preview (When Enabled)
```
┌────────────────────────────────────────┐
│ 📅 Bulk Contribution Preview           │
│                                        │
│ Amount:              ₦5,000.00        │
│ Daily Target:        ₦500.00          │
│ Days Covered:        10 days          │
│                                        │
│ Starting from: October 17, 2025        │
│ This will mark 10 consecutive days     │
│ on your calendar                       │
└────────────────────────────────────────┘
```

### Monthly Goal Progress
```
┌────────────────────────────────────────┐
│ Monthly Goal            [October 2025] │
│                                        │
│ ₦15,500.00 of ₦15,500.00        100%  │
│ ████████████████████████████████       │
│                                        │
│ 🎉 Congratulations! You've reached     │
│    your monthly goal!                  │
└────────────────────────────────────────┘
```

---

## 💾 Data Structure

### Contributions By Date
```typescript
interface DailyContribution {
  date: string;      // "YYYY-MM-DD"
  amount: number;
  time: string;      // "HH:MM AM/PM"
}

// Storage format
contributionsByDate: {
  "2025-10-14": [
    { date: "2025-10-14", amount: 500, time: "09:30 AM" },
    { date: "2025-10-14", amount: 200, time: "02:15 PM" }
  ],
  "2025-10-13": [
    { date: "2025-10-13", amount: 500, time: "08:45 AM" }
  ],
  // ... more dates
}
```

### LocalStorage Keys
- `contributionsByDate`: Object with date strings as keys and arrays of contributions
- `totalContributions`: Total amount contributed across all time
- `dailyContributionTarget`: User's daily savings goal
- `paymentMethods`: Available payment methods
- `userBalance`: Current account balance
- `transactions`: Transaction history

---

## 🔄 Workflow

### Making a Contribution

1. **Select Date** (default: today)
   - Click on calendar to choose a date
   - Can select past or future dates
   - Selected date shown on contribution form

2. **Enter Amount**
   - Type amount or use quick select buttons
   - Minimum: ₦500
   - Default: User's daily target

3. **Initiate Payment**
   - Click "Contribute" button
   - Payment dialog opens

4. **Complete Payment**
   - Select payment method
   - Confirm payment
   - Real-time balance updates

5. **Confirmation**
   - Contribution recorded for selected date
   - Calendar updates with visual indicator
   - Balance and stats update
   - Transaction added to history
   - Success notification displayed

### Changing Daily Target

1. Click **[Change]** button on Daily Contribution Target card
2. Settings dialog opens
3. Enter new target amount (min: ₦500)
4. Use suggested amounts or type custom value
5. Preview monthly goal calculation
6. Click **Save Changes**
7. Target updated, calendar recalculates achievement status

### Navigating Months

1. Use **[◀]** and **[▶]** buttons to navigate
2. Calendar shows selected month
3. Contributions from that month are displayed
4. Monthly goal progress updates for selected month
5. Can contribute to any visible month

### Using Bulk Contribution Mode

1. **Enable Bulk Mode**
   - Toggle "Bulk Contribution Mode" switch ON
   - Quick select buttons update to show week/month amounts
   - Calendar shows purple preview indicators

2. **Enter Lump Sum**
   - Enter total amount (e.g., ₦5,000)
   - System automatically calculates days: Amount ÷ Daily Target
   - Preview shows: "= 10 days × ₦500"

3. **Review Preview**
   - Purple indicators appear on calendar showing affected dates
   - Preview card displays:
     - Total amount
     - Daily target
     - Number of days covered
     - Remainder (if any)
     - Starting date

4. **Confirm & Pay**
   - Click "Contribute" button
   - Confirmation dialog shows detailed distribution
   - List of dates that will be marked
   - Proceed to payment

5. **Result**
   - Multiple days marked on calendar automatically
   - Single transaction for full amount
   - All consecutive days show contributions
   - Target achievement calculated per day

**Example:**
- Daily Target: ₦500
- Bulk Amount: ₦5,500
- Result: 11 days marked (10 × ₦500 + 1 × ₦500 remainder)
- Calendar shows Days 1-11 all marked green (target met)

### Viewing Contribution Details

1. Click any date on the calendar
2. Selected Date Details card shows:
   - Full date name
   - Total contributed that day
   - Target achievement badge (if applicable)
   - List of all contributions with times
3. Click another date to view its details

---

## 📊 Calculations

### Monthly Goal
```
Monthly Goal = Daily Target × Days in Current Month

Example:
Daily Target: ₦500
October 2025: 31 days
Monthly Goal: ₦500 × 31 = ₦15,500
```

### Monthly Progress
```
Progress % = (Current Month Total / Monthly Goal) × 100

Example:
Current Month Total: ₦10,500
Monthly Goal: ₦15,500
Progress: (10,500 / 15,500) × 100 = 67.74%
```

### Streak Calculation
```
1. Start from today's date
2. Check if contribution exists for that date
3. If yes, increment streak and check previous day
4. If no, return current streak count
5. Continue until gap found or beginning of history
```

### Target Achievement Per Day
```
For each date:
  Total = Sum of all contribution amounts for that date
  Target Met = Total >= Daily Contribution Target
  
Visual Indicator:
  - Green border + Green background: Target Met
  - Blue background: Contributed but target not met
  - Default: No contribution
```

---

## 🎨 Visual Indicators

### Calendar Day States

| State | Appearance | Condition |
|-------|------------|-----------|
| Target Met | Green background, green border, bold text | Total contributions ≥ daily target |
| Contributed | Blue background, bold text | Has contributions but < daily target |
| No Contribution | Default calendar style | No contributions recorded |
| Selected | Highlighted border | Currently selected date |
| Today | Outlined | Current date |

### Color Scheme

**Target Met:**
- Background: `bg-green-100`
- Text: `text-green-900`
- Border: `border-2 border-green-500`

**Contributed:**
- Background: `bg-blue-100`
- Text: `text-blue-900`

**Stats Cards:**
- Total Saved: Blue gradient with TrendingUp icon
- Current Streak: Orange flame icon
- Daily Target: Blue gradient banner

---

## 🔔 Notifications

### Success Messages
- "Successfully contributed ₦500.00"
- "Daily contribution target updated"

### Error Messages
- "Minimum contribution is ₦500"
- "Please enter a valid amount"
- "Please add a payment method first"
- "Minimum daily contribution is ₦500"

### Motivational Messages
- "🎉 Congratulations! You've reached your monthly goal!" (when monthly goal met)
- "You're on a 14-day streak! Make your daily contribution of ₦500.00 to keep it going." (streak reminder)

---

## 📱 Responsive Design

- Mobile-optimized layout
- Calendar adapts to screen width
- Touch-friendly date selection
- Bottom navigation clearance (pb-20)
- Scrollable content area
- Quick select buttons in responsive grid
- Compact month navigation controls

---

## 🚀 Advanced Features

### Multiple Contributions Per Day
- Users can make multiple contributions on the same day
- Each contribution is timestamped
- All contributions count toward daily target
- Details view shows complete contribution list

### Cross-Month Contributions
- Contribute to dates in different months
- Each month maintains independent totals
- Navigate between months seamlessly
- Historical data preserved indefinitely

### Future-Dated Contributions
- Can contribute to future dates
- Useful for planning ahead
- Target achievement calculated for future dates
- Helps with budgeting and goal planning

### Balance Retention
- Total contributions persist across app sessions
- Individual date contributions saved
- Monthly totals calculated dynamically
- No data loss when navigating months

### Bulk Contribution Mode
- **Automatic Distribution**: Enter lump sum, system divides by daily target
- **Visual Preview**: Purple indicators show which days will be marked
- **Smart Calculation**: Handles remainders automatically
- **Confirmation Dialog**: Review before processing
- **Consecutive Days**: Marks days in sequence starting from selected date
- **Single Transaction**: One payment for multiple days
- **Quick Select**: Preset amounts for weeks/months (1 week, 2 weeks, 1 month, 2 months)

**How It Works:**
```
Lump Sum: ₦5,000
Daily Target: ₦500
Calculation: ₦5,000 ÷ ₦500 = 10 days

Result:
- Days 1-10: ₦500 each (green - target met)
- Single transaction: ₦5,000
- Calendar: 10 consecutive days marked
```

**With Remainder:**
```
Lump Sum: ₦5,750
Daily Target: ₦500
Calculation: ₦5,750 ÷ ₦500 = 11 days + ₦250 remainder

Result:
- Days 1-11: ₦500 each (green - target met)
- Day 12: ₦250 (blue - partial)
- Total: 12 days marked
```

---

## 🔧 Technical Implementation

### State Management
```typescript
// Daily contribution target
const [dailyContributionTarget, setDailyContributionTarget] = useState(500);

// All contributions organized by date
const [contributionsByDate, setContributionsByDate] = useState<Record<string, DailyContribution[]>>({});

// Total across all time
const [totalContributions, setTotalContributions] = useState(0);

// Currently viewing month
const [currentMonth, setCurrentMonth] = useState(new Date());

// Selected date for contribution
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
```

### Data Persistence
```typescript
// Save on every change
useEffect(() => {
  localStorage.setItem("totalContributions", totalContributions.toString());
  localStorage.setItem("contributionsByDate", JSON.stringify(contributionsByDate));
  localStorage.setItem("dailyContributionTarget", dailyContributionTarget.toString());
}, [totalContributions, contributionsByDate, dailyContributionTarget]);
```

### Calendar Modifiers
```typescript
const modifiers = {
  contributed: (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return contributionsByDate[dateStr]?.length > 0;
  },
  targetMet: (date: Date) => {
    const total = getDateTotal(date);
    return total >= dailyContributionTarget;
  }
};
```

### Payment Integration
```typescript
const handlePaymentSuccess = (paidAmount: number) => {
  // Update total
  setTotalContributions(prev => prev + paidAmount);
  
  // Add to date-specific contributions
  const dateStr = selectedDate.toISOString().split('T')[0];
  setContributionsByDate(prev => ({
    ...prev,
    [dateStr]: [
      ...(prev[dateStr] || []),
      { date: dateStr, amount: paidAmount, time: currentTime }
    ]
  }));
  
  // Update global balance
  // Add to transaction history
  // Show success notification
};
```

---

## 📈 Usage Scenarios

### Scenario 1: Daily Saver
**Goal:** Save ₦500 every day

1. Set daily target to ₦500
2. Contribute ₦500 each day
3. Calendar shows green indicators for target met
4. Monthly goal: ₦15,500 (31 days)
5. Maintain streak for motivation

### Scenario 2: Variable Amounts
**Goal:** Flexible savings

1. Set daily target to ₦500
2. Some days contribute ₦500, others ₦1,000+
3. Blue indicators for days below target
4. Green indicators for days meeting/exceeding target
5. Total contributions still accumulate

### Scenario 3: Catching Up
**Goal:** Missed days recovery

1. Missed 3 days of contributions
2. Navigate to past dates
3. Make contributions for missed days
4. Calendar updates with indicators
5. Streak may be broken but balance increases

### Scenario 4: Planning Ahead
**Goal:** Pre-save for upcoming month

1. Navigate to next month
2. Make contributions for future dates
3. Plan budget in advance
4. Visual confirmation of commitment
5. Helps with financial planning

### Scenario 5: Custom Goals
**Goal:** Higher savings target

1. Change daily target to ₦2,000
2. Monthly goal updates: ₦62,000 (31 days)
3. Contribute higher amounts
4. Track progress against bigger goal
5. Achieve monthly target for satisfaction

---

## 🎯 Best Practices

### For Users

1. **Set Realistic Targets**
   - Start with minimum ₦500 if new to saving
   - Gradually increase as comfortable
   - Consider income and expenses

2. **Maintain Consistency**
   - Contribute daily for streak maintenance
   - Use quick select for convenience
   - Set reminders if needed

3. **Track Progress**
   - Review calendar regularly
   - Monitor monthly goal achievement
   - Celebrate milestones

4. **Plan Ahead**
   - Use future dating for budgeting
   - Catch up on missed days when possible
   - Review past months for patterns

### For Admins

1. **Monitor Activity**
   - Track total contributions across users
   - Identify high-performing savers
   - Support users with low activity

2. **Withdrawal Management**
   - Verify contribution history before approvals
   - Ensure sufficient balance
   - Process requests promptly

3. **Data Analysis**
   - Generate monthly reports
   - Analyze contribution patterns
   - Identify trends and opportunities

---

## 🔒 Data Integrity

### Validation Rules
- Minimum contribution: ₦500
- Amount must be positive number
- Date must be valid
- Payment method required
- Sufficient balance for withdrawals

### Consistency Checks
- Total contributions = Sum of all date totals
- Monthly total = Sum of that month's contributions
- Transaction history matches contributions
- Balance updates reflect all contributions

### Error Handling
- Invalid amounts rejected with clear messages
- Missing payment methods trigger prompts
- Network failures handled gracefully
- LocalStorage quota monitored

---

## 📊 Reporting & Analytics

### Available Metrics

**User Level:**
- Total contributions (all-time)
- Current month total
- Monthly goal progress
- Current streak length
- Average daily contribution
- Days with contributions
- Days meeting target

**Admin Level:**
- Total platform contributions
- Active savers count
- Average contribution amount
- Most active contributors
- Monthly growth trends
- Withdrawal vs. contribution ratio

---

## 🎉 Success Indicators

### User Engagement
- ✅ Daily streak maintained
- ✅ Monthly goals achieved
- ✅ Consistent contribution patterns
- ✅ Increasing contribution amounts
- ✅ Future planning with advanced contributions

### Financial Health
- ✅ Growing account balance
- ✅ Regular savings habit established
- ✅ Meeting personal financial goals
- ✅ Building emergency fund
- ✅ Qualifying for larger loans

---

## 🔮 Future Enhancements

### Planned Features
- **Goal Templates**: Pre-set targets for different savings goals
- **Achievement Badges**: Rewards for milestones (30-day streak, ₦10k saved, etc.)
- **Smart Reminders**: Personalized notifications for missed contributions
- **Contribution Analytics**: Graphs and charts of savings patterns
- **Export Reports**: Download contribution history as PDF/CSV
- **Automated Contributions**: Schedule recurring daily transfers
- **Social Features**: Share achievements, compare with friends
- **Savings Challenges**: Group or individual challenges with rewards

### Potential Integrations
- Bank account auto-debit for daily contributions
- SMS confirmations for each contribution
- Email monthly reports
- Push notifications for streak milestones
- Calendar sync with device calendar

---

## 📞 Support & Help

### Common Questions

**Q: What's the minimum contribution?**
A: ₦500 per contribution

**Q: Can I contribute multiple times per day?**
A: Yes! All contributions count toward your daily total.

**Q: Can I change my daily target?**
A: Yes, anytime via the Settings button on the Daily Contribution Target card.

**Q: What happens if I miss a day?**
A: Your balance remains, but your streak resets. You can still contribute to past dates.

**Q: Can I contribute to future dates?**
A: Yes, select any future date on the calendar.

**Q: How is my monthly goal calculated?**
A: Daily Target × Number of days in the month.

**Q: Do contributions carry to next month?**
A: Yes, your total balance persists. Only the monthly goal resets.

---

## 📝 Version History

**Version 3.7** - October 17, 2025
- ✨ **NEW**: Interactive calendar view with visual indicators
- ✨ **NEW**: Customizable daily contribution target (min ₦500)
- ✨ **NEW**: Multi-month navigation and support
- ✨ **NEW**: Per-day contribution details view
- ✨ **NEW**: Multiple contributions per day
- ✨ **NEW**: Future-dated contributions
- ✨ **NEW**: Enhanced streak tracking
- 🔄 **CHANGED**: Minimum contribution increased to ₦500
- 🔄 **CHANGED**: Quick select amounts: ₦500, ₦1k, ₦2k, ₦5k
- 🔄 **IMPROVED**: Monthly goal calculation based on days in month
- 🔄 **IMPROVED**: Better visual feedback for achievement status
- 🔄 **IMPROVED**: Enhanced data persistence and integrity

---

## 🏆 Benefits

### For Customers
- 📊 **Better Visibility**: See entire month at a glance
- 🎯 **Clear Goals**: Know exactly what to save daily
- 🔥 **Motivation**: Streaks and visual progress encourage consistency
- 📅 **Flexibility**: Contribute to any date, catch up when needed
- 💰 **Financial Growth**: Structured savings build wealth over time

### For FNG Platform
- 📈 **Increased Engagement**: Calendar gamification boosts daily usage
- 💵 **Higher Deposits**: Clear targets encourage regular contributions
- 👥 **User Retention**: Streak mechanics create habit formation
- 📊 **Better Analytics**: Date-specific data enables insights
- 🎁 **Loan Eligibility**: Regular savers qualify for better loan terms

---

**Status**: Production Ready 🚀  
**Version**: 3.7  
**Last Updated**: October 17, 2025
