import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  Printer,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  File,
  Activity
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../../lib/utils";

interface ReportConfig {
  type: "financial" | "customers" | "loans" | "transactions" | "revenue" | "activity";
  format: "word" | "excel" | "print";
  startDate: string;
  endDate: string;
  includeCharts: boolean;
}

export function ReportGenerator() {
  const [config, setConfig] = useState<ReportConfig>({
    type: "financial",
    format: "excel",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    includeCharts: true
  });

  const [generating, setGenerating] = useState(false);
  const [reportStats, setReportStats] = useState({
    totalReports: 0,
    lastGenerated: null as string | null
  });

  useEffect(() => {
    loadReportStats();
  }, []);

  const loadReportStats = () => {
    const stats = localStorage.getItem("reportStats");
    if (stats) {
      setReportStats(JSON.parse(stats));
    }
  };

  const updateReportStats = () => {
    const newStats = {
      totalReports: reportStats.totalReports + 1,
      lastGenerated: new Date().toISOString()
    };
    localStorage.setItem("reportStats", JSON.stringify(newStats));
    setReportStats(newStats);
  };

  const getReportData = () => {
    const startDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);

    // Get all data from localStorage
    const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const kycSubmissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
    const withdrawals = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");
    const transactions = JSON.parse(localStorage.getItem("interestTransactions") || "[]");

    // Revenue data
    const serviceChargeBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
    const insuranceBalance = parseFloat(localStorage.getItem("insuranceBalance") || "0");
    const loanInterestBalance = parseFloat(localStorage.getItem("loanInterestBalance") || "0");
    const loanServiceChargeBalance = parseFloat(localStorage.getItem("loanServiceChargeBalance") || "0");

    // Filter by date range
    const filteredLoans = loans.filter((loan: any) => {
      const loanDate = new Date(loan.createdAt || loan.date);
      return loanDate >= startDate && loanDate <= endDate;
    });

    const filteredWithdrawals = withdrawals.filter((w: any) => {
      const wDate = new Date(w.requestDate);
      return wDate >= startDate && wDate <= endDate;
    });

    const filteredTransactions = transactions.filter((t: any) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    return {
      loans,
      filteredLoans,
      customers,
      kycSubmissions,
      withdrawals: filteredWithdrawals,
      transactions: filteredTransactions,
      revenue: {
        serviceCharge: serviceChargeBalance,
        insurance: insuranceBalance,
        loanInterest: loanInterestBalance,
        loanServiceCharge: loanServiceChargeBalance,
        total: serviceChargeBalance + insuranceBalance + loanInterestBalance + loanServiceChargeBalance
      }
    };
  };

  const generateWordReport = async () => {
    const data = getReportData();
    const startDate = new Date(config.startDate).toLocaleDateString();
    const endDate = new Date(config.endDate).toLocaleDateString();

    // Create HTML content that mimics a Word document
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FNG Financial Report - ${config.type.toUpperCase()}</title>
  <style>
    @page { size: A4; margin: 2cm; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin: 30px 0; }
    .section h2 { color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 10px; font-size: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f9fafb; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
    .stat-card { background: #f0f9ff; border: 2px solid #93c5fd; border-radius: 8px; padding: 20px; }
    .stat-card h3 { color: #1e40af; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; }
    .stat-card .value { font-size: 32px; font-weight: bold; color: #2563eb; margin: 0; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
    .summary-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    .summary-box h4 { margin: 0 0 10px 0; color: #92400e; }
    @media print { body { max-width: 100%; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>FNG FINANCIAL SERVICES</h1>
    <p>${config.type.toUpperCase()} REPORT</p>
    <p>Period: ${startDate} - ${endDate}</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>
`;

    // Add content based on report type
    if (config.type === "financial" || config.type === "revenue") {
      html += `
  <div class="section">
    <h2>Revenue Summary</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="value">${formatCurrency(data.revenue.total)}</p>
      </div>
      <div class="stat-card">
        <h3>Loan Interest</h3>
        <p class="value">${formatCurrency(data.revenue.loanInterest)}</p>
      </div>
      <div class="stat-card">
        <h3>Service Charges</h3>
        <p class="value">${formatCurrency(data.revenue.serviceCharge)}</p>
      </div>
      <div class="stat-card">
        <h3>Insurance Fees</h3>
        <p class="value">${formatCurrency(data.revenue.insurance)}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Revenue Stream</th>
          <th>Amount</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monthly Service Charges</td>
          <td>${formatCurrency(data.revenue.serviceCharge)}</td>
          <td>${((data.revenue.serviceCharge / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Loan Insurance Fees</td>
          <td>${formatCurrency(data.revenue.insurance)}</td>
          <td>${((data.revenue.insurance / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Loan Interest (20% APR)</td>
          <td>${formatCurrency(data.revenue.loanInterest)}</td>
          <td>${((data.revenue.loanInterest / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Loan Service Charges</td>
          <td>${formatCurrency(data.revenue.loanServiceCharge)}</td>
          <td>${((data.revenue.loanServiceCharge / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr style="background: #dbeafe; font-weight: bold;">
          <td><strong>TOTAL REVENUE</strong></td>
          <td><strong>${formatCurrency(data.revenue.total)}</strong></td>
          <td><strong>100%</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
`;
    }

    if (config.type === "loans" || config.type === "financial") {
      const activeLoans = data.filteredLoans.filter((l: any) => l.status === "active");
      const completedLoans = data.filteredLoans.filter((l: any) => l.status === "completed");
      const totalDisbursed = data.filteredLoans.reduce((sum: number, l: any) => sum + l.amount, 0);
      const totalRepaid = data.filteredLoans.reduce((sum: number, l: any) => sum + (l.repaid || 0), 0);

      html += `
  <div class="section">
    <h2>Loan Portfolio Analysis</h2>
    <div class="summary-box">
      <h4>Period Summary</h4>
      <p><strong>${data.filteredLoans.length}</strong> loans in selected period | 
         <strong>${activeLoans.length}</strong> active | 
         <strong>${completedLoans.length}</strong> completed</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Disbursed</h3>
        <p class="value">${formatCurrency(totalDisbursed)}</p>
      </div>
      <div class="stat-card">
        <h3>Total Repaid</h3>
        <p class="value">${formatCurrency(totalRepaid)}</p>
      </div>
      <div class="stat-card">
        <h3>Active Loans</h3>
        <p class="value">${activeLoans.length}</p>
      </div>
      <div class="stat-card">
        <h3>Completed Loans</h3>
        <p class="value">${completedLoans.length}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Repaid</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
`;

      data.filteredLoans.forEach((loan: any) => {
        html += `
        <tr>
          <td>${loan.customerName || 'N/A'}</td>
          <td>${loan.type || 'Standard'}</td>
          <td>${formatCurrency(loan.amount)}</td>
          <td>${formatCurrency(loan.repaid || 0)}</td>
          <td>${loan.status === 'completed' ? '✓ Completed' : '⟳ Active'}</td>
        </tr>
`;
      });

      html += `
      </tbody>
    </table>
  </div>
`;
    }

    if (config.type === "customers" || config.type === "financial") {
      const approvedKYC = data.kycSubmissions.filter((k: any) => k.status === "approved").length;
      const pendingKYC = data.kycSubmissions.filter((k: any) => k.status === "pending").length;

      html += `
  <div class="section">
    <h2>Customer Overview</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Customers</h3>
        <p class="value">${data.customers.length}</p>
      </div>
      <div class="stat-card">
        <h3>Approved KYC</h3>
        <p class="value">${approvedKYC}</p>
      </div>
      <div class="stat-card">
        <h3>Pending KYC</h3>
        <p class="value">${pendingKYC}</p>
      </div>
      <div class="stat-card">
        <h3>KYC Submissions</h3>
        <p class="value">${data.kycSubmissions.length}</p>
      </div>
    </div>
  </div>
`;
    }

    if (config.type === "transactions") {
      html += `
  <div class="section">
    <h2>Transaction History</h2>
    <div class="summary-box">
      <h4>Period Activity</h4>
      <p><strong>${data.transactions.length}</strong> transactions recorded</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Customer</th>
        </tr>
      </thead>
      <tbody>
`;

      data.transactions.forEach((transaction: any) => {
        html += `
        <tr>
          <td>${new Date(transaction.date).toLocaleDateString()}</td>
          <td>${transaction.type || 'Interest'}</td>
          <td>${formatCurrency(transaction.amount)}</td>
          <td>${transaction.customerName || 'N/A'}</td>
        </tr>
`;
      });

      html += `
      </tbody>
    </table>
  </div>
`;
    }

    html += `
  <div class="footer">
    <p><strong>FNG Financial Services</strong></p>
    <p>This is a system-generated report. For inquiries, contact your administrator.</p>
    <p>Report ID: FNG-${Date.now()}</p>
  </div>
</body>
</html>
`;

    // Create and download the file
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FNG_${config.type}_Report_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExcelReport = () => {
    const data = getReportData();
    
    // Create CSV content (compatible with Excel)
    let csv = `FNG FINANCIAL SERVICES - ${config.type.toUpperCase()} REPORT\n`;
    csv += `Period: ${new Date(config.startDate).toLocaleDateString()} - ${new Date(config.endDate).toLocaleDateString()}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    if (config.type === "financial" || config.type === "revenue") {
      csv += `REVENUE SUMMARY\n`;
      csv += `Revenue Stream,Amount,Percentage\n`;
      csv += `Monthly Service Charges,${data.revenue.serviceCharge},${((data.revenue.serviceCharge / data.revenue.total) * 100).toFixed(1)}%\n`;
      csv += `Insurance Fees,${data.revenue.insurance},${((data.revenue.insurance / data.revenue.total) * 100).toFixed(1)}%\n`;
      csv += `Loan Interest,${data.revenue.loanInterest},${((data.revenue.loanInterest / data.revenue.total) * 100).toFixed(1)}%\n`;
      csv += `Loan Service Charges,${data.revenue.loanServiceCharge},${((data.revenue.loanServiceCharge / data.revenue.total) * 100).toFixed(1)}%\n`;
      csv += `TOTAL REVENUE,${data.revenue.total},100%\n\n`;
    }

    if (config.type === "loans" || config.type === "financial") {
      csv += `LOAN PORTFOLIO\n`;
      csv += `Customer,Type,Amount,Repaid,Balance,Status,Date\n`;
      data.filteredLoans.forEach((loan: any) => {
        const balance = loan.amount - (loan.repaid || 0);
        csv += `${loan.customerName || 'N/A'},${loan.type || 'Standard'},${loan.amount},${loan.repaid || 0},${balance},${loan.status},${new Date(loan.createdAt || loan.date).toLocaleDateString()}\n`;
      });
      csv += `\n`;
    }

    if (config.type === "customers") {
      csv += `CUSTOMER LIST\n`;
      csv += `Name,Email,Phone,KYC Status,Joined Date\n`;
      data.customers.forEach((customer: any) => {
        const kyc = data.kycSubmissions.find((k: any) => k.email === customer.email);
        csv += `${customer.name || customer.fullName},${customer.email},${customer.phone || 'N/A'},${kyc?.status || 'Not Submitted'},${new Date(customer.createdAt || Date.now()).toLocaleDateString()}\n`;
      });
      csv += `\n`;
    }

    if (config.type === "transactions") {
      csv += `TRANSACTION HISTORY\n`;
      csv += `Date,Type,Amount,Customer,Loan Type\n`;
      data.transactions.forEach((transaction: any) => {
        csv += `${new Date(transaction.date).toLocaleDateString()},${transaction.type || 'Interest'},${transaction.amount},${transaction.customerName || 'N/A'},${transaction.loanType || 'N/A'}\n`;
      });
    }

    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FNG_${config.type}_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePrintReport = () => {
    const data = getReportData();
    const startDate = new Date(config.startDate).toLocaleDateString();
    const endDate = new Date(config.endDate).toLocaleDateString();

    // Open print window with formatted content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to print reports");
      return;
    }

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FNG Report - ${config.type.toUpperCase()}</title>
  <style>
    @page { size: A4; margin: 1.5cm; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    body { font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937; margin: 0; padding: 20px; }
    .header { text-align: center; border-bottom: 4px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #2563eb; margin: 0 0 10px 0; font-size: 32px; }
    .header .subtitle { color: #4b5563; font-size: 18px; margin: 5px 0; font-weight: 600; }
    .header .meta { color: #6b7280; font-size: 14px; margin: 3px 0; }
    .section { margin: 30px 0; }
    .section h2 { color: #1e40af; border-bottom: 3px solid #93c5fd; padding-bottom: 10px; margin-bottom: 20px; font-size: 22px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 25px 0; }
    .stat-card { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; }
    .stat-card h3 { color: #1e40af; margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-card .value { font-size: 28px; font-weight: bold; color: #1e3a8a; margin: 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    th { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 14px 10px; text-align: left; font-weight: 600; border: 1px solid #1e40af; }
    td { padding: 12px 10px; border: 1px solid #d1d5db; }
    tr:nth-child(even) { background: #f9fafb; }
    tr:hover { background: #eff6ff; }
    .summary-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 5px solid #f59e0b; padding: 18px; margin: 20px 0; border-radius: 8px; }
    .summary-box h4 { margin: 0 0 8px 0; color: #92400e; font-size: 16px; }
    .summary-box p { margin: 5px 0; color: #78350f; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 3px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .print-button { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 20px 0; }
    .print-button:hover { background: #1e40af; }
    .total-row { background: #dbeafe !important; font-weight: bold; border-top: 3px solid #2563eb !important; }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; margin-bottom: 20px;">
    <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
    <button class="print-button" onclick="window.close()" style="background: #6b7280; margin-left: 10px;">✕ Close</button>
  </div>

  <div class="header">
    <h1>FNG FINANCIAL SERVICES</h1>
    <div class="subtitle">${config.type.toUpperCase()} REPORT</div>
    <div class="meta">Report Period: ${startDate} - ${endDate}</div>
    <div class="meta">Generated: ${new Date().toLocaleString()}</div>
    <div class="meta">Report ID: FNG-RPT-${Date.now()}</div>
  </div>
`;

    // Add content based on type (same as Word version)
    if (config.type === "financial" || config.type === "revenue") {
      html += `
  <div class="section">
    <h2>📊 Revenue Summary</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="value">${formatCurrency(data.revenue.total)}</p>
      </div>
      <div class="stat-card">
        <h3>Loan Interest</h3>
        <p class="value">${formatCurrency(data.revenue.loanInterest)}</p>
      </div>
      <div class="stat-card">
        <h3>Service Charges</h3>
        <p class="value">${formatCurrency(data.revenue.serviceCharge)}</p>
      </div>
      <div class="stat-card">
        <h3>Insurance Fees</h3>
        <p class="value">${formatCurrency(data.revenue.insurance)}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Revenue Stream</th>
          <th style="text-align: right;">Amount (₦)</th>
          <th style="text-align: center;">Percentage</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monthly Service Charges</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.serviceCharge)}</td>
          <td style="text-align: center;">${((data.revenue.serviceCharge / data.revenue.total) * 100).toFixed(1)}%</td>
          <td>From customer contributions</td>
        </tr>
        <tr>
          <td>Loan Insurance Fees</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.insurance)}</td>
          <td style="text-align: center;">${((data.revenue.insurance / data.revenue.total) * 100).toFixed(1)}%</td>
          <td>One-time upfront fees</td>
        </tr>
        <tr>
          <td>Loan Interest Revenue</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.loanInterest)}</td>
          <td style="text-align: center;">${((data.revenue.loanInterest / data.revenue.total) * 100).toFixed(1)}%</td>
          <td>20% APR on active loans</td>
        </tr>
        <tr>
          <td>Loan Service Charges</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.loanServiceCharge)}</td>
          <td style="text-align: center;">${((data.revenue.loanServiceCharge / data.revenue.total) * 100).toFixed(1)}%</td>
          <td>Processing fees</td>
        </tr>
        <tr class="total-row">
          <td><strong>TOTAL REVENUE</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(data.revenue.total)}</strong></td>
          <td style="text-align: center;"><strong>100.0%</strong></td>
          <td><strong>All revenue streams</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
`;
    }

    if (config.type === "loans" || config.type === "financial") {
      const activeLoans = data.filteredLoans.filter((l: any) => l.status === "active");
      const completedLoans = data.filteredLoans.filter((l: any) => l.status === "completed");
      const totalDisbursed = data.filteredLoans.reduce((sum: number, l: any) => sum + l.amount, 0);
      const totalRepaid = data.filteredLoans.reduce((sum: number, l: any) => sum + (l.repaid || 0), 0);
      const totalBalance = totalDisbursed - totalRepaid;

      html += `
  <div class="section page-break">
    <h2>💰 Loan Portfolio Analysis</h2>
    <div class="summary-box">
      <h4>Period Summary</h4>
      <p><strong>${data.filteredLoans.length}</strong> total loans | 
         <strong>${activeLoans.length}</strong> active | 
         <strong>${completedLoans.length}</strong> completed | 
         Outstanding: <strong>${formatCurrency(totalBalance)}</strong></p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Disbursed</h3>
        <p class="value">${formatCurrency(totalDisbursed)}</p>
      </div>
      <div class="stat-card">
        <h3>Total Repaid</h3>
        <p class="value">${formatCurrency(totalRepaid)}</p>
      </div>
      <div class="stat-card">
        <h3>Active Loans</h3>
        <p class="value">${activeLoans.length}</p>
      </div>
      <div class="stat-card">
        <h3>Completed</h3>
        <p class="value">${completedLoans.length}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Type</th>
          <th style="text-align: right;">Amount</th>
          <th style="text-align: right;">Repaid</th>
          <th style="text-align: right;">Balance</th>
          <th style="text-align: center;">Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
`;

      data.filteredLoans.forEach((loan: any) => {
        const balance = loan.amount - (loan.repaid || 0);
        const statusIcon = loan.status === 'completed' ? '✓' : '⟳';
        const statusColor = loan.status === 'completed' ? '#059669' : '#f59e0b';
        
        html += `
        <tr>
          <td>${loan.customerName || 'N/A'}</td>
          <td>${loan.type || 'Standard'}</td>
          <td style="text-align: right;">${formatCurrency(loan.amount)}</td>
          <td style="text-align: right;">${formatCurrency(loan.repaid || 0)}</td>
          <td style="text-align: right;">${formatCurrency(balance)}</td>
          <td style="text-align: center; color: ${statusColor}; font-weight: bold;">${statusIcon} ${loan.status}</td>
          <td>${new Date(loan.createdAt || loan.date).toLocaleDateString()}</td>
        </tr>
`;
      });

      html += `
        <tr class="total-row">
          <td colspan="2"><strong>TOTALS</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(totalDisbursed)}</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(totalRepaid)}</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(totalBalance)}</strong></td>
          <td colspan="2"></td>
        </tr>
      </tbody>
    </table>
  </div>
`;
    }

    if (config.type === "customers" || config.type === "financial") {
      const approvedKYC = data.kycSubmissions.filter((k: any) => k.status === "approved").length;
      const pendingKYC = data.kycSubmissions.filter((k: any) => k.status === "pending").length;
      const rejectedKYC = data.kycSubmissions.filter((k: any) => k.status === "rejected").length;

      html += `
  <div class="section page-break">
    <h2>👥 Customer Overview</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Customers</h3>
        <p class="value">${data.customers.length}</p>
      </div>
      <div class="stat-card">
        <h3>Approved KYC</h3>
        <p class="value">${approvedKYC}</p>
      </div>
      <div class="stat-card">
        <h3>Pending KYC</h3>
        <p class="value">${pendingKYC}</p>
      </div>
      <div class="stat-card">
        <h3>Total KYC</h3>
        <p class="value">${data.kycSubmissions.length}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th style="text-align: center;">KYC Status</th>
          <th>Join Date</th>
        </tr>
      </thead>
      <tbody>
`;

      data.customers.slice(0, 50).forEach((customer: any) => {
        const kyc = data.kycSubmissions.find((k: any) => k.email === customer.email);
        const kycStatus = kyc?.status || 'Not Submitted';
        const statusColor = kycStatus === 'approved' ? '#059669' : kycStatus === 'pending' ? '#f59e0b' : '#6b7280';
        
        html += `
        <tr>
          <td>${customer.name || customer.fullName || 'N/A'}</td>
          <td>${customer.email}</td>
          <td>${customer.phone || 'N/A'}</td>
          <td style="text-align: center; color: ${statusColor}; font-weight: 600;">${kycStatus}</td>
          <td>${new Date(customer.createdAt || Date.now()).toLocaleDateString()}</td>
        </tr>
`;
      });

      html += `
      </tbody>
    </table>
    ${data.customers.length > 50 ? `<p style="text-align: center; color: #6b7280; margin-top: 10px;"><em>Showing first 50 customers of ${data.customers.length} total</em></p>` : ''}
  </div>
`;
    }

    if (config.type === "transactions") {
      const totalAmount = data.transactions.reduce((sum: number, t: any) => sum + t.amount, 0);

      html += `
  <div class="section page-break">
    <h2>📝 Transaction History</h2>
    <div class="summary-box">
      <h4>Transaction Summary</h4>
      <p><strong>${data.transactions.length}</strong> transactions | Total Amount: <strong>${formatCurrency(totalAmount)}</strong></p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Transaction Type</th>
          <th style="text-align: right;">Amount</th>
          <th>Customer</th>
          <th>Loan Type</th>
        </tr>
      </thead>
      <tbody>
`;

      data.transactions.forEach((transaction: any) => {
        html += `
        <tr>
          <td>${new Date(transaction.date).toLocaleDateString()}</td>
          <td>${transaction.type || 'Interest Payment'}</td>
          <td style="text-align: right;">${formatCurrency(transaction.amount)}</td>
          <td>${transaction.customerName || 'N/A'}</td>
          <td>${transaction.loanType || 'N/A'}</td>
        </tr>
`;
      });

      html += `
        <tr class="total-row">
          <td colspan="2"><strong>TOTAL</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(totalAmount)}</strong></td>
          <td colspan="2"></td>
        </tr>
      </tbody>
    </table>
  </div>
`;
    }

    html += `
  <div class="footer">
    <p style="font-size: 14px; margin-bottom: 10px;"><strong>FNG FINANCIAL SERVICES</strong></p>
    <p>This is a system-generated report and is valid without signature.</p>
    <p>For inquiries or clarifications, please contact your system administrator.</p>
    <p style="margin-top: 15px; font-style: italic;">Report ID: FNG-RPT-${Date.now()}</p>
    <p style="margin-top: 5px;">Printed: ${new Date().toLocaleString()}</p>
  </div>

  <script>
    // Auto-print option (commented out by default)
    // window.onload = function() { window.print(); }
  </script>
</body>
</html>
`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleGenerateReport = async () => {
    setGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing

      if (config.format === "word") {
        await generateWordReport();
        toast.success("Word document generated successfully!");
      } else if (config.format === "excel") {
        generateExcelReport();
        toast.success("Excel file generated successfully!");
      } else if (config.format === "print") {
        generatePrintReport();
        toast.success("Print preview opened!");
      }

      updateReportStats();
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const reportTypes = [
    { value: "financial", label: "Financial Summary", icon: BarChart3, description: "Complete financial overview" },
    { value: "revenue", label: "Revenue Analytics", icon: TrendingUp, description: "Revenue streams breakdown" },
    { value: "loans", label: "Loan Portfolio", icon: DollarSign, description: "All loan details" },
    { value: "customers", label: "Customer Report", icon: Users, description: "Customer list & KYC" },
    { value: "transactions", label: "Transaction History", icon: Activity, description: "All transactions" }
  ];

  const formatTypes = [
    { value: "excel", label: "Excel (CSV)", icon: FileSpreadsheet, description: "Spreadsheet format" },
    { value: "word", label: "Word Document", icon: FileText, description: "Formatted document" },
    { value: "print", label: "Print/PDF", icon: Printer, description: "Printable format" }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl">Generate Reports</h2>
        <p className="text-gray-600">
          Create comprehensive reports in Word, Excel, or printable format
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <File className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports Generated</p>
              <p className="text-2xl">{reportStats.totalReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Generated</p>
              <p className="text-sm">
                {reportStats.lastGenerated 
                  ? new Date(reportStats.lastGenerated).toLocaleString()
                  : "No reports yet"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3>Report Configuration</h3>
            <p className="text-sm text-gray-600">Select report type, format, and date range</p>
          </div>

          <Separator />

          {/* Report Type */}
          <div className="space-y-3">
            <Label>Report Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = config.type === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setConfig({ ...config, type: type.value as any })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                      <div>
                        <p className={`font-medium ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Type */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {formatTypes.map((format) => {
                const Icon = format.icon;
                const isSelected = config.format === format.value;
                return (
                  <button
                    key={format.value}
                    onClick={() => setConfig({ ...config, format: format.value as any })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? "text-green-600" : "text-gray-600"}`} />
                      <div>
                        <p className={`font-medium ${isSelected ? "text-green-900" : "text-gray-900"}`}>
                          {format.label}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{format.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Report Preview:</strong> {config.type.charAt(0).toUpperCase() + config.type.slice(1)} report from{" "}
              {new Date(config.startDate).toLocaleDateString()} to {new Date(config.endDate).toLocaleDateString()}{" "}
              will be exported as <strong>{config.format.toUpperCase()}</strong> format.
            </AlertDescription>
          </Alert>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReport}
            disabled={generating}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
            size="lg"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Generate {config.format.charAt(0).toUpperCase() + config.format.slice(1)} Report
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Help Section */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-3 rounded-full">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-purple-900">Report Generation Guide</h3>
              <p className="text-sm text-purple-700 mt-1">Tips for creating comprehensive reports</p>
            </div>
          </div>

          <Separator className="bg-purple-200" />

          <div className="space-y-3 text-sm text-purple-900">
            <div className="flex gap-3">
              <span className="text-purple-600">📊</span>
              <p><strong>Excel Format:</strong> Best for data analysis, filtering, and pivot tables. Opens in Microsoft Excel, Google Sheets, or any spreadsheet software.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-600">📄</span>
              <p><strong>Word Format:</strong> Professional documents with formatted tables and headers. Opens in Microsoft Word or compatible word processors.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-600">🖨️</span>
              <p><strong>Print/PDF Format:</strong> Optimized for printing or saving as PDF. Use your browser's "Save as PDF" option when printing.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-600">📅</span>
              <p><strong>Date Ranges:</strong> Select appropriate date ranges to include relevant data. Use broader ranges for trend analysis.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
