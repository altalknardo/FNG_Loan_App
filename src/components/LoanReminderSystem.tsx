import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Bell, Calendar, Clock, AlertTriangle, X } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { toast } from "sonner@2.0.3";

interface Loan {
  id: number;
  amount: number;
  repaid: number;
  weeklyPayment: number;
  nextPayment: string;
  status: string;
  period: number;
  startDate: string;
  loanType?: string;
}

interface LoanReminderSystemProps {
  onNavigate?: (tab: string) => void;
}

export function LoanReminderSystem({ onNavigate }: LoanReminderSystemProps) {
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([]);

  useEffect(() => {
    // Load active loans
    const saved = localStorage.getItem("activeLoans");
    if (saved) {
      const loans = JSON.parse(saved);
      setActiveLoans(loans);
      checkOverduePayments(loans);
    }

    // Check for reminders every minute
    const interval = setInterval(() => {
      checkReminders();
    }, 60000);

    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, []);

  const checkReminders = () => {
    const saved = localStorage.getItem("activeLoans");
    if (!saved) return;

    const loans: Loan[] = JSON.parse(saved);
    const today = new Date();
    
    loans.forEach((loan) => {
      if (dismissedReminders.includes(loan.id)) return;

      const nextPaymentDate = new Date(loan.nextPayment);
      const daysUntilPayment = Math.ceil(
        (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send reminder 3 days before
      if (daysUntilPayment === 3) {
        sendPaymentReminder(loan, "3 days");
      }
      // Send reminder 1 day before
      else if (daysUntilPayment === 1) {
        sendPaymentReminder(loan, "tomorrow");
      }
      // Send reminder on payment day
      else if (daysUntilPayment === 0) {
        sendPaymentReminder(loan, "today");
      }
    });
  };

  const checkOverduePayments = (loans: Loan[]) => {
    const today = new Date();
    const overdue = loans.filter((loan) => {
      const nextPaymentDate = new Date(loan.nextPayment);
      return nextPaymentDate < today && loan.status === "active";
    });

    if (overdue.length > 0) {
      setOverdueLoans(overdue);
      // Auto-deduct from contributions for overdue payments
      overdue.forEach((loan) => {
        handleAutoDeduction(loan);
      });
    }
  };

  const handleAutoDeduction = (loan: Loan) => {
    // Check if auto-deduction has already been done for this payment
    const deductionLog = JSON.parse(localStorage.getItem("autoDeductions") || "[]");
    const alreadyDeducted = deductionLog.some(
      (log: any) => log.loanId === loan.id && log.paymentDate === loan.nextPayment
    );

    if (alreadyDeducted) return;

    // Get contribution balance
    const contributionBalance = parseFloat(localStorage.getItem("totalContributions") || "0");
    
    if (contributionBalance >= loan.weeklyPayment) {
      // Deduct from contributions
      const newBalance = contributionBalance - loan.weeklyPayment;
      localStorage.setItem("totalContributions", newBalance.toString());

      // Update loan
      const updatedLoans = activeLoans.map((l) => {
        if (l.id === loan.id) {
          const newRepaid = l.repaid + loan.weeklyPayment;
          const nextDate = new Date(l.nextPayment);
          nextDate.setDate(nextDate.getDate() + 7);
          return {
            ...l,
            repaid: newRepaid,
            nextPayment: nextDate.toISOString().split('T')[0]
          };
        }
        return l;
      });

      localStorage.setItem("activeLoans", JSON.stringify(updatedLoans));
      setActiveLoans(updatedLoans);

      // Log the deduction
      deductionLog.push({
        loanId: loan.id,
        paymentDate: loan.nextPayment,
        amount: loan.weeklyPayment,
        timestamp: new Date().toISOString(),
        type: "auto_deduction"
      });
      localStorage.setItem("autoDeductions", JSON.stringify(deductionLog));

      // Add to transaction history
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      transactions.unshift({
        id: Date.now(),
        type: "loan_payment",
        amount: loan.weeklyPayment,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        description: `Auto-deduction from contributions for Loan #${loan.id}`,
        status: "completed"
      });
      localStorage.setItem("transactions", JSON.stringify(transactions));

      toast.info(`Auto-deducted ${formatCurrency(loan.weeklyPayment)} from your contributions for overdue Loan #${loan.id}`);
    } else {
      toast.error(`Insufficient contribution balance to cover overdue payment for Loan #${loan.id}. Please make a payment immediately.`);
    }
  };

  const sendPaymentReminder = (loan: Loan, timing: string) => {
    // Store reminder in localStorage
    const reminders = JSON.parse(localStorage.getItem("paymentReminders") || "[]");
    const reminderExists = reminders.some(
      (r: any) => r.loanId === loan.id && r.paymentDate === loan.nextPayment && r.timing === timing
    );

    if (!reminderExists) {
      const reminder = {
        id: Date.now(),
        loanId: loan.id,
        amount: loan.weeklyPayment,
        paymentDate: loan.nextPayment,
        timing,
        timestamp: new Date().toISOString(),
        message: `Loan payment of ${formatCurrency(loan.weeklyPayment)} is due ${timing}`
      };

      reminders.push(reminder);
      localStorage.setItem("paymentReminders", JSON.stringify(reminders));

      // Show toast notification
      if (timing === "today") {
        toast.warning(reminder.message, {
          duration: 10000,
          action: {
            label: "Pay Now",
            onClick: () => onNavigate?.("loans")
          }
        });
      } else {
        toast.info(reminder.message, {
          duration: 5000
        });
      }
    }
  };

  const dismissReminder = (loanId: number) => {
    setDismissedReminders([...dismissedReminders, loanId]);
  };

  const upcomingPayments = activeLoans.filter((loan) => {
    if (dismissedReminders.includes(loan.id)) return false;
    const nextPaymentDate = new Date(loan.nextPayment);
    const today = new Date();
    const daysUntilPayment = Math.ceil(
      (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilPayment >= 0 && daysUntilPayment <= 7;
  });

  if (upcomingPayments.length === 0 && overdueLoans.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Overdue Payments Alert */}
      {overdueLoans.length > 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <p className="font-medium">You have {overdueLoans.length} overdue payment(s)</p>
              <p className="text-sm">
                Overdue payments have been automatically deducted from your contributions balance.
                If insufficient funds, please make a payment immediately to avoid account suspension.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Upcoming Payment Reminders */}
      {upcomingPayments.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <h3>Upcoming Loan Payments</h3>
            </div>

            {upcomingPayments.map((loan) => {
              const nextPaymentDate = new Date(loan.nextPayment);
              const today = new Date();
              const daysUntilPayment = Math.ceil(
                (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={loan.id}
                  className="flex items-start justify-between gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Loan #{loan.id}</p>
                      {daysUntilPayment === 0 && (
                        <Badge className="bg-orange-500 text-white">Due Today</Badge>
                      )}
                      {daysUntilPayment === 1 && (
                        <Badge className="bg-yellow-500 text-white">Due Tomorrow</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{loan.nextPayment}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {daysUntilPayment === 0
                            ? "Today"
                            : daysUntilPayment === 1
                            ? "Tomorrow"
                            : `${daysUntilPayment} days`}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-900">
                      Amount due: {formatCurrency(loan.weeklyPayment)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onNavigate?.("loans")}
                    >
                      Pay Now
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissReminder(loan.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
