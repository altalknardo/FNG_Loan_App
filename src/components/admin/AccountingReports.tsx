import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  Printer,
  AlertCircle,
  CheckCircle2,
  Calculator
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../../lib/utils";

interface AccountingData {
  revenue: {
    contributions: number;
    loanInterest: number;
    loanServiceCharges: number;
    insurance: number;
    upfrontDeposits: number;
    monthlyServiceCharges: number;
    total: number;
  };
  expenses: {
    loanDisbursements: number;
    withdrawals: number;
    depositRefunds: number;
    operatingExpenses: number;
    total: number;
  };
  taxes: {
    monthlyVAT: number;
    annualIncomeTax: number;
    taxableIncome: number;
    taxRate: number;
  };
  netProfit: number;
  period: string;
}

export function AccountingReports() {
  const [reportType, setReportType] = useState<"monthly" | "annual">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [accountingData, setAccountingData] = useState<AccountingData | null>(null);
  const [generating, setGenerating] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    if (reportType === "monthly") {
      generateMonthlyReport();
    } else {
      generateAnnualReport();
    }
  }, [reportType, selectedMonth, selectedYear]);

  const calculateVAT = (serviceCharges: number): number => {
    return serviceCharges * 0.075; // 7.5% VAT on service charges
  };

  const calculateIncomeTax = (revenue: number): { tax: number; rate: number } => {
    if (revenue > 100000000) {
      return { tax: revenue * 0.30, rate: 30 }; // 30% for revenue > ₦100M
    } else if (revenue > 25000000) {
      return { tax: revenue * 0.20, rate: 20 }; // 20% for revenue > ₦25M
    } else {
      return { tax: 0, rate: 0 }; // No tax below ₦25M
    }
  };

  const generateMonthlyReport = () => {
    const [year, month] = selectedMonth.split("-");
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const data = getDataForPeriod(startDate, endDate);
    
    // Calculate monthly VAT on service charges
    const monthlyVAT = calculateVAT(data.revenue.monthlyServiceCharges);

    const accountingData: AccountingData = {
      revenue: data.revenue,
      expenses: data.expenses,
      taxes: {
        monthlyVAT,
        annualIncomeTax: 0, // Not applicable for monthly
        taxableIncome: data.revenue.total - data.expenses.total,
        taxRate: 0
      },
      netProfit: data.revenue.total - data.expenses.total - monthlyVAT,
      period: `${months[parseInt(month) - 1]} ${year}`
    };

    setAccountingData(accountingData);
  };

  const generateAnnualReport = () => {
    const startDate = new Date(parseInt(selectedYear), 0, 1);
    const endDate = new Date(parseInt(selectedYear), 11, 31);

    const data = getDataForPeriod(startDate, endDate);
    
    // Calculate annual VAT (sum of all monthly VATs)
    const annualVAT = calculateVAT(data.revenue.monthlyServiceCharges);
    
    // Calculate income tax based on annual revenue
    const taxableIncome = data.revenue.total - data.expenses.total;
    const { tax: incomeTax, rate: taxRate } = calculateIncomeTax(data.revenue.total);

    const accountingData: AccountingData = {
      revenue: data.revenue,
      expenses: data.expenses,
      taxes: {
        monthlyVAT: annualVAT,
        annualIncomeTax: incomeTax,
        taxableIncome,
        taxRate
      },
      netProfit: taxableIncome - annualVAT - incomeTax,
      period: `Financial Year ${selectedYear}`
    };

    setAccountingData(accountingData);
  };

  const getDataForPeriod = (startDate: Date, endDate: Date) => {
    // Get all transactions
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const activeLoans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");

    // Filter transactions by date
    const filteredTransactions = transactions.filter((t: any) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    // Calculate revenue streams
    const contributionRevenue = filteredTransactions
      .filter((t: any) => t.type === "contribution")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const loanRepayments = filteredTransactions
      .filter((t: any) => t.type === "repayment")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    // Get interest earned from repayments (20% APR)
    const loanInterest = parseFloat(localStorage.getItem("loanInterestBalance") || "0");

    // Get service charges
    const loanServiceCharges = parseFloat(localStorage.getItem("loanServiceChargeBalance") || "0");
    const monthlyServiceCharges = parseFloat(localStorage.getItem("contributionServiceChargeBalance") || "0");

    // Get insurance fees
    const insurance = parseFloat(localStorage.getItem("insuranceBalance") || "0");

    // Get upfront deposits (held separately)
    const upfrontDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");

    // Calculate expenses
    const disbursedLoans = activeLoans
      .filter((l: any) => {
        const lDate = new Date(l.createdAt || l.date);
        return lDate >= startDate && lDate <= endDate;
      })
      .reduce((sum: number, l: any) => sum + l.amount, 0);

    const approvedWithdrawals = withdrawalRequests
      .filter((w: any) => {
        const wDate = new Date(w.requestDate);
        return w.status === "approved" && wDate >= startDate && wDate <= endDate;
      })
      .reduce((sum: number, w: any) => sum + w.amount, 0);

    const depositRefunds = filteredTransactions
      .filter((t: any) => t.type === "deposit_refund")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const revenue = {
      contributions: contributionRevenue,
      loanInterest: loanInterest,
      loanServiceCharges: loanServiceCharges,
      insurance: insurance,
      upfrontDeposits: upfrontDeposits,
      monthlyServiceCharges: monthlyServiceCharges,
      total: contributionRevenue + loanInterest + loanServiceCharges + insurance + monthlyServiceCharges
    };

    const expenses = {
      loanDisbursements: disbursedLoans,
      withdrawals: approvedWithdrawals,
      depositRefunds: depositRefunds,
      operatingExpenses: 0, // Can be added manually
      total: disbursedLoans + approvedWithdrawals + depositRefunds
    };

    return { revenue, expenses };
  };

  const downloadWordReport = () => {
    if (!accountingData) return;

    setGenerating(true);

    const html = generateHTMLReport(accountingData, "word");

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FNG_Accounting_${reportType}_${selectedMonth || selectedYear}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Accounting report downloaded successfully!");
    setGenerating(false);
  };

  const downloadExcelReport = () => {
    if (!accountingData) return;

    setGenerating(true);

    let csv = `FNG FINANCIAL SERVICES - ACCOUNTING REPORT\n`;
    csv += `Report Type: ${reportType.toUpperCase()}\n`;
    csv += `Period: ${accountingData.period}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    csv += `REVENUE BREAKDOWN\n`;
    csv += `Category,Amount (₦)\n`;
    csv += `Contributions,${accountingData.revenue.contributions}\n`;
    csv += `Loan Interest (20% APR),${accountingData.revenue.loanInterest}\n`;
    csv += `Loan Service Charges,${accountingData.revenue.loanServiceCharges}\n`;
    csv += `Insurance Fees,${accountingData.revenue.insurance}\n`;
    csv += `Monthly Service Charges,${accountingData.revenue.monthlyServiceCharges}\n`;
    csv += `TOTAL REVENUE,${accountingData.revenue.total}\n\n`;

    csv += `EXPENSES BREAKDOWN\n`;
    csv += `Category,Amount (₦)\n`;
    csv += `Loan Disbursements,${accountingData.expenses.loanDisbursements}\n`;
    csv += `Customer Withdrawals,${accountingData.expenses.withdrawals}\n`;
    csv += `Deposit Refunds,${accountingData.expenses.depositRefunds}\n`;
    csv += `Operating Expenses,${accountingData.expenses.operatingExpenses}\n`;
    csv += `TOTAL EXPENSES,${accountingData.expenses.total}\n\n`;

    csv += `TAX CALCULATIONS\n`;
    csv += `Description,Amount (₦)\n`;
    csv += `Gross Profit,${accountingData.revenue.total - accountingData.expenses.total}\n`;
    csv += `VAT on Service Charges (7.5%),${accountingData.taxes.monthlyVAT}\n`;
    
    if (reportType === "annual") {
      csv += `Annual Income Tax (${accountingData.taxes.taxRate}%),${accountingData.taxes.annualIncomeTax}\n`;
      csv += `Tax Rate Applied,${accountingData.taxes.taxRate}%\n`;
    }
    
    csv += `TOTAL TAX LIABILITY,${accountingData.taxes.monthlyVAT + accountingData.taxes.annualIncomeTax}\n\n`;

    csv += `NET PROFIT (After Tax),${accountingData.netProfit}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FNG_Accounting_${reportType}_${selectedMonth || selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Accounting report exported to Excel!");
    setGenerating(false);
  };

  const printReport = () => {
    if (!accountingData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to print reports");
      return;
    }

    const html = generateHTMLReport(accountingData, "print");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    toast.success("Opening print preview...");
  };

  const generateHTMLReport = (data: AccountingData, format: "word" | "print"): string => {
    const taxInfo = reportType === "annual" 
      ? `<tr>
          <td>Annual Income Tax (${data.taxes.taxRate}%)</td>
          <td style="text-align: right;">${formatCurrency(data.taxes.annualIncomeTax)}</td>
        </tr>`
      : '';

    const taxNotes = reportType === "annual"
      ? `<div class="tax-note">
          <p><strong>Income Tax Rates Applied:</strong></p>
          <ul>
            <li>0% for revenue ≤ ₦25,000,000</li>
            <li>20% for revenue > ₦25,000,000</li>
            <li>30% for revenue > ₦100,000,000</li>
          </ul>
          <p><strong>Current Revenue:</strong> ${formatCurrency(data.revenue.total)}</p>
          <p><strong>Tax Rate Applied:</strong> ${data.taxes.taxRate}%</p>
          <p><strong>Tax Amount:</strong> ${formatCurrency(data.taxes.annualIncomeTax)}</p>
        </div>`
      : '';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FNG Accounting Report - ${data.period}</title>
  <style>
    @page { size: A4; margin: 2cm; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body { 
      font-family: 'Arial', sans-serif; 
      line-height: 1.6; 
      color: #1f2937; 
      max-width: 900px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    .header { 
      text-align: center; 
      border-bottom: 4px solid #2563eb; 
      padding-bottom: 20px; 
      margin-bottom: 40px; 
    }
    .header h1 { 
      color: #2563eb; 
      margin: 0 0 10px 0; 
      font-size: 36px; 
    }
    .header .subtitle { 
      color: #1e40af; 
      font-size: 22px; 
      font-weight: 600; 
      margin: 5px 0; 
    }
    .header .period { 
      color: #6b7280; 
      font-size: 16px; 
      margin: 10px 0; 
    }
    .section { 
      margin: 35px 0; 
      page-break-inside: avoid; 
    }
    .section h2 { 
      color: #1e40af; 
      border-bottom: 3px solid #93c5fd; 
      padding-bottom: 12px; 
      margin-bottom: 20px; 
      font-size: 24px; 
    }
    .summary-cards { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 20px; 
      margin: 25px 0; 
    }
    .summary-card { 
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); 
      border: 2px solid #3b82f6; 
      border-radius: 12px; 
      padding: 20px; 
      text-align: center; 
    }
    .summary-card.revenue { 
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); 
      border-color: #10b981; 
    }
    .summary-card.expense { 
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); 
      border-color: #ef4444; 
    }
    .summary-card.profit { 
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); 
      border-color: #f59e0b; 
    }
    .summary-card h3 { 
      margin: 0 0 10px 0; 
      font-size: 14px; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      color: #374151; 
    }
    .summary-card .value { 
      font-size: 32px; 
      font-weight: bold; 
      margin: 0; 
      color: #111827; 
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    }
    th { 
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); 
      color: white; 
      padding: 16px 12px; 
      text-align: left; 
      font-weight: 600; 
      font-size: 14px; 
    }
    td { 
      padding: 14px 12px; 
      border-bottom: 1px solid #e5e7eb; 
    }
    tr:nth-child(even) { 
      background: #f9fafb; 
    }
    tr:hover { 
      background: #eff6ff; 
    }
    .total-row { 
      background: #dbeafe !important; 
      font-weight: bold; 
      border-top: 3px solid #2563eb !important; 
      font-size: 16px; 
    }
    .tax-section { 
      background: #fef3c7; 
      border: 2px solid #f59e0b; 
      border-radius: 12px; 
      padding: 25px; 
      margin: 30px 0; 
    }
    .tax-section h3 { 
      color: #92400e; 
      margin: 0 0 20px 0; 
      font-size: 20px; 
    }
    .tax-note { 
      background: #fff7ed; 
      border-left: 4px solid #ea580c; 
      padding: 20px; 
      margin: 20px 0; 
      border-radius: 8px; 
    }
    .tax-note ul { 
      margin: 10px 0; 
      padding-left: 25px; 
    }
    .tax-note li { 
      margin: 8px 0; 
      color: #7c2d12; 
    }
    .profit-card { 
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); 
      border: 3px solid #10b981; 
      border-radius: 12px; 
      padding: 30px; 
      text-align: center; 
      margin: 30px 0; 
    }
    .profit-card h2 { 
      color: #065f46; 
      margin: 0 0 15px 0; 
      border: none; 
      padding: 0; 
    }
    .profit-card .amount { 
      font-size: 48px; 
      font-weight: bold; 
      color: #047857; 
      margin: 10px 0; 
    }
    .footer { 
      margin-top: 50px; 
      padding-top: 25px; 
      border-top: 3px solid #e5e7eb; 
      text-align: center; 
      color: #6b7280; 
      font-size: 13px; 
    }
    .print-button { 
      background: #2563eb; 
      color: white; 
      border: none; 
      padding: 14px 28px; 
      border-radius: 8px; 
      cursor: pointer; 
      font-size: 16px; 
      margin: 10px; 
      font-weight: 600; 
    }
    .print-button:hover { 
      background: #1e40af; 
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      color: rgba(37, 99, 235, 0.05);
      font-weight: bold;
      z-index: -1;
      pointer-events: none;
    }
  </style>
</head>
<body>
  ${format === "print" ? `
    <div class="no-print" style="text-align: center; margin-bottom: 30px;">
      <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
      <button class="print-button" onclick="window.close()" style="background: #6b7280;">✕ Close</button>
    </div>
  ` : ''}
  
  <div class="watermark">FNG</div>

  <div class="header">
    <h1>FNG FINANCIAL SERVICES</h1>
    <div class="subtitle">ACCOUNTING REPORT</div>
    <div class="period">${data.period}</div>
    <div class="period" style="font-size: 13px;">Generated: ${new Date().toLocaleString()}</div>
  </div>

  <div class="summary-cards">
    <div class="summary-card revenue">
      <h3>Total Revenue</h3>
      <p class="value">${formatCurrency(data.revenue.total)}</p>
    </div>
    <div class="summary-card expense">
      <h3>Total Expenses</h3>
      <p class="value">${formatCurrency(data.expenses.total)}</p>
    </div>
    <div class="summary-card profit">
      <h3>Net Profit</h3>
      <p class="value">${formatCurrency(data.netProfit)}</p>
    </div>
  </div>

  <div class="section">
    <h2>💰 Revenue Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Revenue Stream</th>
          <th style="text-align: right;">Amount (₦)</th>
          <th style="text-align: center;">% of Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Customer Contributions</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.contributions)}</td>
          <td style="text-align: center;">${((data.revenue.contributions / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Loan Interest (20% APR)</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.loanInterest)}</td>
          <td style="text-align: center;">${((data.revenue.loanInterest / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Loan Service Charges</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.loanServiceCharges)}</td>
          <td style="text-align: center;">${((data.revenue.loanServiceCharges / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Insurance Fees</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.insurance)}</td>
          <td style="text-align: center;">${((data.revenue.insurance / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Monthly Service Charges</td>
          <td style="text-align: right;">${formatCurrency(data.revenue.monthlyServiceCharges)}</td>
          <td style="text-align: center;">${((data.revenue.monthlyServiceCharges / data.revenue.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr class="total-row">
          <td><strong>TOTAL REVENUE</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(data.revenue.total)}</strong></td>
          <td style="text-align: center;"><strong>100.0%</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>📊 Expense Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Expense Category</th>
          <th style="text-align: right;">Amount (₦)</th>
          <th style="text-align: center;">% of Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Loan Disbursements</td>
          <td style="text-align: right;">${formatCurrency(data.expenses.loanDisbursements)}</td>
          <td style="text-align: center;">${((data.expenses.loanDisbursements / data.expenses.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Customer Withdrawals</td>
          <td style="text-align: right;">${formatCurrency(data.expenses.withdrawals)}</td>
          <td style="text-align: center;">${((data.expenses.withdrawals / data.expenses.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Deposit Refunds</td>
          <td style="text-align: right;">${formatCurrency(data.expenses.depositRefunds)}</td>
          <td style="text-align: center;">${((data.expenses.depositRefunds / data.expenses.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td>Operating Expenses</td>
          <td style="text-align: right;">${formatCurrency(data.expenses.operatingExpenses)}</td>
          <td style="text-align: center;">${((data.expenses.operatingExpenses / data.expenses.total) * 100).toFixed(1)}%</td>
        </tr>
        <tr class="total-row">
          <td><strong>TOTAL EXPENSES</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(data.expenses.total)}</strong></td>
          <td style="text-align: center;"><strong>100.0%</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="tax-section">
      <h3>📋 Tax Calculations & Compliance</h3>
      <table>
        <thead>
          <tr>
            <th>Tax Item</th>
            <th style="text-align: right;">Amount (₦)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gross Profit (Revenue - Expenses)</td>
            <td style="text-align: right;">${formatCurrency(data.revenue.total - data.expenses.total)}</td>
          </tr>
          <tr>
            <td>VAT on Service Charges (7.5%)</td>
            <td style="text-align: right;">${formatCurrency(data.taxes.monthlyVAT)}</td>
          </tr>
          ${taxInfo}
          <tr class="total-row">
            <td><strong>TOTAL TAX LIABILITY</strong></td>
            <td style="text-align: right;"><strong>${formatCurrency(data.taxes.monthlyVAT + data.taxes.annualIncomeTax)}</strong></td>
          </tr>
        </tbody>
      </table>
      
      ${taxNotes}
      
      <div class="tax-note">
        <p><strong>VAT Calculation:</strong></p>
        <p>Monthly Service Charges: ${formatCurrency(data.revenue.monthlyServiceCharges)}</p>
        <p>VAT Rate: 7.5%</p>
        <p>VAT Amount: ${formatCurrency(data.taxes.monthlyVAT)}</p>
      </div>
    </div>
  </div>

  <div class="profit-card">
    <h2>NET PROFIT (After Tax)</h2>
    <p class="amount">${formatCurrency(data.netProfit)}</p>
    <p style="color: #065f46; margin: 10px 0;">
      ${data.netProfit > 0 ? '✓ Profitable' : '⚠️ Loss'} | 
      Margin: ${((data.netProfit / data.revenue.total) * 100).toFixed(1)}%
    </p>
  </div>

  <div class="footer">
    <p><strong>FNG FINANCIAL SERVICES</strong></p>
    <p>This is a system-generated accounting report for ${data.period}</p>
    <p>Report ID: FNG-ACC-${Date.now()}</p>
    <p style="margin-top: 15px; font-size: 11px;">
      For tax compliance queries, consult with a licensed tax professional<br/>
      All figures are in Nigerian Naira (₦)
    </p>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2">Accounting Reports</h2>
        <p className="text-sm text-gray-600">
          Generate comprehensive monthly and annual accounting reports with tax calculations
        </p>
      </div>

      {/* Report Configuration */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={(value: "monthly" | "annual") => setReportType(value)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly Report</SelectItem>
                <SelectItem value="annual">Annual Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportType === "monthly" && (
            <div>
              <Label>Select Month</Label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                max={new Date().toISOString().slice(0, 7)}
                className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          {reportType === "annual" && (
            <div>
              <Label>Select Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      {/* Report Preview */}
      {accountingData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Total Revenue</p>
                  <h3 className="text-green-900 mt-1">{formatCurrency(accountingData.revenue.total)}</h3>
                </div>
                <div className="bg-green-600 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Total Expenses</p>
                  <h3 className="text-red-900 mt-1">{formatCurrency(accountingData.expenses.total)}</h3>
                </div>
                <div className="bg-red-600 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Net Profit</p>
                  <h3 className="text-blue-900 mt-1">{formatCurrency(accountingData.netProfit)}</h3>
                </div>
                <div className="bg-blue-600 p-3 rounded-full">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tax Information */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <div className="flex items-start gap-3">
              <div className="bg-amber-600 p-2 rounded-full flex-shrink-0">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-amber-900">Tax Summary</h4>
                <Separator className="my-3 bg-amber-200" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-700">VAT on Service Charges (7.5%):</span>
                    <span className="text-amber-900">{formatCurrency(accountingData.taxes.monthlyVAT)}</span>
                  </div>
                  {reportType === "annual" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Annual Income Tax ({accountingData.taxes.taxRate}%):</span>
                        <span className="text-amber-900">{formatCurrency(accountingData.taxes.annualIncomeTax)}</span>
                      </div>
                      <Separator className="my-2 bg-amber-200" />
                      <div className="flex justify-between">
                        <span className="text-amber-900">Total Tax Liability:</span>
                        <span className="text-amber-900">{formatCurrency(accountingData.taxes.monthlyVAT + accountingData.taxes.annualIncomeTax)}</span>
                      </div>
                    </>
                  )}
                </div>
                
                {reportType === "annual" && (
                  <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Income Tax Brackets:</strong><br/>
                      • 0% for revenue ≤ ₦25M<br/>
                      • 20% for revenue &gt; ₦25M<br/>
                      • 30% for revenue &gt; ₦100M
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="p-6">
            <h4 className="mb-4">Revenue Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(accountingData.revenue)
                .filter(([key]) => key !== 'total')
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between pb-2 border-b">
                    <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm">{formatCurrency(value)}</span>
                  </div>
                ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-blue-900">Total Revenue</span>
                <span className="text-blue-900">{formatCurrency(accountingData.revenue.total)}</span>
              </div>
            </div>
          </Card>

          {/* Export Actions */}
          <Card className="p-6">
            <h4 className="mb-4">Export Report</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button onClick={downloadWordReport} disabled={generating} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download Word
              </Button>
              <Button onClick={downloadExcelReport} disabled={generating} variant="outline" className="w-full">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={printReport} variant="outline" className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
