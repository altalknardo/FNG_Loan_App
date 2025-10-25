import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import {
  FileText,
  Download,
  Users,
  DollarSign,
  Wallet,
  TrendingUp,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../../lib/utils";

interface CustomerReport {
  customerId: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  
  // Contribution data
  totalContributions: number;
  contributionBalance: number;
  contributionCount: number;
  lastContributionDate: string | null;
  
  // Loan data
  totalLoansCount: number;
  activeLoansCount: number;
  completedLoansCount: number;
  totalLoanAmount: number;
  totalRepaid: number;
  totalOutstanding: number;
  loans: any[];
  
  // Status
  kycStatus: string;
  accountStatus: "active" | "inactive";
  joinDate: string;
}

export function CustomerLoanContributionReport() {
  const [customers, setCustomers] = useState<CustomerReport[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "with-loans" | "with-contributions" | "active-loans">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, []);

  useEffect(() => {
    filterCustomerData();
  }, [searchQuery, filterStatus, customers]);

  const loadCustomerData = () => {
    try {
      setLoading(true);

      // Get all data from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const kycSubmissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
      const allLoans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
      const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
      
      // Build customer reports
      const reports: CustomerReport[] = users.map((user: any) => {
        // Get KYC status
        const kyc = kycSubmissions.find((k: any) => 
          k.email === user.email || k.phoneNumber === user.phoneNumber
        );

        // Get all user's loans (both from activeLoans and loanApplications)
        const userLoans = allLoans.filter((loan: any) => 
          loan.userId === user.email || 
          loan.userId === user.phoneNumber ||
          loan.userEmail === user.email ||
          loan.userEmail === user.phoneNumber
        );

        const userApplications = loanApplications.filter((app: any) =>
          app.userId === user.email ||
          app.userId === user.phoneNumber ||
          app.userEmail === user.email ||
          app.userEmail === user.phoneNumber
        );

        // Combine loans
        const allUserLoans = [...userLoans, ...userApplications];

        // Calculate loan stats
        const activeLoans = allUserLoans.filter((l: any) => l.status === "active");
        const completedLoans = allUserLoans.filter((l: any) => l.status === "completed");
        const totalLoanAmount = allUserLoans.reduce((sum: number, l: any) => sum + (l.amount || 0), 0);
        const totalRepaid = allUserLoans.reduce((sum: number, l: any) => sum + (l.repaid || 0), 0);
        const totalOutstanding = totalLoanAmount - totalRepaid;

        // Get contribution data
        const contributionBalance = parseFloat(user.contributionBalance || "0");
        const totalContributions = parseFloat(user.totalContributions || "0");
        
        // Get contribution count (estimate from history)
        const contributionHistory = JSON.parse(user.contributionHistory || "[]");
        const contributionCount = contributionHistory.length;
        
        // Get last contribution date
        const lastContribution = contributionHistory.length > 0 
          ? contributionHistory[contributionHistory.length - 1]?.date 
          : null;

        return {
          customerId: user.email || user.phoneNumber,
          customerName: user.fullName || user.name || "N/A",
          email: user.email || "N/A",
          phoneNumber: user.phoneNumber || "N/A",
          
          totalContributions,
          contributionBalance,
          contributionCount,
          lastContributionDate: lastContribution,
          
          totalLoansCount: allUserLoans.length,
          activeLoansCount: activeLoans.length,
          completedLoansCount: completedLoans.length,
          totalLoanAmount,
          totalRepaid,
          totalOutstanding,
          loans: allUserLoans,
          
          kycStatus: kyc?.status || "not_submitted",
          accountStatus: user.isActive !== false ? "active" : "inactive",
          joinDate: user.createdAt || user.registrationDate || new Date().toISOString(),
        };
      });

      setCustomers(reports);
      setLoading(false);
    } catch (error) {
      console.error("Error loading customer data:", error);
      toast.error("Failed to load customer data");
      setLoading(false);
    }
  };

  const filterCustomerData = () => {
    let filtered = [...customers];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.customerName.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phoneNumber.includes(query) ||
        c.customerId.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (filterStatus) {
      case "with-loans":
        filtered = filtered.filter(c => c.totalLoansCount > 0);
        break;
      case "with-contributions":
        filtered = filtered.filter(c => c.totalContributions > 0);
        break;
      case "active-loans":
        filtered = filtered.filter(c => c.activeLoansCount > 0);
        break;
    }

    setFilteredCustomers(filtered);
  };

  const calculateTotals = () => {
    return {
      totalCustomers: filteredCustomers.length,
      totalContributions: filteredCustomers.reduce((sum, c) => sum + c.totalContributions, 0),
      totalContributionBalance: filteredCustomers.reduce((sum, c) => sum + c.contributionBalance, 0),
      totalLoans: filteredCustomers.reduce((sum, c) => sum + c.totalLoansCount, 0),
      totalActiveLoans: filteredCustomers.reduce((sum, c) => sum + c.activeLoansCount, 0),
      totalLoanAmount: filteredCustomers.reduce((sum, c) => sum + c.totalLoanAmount, 0),
      totalRepaid: filteredCustomers.reduce((sum, c) => sum + c.totalRepaid, 0),
      totalOutstanding: filteredCustomers.reduce((sum, c) => sum + c.totalOutstanding, 0),
    };
  };

  const exportToCSV = () => {
    try {
      const totals = calculateTotals();

      let csv = "FNG FINANCIAL SERVICES - COMPREHENSIVE CUSTOMER REPORT\n";
      csv += `Generated: ${new Date().toLocaleString()}\n`;
      csv += `Total Customers: ${totals.totalCustomers}\n\n`;

      csv += "SUMMARY STATISTICS\n";
      csv += `Total Contributions,₦${totals.totalContributions.toLocaleString()}\n`;
      csv += `Total Contribution Balance,₦${totals.totalContributionBalance.toLocaleString()}\n`;
      csv += `Total Loans Issued,${totals.totalLoans}\n`;
      csv += `Active Loans,${totals.totalActiveLoans}\n`;
      csv += `Total Loan Amount,₦${totals.totalLoanAmount.toLocaleString()}\n`;
      csv += `Total Repaid,₦${totals.totalRepaid.toLocaleString()}\n`;
      csv += `Total Outstanding,₦${totals.totalOutstanding.toLocaleString()}\n\n`;

      csv += "CUSTOMER DETAILS\n";
      csv += "Customer Name,Email,Phone,";
      csv += "Total Contributions,Contribution Balance,Contribution Count,Last Contribution,";
      csv += "Total Loans,Active Loans,Completed Loans,Total Loan Amount,Total Repaid,Outstanding Balance,";
      csv += "KYC Status,Account Status,Join Date\n";

      filteredCustomers.forEach(customer => {
        csv += `"${customer.customerName}",`;
        csv += `"${customer.email}",`;
        csv += `"${customer.phoneNumber}",`;
        csv += `"₦${customer.totalContributions.toLocaleString()}",`;
        csv += `"₦${customer.contributionBalance.toLocaleString()}",`;
        csv += `${customer.contributionCount},`;
        csv += `"${customer.lastContributionDate ? new Date(customer.lastContributionDate).toLocaleDateString() : 'N/A'}",`;
        csv += `${customer.totalLoansCount},`;
        csv += `${customer.activeLoansCount},`;
        csv += `${customer.completedLoansCount},`;
        csv += `"₦${customer.totalLoanAmount.toLocaleString()}",`;
        csv += `"₦${customer.totalRepaid.toLocaleString()}",`;
        csv += `"₦${customer.totalOutstanding.toLocaleString()}",`;
        csv += `"${customer.kycStatus}",`;
        csv += `"${customer.accountStatus}",`;
        csv += `"${new Date(customer.joinDate).toLocaleDateString()}"\n`;
      });

      // Add detailed loan breakdown
      csv += "\n\nDETAILED LOAN BREAKDOWN\n";
      csv += "Customer Name,Loan ID,Loan Type,Amount,Repaid,Outstanding,Status,Start Date,Weekly Payment\n";

      filteredCustomers.forEach(customer => {
        if (customer.loans.length > 0) {
          customer.loans.forEach(loan => {
            csv += `"${customer.customerName}",`;
            csv += `"${loan.id || 'N/A'}",`;
            csv += `"${loan.loanType || loan.type || 'Standard'}",`;
            csv += `"₦${(loan.amount || 0).toLocaleString()}",`;
            csv += `"₦${(loan.repaid || 0).toLocaleString()}",`;
            csv += `"₦${((loan.amount || 0) - (loan.repaid || 0)).toLocaleString()}",`;
            csv += `"${loan.status || 'N/A'}",`;
            csv += `"${loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : 'N/A'}",`;
            csv += `"₦${(loan.weeklyPayment || 0).toLocaleString()}"\n`;
          });
        }
      });

      // Create and download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FNG_Customer_Loan_Contribution_Report_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    }
  };

  const exportToWord = () => {
    try {
      const totals = calculateTotals();

      let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FNG Customer Report</title>
  <style>
    @page { size: A4 landscape; margin: 1.5cm; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 5px 0; }
    .summary { background: #f0f9ff; border: 2px solid #93c5fd; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .summary h2 { color: #1e40af; margin: 0 0 15px 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 15px 0; }
    .stat-box { background: white; border: 1px solid #93c5fd; padding: 12px; border-radius: 6px; }
    .stat-box .label { font-size: 12px; color: #666; text-transform: uppercase; }
    .stat-box .value { font-size: 20px; font-weight: bold; color: #2563eb; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px; }
    th { background: #2563eb; color: white; padding: 10px 8px; text-align: left; font-weight: 600; }
    td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f9fafb; }
    .section { margin: 30px 0; }
    .section h3 { color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; }
    .badge-approved { background: #d1fae5; color: #065f46; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-active { background: #dbeafe; color: #1e40af; }
    .footer { margin-top: 40px; padding-top: 15px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>FNG FINANCIAL SERVICES</h1>
    <p style="font-size: 18px; font-weight: 600;">Comprehensive Customer, Loan & Contribution Report</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Report ID: FNG-CUST-${Date.now()}</p>
  </div>

  <div class="summary">
    <h2>Executive Summary</h2>
    <div class="stats-grid">
      <div class="stat-box">
        <div class="label">Total Customers</div>
        <div class="value">${totals.totalCustomers}</div>
      </div>
      <div class="stat-box">
        <div class="label">Total Contributions</div>
        <div class="value">${formatCurrency(totals.totalContributions)}</div>
      </div>
      <div class="stat-box">
        <div class="label">Total Loans</div>
        <div class="value">${totals.totalLoans}</div>
      </div>
      <div class="stat-box">
        <div class="label">Active Loans</div>
        <div class="value">${totals.totalActiveLoans}</div>
      </div>
      <div class="stat-box">
        <div class="label">Contribution Balance</div>
        <div class="value">${formatCurrency(totals.totalContributionBalance)}</div>
      </div>
      <div class="stat-box">
        <div class="label">Total Disbursed</div>
        <div class="value">${formatCurrency(totals.totalLoanAmount)}</div>
      </div>
      <div class="stat-box">
        <div class="label">Total Repaid</div>
        <div class="value">${formatCurrency(totals.totalRepaid)}</div>
      </div>
      <div class="stat-box">
        <div class="label">Outstanding</div>
        <div class="value">${formatCurrency(totals.totalOutstanding)}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3>Customer Details</h3>
    <table>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Contact</th>
          <th style="text-align: right;">Contributions</th>
          <th style="text-align: right;">Balance</th>
          <th style="text-align: center;">Loans</th>
          <th style="text-align: right;">Loan Amount</th>
          <th style="text-align: right;">Outstanding</th>
          <th style="text-align: center;">KYC</th>
        </tr>
      </thead>
      <tbody>
`;

      filteredCustomers.forEach(customer => {
        const kycBadge = customer.kycStatus === "approved" 
          ? '<span class="badge badge-approved">Approved</span>'
          : customer.kycStatus === "pending"
          ? '<span class="badge badge-pending">Pending</span>'
          : '<span class="badge">Not Submitted</span>';

        html += `
        <tr>
          <td><strong>${customer.customerName}</strong></td>
          <td>
            ${customer.phoneNumber}<br>
            <small style="color: #666;">${customer.email}</small>
          </td>
          <td style="text-align: right;">${formatCurrency(customer.totalContributions)}</td>
          <td style="text-align: right;">${formatCurrency(customer.contributionBalance)}</td>
          <td style="text-align: center;">
            <strong>${customer.totalLoansCount}</strong> 
            ${customer.activeLoansCount > 0 ? `<span class="badge badge-active">${customer.activeLoansCount} Active</span>` : ''}
          </td>
          <td style="text-align: right;">${formatCurrency(customer.totalLoanAmount)}</td>
          <td style="text-align: right;">${formatCurrency(customer.totalOutstanding)}</td>
          <td style="text-align: center;">${kycBadge}</td>
        </tr>
`;
      });

      html += `
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>FNG Financial Services</strong> | Comprehensive Customer Report</p>
    <p>This is a system-generated report. All data is accurate as of ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
`;

      const blob = new Blob([html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FNG_Customer_Report_${new Date().toISOString().split("T")[0]}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Word report generated successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate Word report");
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2>Customer, Loan & Contribution Report</h2>
        <p className="text-sm text-gray-600">Comprehensive overview of all customers with loans and contributions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold">{totals.totalCustomers}</p>
              <p className="text-xs sm:text-sm text-gray-600">Customers</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-semibold">{formatCurrency(totals.totalContributions)}</p>
              <p className="text-xs sm:text-sm text-gray-600">Contributions</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold">{totals.totalLoans}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Loans</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-semibold">{formatCurrency(totals.totalOutstanding)}</p>
              <p className="text-xs sm:text-sm text-gray-600">Outstanding</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="sm:col-span-2">
              <Label className="text-xs sm:text-sm">Search Customers</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Filter */}
            <div>
              <Label className="text-xs sm:text-sm">Filter</Label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
              >
                <option value="all">All Customers</option>
                <option value="with-loans">With Loans</option>
                <option value="active-loans">Active Loans</option>
                <option value="with-contributions">With Contributions</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex items-end gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none h-9 sm:h-10"
              >
                <FileSpreadsheet className="h-4 w-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">CSV</span>
              </Button>
              <Button
                onClick={exportToWord}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none h-9 sm:h-10"
              >
                <FileText className="h-4 w-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Word</span>
              </Button>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
          </div>
        </div>
      </Card>

      {/* Customer Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-700">Customer</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-700">Contributions</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-700">Balance</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium text-gray-700">Loans</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-700">Loan Amount</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-700">Outstanding</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    No customers found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">{customer.customerName}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{customer.phoneNumber}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                      <p className="text-xs sm:text-sm font-medium">{formatCurrency(customer.totalContributions)}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{customer.contributionCount} times</p>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm">
                      {formatCurrency(customer.contributionBalance)}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {customer.totalLoansCount} total
                        </Badge>
                        {customer.activeLoansCount > 0 && (
                          <Badge className="bg-orange-100 text-orange-700 text-[10px] sm:text-xs">
                            {customer.activeLoansCount} active
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm">
                      {formatCurrency(customer.totalLoanAmount)}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                      <p className={`text-xs sm:text-sm font-medium ${customer.totalOutstanding > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {formatCurrency(customer.totalOutstanding)}
                      </p>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                      <Badge
                        variant={customer.kycStatus === "approved" ? "default" : "outline"}
                        className={`text-[10px] sm:text-xs ${
                          customer.kycStatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : customer.kycStatus === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {customer.kycStatus === "approved" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                        ) : customer.kycStatus === "pending" ? (
                          <Clock className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1 inline" />
                        )}
                        {customer.kycStatus.replace("_", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Footer */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-xs sm:text-sm text-blue-800">
          <strong>Summary:</strong> {totals.totalCustomers} customers with {formatCurrency(totals.totalContributions)} in total contributions
          and {formatCurrency(totals.totalLoanAmount)} in total loans ({totals.totalActiveLoans} currently active).
          Outstanding balance: {formatCurrency(totals.totalOutstanding)}.
        </AlertDescription>
      </Alert>
    </div>
  );
}
