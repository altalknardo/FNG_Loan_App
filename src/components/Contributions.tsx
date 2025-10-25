import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PaymentDialog } from "./PaymentDialog";
import { CalendarIcon, TrendingUp, Target, Flame, Settings, ChevronLeft, ChevronRight, Check, Plus, CalendarDays, ArrowDownToLine, AlertCircle, Building2, CreditCard } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../lib/utils";

interface PaymentMethod {
  id: number;
  type: "card" | "bank";
  name: string;
  last4: string;
  bankName?: string;
  cardBrand?: string;
  isDefault: boolean;
}

interface DailyContribution {
  date: string; // YYYY-MM-DD format
  amount: number;
  time: string;
}

interface ContributionsProps {
  userEmail: string;
}

export function Contributions({ userEmail }: ContributionsProps) {
  const [amount, setAmount] = useState("500");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkPreviewOpen, setBulkPreviewOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [selectedWithdrawalAccount, setSelectedWithdrawalAccount] = useState("");

  // Load saved data from localStorage
  const [dailyContributionTarget, setDailyContributionTarget] = useState(() => {
    const saved = localStorage.getItem("dailyContributionTarget");
    return saved ? parseFloat(saved) : 500;
  });

  const [tempDailyTarget, setTempDailyTarget] = useState(dailyContributionTarget.toString());

  const [totalContributions, setTotalContributions] = useState(() => {
    const saved = localStorage.getItem("totalContributions");
    return saved ? parseFloat(saved) : 3200;
  });

  const [contributionsByDate, setContributionsByDate] = useState<Record<string, DailyContribution[]>>(() => {
    const saved = localStorage.getItem("contributionsByDate");
    return saved ? JSON.parse(saved) : {
      "2025-10-14": [{ date: "2025-10-14", amount: 500, time: "09:30 AM" }],
      "2025-10-13": [{ date: "2025-10-13", amount: 500, time: "08:45 AM" }],
      "2025-10-12": [{ date: "2025-10-12", amount: 500, time: "10:15 AM" }],
      "2025-10-11": [{ date: "2025-10-11", amount: 750, time: "11:20 AM" }],
      "2025-10-10": [{ date: "2025-10-10", amount: 500, time: "09:00 AM" }],
      "2025-10-09": [{ date: "2025-10-09", amount: 500, time: "08:30 AM" }],
      "2025-10-08": [{ date: "2025-10-08", amount: 500, time: "09:45 AM" }],
    };
  });

  // Load payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem("paymentMethods");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: "bank",
        name: "Savings Account",
        last4: "4532",
        bankName: "First Bank",
        isDefault: true,
      },
    ];
  });

  // Calculate current streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (contributionsByDate[dateStr] && contributionsByDate[dateStr].length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Calculate monthly totals
  const getMonthlyTotal = (month: Date) => {
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    let total = 0;
    
    Object.entries(contributionsByDate).forEach(([dateStr, contributions]) => {
      const date = new Date(dateStr);
      if (date.getFullYear() === year && date.getMonth() === monthNum) {
        contributions.forEach(c => total += c.amount);
      }
    });
    
    return total;
  };

  const currentMonthTotal = getMonthlyTotal(currentMonth);
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const monthlyGoal = dailyContributionTarget * daysInMonth;
  const monthProgress = (currentMonthTotal / monthlyGoal) * 100;

  // Calculate bulk contribution details
  const getBulkDetails = () => {
    const contributionAmount = parseFloat(amount) || 0;
    const numberOfDays = Math.floor(contributionAmount / dailyContributionTarget);
    const remainder = contributionAmount % dailyContributionTarget;
    return { numberOfDays, remainder, contributionAmount };
  };

  const { numberOfDays, remainder } = getBulkDetails();

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("totalContributions", totalContributions.toString());
    localStorage.setItem("contributionsByDate", JSON.stringify(contributionsByDate));
    localStorage.setItem("dailyContributionTarget", dailyContributionTarget.toString());
  }, [totalContributions, contributionsByDate, dailyContributionTarget]);

  const quickAmounts = [500, 1000, 2000, 5000];
  const bulkQuickAmounts = [
    dailyContributionTarget * 7,  // 1 week
    dailyContributionTarget * 14, // 2 weeks
    dailyContributionTarget * 30, // 1 month
    dailyContributionTarget * 60, // 2 months
  ];

  const handleContribute = () => {
    const contributionAmount = parseFloat(amount);
    if (contributionAmount < 500) {
      toast.error("Minimum contribution is ₦500");
      return;
    }
    if (contributionAmount > 0) {
      if (paymentMethods.length === 0) {
        toast.error("Please add a payment method first");
        return;
      }

      // If bulk mode and amount covers multiple days, show preview
      if (bulkMode && numberOfDays > 1) {
        setBulkPreviewOpen(true);
      } else {
        setPaymentDialogOpen(true);
      }
    } else {
      toast.error("Please enter a valid amount");
    }
  };

  const handleBulkContribute = () => {
    setBulkPreviewOpen(false);
    setPaymentDialogOpen(true);
  };

  // Function to check and process monthly service charge
  const processMonthlyServiceCharge = () => {
    const userEmail = localStorage.getItem("userEmail") || "user@example.com";
    const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
    const firstContributionDate = localStorage.getItem(`firstContributionDate_${userEmail}`);
    const lastServiceChargeDate = localStorage.getItem(`lastServiceChargeDate_${userEmail}`);
    
    // Set first contribution date if not set
    if (!firstContributionDate) {
      localStorage.setItem(`firstContributionDate_${userEmail}`, new Date().toISOString());
      return; // Don't charge on first contribution
    }
    
    const now = new Date();
    const lastChargeDate = lastServiceChargeDate ? new Date(lastServiceChargeDate) : new Date(firstContributionDate);
    
    // Calculate months since last charge
    const monthsSinceLastCharge = 
      (now.getFullYear() - lastChargeDate.getFullYear()) * 12 +
      (now.getMonth() - lastChargeDate.getMonth());
    
    // Check if at least one month has passed
    if (monthsSinceLastCharge >= 1) {
      const serviceChargeAmount = dailyContributionTarget;
      
      // Check if user has sufficient balance
      if (contributionBalance >= serviceChargeAmount) {
        // Deduct from contribution balance
        const newBalance = contributionBalance - serviceChargeAmount;
        localStorage.setItem("contributionBalance", newBalance.toString());
        
        // Add to company balance
        const currentCompanyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
        const newCompanyBalance = currentCompanyBalance + serviceChargeAmount;
        localStorage.setItem("companyBalance", newCompanyBalance.toString());
        
        // Update last service charge date
        localStorage.setItem(`lastServiceChargeDate_${userEmail}`, now.toISOString());
        
        // Add to transaction history
        const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
        transactions.unshift({
          id: Date.now() + 1,
          type: "service_charge",
          amount: serviceChargeAmount,
          date: now.toISOString().split('T')[0],
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: "Monthly Service Charge",
          status: "completed"
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        
        toast.info(`Monthly service charge of ${formatCurrency(serviceChargeAmount)} deducted from your savings balance`);
      } else {
        // Insufficient balance - skip this month
        console.log("Insufficient balance for service charge, skipping this month");
      }
    }
  };

  const handlePaymentSuccess = (paidAmount: number, paymentMethod: PaymentMethod) => {
    // Update total contributions
    setTotalContributions(prev => prev + paidAmount);
    
    // Update contribution balance
    const currentContributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
    const newContributionBalance = currentContributionBalance + paidAmount;
    localStorage.setItem("contributionBalance", newContributionBalance.toString());

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Check and process monthly service charge for active contributors
    processMonthlyServiceCharge();

    if (bulkMode && numberOfDays > 1) {
      // Bulk mode: distribute across multiple days
      const startDate = selectedDate ? new Date(selectedDate) : new Date();
      const updates: Record<string, DailyContribution[]> = {};
      
      // Add contributions for each day
      for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        if (!updates[dateStr]) {
          updates[dateStr] = contributionsByDate[dateStr] ? [...contributionsByDate[dateStr]] : [];
        }
        
        updates[dateStr].push({
          date: dateStr,
          amount: dailyContributionTarget,
          time: time
        });
      }

      // Handle remainder if any
      if (remainder > 0) {
        const finalDate = new Date(startDate);
        finalDate.setDate(finalDate.getDate() + numberOfDays);
        const finalDateStr = finalDate.toISOString().split('T')[0];
        
        if (!updates[finalDateStr]) {
          updates[finalDateStr] = contributionsByDate[finalDateStr] ? [...contributionsByDate[finalDateStr]] : [];
        }
        
        updates[finalDateStr].push({
          date: finalDateStr,
          amount: remainder,
          time: time
        });
      }

      // Update state with all new contributions
      setContributionsByDate(prev => ({
        ...prev,
        ...updates
      }));

      // Add single transaction for the bulk payment
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      transactions.unshift({
        id: Date.now(),
        type: "contribution",
        amount: paidAmount,
        date: startDate.toISOString().split('T')[0],
        time: time,
        description: `Bulk Contribution (${numberOfDays}${remainder > 0 ? '+' : ''} days)`,
        status: "completed"
      });
      localStorage.setItem("transactions", JSON.stringify(transactions));

      toast.success(`Successfully distributed ${formatCurrency(paidAmount)} across ${numberOfDays}${remainder > 0 ? '+' : ''} days!`);
    } else {
      // Single day contribution
      const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      setContributionsByDate(prev => {
        const updated = { ...prev };
        if (!updated[dateStr]) {
          updated[dateStr] = [];
        }
        updated[dateStr].push({
          date: dateStr,
          amount: paidAmount,
          time: time
        });
        return updated;
      });

      // Add to transaction history
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      transactions.unshift({
        id: Date.now(),
        type: "contribution",
        amount: paidAmount,
        date: dateStr,
        time: time,
        description: "Daily Contribution",
        status: "completed"
      });
      localStorage.setItem("transactions", JSON.stringify(transactions));

      toast.success(`Successfully contributed ${formatCurrency(paidAmount)}`);
    }

    // Trigger balance update event
    window.dispatchEvent(new Event("balanceUpdated"));
    
    // Reset amount to daily target
    setAmount(dailyContributionTarget.toString());
  };

  const handleSaveSettings = () => {
    const newTarget = parseFloat(tempDailyTarget);
    if (newTarget < 500) {
      toast.error("Minimum daily contribution is ₦500");
      return;
    }
    setDailyContributionTarget(newTarget);
    setAmount(newTarget.toString());
    setSettingsOpen(false);
    toast.success("Daily contribution target updated");
  };

  const handleWithdrawalRequest = () => {
    const withdrawAmount = parseFloat(withdrawalAmount);
    const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");

    // Validation
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > contributionBalance) {
      toast.error(`Insufficient balance. Available: ${formatCurrency(contributionBalance)}`);
      return;
    }

    if (!selectedWithdrawalAccount) {
      toast.error("Please select a withdrawal account");
      return;
    }

    if (!withdrawalReason.trim()) {
      toast.error("Please provide a reason for withdrawal");
      return;
    }

    // Get selected payment method details
    const selectedMethod = paymentMethods.find(
      pm => `${pm.id}-${pm.type}` === selectedWithdrawalAccount
    );

    if (!selectedMethod) {
      toast.error("Selected payment method not found");
      return;
    }

    // Create withdrawal request
    const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");
    const userEmail = localStorage.getItem("userEmail") || "user@example.com";
    
    const newRequest = {
      id: Date.now(),
      userId: userEmail,
      userName: userEmail.split("@")[0],
      amount: withdrawAmount,
      accountDetails: selectedMethod.type === "bank" 
        ? `${selectedMethod.bankName} - ****${selectedMethod.last4}`
        : `${selectedMethod.cardBrand} - ****${selectedMethod.last4}`,
      requestDate: new Date().toISOString().split('T')[0],
      requestTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: "pending",
      availableBalance: contributionBalance,
      reason: withdrawalReason,
      paymentMethod: {
        type: selectedMethod.type,
        name: selectedMethod.name,
        last4: selectedMethod.last4,
        bankName: selectedMethod.bankName,
        cardBrand: selectedMethod.cardBrand,
      }
    };

    withdrawalRequests.unshift(newRequest);
    localStorage.setItem("withdrawalRequests", JSON.stringify(withdrawalRequests));

    // Add to transaction history
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.unshift({
      id: Date.now(),
      type: "withdrawal_request",
      amount: withdrawAmount,
      date: newRequest.requestDate,
      time: newRequest.requestTime,
      description: `Withdrawal Request - ${withdrawalReason.substring(0, 30)}${withdrawalReason.length > 30 ? '...' : ''}`,
      status: "pending"
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    toast.success("Withdrawal request submitted successfully!");
    
    // Reset form
    setWithdrawalAmount("");
    setWithdrawalReason("");
    setSelectedWithdrawalAccount("");
    setWithdrawalDialogOpen(false);
  };

  // Get contribution total for a specific date
  const getDateTotal = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    if (!contributionsByDate[dateStr]) return 0;
    return contributionsByDate[dateStr].reduce((sum, c) => sum + c.amount, 0);
  };

  // Get contributions for selected date
  const selectedDateContributions = selectedDate 
    ? contributionsByDate[selectedDate.toISOString().split('T')[0]] || []
    : [];

  const selectedDateTotal = selectedDateContributions.reduce((sum, c) => sum + c.amount, 0);

  // Get dates that will be covered by bulk contribution
  const getBulkDates = () => {
    if (!selectedDate || !bulkMode) return [];
    const startDate = new Date(selectedDate);
    const dates = [];
    
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    
    if (remainder > 0) {
      const finalDate = new Date(startDate);
      finalDate.setDate(finalDate.getDate() + numberOfDays);
      dates.push(finalDate);
    }
    
    return dates;
  };

  const bulkDates = getBulkDates();

  // Custom day renderer for calendar
  const modifiers = {
    contributed: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return contributionsByDate[dateStr] && contributionsByDate[dateStr].length > 0;
    },
    targetMet: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const total = getDateTotal(date);
      return total >= dailyContributionTarget;
    },
    bulkPreview: (date: Date) => {
      if (!bulkMode) return false;
      return bulkDates.some(d => d.toISOString().split('T')[0] === date.toISOString().split('T')[0]);
    }
  };

  const modifiersClassNames = {
    contributed: "bg-blue-100 text-blue-900 font-semibold",
    targetMet: "bg-green-100 text-green-900 font-semibold border-2 border-green-500",
    bulkPreview: "bg-purple-100 text-purple-900 font-semibold border-2 border-purple-500"
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get contribution balance
  const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");

  return (
    <div className="space-y-6 pb-20">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <p className="text-sm">Total Saved</p>
            </div>
            <p className="text-2xl">{formatCurrency(totalContributions)}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <Flame className="h-4 w-4 text-orange-500" />
              <p className="text-sm">Current Streak</p>
            </div>
            <p className="text-2xl">{currentStreak} days</p>
          </div>
        </Card>
      </div>

      {/* Withdrawal Button - Prominent */}
      {contributionBalance > 0 && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-900">Available Balance</h3>
                <p className="text-3xl text-green-700 mt-1">{formatCurrency(contributionBalance)}</p>
              </div>
              <ArrowDownToLine className="h-8 w-8 text-green-600" />
            </div>
            <Button 
              onClick={() => setWithdrawalDialogOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Request Withdrawal
            </Button>
            <p className="text-xs text-center text-green-700">
              Withdraw your savings anytime. Subject to admin approval.
            </p>
          </div>
        </Card>
      )}

      {/* Daily Target Setting */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Daily Contribution Target
            </h3>
            <p className="text-sm text-gray-600 mt-1">Your daily savings goal</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Change
          </Button>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <p className="text-3xl text-center text-blue-900">{formatCurrency(dailyContributionTarget)}</p>
          <p className="text-sm text-center text-blue-700 mt-1">per day</p>
        </div>
      </Card>

      {/* Make Contribution */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>Make a Contribution</h3>
            {selectedDate && (
              <Badge variant="outline">
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            )}
          </div>

          {/* Bulk Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-600" />
              <div>
                <Label htmlFor="bulk-mode" className="text-sm font-medium cursor-pointer">Bulk Contribution Mode</Label>
                <p className="text-xs text-gray-500">Distribute lump sum across multiple days</p>
              </div>
            </div>
            <Switch
              id="bulk-mode"
              checked={bulkMode}
              onCheckedChange={setBulkMode}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Min: ₦500)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="500"
                min="500"
                step="100"
              />
            </div>
            {bulkMode && numberOfDays > 0 && (
              <p className="text-xs text-purple-600">
                = {numberOfDays} days × {formatCurrency(dailyContributionTarget)}
                {remainder > 0 && ` + ${formatCurrency(remainder)}`}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {(bulkMode ? bulkQuickAmounts : quickAmounts).map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount.toString() ? "default" : "outline"}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="h-12 flex flex-col items-center justify-center p-1"
                >
                  <span className="text-xs">₦{quickAmount >= 1000 ? `${(quickAmount / 1000).toFixed(0)}k` : quickAmount}</span>
                  {bulkMode && (
                    <span className="text-[10px] text-gray-500">
                      {Math.floor(quickAmount / dailyContributionTarget)}d
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleContribute} 
            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {bulkMode && numberOfDays > 1 
              ? `Contribute ${formatCurrency(parseFloat(amount) || 0)} (${numberOfDays}${remainder > 0 ? '+' : ''} days)`
              : `Contribute ${formatCurrency(parseFloat(amount) || 0)}`
            }
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            {bulkMode && numberOfDays > 1
              ? `Starting from ${selectedDate?.toLocaleDateString()}`
              : `Contributing to ${selectedDate ? selectedDate.toLocaleDateString() : 'today'}`
            }
          </p>
        </div>
      </Card>

      {/* Monthly Calendar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>Contribution Calendar</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[140px] text-center">{monthName}</span>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span className="text-gray-600">Target Met</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-gray-600">Contributed</span>
            </div>
            {bulkMode && numberOfDays > 1 && (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded"></div>
                <span className="text-gray-600">Bulk Preview</span>
              </div>
            )}
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border"
          />
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && !bulkMode && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              {selectedDateTotal >= dailyContributionTarget && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Target Met
                </Badge>
              )}
            </div>

            {selectedDateContributions.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600">Total for this day</p>
                  <p className="text-2xl text-green-900">{formatCurrency(selectedDateTotal)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Contributions:</p>
                  {selectedDateContributions.map((contribution, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-gray-600">{contribution.time}</span>
                      <span className="text-green-600">+{formatCurrency(contribution.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No contributions on this day</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Bulk Mode Preview */}
      {bulkMode && numberOfDays > 1 && (
        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-600" />
              <h3 className="text-purple-900">Bulk Contribution Preview</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Amount:</span>
                <span className="font-semibold text-purple-900">{formatCurrency(parseFloat(amount) || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Daily Target:</span>
                <span className="font-semibold text-purple-900">{formatCurrency(dailyContributionTarget)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Days Covered:</span>
                <span className="font-semibold text-purple-900">{numberOfDays} days</span>
              </div>
              {remainder > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Remainder:</span>
                  <span className="font-semibold text-purple-900">{formatCurrency(remainder)} (Day {numberOfDays + 1})</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <p className="text-sm text-gray-700 mb-2">Starting from: <span className="font-medium">{selectedDate?.toLocaleDateString()}</span></p>
              <p className="text-sm text-gray-700">
                This will mark <span className="font-semibold text-purple-900">{numberOfDays}{remainder > 0 ? '+' : ''} consecutive days</span> on your calendar
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        amount={parseFloat(amount)}
        onPaymentSuccess={handlePaymentSuccess}
        paymentMethods={paymentMethods}
        onAddPaymentMethod={undefined}
      />

      {/* Bulk Confirmation Dialog */}
      <Dialog open={bulkPreviewOpen} onOpenChange={setBulkPreviewOpen}>
        <DialogContent className="p-4 gap-3">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Confirm Bulk Contribution</DialogTitle>
            <DialogDescription className="text-xs">
              Review your bulk contribution details before proceeding
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-180px)] overflow-y-auto">
            <div className="space-y-3 pr-3">
              <div className="bg-purple-50 rounded-lg p-2.5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="font-semibold text-purple-900">{formatCurrency(parseFloat(amount) || 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">Daily Target:</span>
                  <span className="font-semibold">{formatCurrency(dailyContributionTarget)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">Days Covered:</span>
                  <span className="font-semibold text-purple-900">{numberOfDays} full days</span>
                </div>
                {remainder > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Plus Remainder:</span>
                    <span className="font-semibold text-purple-900">{formatCurrency(remainder)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-2">
                <p className="text-xs text-gray-600 mb-1">Starting Date:</p>
                <p className="text-sm font-medium">{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <div className="border-t pt-2">
                <p className="text-xs text-gray-600 mb-1.5">Distribution:</p>
                <ul className="space-y-1 text-xs">
                  {bulkDates.slice(0, 5).map((date, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="text-green-600 font-medium">
                        +{formatCurrency(index < numberOfDays ? dailyContributionTarget : remainder)}
                      </span>
                    </li>
                  ))}
                  {bulkDates.length > 5 && (
                    <li className="text-gray-500 italic text-[11px]">
                      ... and {bulkDates.length - 5} more days
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => setBulkPreviewOpen(false)} className="flex-1 h-9 text-sm">
              Cancel
            </Button>
            <Button onClick={handleBulkContribute} className="flex-1 h-9 text-sm">
              Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="p-4 gap-3">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Daily Contribution Settings</DialogTitle>
            <DialogDescription className="text-xs">
              Set your daily contribution target. Minimum is ₦500.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="dailyTarget" className="text-sm">Daily Target Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                <Input
                  id="dailyTarget"
                  type="number"
                  value={tempDailyTarget}
                  onChange={(e) => setTempDailyTarget(e.target.value)}
                  className="pl-8 h-9"
                  placeholder="500"
                  min="500"
                  step="100"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Monthly goal: {formatCurrency(parseFloat(tempDailyTarget) * daysInMonth)} ({daysInMonth} days)
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Suggested Amounts</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[500, 1000, 2000].map((suggested) => (
                  <Button
                    key={suggested}
                    variant={tempDailyTarget === suggested.toString() ? "default" : "outline"}
                    onClick={() => setTempDailyTarget(suggested.toString())}
                    className="h-8 text-sm"
                    size="sm"
                  >
                    ₦{suggested}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setSettingsOpen(false)} className="flex-1 h-9 text-sm">
                Cancel
              </Button>
              <Button onClick={handleSaveSettings} className="flex-1 h-9 text-sm">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Monthly Goal Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h3>Monthly Goal</h3>
            </div>
            <Badge>{monthName}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {formatCurrency(currentMonthTotal)} of {formatCurrency(monthlyGoal)}
              </span>
              <span>{monthProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(monthProgress, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {currentMonthTotal >= monthlyGoal 
              ? "🎉 Congratulations! You've reached your monthly goal!" 
              : `${formatCurrency(monthlyGoal - currentMonthTotal)} remaining to reach your goal`}
          </p>
        </div>
      </Card>

      {/* Daily Reminder */}
      {currentStreak > 0 && (
        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="flex gap-3">
            <Flame className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-orange-900">Keep Your Streak!</h4>
              <p className="text-sm text-orange-700">
                You're on a {currentStreak}-day streak! Make your daily contribution of {formatCurrency(dailyContributionTarget)} to keep it going.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Withdrawal Request Dialog */}
      <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Request Withdrawal</DialogTitle>
            <DialogDescription className="text-xs">
              Submit a request to withdraw from your contribution balance
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] overflow-y-auto px-1">
            <div className="space-y-3 pr-3">
              {/* Available Balance Display */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-gray-600">Available Balance</p>
                <p className="text-2xl text-green-700">{formatCurrency(contributionBalance)}</p>
              </div>

              {/* Warning Alert */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 flex gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-orange-800">
                  <p className="font-medium">Important:</p>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[11px]">
                    <li>Requires admin approval</li>
                    <li>Takes 1-2 business days</li>
                    <li>Sent to selected account</li>
                  </ul>
                </div>
              </div>

              {/* Withdrawal Amount & Quick Select */}
              <div className="space-y-1.5">
                <Label htmlFor="withdrawal-amount" className="text-sm">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="pl-8 h-9"
                    placeholder="0"
                    min="500"
                    max={contributionBalance}
                    step="100"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                  {[
                    Math.min(5000, contributionBalance),
                    Math.min(10000, contributionBalance),
                    contributionBalance
                  ].filter(amt => amt > 0).map((quickAmt, index) => (
                    <Button
                      key={index}
                      variant={withdrawalAmount === quickAmt.toString() ? "default" : "outline"}
                      onClick={() => setWithdrawalAmount(quickAmt.toString())}
                      className="text-xs h-7"
                      size="sm"
                      disabled={quickAmt <= 0}
                    >
                      {index === 2 ? "All" : `₦${quickAmt >= 1000 ? `${(quickAmt / 1000).toFixed(0)}k` : quickAmt}`}
                    </Button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500">
                  Max: {formatCurrency(contributionBalance)}
                </p>
              </div>

              {/* Withdrawal Account */}
              <div className="space-y-1.5">
                <Label htmlFor="withdrawal-account" className="text-sm">Withdrawal Account</Label>
                <Select value={selectedWithdrawalAccount} onValueChange={setSelectedWithdrawalAccount}>
                  <SelectTrigger id="withdrawal-account" className="h-9">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={`${method.id}-${method.type}`} value={`${method.id}-${method.type}`}>
                        <div className="flex items-center gap-2">
                          {method.type === "bank" ? (
                            <Building2 className="h-3 w-3" />
                          ) : (
                            <CreditCard className="h-3 w-3" />
                          )}
                          <span className="text-xs">
                            {method.type === "bank" ? method.bankName : method.cardBrand} •••• {method.last4}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {paymentMethods.length === 0 && (
                  <p className="text-[11px] text-red-600">
                    Please add a payment method first
                  </p>
                )}
              </div>

              {/* Withdrawal Reason */}
              <div className="space-y-1.5">
                <Label htmlFor="withdrawal-reason" className="text-sm">Reason</Label>
                <textarea
                  id="withdrawal-reason"
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full min-h-[60px] px-2.5 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide a reason..."
                  maxLength={200}
                />
                <p className="text-[11px] text-gray-500">
                  {withdrawalReason.length}/200
                </p>
              </div>

              {/* Summary */}
              {parseFloat(withdrawalAmount) > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                  <p className="text-xs font-medium text-blue-900 mb-1.5">Summary</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Withdrawal:</span>
                      <span className="font-medium text-blue-900">{formatCurrency(parseFloat(withdrawalAmount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-medium text-blue-900">
                        {formatCurrency(contributionBalance - parseFloat(withdrawalAmount))}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </ScrollArea>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setWithdrawalDialogOpen(false);
                setWithdrawalAmount("");
                setWithdrawalReason("");
                setSelectedWithdrawalAccount("");
              }}
              className="flex-1 h-9 text-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleWithdrawalRequest} 
              className="flex-1 h-9 text-sm bg-green-600 hover:bg-green-700"
              disabled={!withdrawalAmount || !selectedWithdrawalAccount || !withdrawalReason.trim()}
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        amount={parseFloat(amount) || 0}
        onPaymentSuccess={handlePaymentSuccess}
        paymentMethods={paymentMethods}
        paymentType="contribution"
        userEmail={userEmail}
      />
    </div>
  );
}
