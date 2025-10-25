import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { CheckCircle2, XCircle, Clock, Eye, Coins, Shield, DollarSign, Building2, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency, calculateUpfrontCosts } from "../../lib/utils";

interface LoanApplication {
  id: number;
  userId: string;
  userName: string;
  amount: number;
  period: number;
  purpose: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
  creditScore: number;
  totalContributions: number;
  loanHistory: number;
  loanType?: "sme" | "business" | "jumbo";
  upfrontCosts?: {
    deposit: number;
    insurance: number;
    insuranceRate: number;
    serviceCharge: number;
    totalUpfront: number;
    paid: boolean;
    paidAt: string | null;
    paidFrom: string | null;
  };
  guarantor?: {
    name: string;
    phone: string;
    address: string;
    relationship: string;
    employer: string;
  };
}

export function LoanApprovals() {
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Load real loan applications and merge with demo data
  const loadApplications = () => {
    const realApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const demoApplications = [
      {
        id: 1,
        userId: "USR001",
        userName: "John Doe",
        amount: 50000,
        period: 24,
        purpose: "Business expansion",
        appliedDate: "2025-10-14",
        status: "pending",
        creditScore: 720,
        totalContributions: 125000,
        loanHistory: 2,
        loanType: "sme",
      },
    {
      id: 2,
      userId: "USR002",
      userName: "Jane Smith",
      amount: 800000,
      period: 24,
      purpose: "Inventory purchase",
      appliedDate: "2025-10-13",
      status: "pending",
      creditScore: 680,
      totalContributions: 85000,
      loanHistory: 1,
      loanType: "sme",
    },
    {
      id: 3,
      userId: "USR003",
      userName: "Mike Johnson",
      amount: 3000000,
      period: 52,
      purpose: "Factory equipment",
      appliedDate: "2025-10-13",
      status: "pending",
      creditScore: 750,
      totalContributions: 200000,
      loanHistory: 3,
      loanType: "business",
    },
    {
      id: 4,
      userId: "USR004",
      userName: "Sarah Williams",
      amount: 8000000,
      period: 104,
      purpose: "Real estate development",
      appliedDate: "2025-10-12",
      status: "approved",
      creditScore: 690,
      totalContributions: 150000,
      loanHistory: 1,
      loanType: "jumbo",
    },
    ];

    // Convert real applications to the format expected by the admin interface
    const convertedRealApplications = realApplications.map((app: any) => ({
      id: app.id,
      userId: "USER",
      userName: "Customer",
      amount: app.principal,
      period: app.period,
      purpose: app.purpose,
      appliedDate: new Date(app.submittedAt).toISOString().split('T')[0],
      status: app.status,
      creditScore: 700, // Default score
      totalContributions: parseFloat(localStorage.getItem("totalContributions") || "0"),
      loanHistory: 0,
      loanType: app.loanType,
      upfrontCosts: app.upfrontCosts, // Include upfront costs info
      guarantor: app.guarantor
    }));

    // Merge and filter out duplicates by ID
    const merged = [...convertedRealApplications, ...demoApplications];
    const uniqueApplications = merged.filter((app, index, self) =>
      index === self.findIndex((a) => a.id === app.id)
    );

    return uniqueApplications;
  };

  const [applications, setApplications] = useState<LoanApplication[]>(loadApplications());

  // Reload applications when balance updates (indicating a payment was made)
  useEffect(() => {
    const handleBalanceUpdate = () => {
      setApplications(loadApplications());
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate);
    return () => window.removeEventListener("balanceUpdated", handleBalanceUpdate);
  }, []);

  const handleApprove = (application: LoanApplication) => {
    // Check if upfront payment is required
    const requireUpfrontPayment = JSON.parse(localStorage.getItem("requireUpfrontPayment") || "true");
    
    // Check if upfront is paid (from real loan applications)
    const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const realApplication = loanApplications.find((app: any) => app.id === application.id);
    const upfrontPaid = realApplication?.upfrontCosts?.paid || false;
    
    if (requireUpfrontPayment && !upfrontPaid) {
      toast.error("Cannot approve: Customer has not paid upfront costs yet");
      return;
    }

    // Check if company has sufficient balance for disbursement
    const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
    if (companyBalance < application.amount) {
      toast.error(`Insufficient company balance. Available: ${formatCurrency(companyBalance)}, Required: ${formatCurrency(application.amount)}`);
      return;
    }
    
    // Update loan application status in localStorage
    const updatedApplications = loanApplications.map((app: any) =>
      app.id === application.id ? { ...app, status: "approved" } : app
    );
    localStorage.setItem("loanApplications", JSON.stringify(updatedApplications));
    
    // Create active loan
    const activeLoans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    
    // Calculate interest rate based on loan period
    // 6 weeks = 10% interest, 12 weeks = 20% interest
    const interestRate = application.period === 6 ? 0.10 : 0.20;
    const totalWithInterest = application.amount * (1 + interestRate);
    const weeklyPayment = totalWithInterest / application.period;
    
    // Calculate deposit amount (10% of loan)
    const depositAmount = application.amount * 0.10;
    
    const newLoan = {
      id: application.id,
      amount: totalWithInterest,
      principal: application.amount,
      interestRate: interestRate,
      repaid: 0,
      weeklyPayment: weeklyPayment,
      period: application.period,
      startDate: new Date().toLocaleDateString(),
      nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      loanType: application.loanType,
      depositAmount: depositAmount,
      depositRefunded: false
    };
    
    activeLoans.push(newLoan);
    localStorage.setItem("activeLoans", JSON.stringify(activeLoans));
    
    // Add loan deposit to customer's loan deposits balance
    const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
    const newLoanDeposits = currentLoanDeposits + depositAmount;
    localStorage.setItem("loanDeposits", newLoanDeposits.toString());

    // AUTOMATIC DISBURSEMENT: Debit company account and credit customer account
    // 1. Debit company account
    const updatedCompanyBalance = companyBalance - application.amount;
    localStorage.setItem("companyBalance", updatedCompanyBalance.toString());

    // 2. Record disbursement transaction
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const disbursementTransaction = {
      id: `DISB-${Date.now()}`,
      type: "loan_disbursement",
      amount: application.amount,
      description: `Loan disbursed to ${application.userName} - ${application.loanType?.toUpperCase() || 'SME'} Loan`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      status: "completed",
      recipient: application.userName,
      recipientId: application.userId,
      loanId: application.id,
      fromAccount: "Company Account",
      toAccount: realApplication?.paymentMethod?.bankName ? 
        `${realApplication.paymentMethod.bankName} ****${realApplication.paymentMethod.last4}` : 
        "Customer Account",
      category: "loan_disbursement"
    };
    transactions.unshift(disbursementTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // 3. Record customer credit notification (this would trigger actual bank transfer in production)
    const customerNotification = {
      id: Date.now(),
      userId: application.userId,
      type: "loan_credited",
      amount: application.amount,
      message: `Your loan of ${formatCurrency(application.amount)} has been disbursed to your account`,
      timestamp: new Date().toISOString(),
      read: false
    };
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift(customerNotification);
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    // Track revenue from upfront costs
    if (realApplication?.upfrontCosts) {
      const upfrontCosts = realApplication.upfrontCosts;
      
      // Add insurance fee to insurance balance (non-refundable)
      const currentInsurance = parseFloat(localStorage.getItem("insuranceBalance") || "0");
      localStorage.setItem("insuranceBalance", (currentInsurance + upfrontCosts.insurance).toString());
      
      // Add service charge to service charge balance (non-refundable, one-time)
      const currentServiceCharge = parseFloat(localStorage.getItem("loanServiceChargeBalance") || "0");
      localStorage.setItem("loanServiceChargeBalance", (currentServiceCharge + upfrontCosts.serviceCharge).toString());
      
      // Calculate and track loan interest revenue (20% APR)
      const loanInterest = application.amount * 0.20; // 20% of loan amount
      const currentLoanInterest = parseFloat(localStorage.getItem("loanInterestBalance") || "0");
      localStorage.setItem("loanInterestBalance", (currentLoanInterest + loanInterest).toString());
      
      // Track interest by loan type
      const loanType = application.loanType || "sme";
      const currentTypeInterest = parseFloat(localStorage.getItem(`loanInterest_${loanType}`) || "0");
      localStorage.setItem(`loanInterest_${loanType}`, (currentTypeInterest + loanInterest).toString());
      
      // Add to interest transactions history
      const interestTransactions = JSON.parse(localStorage.getItem("interestTransactions") || "[]");
      interestTransactions.push({
        id: Date.now(),
        loanId: application.id,
        loanType: loanType,
        principal: application.amount,
        interestAmount: loanInterest,
        interestRate: 0.20,
        date: new Date().toISOString(),
        status: "active"
      });
      localStorage.setItem("interestTransactions", JSON.stringify(interestTransactions));
    }
    
    // Update local state
    setApplications(applications.map(app => 
      app.id === application.id ? { ...app, status: "approved" as const } : app
    ));
    
    // Trigger balance update event
    window.dispatchEvent(new Event("balanceUpdated"));
    
    toast.success(`Loan approved for ${application.userName}! Active loan created.`);
    setViewDialogOpen(false);
  };

  const handleReject = (application: LoanApplication) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    // Update loan application status in localStorage
    const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const updatedApplications = loanApplications.map((app: any) =>
      app.id === application.id 
        ? { ...app, status: "rejected", rejectionReason: rejectReason } 
        : app
    );
    localStorage.setItem("loanApplications", JSON.stringify(updatedApplications));
    
    // Update local state
    setApplications(applications.map(app => 
      app.id === application.id ? { ...app, status: "rejected" as const } : app
    ));
    
    // Trigger balance update event
    window.dispatchEvent(new Event("balanceUpdated"));
    
    toast.success(`Loan rejected for ${application.userName}`);
    setViewDialogOpen(false);
    setRejectReason("");
  };

  const handleViewDetails = (application: LoanApplication) => {
    setSelectedLoan(application);
    setViewDialogOpen(true);
  };

  const pendingApplications = applications.filter(app => app.status === "pending");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");

  const getLoanTypeBadge = (loanType?: string) => {
    if (!loanType) return null;
    
    const configs = {
      sme: { label: "SME Loan", className: "bg-blue-100 text-blue-700 border-blue-200" },
      business: { label: "Business Loan", className: "bg-purple-100 text-purple-700 border-purple-200" },
      jumbo: { label: "Jumbo Loan", className: "bg-orange-100 text-orange-700 border-orange-200" }
    };
    
    const config = configs[loanType as keyof typeof configs];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const ApplicationCard = ({ application }: { application: LoanApplication }) => (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{application.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4>{application.userName}</h4>
                {application.loanType && getLoanTypeBadge(application.loanType)}
              </div>
              <p className="text-sm text-gray-600">{application.userId}</p>
            </div>
          </div>
          <Badge variant={
            application.status === "approved" ? "default" :
            application.status === "rejected" ? "destructive" :
            "secondary"
          }>
            {application.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Loan Amount</p>
            <p className="text-lg">₦{application.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Period</p>
            <p className="text-lg">{application.period} weeks</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Credit Score</p>
            <p className={`text-lg ${
              application.creditScore >= 700 ? "text-green-600" :
              application.creditScore >= 650 ? "text-orange-600" :
              "text-red-600"
            }`}>
              {application.creditScore}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Applied Date</p>
            <p className="text-sm">{application.appliedDate}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600">Purpose</p>
          <p className="text-sm">{application.purpose}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleViewDetails(application)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {application.status === "pending" && (
            <>
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(application)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setSelectedLoan(application);
                  setViewDialogOpen(true);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2>Loan Approvals</h2>
        <p className="text-sm text-gray-600">Review and approve loan applications</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl">{pendingApplications.length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl">{approvedApplications.length}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl">{rejectedApplications.length}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingApplications.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))}
          {pendingApplications.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No pending applications</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedApplications.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedApplications.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Loan Application Details</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Review complete application information
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Applicant:</span>
                  <span className="text-xs sm:text-sm font-medium">{selectedLoan.userName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">User ID:</span>
                  <span className="text-xs sm:text-sm">{selectedLoan.userId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Amount:</span>
                  <span className="text-xs sm:text-sm font-medium">₦{selectedLoan.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Period:</span>
                  <span className="text-xs sm:text-sm">{selectedLoan.period} weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Purpose:</span>
                  <span className="text-xs sm:text-sm text-right max-w-[60%] break-words">{selectedLoan.purpose}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Credit Score:</span>
                  <span className="text-xs sm:text-sm">{selectedLoan.creditScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Contributions:</span>
                  <span className="text-xs sm:text-sm">₦{selectedLoan.totalContributions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Previous Loans:</span>
                  <span className="text-xs sm:text-sm">{selectedLoan.loanHistory} completed</span>
                </div>
              </div>

              {/* Upfront Costs Section */}
              {selectedLoan.loanType && (() => {
                const upfront = calculateUpfrontCosts(selectedLoan.amount, selectedLoan.loanType);
                
                // Check real application for payment status
                const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
                const realApplication = loanApplications.find((app: any) => app.id === selectedLoan.id);
                const upfrontPaid = realApplication?.upfrontCosts?.paid || false;
                const paidFrom = realApplication?.upfrontCosts?.paidFrom;
                const paidAt = realApplication?.upfrontCosts?.paidAt;
                
                return (
                  <div className={`border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 ${upfrontPaid ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                    <div className="flex items-center justify-between pb-2 border-b border-current/20">
                      <div className="flex items-center gap-2">
                        <Coins className={`h-3 w-3 sm:h-4 sm:w-4 ${upfrontPaid ? "text-green-600" : "text-orange-600"}`} />
                        <h4 className={`text-xs sm:text-sm ${upfrontPaid ? "text-green-900" : "text-orange-900"}`}>Upfront Costs</h4>
                      </div>
                      <Badge variant={upfrontPaid ? "default" : "outline"} className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 ${upfrontPaid ? "bg-green-600" : "border-orange-300 text-orange-700"}`}>
                        {upfrontPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <DollarSign className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="text-[10px] sm:text-xs">Deposit (10%):</span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium">{formatCurrency(upfront.deposit)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="text-[10px] sm:text-xs">Insurance ({upfront.insuranceRate}%):</span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium">{formatCurrency(upfront.insurance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="text-[10px] sm:text-xs">Service Charge:</span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium">{formatCurrency(upfront.serviceCharge)}</span>
                      </div>
                      <div className="border-t border-current/20 pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs sm:text-sm font-semibold ${upfrontPaid ? "text-green-900" : "text-orange-900"}`}>Total Upfront:</span>
                          <span className={`text-xs sm:text-sm font-semibold ${upfrontPaid ? "text-green-900" : "text-orange-900"}`}>{formatCurrency(upfront.totalUpfront)}</span>
                        </div>
                      </div>
                    </div>
                    {upfrontPaid ? (
                      <div className="space-y-1.5 sm:space-y-2">
                        <p className="text-[10px] sm:text-xs text-green-800 bg-green-100 border border-green-300 rounded p-1.5 sm:p-2">
                          <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-1" />
                          Paid from {paidFrom === "contribution_balance" ? "contribution balance" : "bank transfer"}
                          {paidAt && ` on ${new Date(paidAt).toLocaleDateString()}`}
                        </p>
                        <p className="text-[10px] sm:text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded p-1.5 sm:p-2">
                          Deposit of {formatCurrency(upfront.deposit)} is refundable after full repayment
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-orange-800 bg-orange-100 border border-orange-300 rounded p-1.5 sm:p-2">
                        <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-1" />
                        Customer must pay upfront costs before approval (if policy requires)
                      </p>
                    )}
                  </div>
                );
              })()}

              {selectedLoan.status === "pending" && (() => {
                const requireUpfrontPayment = JSON.parse(localStorage.getItem("requireUpfrontPayment") || "true");
                const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
                const realApplication = loanApplications.find((app: any) => app.id === selectedLoan.id);
                const upfrontPaid = realApplication?.upfrontCosts?.paid || false;
                const canApprove = !requireUpfrontPayment || upfrontPaid;

                return (
                  <>
                    {requireUpfrontPayment && !upfrontPaid && (
                      <Alert className="bg-red-50 border-red-200 py-2 sm:py-3">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-[10px] sm:text-sm">
                          <strong>Cannot Approve:</strong> Company policy requires upfront payment before loan approval. Customer has not paid yet.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="reject-reason" className="text-xs sm:text-sm">Rejection Reason (if rejecting)</Label>
                      <Textarea
                        id="reject-reason"
                        placeholder="Provide a reason for rejection..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                        className="text-xs sm:text-sm"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 h-9 sm:h-10"
                        onClick={() => handleApprove(selectedLoan)}
                        disabled={!canApprove}
                      >
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Approve</span>
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 h-9 sm:h-10"
                        onClick={() => handleReject(selectedLoan)}
                      >
                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Reject</span>
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
