import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

export function TransactionHistory() {
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Load transactions from localStorage with live updates
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [
      { id: 1, type: "contribution", amount: 500, date: "2025-10-14", time: "09:30 AM", description: "Daily Contribution", status: "completed" },
      { id: 2, type: "loan_payment", amount: -100, date: "2025-10-13", time: "02:15 PM", description: "Loan #1 Repayment", status: "completed" },
      { id: 3, type: "contribution", amount: 500, date: "2025-10-13", time: "08:45 AM", description: "Daily Contribution", status: "completed" },
      { id: 4, type: "contribution", amount: 500, date: "2025-10-12", time: "10:20 AM", description: "Daily Contribution", status: "completed" },
      { id: 5, type: "contribution", amount: 750, date: "2025-10-11", time: "09:00 AM", description: "Daily Contribution", status: "completed" },
      { id: 6, type: "loan_payment", amount: -100, date: "2025-10-10", time: "03:30 PM", description: "Loan #1 Repayment", status: "completed" },
      { id: 7, type: "contribution", amount: 500, date: "2025-10-10", time: "09:15 AM", description: "Daily Contribution", status: "completed" },
      { id: 8, type: "loan_disbursement", amount: 2000, date: "2025-09-01", time: "11:00 AM", description: "Loan #1 Disbursed", status: "completed" },
      { id: 9, type: "contribution", amount: 500, date: "2025-10-09", time: "08:30 AM", description: "Daily Contribution", status: "completed" },
      { id: 10, type: "contribution", amount: 500, date: "2025-10-08", time: "09:45 AM", description: "Daily Contribution", status: "completed" },
    ];
  });

  // Listen for transaction updates
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("transactions");
      if (saved) {
        setTransactions(JSON.parse(saved));
      }
    };

    // Check for updates periodically
    const interval = setInterval(handleUpdate, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "contribution":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "loan_payment":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case "loan_disbursement":
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case "service_charge":
        return <ArrowDownRight className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (type === "loan_disbursement") return "text-blue-600";
    if (type === "service_charge") return "text-orange-600";
    return amount > 0 ? "text-green-600" : "text-red-600";
  };

  const getTransactionBgColor = (type: string) => {
    switch (type) {
      case "contribution":
        return "bg-green-100";
      case "loan_payment":
        return "bg-red-100";
      case "loan_disbursement":
        return "bg-blue-100";
      case "service_charge":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  const filterTransactions = (filterType: string) => {
    if (filterType === "all") return transactions;
    return transactions.filter((t) => t.type === filterType);
  };

  const contributions = filterTransactions("contribution");
  const loanTransactions = transactions.filter(
    (t) => t.type === "loan_payment" || t.type === "loan_disbursement"
  );

  const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
  const totalLoanPayments = loanTransactions
    .filter((t) => t.type === "loan_payment")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Total Contributions</p>
            <p className="text-2xl text-green-600">+₦{totalContributions.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Total Loan Payments</p>
            <p className="text-2xl text-red-600">-₦{totalLoanPayments.toFixed(2)}</p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for different transaction types */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getTransactionBgColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {transaction.date} · {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${getTransactionColor(transaction.type, transaction.amount)}`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contributions" className="space-y-3 mt-4">
          {contributions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {transaction.date} · {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600">+₦{transaction.amount.toFixed(2)}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="loans" className="space-y-3 mt-4">
          {loanTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getTransactionBgColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {transaction.date} · {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${getTransactionColor(transaction.type, transaction.amount)}`}>
                    {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
