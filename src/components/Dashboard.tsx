import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { LoanReminderSystem } from "./LoanReminderSystem";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sun,
  Moon,
  Cloud,
  TrendingDown,
  HandCoins,
} from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { ApiError, getUserDashboardData } from "../lib/userDashboard-api";
import { StreakCard } from "./UserDashboard/DailyStreaks/DailyStreaks";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  userEmail?: string;
}

export function Dashboard({ onNavigate, userEmail }: DashboardProps) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [userDashboardData, setUserDashboardData] = useState<any>(null);
  const navigate = useNavigate();
  // Separate balances
  const [contributionBalance, setContributionBalance] = useState(() => {
    const saved = localStorage.getItem("contributionBalance");
    return saved ? parseFloat(saved) : 3200.0;
  });

  const [loanDeposits, setLoanDeposits] = useState(() => {
    const saved = localStorage.getItem("loanDeposits");
    return saved ? parseFloat(saved) : 0;
  });

  const [totalContributions, setTotalContributions] = useState(() => {
    const saved = localStorage.getItem("totalContributions");
    return saved ? parseFloat(saved) : 3200.0;
  });

  // Total balance is sum of contribution balance and loan deposits
  const totalBalance = contributionBalance + loanDeposits;

  // Load loan data
  const [activeLoanAmount, setActiveLoanAmount] = useState(() => {
    const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    return loans.length > 0 ? loans[0].amount : 2000.0;
  });

  const [loanRepaid, setLoanRepaid] = useState(() => {
    const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    return loans.length > 0 ? loans[0].repaid : 800.0;
  });

  const loanProgress = (loanRepaid / activeLoanAmount) * 100;

  // Get user's name from KYC data or registered users
  const [userName, setUserName] = useState("User");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUserName(userData?.firstName + " " + userData?.lastName);
  }, [userData]);

  useEffect(() => {
    // Try to get name from KYC data
    const kycData = JSON.parse(localStorage.getItem("kycData") || "{}");
    if (kycData.fullName) {
      const firstName = kycData.fullName.split(" ")[0];
      // setUserName(firstName);
    } else if (userEmail) {
      // Try to get from registered users
      const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
      const user = registeredUsers.find((u: any) => u.email === userEmail);
      if (user && user.fullName) {
        const firstName = user.fullName.split(" ")[0];
        // setUserName(firstName);
      }
    }
  }, [userEmail]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: Sun };
    if (hour < 17) return { text: "Good Afternoon", icon: Sun };
    if (hour < 21) return { text: "Good Evening", icon: Cloud };
    return { text: "Good Night", icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Listen for storage changes (when contributions or loan payments are made)
  useEffect(() => {
    const handleStorageChange = () => {
      const newContributionBalance = parseFloat(
        localStorage.getItem("contributionBalance") || "3200.00"
      );
      const newLoanDeposits = parseFloat(
        localStorage.getItem("loanDeposits") || "0"
      );
      const newContributions = parseFloat(
        localStorage.getItem("totalContributions") || "3200.00"
      );

      setContributionBalance(newContributionBalance);
      setLoanDeposits(newLoanDeposits);
      setTotalContributions(newContributions);

      // Update loan data
      const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
      if (loans.length > 0) {
        setActiveLoanAmount(loans[0].amount);
        setLoanRepaid(loans[0].repaid);
      }
    };
    const getDashboardData = async () => {
      try {
        // Call API to login
        const response = await getUserDashboardData();

        if (response.success && response.data) {
          // Store auth token
          console.log(response.data, "response");
          setUserDashboardData(response?.data);
        } else {
          setError(response.message || "Login failed. Please try again.");
          setIsLoading(false);
        }
      } catch (error: any) {
        // Handle API errors
        const apiError = error as ApiError;

        // Check for field-specific errors
        if (apiError.errors && Object.keys(apiError.errors).length > 0) {
          const firstError = Object.values(apiError.errors)[0][0];
          setError(firstError || apiError.message);
        } else {
          setError(
            apiError.message ||
              "Invalid credentials. Please check your email/phone and password."
          );
        }

        setIsLoading(false);

        // Fallback to localStorage for demo/admin users if API fails
        if (
          apiError.status === 404 ||
          apiError.status === 500 ||
          !apiError.status
        ) {
          console.warn("API login failed, trying localStorage fallback");
        }
      }
    };
    // Listen for custom event
    window.addEventListener("balanceUpdated", handleStorageChange);

    // Check for updates periodically
    const interval = setInterval(handleStorageChange, 1000);
    getDashboardData();

    return () => {
      // getDashboardData();
      // window.removeEventListener("balanceUpdated", handleStorageChange);
      // clearInterval(interval);
    };
  }, []);

  const recentTransactions = [
    {
      id: 1,
      type: "contribution",
      amount: 500,
      date: "2025-10-14",
      description: "Daily Contribution",
    },
    {
      id: 2,
      type: "loan_payment",
      amount: -100,
      date: "2025-10-13",
      description: "Loan Repayment",
    },
    {
      id: 3,
      type: "contribution",
      amount: 500,
      date: "2025-10-13",
      description: "Daily Contribution",
    },
    {
      id: 4,
      type: "contribution",
      amount: 500,
      date: "2025-10-12",
      description: "Daily Contribution",
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-100 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <GreetingIcon className="h-5 w-5" />
              <p className="text-sm">{greeting.text}</p>
            </div>
            <h2 className="text-3xl text-gray-900">
              Welcome, {userName || ""}! 👋
            </h2>
            <p className="text-sm text-gray-600">
              Here's your financial overview
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-full">
            <Wallet className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </Card>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <p className="text-emerald-100 text-sm">Total Balance</p>
            <h2 className="text-4xl">
              {formatCurrency(
                userDashboardData?.balanceInfo?.totalBalance || 0
              )}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-emerald-100 text-xs">Contribution Balance</p>
              <p className="text-xl mt-1">
                {formatCurrency(
                  userDashboardData?.balanceInfo?.contributionBalance || 0
                )}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-emerald-100 text-xs">Active Loan</p>
              <p className="text-xl mt-1">
                {formatCurrency(
                  userDashboardData?.balanceInfo?.activeLoan || 0
                )}
              </p>
            </div>
            {loanDeposits > 0 && (
              <div className="bg-green-400/20 backdrop-blur-sm rounded-lg p-3 col-span-2 border border-green-300/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs">
                      Loan Deposits (Refundable)
                    </p>
                    <p className="text-xl mt-1">
                      {formatCurrency(loanDeposits)}
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white border-green-500">
                    Refundable
                  </Badge>
                </div>
                <p className="text-xs text-green-100 mt-2">
                  Will be refunded after full loan repayment
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions inside Balance Card */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              // onClick={() => onNavigate("contributions")}
              onClick={() => navigate("/contribute")}
              className="h-20 flex flex-col gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white shadow-md transition-all"
            >
              <Wallet className="h-6 w-6" />
              <span>Contribute</span>
            </Button>
            <Button
              onClick={() => navigate("/request-loan")}
              className="h-20 flex flex-col gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white shadow-md transition-all"
            >
              <HandCoins className="h-6 w-6" />
              <span>Request Loan</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Loan Status - Moved right under Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Active Loan</h3>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              In Progress
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">
                Repaid{" "}
                {formatCurrency(
                  userDashboardData?.activeLoan?.repaidAmount || 0
                )}{" "}
                of{" "}
                {formatCurrency(
                  userDashboardData?.activeLoan?.totalAmount || 0
                )}
              </span>
              <span className="text-orange-600">
                {/* {loanProgress.toFixed(0)}% */}
                {userDashboardData?.activeLoan?.completetionPercentage}
              </span>
            </div>
            <Progress
              value={Number(
                userDashboardData?.activeLoan?.completetionPercentage?.split(
                  " "
                )[0] || 0
              )}
              className="h-3"
            />
          </div>
          <div className="flex justify-between text-sm bg-white/60 p-3 rounded-lg">
            <span className="text-gray-700">Next payment</span>
            <span className="text-gray-900">
              {formatCurrency(
                userDashboardData?.activeLoan?.nextPaymentAmount || 0
              )}{" "}
              {userDashboardData?.activeLoan?.nextPaymentDueDate
                ? "on" + userDashboardData?.activeLoan?.nextPaymentDueDate
                : ""}
            </span>
          </div>
        </div>
      </Card>

      {/* Deposit Offset Quick Action */}
      {(() => {
        const remainingBalance = activeLoanAmount - loanRepaid;
        if (loanDeposits > 0 && remainingBalance > 0) {
          return (
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-gray-900">
                      Use Deposit to Reduce Loan
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Apply your {formatCurrency(loanDeposits)} deposit to
                      offset your loan balance
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingDown className="h-6 w-6 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white/60 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Deposit:</span>
                    <span className="font-medium text-purple-600">
                      {formatCurrency(loanDeposits)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Loan Balance:</span>
                    <span className="font-medium">
                      {formatCurrency(remainingBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-purple-200 pt-2">
                    <span className="text-gray-700 font-medium">
                      Balance After Offset:
                    </span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(
                        Math.max(0, remainingBalance - loanDeposits)
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => onNavigate("loans")}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Apply Deposit to Loan Balance
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  This request requires admin approval
                </p>
              </div>
            </Card>
          );
        }
        return null;
      })()}

      {/* Loan Reminders */}
      <LoanReminderSystem onNavigate={onNavigate} />

      {/* Contribution Streak */}
      {/* <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-gray-900">Daily Contribution Streak</h3>
            <p className="text-4xl text-green-600">
              {userDashboardData?.dailyContributionStreak || ""}{" "}
            </p>
            <p className="text-sm text-green-700">Keep it up! 🔥</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full shadow-sm">
            <TrendingUp className="h-7 w-7 text-green-600" />
          </div>
        </div>
      </Card> */}
      {/* {userDashboardData && ( */}
      <StreakCard
        streak={userDashboardData?.dailyContributionStreak || "0 days"}
      />
      {/* )} */}

      {/* Recent Transactions */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Recent Transactions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("history")}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {userDashboardData?.recenetTransactions?.map(
              (transaction: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.amount > 0
                          ? "bg-gradient-to-br from-green-100 to-emerald-100"
                          : "bg-gradient-to-br from-red-100 to-pink-100"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {transaction.transactionType === "dailyContribution"
                          ? "Daily Contribution"
                          : "Loan Payment"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
