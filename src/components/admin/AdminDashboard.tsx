import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  Percent,
  Briefcase,
  Rocket,
  BarChart3,
  Shield
} from "lucide-react";
import { formatCurrency } from "../../lib/utils";

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  // Company Balance (Service Charges)
  const [companyBalance, setCompanyBalance] = useState(() => {
    const saved = localStorage.getItem("companyBalance");
    return saved ? parseFloat(saved) : 0;
  });

  // Loan Interest Balance
  const [loanInterestBalance, setLoanInterestBalance] = useState(() => {
    const saved = localStorage.getItem("loanInterestBalance");
    return saved ? parseFloat(saved) : 0;
  });

  // Interest breakdown by loan type
  const [smeInterest, setSmeInterest] = useState(0);
  const [businessInterest, setBusinessInterest] = useState(0);
  const [jumboInterest, setJumboInterest] = useState(0);

  // Reload balances periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const savedCompanyBalance = localStorage.getItem("companyBalance");
      setCompanyBalance(savedCompanyBalance ? parseFloat(savedCompanyBalance) : 0);
      
      const savedInterestBalance = localStorage.getItem("loanInterestBalance");
      setLoanInterestBalance(savedInterestBalance ? parseFloat(savedInterestBalance) : 0);
      
      setSmeInterest(parseFloat(localStorage.getItem("loanInterest_sme") || "0"));
      setBusinessInterest(parseFloat(localStorage.getItem("loanInterest_business") || "0"));
      setJumboInterest(parseFloat(localStorage.getItem("loanInterest_jumbo") || "0"));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Loans",
      value: "₦2.5M",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Contributions",
      value: "₦8.9M",
      change: "+15.3%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pending Approvals",
      value: "47",
      change: "-3",
      trend: "down",
      icon: AlertCircle,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const pendingActions = [
    {
      type: "loan",
      count: 12,
      label: "Loan Applications",
      action: () => onNavigate("loan-approvals"),
    },
    {
      type: "withdrawal",
      count: 8,
      label: "Withdrawal Requests",
      action: () => onNavigate("withdrawal-approvals"),
    },
    {
      type: "upfront-refund",
      count: (() => {
        const requests = JSON.parse(localStorage.getItem("upfrontRefundRequests") || "[]");
        return requests.filter((r: any) => r.status === "pending").length;
      })(),
      label: "Deposit Refund Requests",
      action: () => onNavigate("upfront-refunds"),
    },
    {
      type: "deposit-offset",
      count: (() => {
        const requests = JSON.parse(localStorage.getItem("depositOffsetRequests") || "[]");
        return requests.filter((r: any) => r.status === "pending").length;
      })(),
      label: "Deposit Offset Requests",
      action: () => onNavigate("deposit-offset"),
    },
    {
      type: "customer",
      count: 27,
      label: "New Registrations",
      action: () => onNavigate("customer-approvals"),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "loan_approved",
      user: "John Doe",
      amount: "₦50,000",
      time: "5 mins ago",
      status: "success",
    },
    {
      id: 2,
      type: "withdrawal_approved",
      user: "Jane Smith",
      amount: "₦25,000",
      time: "12 mins ago",
      status: "success",
    },
    {
      id: 3,
      type: "customer_approved",
      user: "Mike Johnson",
      time: "18 mins ago",
      status: "success",
    },
    {
      id: 4,
      type: "loan_rejected",
      user: "Sarah Williams",
      amount: "₦100,000",
      time: "25 mins ago",
      status: "rejected",
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Low Balance Warning */}
      {companyBalance < 100000 && (
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="text-orange-900">Low Company Balance Warning</h4>
              <p className="text-sm text-orange-700 mt-1">
                Company balance is low ({formatCurrency(companyBalance)}). You may not have sufficient funds to disburse loans or process withdrawals. Consider funding the company account.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onNavigate("company-settings")}
                  className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded hover:bg-orange-700"
                >
                  Fund Account
                </button>
                <button
                  onClick={() => onNavigate("loan-approvals")}
                  className="text-xs border border-orange-600 text-orange-700 px-3 py-1.5 rounded hover:bg-orange-50"
                >
                  View Pending Loans
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Company Balance Card */}
      <Card className={`p-6 bg-gradient-to-br ${companyBalance < 100000 ? 'from-orange-50 to-red-50 border-orange-200' : 'from-green-50 to-emerald-50 border-green-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`${companyBalance < 100000 ? 'bg-orange-600' : 'bg-green-600'} p-4 rounded-full`}>
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className={companyBalance < 100000 ? 'text-orange-900' : 'text-green-900'}>Company Balance</h3>
              <p className={`text-3xl ${companyBalance < 100000 ? 'text-orange-700' : 'text-green-700'} mt-1`}>{formatCurrency(companyBalance)}</p>
              <p className={`text-sm ${companyBalance < 100000 ? 'text-orange-600' : 'text-green-600'} mt-1`}>
                Available for loan disbursements & withdrawals
              </p>
              {companyBalance < 100000 && (
                <Badge className="mt-2 bg-orange-100 text-orange-700 border-orange-300">
                  ⚠️ Low Balance
                </Badge>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigate("company-settings")}
            className={`text-sm ${companyBalance < 100000 ? 'text-orange-700 hover:text-orange-800' : 'text-green-700 hover:text-green-800'} hover:underline`}
          >
            View Details →
          </button>
        </div>
      </Card>

      {/* Loan Interest Revenue Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-full">
                <Percent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-blue-900">Loan Interest Revenue</h3>
                <p className="text-3xl text-blue-700 mt-1">{formatCurrency(loanInterestBalance)}</p>
                <p className="text-sm text-blue-600 mt-1">
                  From loan repayments (20% interest)
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-700">20% APR</span>
              </div>
              <button
                onClick={() => onNavigate("revenue-analytics")}
                className="text-sm text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </button>
            </div>
          </div>

          {/* Breakdown by Loan Type */}
          {loanInterestBalance > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-blue-200">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-blue-600" />
                  <p className="text-xs text-blue-700">SME</p>
                </div>
                <p className="text-sm text-blue-900">{formatCurrency(smeInterest)}</p>
                <div className="w-full bg-blue-200 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full"
                    style={{ width: `${(smeInterest / loanInterestBalance) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                  <p className="text-xs text-blue-700">Business</p>
                </div>
                <p className="text-sm text-blue-900">{formatCurrency(businessInterest)}</p>
                <div className="w-full bg-purple-200 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full"
                    style={{ width: `${(businessInterest / loanInterestBalance) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Rocket className="h-3 w-3 text-amber-600" />
                  <p className="text-xs text-blue-700">Jumbo</p>
                </div>
                <p className="text-sm text-blue-900">{formatCurrency(jumboInterest)}</p>
                <div className="w-full bg-amber-200 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full"
                    style={{ width: `${(jumboInterest / loanInterestBalance) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Incoming Payments */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-emerald-900">Recent Incoming Payments</h3>
          </div>
          <button
            onClick={() => onNavigate("activity")}
            className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            View All
          </button>
        </div>
        <p className="text-xs text-emerald-700 mb-4">
          All customer payments automatically credit the company account in real-time
        </p>
        <div className="space-y-2">
          {(() => {
            // Get recent incoming transactions
            const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
            const incomingTypes = ["contribution", "repayment", "upfront_payment"];
            const recentIncoming = transactions
              .filter((t: any) => incomingTypes.includes(t.type) && t.status === "completed")
              .slice(0, 5);
            
            if (recentIncoming.length === 0) {
              return (
                <div className="text-center py-6">
                  <p className="text-sm text-emerald-600">No recent incoming payments</p>
                  <p className="text-xs text-emerald-500 mt-1">Customer payments will appear here</p>
                </div>
              );
            }
            
            return recentIncoming.map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-emerald-900 truncate">
                      {transaction.type === "contribution" && "Contribution"}
                      {transaction.type === "repayment" && "Loan Repayment"}
                      {transaction.type === "upfront_payment" && "Upfront Payment"}
                    </p>
                    <p className="text-xs text-emerald-600">
                      {new Date(transaction.date).toLocaleDateString()} {transaction.time || ""}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm text-emerald-700">{formatCurrency(transaction.amount)}</p>
                  <p className="text-xs text-emerald-500">✓ Credited</p>
                </div>
              </div>
            ));
          })()}
        </div>
        <div className="mt-4 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-700" />
            <p className="text-xs text-emerald-800">
              <span className="font-medium">Automatic Processing:</span> All payments are verified and credited to company account instantly
            </p>
          </div>
        </div>
      </Card>

      {/* Pending Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Pending Actions</h3>
        <div className="space-y-3">
          {pendingActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                  {action.count}
                </div>
                <span>{action.label}</span>
              </div>
              <Clock className="h-5 w-5 text-gray-400" />
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Activities</h3>
          <button
            onClick={() => onNavigate("activity")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <div className={`p-2 rounded-full mt-1 ${
                activity.status === "success" ? "bg-green-100" : "bg-red-100"
              }`}>
                {activity.status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  {" - "}
                  {activity.type === "loan_approved" && `Loan approved ${activity.amount}`}
                  {activity.type === "loan_rejected" && `Loan rejected ${activity.amount}`}
                  {activity.type === "withdrawal_approved" && `Withdrawal approved ${activity.amount}`}
                  {activity.type === "customer_approved" && "Registration approved"}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate("data-management")}
        >
          <h4>Data Management</h4>
          <p className="text-sm text-gray-600 mt-1">Generate reports & archive data</p>
        </Card>
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate("activity")}
        >
          <h4>Live Monitoring</h4>
          <p className="text-sm text-gray-600 mt-1">Real-time activity stream</p>
        </Card>
      </div>
    </div>
  );
}
