import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { PaymentDialog } from "./PaymentDialog";
import { LoanTermsAndConditions } from "./LoanTermsAndConditions";
import { Calendar, CheckCircle2, Clock, Briefcase, User, Phone, MapPin, Building2, AlertCircle, TrendingUp, Rocket, Shield, Coins, DollarSign as DollarSignIcon, RefreshCw, TrendingDown, Wallet, CreditCard, UserCheck, HandCoins } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency, calculateLoanRepayment, calculateUpfrontCosts } from "../lib/utils";

interface PaymentMethod {
  id: number;
  type: "card" | "bank";
  name: string;
  last4: string;
  bankName?: string;
  cardBrand?: string;
  isDefault: boolean;
}

interface LoanSectionProps {
  onNavigate?: (tab: string) => void;
  userEmail: string;
}

type LoanType = "sme" | "business" | "jumbo";

interface LoanTypeConfig {
  name: string;
  minAmount: number;
  maxAmount: number;
  description: string;
  features: string[];
  icon: any;
  gradient: string;
  defaultPeriod: string;
}

const loanTypes: Record<LoanType, LoanTypeConfig> = {
  sme: {
    name: "SME Loan",
    minAmount: 50000,
    maxAmount: 1499999,
    description: "Perfect for small and medium enterprises looking to grow",
    features: [
      "Quick approval within 24 hours",
      "Flexible repayment terms",
      "Minimal documentation",
      "Ideal for business expansion"
    ],
    icon: Briefcase,
    gradient: "from-blue-600 to-cyan-600",
    defaultPeriod: "12"
  },
  business: {
    name: "Business Loan",
    minAmount: 1500000,
    maxAmount: 5000000,
    description: "Designed for established businesses with larger capital needs",
    features: [
      "Competitive interest rates",
      "Extended repayment periods",
      "Dedicated account manager",
      "Business growth support"
    ],
    icon: TrendingUp,
    gradient: "from-purple-600 to-pink-600",
    defaultPeriod: "12"
  },
  jumbo: {
    name: "Jumbo Loan",
    minAmount: 5000000,
    maxAmount: 50000000,
    description: "Premium loan solution for large-scale business operations",
    features: [
      "Customized loan packages",
      "Priority processing",
      "Corporate advisory services",
      "Flexible collateral options"
    ],
    icon: Rocket,
    gradient: "from-orange-600 to-red-600",
    defaultPeriod: "12"
  }
};

export function LoanSection() {
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType>("sme");
  const [loanAmount, setLoanAmount] = useState([100000]);
  const [loanAmountInput, setLoanAmountInput] = useState("100000");
  const [loanPeriod, setLoanPeriod] = useState("12");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  
  // Guarantor form fields
  const [guarantorNIN, setGuarantorNIN] = useState("");
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [guarantorAddress, setGuarantorAddress] = useState("");
  const [guarantorRelationship, setGuarantorRelationship] = useState("");
  const [guarantorEmployer, setGuarantorEmployer] = useState("");
  const [guarantorEmail, setGuarantorEmail] = useState("");
  const [isGuarantorRegistered, setIsGuarantorRegistered] = useState(false);
  const [guarantorCustomerId, setGuarantorCustomerId] = useState<number | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedGuarantorTerms, setAcceptedGuarantorTerms] = useState(false);
  const [loanPurpose, setLoanPurpose] = useState("");
  const [payUpfrontFromContributions, setPayUpfrontFromContributions] = useState(false);
  const [upfrontPaidInDialog, setUpfrontPaidInDialog] = useState(false);
  const [upfrontPaymentDialogOpen, setUpfrontPaymentDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [bankOffsetDialogOpen, setBankOffsetDialogOpen] = useState(false);
  const [bankOffsetAmount, setBankOffsetAmount] = useState("");
  const [useDepositForPayment, setUseDepositForPayment] = useState(false);
  const [depositAmountToUse, setDepositAmountToUse] = useState(0);

  // Load payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem("paymentMethods");
    return saved ? JSON.parse(saved) : [];
  });

  // Load active loans from localStorage
  const [activeLoans, setActiveLoans] = useState(() => {
    const saved = localStorage.getItem("activeLoans");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        amount: 2000,
        repaid: 800,
        weeklyPayment: 100,
        nextPayment: "2025-10-20",
        status: "active",
        period: 20,
        startDate: "2025-09-01",
        loanType: "sme"
      }
    ];
  });

  // Calculate interest rate based on loan period
  // 6 weeks = 10% interest, 12 weeks = 20% interest
  const interestRate = parseInt(loanPeriod) === 6 ? 10 : 20;
  const interestRateDecimal = interestRate / 100;
  
  const currentLoanConfig = loanTypes[selectedLoanType];
  const loanCalculation = calculateLoanRepayment(loanAmount[0], parseInt(loanPeriod), interestRateDecimal);
  const upfrontCosts = calculateUpfrontCosts(loanAmount[0], selectedLoanType);
  const weeklyPayment = loanCalculation.weeklyPayment;

  // Check if customer has any active unpaid loans
  const hasUnpaidLoan = activeLoans.some((loan: any) => {
    const remainingBalance = loan.amount - loan.repaid;
    return remainingBalance > 0;
  });

  // Get the unpaid loan details for messaging
  const unpaidLoan = activeLoans.find((loan: any) => {
    const remainingBalance = loan.amount - loan.repaid;
    return remainingBalance > 0;
  });

  const loanHistory = [
    {
      id: 2,
      amount: 1500,
      status: "completed",
      startDate: "2025-01-15",
      endDate: "2025-08-15",
      loanType: "sme",
      depositAmount: 150, // 10% deposit
      depositRefunded: false
    },
    {
      id: 3,
      amount: 1000,
      status: "completed",
      startDate: "2024-06-01",
      endDate: "2024-12-01",
      loanType: "sme",
      depositAmount: 100, // 10% deposit
      depositRefunded: true // Already claimed
    }
  ];

  const handleClaimDeposit = (loan: any) => {
    // Get default payment method for refund
    const paymentMethods = JSON.parse(localStorage.getItem("paymentMethods") || "[]");
    const defaultMethod = paymentMethods.find((pm: any) => pm.isDefault) || paymentMethods[0];

    if (!defaultMethod) {
      toast.error("Please add a payment method first");
      return;
    }

    // Create refund request
    const refundRequests = JSON.parse(localStorage.getItem("upfrontRefundRequests") || "[]");
    const newRequest = {
      id: Date.now(),
      customerId: 1, // In production, use actual customer ID
      customerName: "Current User", // In production, use actual customer name
      customerEmail: "user@example.com", // In production, use actual customer email
      loanId: loan.id,
      loanAmount: loan.amount,
      depositAmount: loan.depositAmount,
      loanType: loanTypes[loan.loanType as LoanType]?.name || "Loan",
      completedDate: loan.endDate,
      requestedAt: new Date().toISOString(),
      status: "pending",
      paymentMethod: {
        type: defaultMethod.type,
        name: defaultMethod.name,
        last4: defaultMethod.last4,
        bankName: defaultMethod.bankName
      }
    };

    refundRequests.push(newRequest);
    localStorage.setItem("upfrontRefundRequests", JSON.stringify(refundRequests));

    toast.success(`Loan deposit refund request submitted for ${formatCurrency(loan.depositAmount)}. Awaiting admin approval.`);
  };

  const handleRequestDepositOffset = (loan: any) => {
    const loanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
    const remainingBalance = loan.amount - loan.repaid;

    if (loanDeposits <= 0) {
      toast.error("No loan deposit available to apply");
      return;
    }

    if (remainingBalance <= 0) {
      toast.error("This loan has already been fully repaid");
      return;
    }

    // Check if there's already a pending request for this loan
    const depositOffsetRequests = JSON.parse(localStorage.getItem("depositOffsetRequests") || "[]");
    const existingRequest = depositOffsetRequests.find(
      (req: any) => req.loanId === loan.id && req.status === "pending" && req.offsetType === "deposit"
    );

    if (existingRequest) {
      toast.error("You already have a pending deposit offset request for this loan");
      return;
    }

    // Calculate the offset amount (can use partial or full deposit)
    const offsetAmount = Math.min(loanDeposits, remainingBalance);

    // Create deposit offset request
    const newRequest = {
      id: Date.now(),
      customerId: 1, // In production, use actual customer ID
      customerName: "Current User", // In production, use actual customer name
      customerEmail: "user@example.com", // In production, use actual customer email
      loanId: loan.id,
      loanAmount: loan.amount,
      currentBalance: remainingBalance,
      depositAmount: loanDeposits,
      offsetAmount: offsetAmount,
      offsetType: "deposit",
      loanType: loan.loanType ? loanTypes[loan.loanType as LoanType]?.name : "Loan",
      requestedAt: new Date().toISOString(),
      status: "pending"
    };

    depositOffsetRequests.push(newRequest);
    localStorage.setItem("depositOffsetRequests", JSON.stringify(depositOffsetRequests));

    toast.success(`Deposit offset request submitted for ${formatCurrency(offsetAmount)}. Awaiting admin approval.`);
  };

  const handleRequestContributionOffset = (loan: any) => {
    const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
    const remainingBalance = loan.amount - loan.repaid;

    if (contributionBalance <= 0) {
      toast.error("No contribution balance available to apply");
      return;
    }

    if (remainingBalance <= 0) {
      toast.error("This loan has already been fully repaid");
      return;
    }

    // Check if there's already a pending request for this loan
    const depositOffsetRequests = JSON.parse(localStorage.getItem("depositOffsetRequests") || "[]");
    const existingRequest = depositOffsetRequests.find(
      (req: any) => req.loanId === loan.id && req.status === "pending" && req.offsetType === "contribution"
    );

    if (existingRequest) {
      toast.error("You already have a pending contribution offset request for this loan");
      return;
    }

    // Calculate the offset amount (can use partial or full contribution balance)
    const offsetAmount = Math.min(contributionBalance, remainingBalance);

    // Create contribution offset request
    const newRequest = {
      id: Date.now(),
      customerId: 1, // In production, use actual customer ID
      customerName: "Current User", // In production, use actual customer name
      customerEmail: "user@example.com", // In production, use actual customer email
      loanId: loan.id,
      loanAmount: loan.amount,
      currentBalance: remainingBalance,
      contributionBalance: contributionBalance,
      offsetAmount: offsetAmount,
      offsetType: "contribution",
      loanType: loan.loanType ? loanTypes[loan.loanType as LoanType]?.name : "Loan",
      requestedAt: new Date().toISOString(),
      status: "pending"
    };

    depositOffsetRequests.push(newRequest);
    localStorage.setItem("depositOffsetRequests", JSON.stringify(depositOffsetRequests));

    toast.success(`Contribution offset request submitted for ${formatCurrency(offsetAmount)}. Awaiting admin approval.`);
  };

  const handleRequestBankOffset = () => {
    if (!selectedLoanId) return;

    const loan = activeLoans.find((l: any) => l.id === selectedLoanId);
    if (!loan) {
      toast.error("Loan not found");
      return;
    }

    const remainingBalance = loan.amount - loan.repaid;
    const amount = parseFloat(bankOffsetAmount);

    if (!bankOffsetAmount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > remainingBalance) {
      toast.error(`Amount cannot exceed remaining loan balance of ${formatCurrency(remainingBalance)}`);
      return;
    }

    // Check if there's already a pending request for this loan
    const depositOffsetRequests = JSON.parse(localStorage.getItem("depositOffsetRequests") || "[]");
    const existingRequest = depositOffsetRequests.find(
      (req: any) => req.loanId === loan.id && req.status === "pending" && req.offsetType === "bank"
    );

    if (existingRequest) {
      toast.error("You already have a pending bank offset request for this loan");
      return;
    }

    // Get default payment method
    const defaultMethod = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];
    if (!defaultMethod) {
      toast.error("No payment method available");
      return;
    }

    // Create bank offset request
    const newRequest = {
      id: Date.now(),
      customerId: 1, // In production, use actual customer ID
      customerName: "Current User", // In production, use actual customer name
      customerEmail: "user@example.com", // In production, use actual customer email
      loanId: loan.id,
      loanAmount: loan.amount,
      currentBalance: remainingBalance,
      offsetAmount: amount,
      offsetType: "bank",
      loanType: loan.loanType ? loanTypes[loan.loanType as LoanType]?.name : "Loan",
      paymentMethod: {
        type: defaultMethod.type,
        name: defaultMethod.name,
        last4: defaultMethod.last4,
        bankName: defaultMethod.bankName
      },
      requestedAt: new Date().toISOString(),
      status: "pending"
    };

    depositOffsetRequests.push(newRequest);
    localStorage.setItem("depositOffsetRequests", JSON.stringify(depositOffsetRequests));

    toast.success(`Bank offset request submitted for ${formatCurrency(amount)}. Awaiting admin approval.`);
    
    // Reset and close dialog
    setBankOffsetAmount("");
    setBankOffsetDialogOpen(false);
    setSelectedLoanId(null);
  };

  const handleLoanTypeChange = (type: LoanType) => {
    setSelectedLoanType(type);
    const config = loanTypes[type];
    setLoanAmount([config.minAmount]);
    setLoanAmountInput(config.minAmount.toString());
    setLoanPeriod(config.defaultPeriod);
  };

  const handleLoanAmountInputChange = (value: string) => {
    setLoanAmountInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Clamp the value between min and max
      const clampedValue = Math.max(
        currentLoanConfig.minAmount,
        Math.min(currentLoanConfig.maxAmount, numValue)
      );
      setLoanAmount([clampedValue]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setLoanAmount(value);
    setLoanAmountInput(value[0].toString());
  };

  // Mock SMS notification function
  const sendGuarantorSMS = (guarantorPhone: string, guarantorName: string, loanAmount: number) => {
    // In production, this would call an actual SMS API
    const smsContent = `Dear ${guarantorName}, you have been listed as a guarantor for a loan application of ${formatCurrency(loanAmount)} on FNG. You will be contacted for verification. If you did not consent to this, please contact us immediately.`;
    
    // Store notification in localStorage for demo purposes
    const notifications = JSON.parse(localStorage.getItem("smsNotifications") || "[]");
    notifications.push({
      id: Date.now(),
      phone: guarantorPhone,
      name: guarantorName,
      message: smsContent,
      timestamp: new Date().toISOString(),
      type: "guarantor_notification"
    });
    localStorage.setItem("smsNotifications", JSON.stringify(notifications));
    
    console.log(`SMS sent to ${guarantorPhone}: ${smsContent}`);
    return true;
  };

  // NIN lookup function
  const handleNINLookup = (nin: string) => {
    setGuarantorNIN(nin);
    
    // Only search if NIN has 11 digits (standard NIN length in Nigeria)
    if (nin.length === 11) {
      const kycSubmissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
      
      // Find customer with matching NIN
      const matchingCustomer = kycSubmissions.find((submission: any) => 
        submission.nin === nin && submission.status === "approved"
      );
      
      if (matchingCustomer) {
        // Auto-populate guarantor information
        setGuarantorName(matchingCustomer.fullName);
        setGuarantorPhone(matchingCustomer.phone);
        setGuarantorAddress(matchingCustomer.address);
        setGuarantorEmail(matchingCustomer.email);
        setGuarantorEmployer(matchingCustomer.employer || "");
        setIsGuarantorRegistered(true);
        setGuarantorCustomerId(matchingCustomer.id);
        
        toast.success(`Guarantor found! Information auto-filled from registered customer: ${matchingCustomer.fullName}`);
      } else {
        // Clear fields if no match or clear previous match
        if (isGuarantorRegistered) {
          setGuarantorName("");
          setGuarantorPhone("");
          setGuarantorAddress("");
          setGuarantorEmail("");
          setGuarantorEmployer("");
          setIsGuarantorRegistered(false);
          setGuarantorCustomerId(null);
          
          toast.info("NIN not found in our system. Please enter guarantor details manually.");
        }
      }
    } else if (nin.length === 0) {
      // Clear all fields when NIN is cleared
      setGuarantorName("");
      setGuarantorPhone("");
      setGuarantorAddress("");
      setGuarantorEmail("");
      setGuarantorEmployer("");
      setIsGuarantorRegistered(false);
      setGuarantorCustomerId(null);
    }
  };

  const handleApplyLoan = () => {
    // Validate loan purpose
    if (!loanPurpose) {
      toast.error("Please specify the loan purpose");
      return;
    }

    // Validate guarantor NIN
    if (!guarantorNIN || guarantorNIN.length !== 11) {
      toast.error("Please enter a valid 11-digit NIN for the guarantor");
      return;
    }

    // Validate guarantor information
    if (!guarantorName || !guarantorPhone || !guarantorAddress || !guarantorRelationship) {
      toast.error("Please fill in all guarantor information");
      return;
    }

    if (!acceptedTerms || !acceptedGuarantorTerms) {
      toast.error("Please accept all terms and conditions");
      return;
    }

    // NEW: Validate that main loan terms have been accepted
    if (!termsAccepted) {
      toast.error("Please read and accept the loan terms and conditions");
      setTermsDialogOpen(true);
      return;
    }

    // Validate upfront payment - MUST be paid before submission
    if (!payUpfrontFromContributions && !upfrontPaidInDialog) {
      toast.error("Please pay upfront costs before submitting your application");
      return;
    }

    // Handle upfront payment from contributions
    let upfrontPaid = false;
    let paidFrom = null;
    
    if (upfrontPaidInDialog) {
      // Payment was made via payment dialog (bank transfer)
      upfrontPaid = true;
      paidFrom = "bank_transfer";
      
      // Add deposit to loan deposits (refundable)
      const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
      const newLoanDeposits = currentLoanDeposits + upfrontCosts.deposit;
      localStorage.setItem("loanDeposits", newLoanDeposits.toString());
      
      // Add insurance to company insurance balance
      const currentInsuranceBalance = parseFloat(localStorage.getItem("insuranceBalance") || "0");
      const newInsuranceBalance = currentInsuranceBalance + upfrontCosts.insurance;
      localStorage.setItem("insuranceBalance", newInsuranceBalance.toString());
    } else if (payUpfrontFromContributions) {
      const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
      if (contributionBalance >= upfrontCosts.totalUpfront) {
        // Deduct upfront costs from contribution balance
        const newContributionBalance = contributionBalance - upfrontCosts.totalUpfront;
        localStorage.setItem("contributionBalance", newContributionBalance.toString());
        
        // Add deposit to loan deposits (refundable)
        const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
        const newLoanDeposits = currentLoanDeposits + upfrontCosts.deposit;
        localStorage.setItem("loanDeposits", newLoanDeposits.toString());
        
        // Add insurance to company insurance balance
        const currentInsuranceBalance = parseFloat(localStorage.getItem("insuranceBalance") || "0");
        const newInsuranceBalance = currentInsuranceBalance + upfrontCosts.insurance;
        localStorage.setItem("insuranceBalance", newInsuranceBalance.toString());
        
        upfrontPaid = true;
        paidFrom = "contribution_balance";
        
        // Record transaction
        const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
        transactions.unshift({
          id: Date.now(),
          type: "upfront_payment",
          amount: -upfrontCosts.totalUpfront,
          date: new Date().toISOString().split('T')[0],
          description: `Loan Upfront Payment (${currentLoanConfig.name})`,
          status: "completed",
          breakdown: {
            deposit: upfrontCosts.deposit,
            insurance: upfrontCosts.insurance,
            serviceCharge: upfrontCosts.serviceCharge
          }
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        
        // Trigger balance update
        window.dispatchEvent(new Event("balanceUpdated"));
      }
    }

    // Store loan application with upfront costs
    const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const newApplication = {
      id: Date.now(),
      loanType: selectedLoanType,
      loanTypeName: currentLoanConfig.name,
      principal: loanAmount[0],
      period: parseInt(loanPeriod),
      purpose: loanPurpose,
      upfrontCosts: {
        deposit: upfrontCosts.deposit,
        insurance: upfrontCosts.insurance,
        insuranceRate: upfrontCosts.insuranceRate,
        serviceCharge: upfrontCosts.serviceCharge,
        totalUpfront: upfrontCosts.totalUpfront,
        paid: upfrontPaid,
        paidAt: upfrontPaid ? new Date().toISOString() : null,
        paidFrom: paidFrom
      },
      guarantor: {
        nin: guarantorNIN,
        name: guarantorName,
        phone: guarantorPhone,
        address: guarantorAddress,
        relationship: guarantorRelationship,
        employer: guarantorEmployer,
        email: guarantorEmail,
        isRegisteredCustomer: isGuarantorRegistered,
        customerId: guarantorCustomerId
      },
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      status: "pending"
    };
    loanApplications.push(newApplication);
    localStorage.setItem("loanApplications", JSON.stringify(loanApplications));

    // Update guarantor records if they are a registered customer
    if (isGuarantorRegistered && guarantorCustomerId) {
      const guarantorRecords = JSON.parse(localStorage.getItem("guarantorRecords") || "[]");
      guarantorRecords.push({
        id: Date.now(),
        guarantorNIN: guarantorNIN,
        guarantorCustomerId: guarantorCustomerId,
        guarantorName: guarantorName,
        loanApplicationId: newApplication.id,
        borrowerName: "Current User", // In production, use actual borrower name
        loanAmount: loanAmount[0],
        loanType: currentLoanConfig.name,
        status: "active", // active, completed, defaulted
        guaranteedAt: new Date().toISOString()
      });
      localStorage.setItem("guarantorRecords", JSON.stringify(guarantorRecords));
    }

    // Send SMS notification to guarantor
    try {
      sendGuarantorSMS(guarantorPhone, guarantorName, loanAmount[0]);
      toast.success(`${currentLoanConfig.name} application submitted! Guarantor has been notified via SMS.`);
    } catch (error) {
      toast.success(`${currentLoanConfig.name} application submitted! You'll receive a notification within 24 hours.`);
    }
    
    // Show appropriate message about upfront costs
    if (upfrontPaid) {
      if (paidFrom === "contribution_balance") {
        toast.success(`Upfront costs of ${formatCurrency(upfrontCosts.totalUpfront)} deducted from your contribution balance`, {
          duration: 5000
        });
      } else {
        toast.success(`Upfront costs of ${formatCurrency(upfrontCosts.totalUpfront)} paid successfully`, {
          duration: 5000
        });
      }
    }
    
    // Reset form
    setLoanPurpose("");
    setGuarantorNIN("");
    setGuarantorName("");
    setGuarantorPhone("");
    setGuarantorAddress("");
    setGuarantorRelationship("");
    setGuarantorEmployer("");
    setGuarantorEmail("");
    setIsGuarantorRegistered(false);
    setGuarantorCustomerId(null);
    setAcceptedTerms(false);
    setAcceptedGuarantorTerms(false);
    setTermsAccepted(false);
    setPayUpfrontFromContributions(false);
    setUpfrontPaidInDialog(false);
    setIsDialogOpen(false);
  };

  const handleUpfrontPaymentInDialog = () => {
    // This function is called when user successfully pays via PaymentDialog in the application form
    // The actual payment processing happens in PaymentDialog
    setUpfrontPaidInDialog(true);
    setUpfrontPaymentDialogOpen(false);
    
    // Add deposit to loan deposits (refundable)
    const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
    const newLoanDeposits = currentLoanDeposits + upfrontCosts.deposit;
    localStorage.setItem("loanDeposits", newLoanDeposits.toString());
    
    // Record transaction
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.unshift({
      id: Date.now(),
      type: "upfront_payment",
      amount: -upfrontCosts.totalUpfront,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description: `Loan Upfront Payment (${currentLoanConfig.name})`,
      status: "completed",
      breakdown: {
        deposit: upfrontCosts.deposit,
        insurance: upfrontCosts.insurance,
        serviceCharge: upfrontCosts.serviceCharge
      }
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // Trigger balance update
    window.dispatchEvent(new Event("balanceUpdated"));
    
    toast.success(`Upfront payment of ${formatCurrency(upfrontCosts.totalUpfront)} completed! You can now submit your application.`);
  };

  const LoanIcon = currentLoanConfig.icon;

  return (
    <div className="space-y-6 pb-20">
      {/* Active Loan Restriction Banner */}
      {hasUnpaidLoan && (
        <Alert className="bg-orange-50 border-orange-300">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <p className="mb-1">
              <strong>Loan Application Restricted:</strong> You have an active loan with a remaining balance of {formatCurrency(unpaidLoan.amount - unpaidLoan.repaid)}.
            </p>
            <p className="text-sm">
              Complete your current loan repayment before applying for a new loan. Check your active loan details below.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Deposit Offset Quick Access Banner */}
      {(() => {
        const loanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
        const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
        const hasActiveLoan = loans.length > 0;
        const activeLoan = loans[0];
        const remainingBalance = hasActiveLoan ? activeLoan.amount - activeLoan.repaid : 0;
        
        if (loanDeposits > 0 && hasActiveLoan && remainingBalance > 0) {
          const offsetAmount = Math.min(loanDeposits, remainingBalance);
          const newBalance = remainingBalance - offsetAmount;
          
          return (
            <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white">Reduce Your Loan Balance!</h3>
                      <p className="text-sm text-purple-100 mt-1">
                        Use your refundable deposit to offset your active loan
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Available Now
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs text-purple-100">Available Deposit</p>
                    <p className="text-xl mt-1">{formatCurrency(loanDeposits)}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs text-purple-100">Current Balance</p>
                    <p className="text-xl mt-1">{formatCurrency(remainingBalance)}</p>
                  </div>
                </div>
                
                <div className="bg-green-400/20 backdrop-blur-sm rounded-lg p-3 border border-green-300/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-100">New Balance After Offset:</p>
                    <p className="text-xl font-medium text-green-100">{formatCurrency(newBalance)}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    // Scroll to active loans section
                    const activeLoanSection = document.querySelector('[data-section="active-loans"]');
                    if (activeLoanSection) {
                      activeLoanSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full bg-white text-purple-600 hover:bg-gray-100"
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  View Offset Options Below
                </Button>
              </div>
            </Card>
          );
        }
        return null;
      })()}

      {/* Loan Type Selection Header */}
      <div className="space-y-4">
        <h2 className="text-2xl">Choose Your Loan Type</h2>
        <p className="text-gray-600">Select a loan package that suits your needs</p>
      </div>

      {/* Loan Type Cards */}
      <Tabs value={selectedLoanType} onValueChange={(value) => handleLoanTypeChange(value as LoanType)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          {Object.entries(loanTypes).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex flex-col gap-2 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:text-white"
                style={{
                  backgroundImage: selectedLoanType === key ? `linear-gradient(to bottom right, var(--tw-gradient-stops))` : undefined
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs sm:text-sm">{config.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* SME Loan Tab */}
        <TabsContent value="sme" className="space-y-6">
          <Card className={`p-6 bg-gradient-to-br ${loanTypes.sme.gradient} text-white`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2>{loanTypes.sme.name}</h2>
                  <p className="text-sm text-white/90">{loanTypes.sme.description}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-white/90 mb-2">Loan Range:</p>
                <p className="text-2xl">{formatCurrency(loanTypes.sme.minAmount)} - {formatCurrency(loanTypes.sme.maxAmount)}</p>
              </div>
              <ul className="space-y-2 text-sm">
                {loanTypes.sme.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-xs text-white/90 flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span><strong>Upfront:</strong> 10% deposit (refundable) + 1.5% insurance + ₦3,500</span>
                </p>
              </div>
              
              {hasUnpaidLoan ? (
                <div className="space-y-3">
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-300/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-100 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-red-100">
                          You have an active loan with a remaining balance of {formatCurrency(unpaidLoan.amount - unpaidLoan.repaid)}.
                        </p>
                        <p className="text-xs text-red-200">
                          Please complete your current loan repayment before applying for a new loan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    disabled 
                    className="w-full bg-white/50 text-blue-700/50 cursor-not-allowed"
                  >
                    <HandCoins className="h-4 w-4 mr-2" />
                    Apply for SME Loan
                  </Button>
                </div>
              ) : (
                <Dialog open={isDialogOpen && selectedLoanType === "sme"} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    // Reset upfront payment states when dialog closes
                    setUpfrontPaidInDialog(false);
                    setPayUpfrontFromContributions(false);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      <HandCoins className="h-5 w-5 mr-2" />
                      Apply for SME Loan
                    </Button>
                  </DialogTrigger>
                  {renderLoanApplicationDialog()}
                </Dialog>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Business Loan Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card className={`p-6 bg-gradient-to-br ${loanTypes.business.gradient} text-white`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2>{loanTypes.business.name}</h2>
                  <p className="text-sm text-white/90">{loanTypes.business.description}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-white/90 mb-2">Loan Range:</p>
                <p className="text-2xl">{formatCurrency(loanTypes.business.minAmount)} - {formatCurrency(loanTypes.business.maxAmount)}</p>
              </div>
              <ul className="space-y-2 text-sm">
                {loanTypes.business.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-xs text-white/90 flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span><strong>Upfront:</strong> 10% deposit (refundable) + 2% insurance + ₦3,500</span>
                </p>
              </div>
              
              {hasUnpaidLoan ? (
                <div className="space-y-3">
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-300/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-100 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-red-100">
                          You have an active loan with a remaining balance of {formatCurrency(unpaidLoan.amount - unpaidLoan.repaid)}.
                        </p>
                        <p className="text-xs text-red-200">
                          Please complete your current loan repayment before applying for a new loan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    disabled 
                    className="w-full bg-white/50 text-purple-700/50 cursor-not-allowed"
                  >
                    <HandCoins className="h-4 w-4 mr-2" />
                    Apply for Business Loan
                  </Button>
                </div>
              ) : (
                <Dialog open={isDialogOpen && selectedLoanType === "business"} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    // Reset upfront payment states when dialog closes
                    setUpfrontPaidInDialog(false);
                    setPayUpfrontFromContributions(false);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      <HandCoins className="h-5 w-5 mr-2" />
                      Apply for Business Loan
                    </Button>
                  </DialogTrigger>
                  {renderLoanApplicationDialog()}
                </Dialog>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Jumbo Loan Tab */}
        <TabsContent value="jumbo" className="space-y-6">
          <Card className={`p-6 bg-gradient-to-br ${loanTypes.jumbo.gradient} text-white`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2>{loanTypes.jumbo.name}</h2>
                  <p className="text-sm text-white/90">{loanTypes.jumbo.description}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-white/90 mb-2">Loan Range:</p>
                <p className="text-2xl">{formatCurrency(loanTypes.jumbo.minAmount)} and above</p>
              </div>
              <ul className="space-y-2 text-sm">
                {loanTypes.jumbo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-xs text-white/90 flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span><strong>Upfront:</strong> 10% deposit (refundable) + 3% insurance + ₦3,500</span>
                </p>
              </div>
              
              {hasUnpaidLoan ? (
                <div className="space-y-3">
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-300/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-100 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-red-100">
                          You have an active loan with a remaining balance of {formatCurrency(unpaidLoan.amount - unpaidLoan.repaid)}.
                        </p>
                        <p className="text-xs text-red-200">
                          Please complete your current loan repayment before applying for a new loan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    disabled 
                    className="w-full bg-white/50 text-orange-700/50 cursor-not-allowed"
                  >
                    <HandCoins className="h-4 w-4 mr-2" />
                    Apply for Jumbo Loan
                  </Button>
                </div>
              ) : (
                <Dialog open={isDialogOpen && selectedLoanType === "jumbo"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      <HandCoins className="h-5 w-5 mr-2" />
                      Apply for Jumbo Loan
                    </Button>
                  </DialogTrigger>
                  {renderLoanApplicationDialog()}
                </Dialog>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pending Loan Applications */}
      {(() => {
        const pendingApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]")
          .filter((app: any) => app.status === "pending");
        
        if (pendingApplications.length === 0) return null;
        
        return (
          <div className="space-y-4">
            <h3>Pending Loan Applications</h3>
            {pendingApplications.map((application: any) => {
              const loanTypeConfig = loanTypes[application.loanType as LoanType];
              const LoanIcon = loanTypeConfig?.icon || Briefcase;
              const needsUpfrontPayment = !application.upfrontCosts?.paid;
              const requireUpfrontBeforeApproval = localStorage.getItem("requireUpfrontBeforeApproval") === "true";
              
              return (
                <Card key={application.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`bg-gradient-to-r ${loanTypeConfig?.gradient || 'from-blue-600 to-cyan-600'} p-3 rounded-full`}>
                          <LoanIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4>{application.loanTypeName || "Loan"}</h4>
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Application #{application.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg">{formatCurrency(application.principal)}</p>
                        <p className="text-sm text-gray-600">{application.period} weeks</p>
                      </div>
                    </div>
                    
                    {/* Upfront Costs Section */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Upfront Costs</p>
                        <p className="">{formatCurrency(application.upfrontCosts.totalUpfront)}</p>
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Deposit (10%)</span>
                          <span>{formatCurrency(application.upfrontCosts.deposit)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Insurance ({application.upfrontCosts.insuranceRate}%)</span>
                          <span>{formatCurrency(application.upfrontCosts.insurance)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Service Charge</span>
                          <span>{formatCurrency(application.upfrontCosts.serviceCharge)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Status */}
                    {needsUpfrontPayment ? (
                      <div className="space-y-3">
                        {requireUpfrontBeforeApproval && (
                          <Alert className="bg-orange-50 border-orange-200">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800 text-sm">
                              Upfront payment is required before your loan can be approved
                            </AlertDescription>
                          </Alert>
                        )}
                        <Button
                          onClick={() => {
                            setSelectedLoanId(application.id);
                            setRepaymentAmount(application.upfrontCosts.totalUpfront);
                            setPaymentDialogOpen(true);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <DollarSignIcon className="h-4 w-4 mr-2" />
                          Pay Upfront Costs
                        </Button>
                      </div>
                    ) : (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 text-sm">
                          Upfront costs paid on {new Date(application.upfrontCosts.paidAt).toLocaleDateString()}
                          {application.upfrontCosts.paidFrom === "contribution_balance" 
                            ? " (Deducted from contribution balance)"
                            : " (Bank transfer)"}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Applied on {new Date(application.submittedAt).toLocaleDateString()} at {new Date(application.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        );
      })()}

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div className="space-y-4" data-section="active-loans">
          <h3>Active Loans</h3>
          {activeLoans.map((loan) => {
            const progress = (loan.repaid / loan.amount) * 100;
            const loanTypeLabel = loan.loanType ? loanTypes[loan.loanType as LoanType]?.name : "Loan";
            return (
              <Card key={loan.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3>Loan #{loan.id}</h3>
                        {loan.loanType && (
                          <Badge variant="outline" className="text-xs">
                            {loanTypeLabel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Started {loan.startDate}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(loan.repaid)} of {formatCurrency(loan.amount)} repaid
                      </span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Weekly Payment</p>
                      <p className="text-lg">{formatCurrency(loan.weeklyPayment)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Next Payment</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p className="text-sm">{loan.nextPayment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Check if this is near the final payment and show deposit option */}
                  {(() => {
                    const remainingBalance = loan.amount - loan.repaid;
                    const isNearFinalPayment = remainingBalance <= loan.weeklyPayment * 2; // Within 2 payments of completion
                    const loanDepositAmount = loan.depositAmount || 0;
                    
                    if (isNearFinalPayment && loanDepositAmount > 0 && remainingBalance > 0) {
                      return (
                        <div className="space-y-3">
                          <Alert className="bg-green-50 border-green-200">
                            <Shield className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800 text-sm">
                              <strong>Final Payment Option:</strong> You can use your refundable deposit ({formatCurrency(loanDepositAmount)}) to offset your remaining balance.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <Checkbox
                              id={`use-deposit-${loan.id}`}
                              checked={useDepositForPayment && selectedLoanId === loan.id}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const depositToUse = Math.min(loanDepositAmount, remainingBalance);
                                  const amountToPay = Math.max(0, remainingBalance - depositToUse);
                                  setUseDepositForPayment(true);
                                  setDepositAmountToUse(depositToUse);
                                  setRepaymentAmount(amountToPay);
                                  setSelectedLoanId(loan.id);
                                } else {
                                  setUseDepositForPayment(false);
                                  setDepositAmountToUse(0);
                                  setRepaymentAmount(loan.weeklyPayment);
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`use-deposit-${loan.id}`}
                              className="text-sm text-purple-900 cursor-pointer flex-1"
                            >
                              Use my deposit ({formatCurrency(loanDepositAmount)}) to offset remaining balance
                            </Label>
                          </div>
                          
                          {useDepositForPayment && selectedLoanId === loan.id && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Remaining Balance:</span>
                                <span className="font-medium">{formatCurrency(remainingBalance)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Deposit Applied:</span>
                                <span className="font-medium text-green-600">-{formatCurrency(depositAmountToUse)}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-900">Amount to Pay:</span>
                                <span className="font-medium text-blue-600">{formatCurrency(repaymentAmount)}</span>
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => {
                              if (!useDepositForPayment) {
                                setRepaymentAmount(loan.weeklyPayment);
                                setSelectedLoanId(loan.id);
                                setPaymentDialogOpen(true);
                              } else if (repaymentAmount === 0 && useDepositForPayment) {
                                // Fully paid with deposit - process immediately
                                const updatedLoans = activeLoans.map(l => {
                                  if (l.id === loan.id) {
                                    const totalPaymentAmount = depositAmountToUse;
                                    const newRepaid = l.repaid + totalPaymentAmount;
                                    
                                    // Calculate interest portion
                                    const interestRate = l.interestRate || 0.20;
                                    const principal = l.principal || l.amount / (1 + interestRate);
                                    const totalWithInterest = l.amount;
                                    const totalInterest = principal * interestRate;
                                    const interestPortion = (totalPaymentAmount / totalWithInterest) * totalInterest;
                                    
                                    // Add interest to total balance
                                    const currentInterestBalance = parseFloat(localStorage.getItem("loanInterestBalance") || "0");
                                    const newInterestBalance = currentInterestBalance + interestPortion;
                                    localStorage.setItem("loanInterestBalance", newInterestBalance.toString());
                                    
                                    // Add interest to breakdown by loan type
                                    const loanType = l.loanType || "sme";
                                    const currentTypeBalance = parseFloat(localStorage.getItem(`loanInterest_${loanType}`) || "0");
                                    localStorage.setItem(`loanInterest_${loanType}`, (currentTypeBalance + interestPortion).toString());
                                    
                                    // Store interest transaction
                                    const interestTransactions = JSON.parse(localStorage.getItem("interestTransactions") || "[]");
                                    interestTransactions.push({
                                      id: Date.now(),
                                      date: new Date().toISOString(),
                                      amount: interestPortion,
                                      loanType: loanType,
                                      loanId: l.id,
                                      principal: principal,
                                      payment: totalPaymentAmount,
                                      depositUsed: depositAmountToUse
                                    });
                                    localStorage.setItem("interestTransactions", JSON.stringify(interestTransactions));
                                    
                                    // Deduct from loan deposits
                                    const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
                                    const newLoanDeposits = Math.max(0, currentLoanDeposits - depositAmountToUse);
                                    localStorage.setItem("loanDeposits", newLoanDeposits.toString());
                                    
                                    // Add transaction for deposit usage
                                    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
                                    transactions.unshift({
                                      id: Date.now(),
                                      type: "deposit_offset",
                                      amount: depositAmountToUse,
                                      date: new Date().toISOString().split('T')[0],
                                      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                      description: `Loan Deposit Applied to Loan #${l.id}`,
                                      status: "completed"
                                    });
                                    localStorage.setItem("transactions", JSON.stringify(transactions));
                                    
                                    return {
                                      ...l,
                                      repaid: newRepaid,
                                      depositRefunded: true
                                    };
                                  }
                                  return l;
                                });
                                
                                setActiveLoans(updatedLoans);
                                localStorage.setItem("activeLoans", JSON.stringify(updatedLoans));
                                
                                // Trigger balance update event
                                window.dispatchEvent(new Event("balanceUpdated"));
                                
                                // Reset states
                                setUseDepositForPayment(false);
                                setDepositAmountToUse(0);
                                setSelectedLoanId(null);
                                
                                toast.success(`Payment completed! ${formatCurrency(depositAmountToUse)} from your deposit was applied to fully pay your remaining balance.`);
                              } else {
                                // Partial payment with deposit
                                setPaymentDialogOpen(true);
                              }
                            }}
                          >
                            {useDepositForPayment && selectedLoanId === loan.id 
                              ? repaymentAmount === 0 
                                ? "Complete with Deposit"
                                : "Pay Remaining Amount"
                              : "Make Payment"}
                          </Button>
                        </div>
                      );
                    }
                    
                    // Regular payment button for non-final payments
                    return (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          setRepaymentAmount(loan.weeklyPayment);
                          setSelectedLoanId(loan.id);
                          setUseDepositForPayment(false);
                          setDepositAmountToUse(0);
                          setPaymentDialogOpen(true);
                        }}
                      >
                        Make Payment
                      </Button>
                    );
                  })()}

                  {/* Deposit Offset Option */}
                  {(() => {
                    const loanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
                    const remainingBalance = loan.amount - loan.repaid;
                    
                    if (loanDeposits > 0 && remainingBalance > 0) {
                      const offsetAmount = Math.min(loanDeposits, remainingBalance);
                      const newBalance = remainingBalance - offsetAmount;
                      
                      return (
                        <div className="pt-4 border-t mt-4">
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-purple-100 p-2 rounded-full">
                                <Coins className="h-4 w-4 text-purple-600" />
                              </div>
                              <h4 className="text-purple-900">Use Deposit to Offset Loan</h4>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Available Deposit:</span>
                                <span className="font-medium text-purple-600">{formatCurrency(loanDeposits)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Current Balance:</span>
                                <span className="font-medium">{formatCurrency(remainingBalance)}</span>
                              </div>
                              <Separator className="bg-purple-200" />
                              <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">Offset Amount:</span>
                                <span className="font-medium text-orange-600">{formatCurrency(offsetAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">New Balance:</span>
                                <span className="font-medium text-green-600">{formatCurrency(newBalance)}</span>
                              </div>
                            </div>

                            <Alert className="bg-blue-50 border-blue-200">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-800 text-xs">
                                This request requires admin approval. Your deposit will be applied to reduce your loan balance.
                              </AlertDescription>
                            </Alert>
                            
                            <Button 
                              onClick={() => handleRequestDepositOffset(loan)}
                              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                              <TrendingDown className="h-4 w-4 mr-2" />
                              Request Deposit Offset
                            </Button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Contribution Offset Option */}
                  {(() => {
                    const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
                    const remainingBalance = loan.amount - loan.repaid;
                    
                    if (contributionBalance > 0 && remainingBalance > 0) {
                      const offsetAmount = Math.min(contributionBalance, remainingBalance);
                      const newBalance = remainingBalance - offsetAmount;
                      
                      return (
                        <div className="pt-4 border-t mt-4">
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 p-2 rounded-full">
                                <Wallet className="h-4 w-4 text-green-600" />
                              </div>
                              <h4 className="text-green-900">Offset with Savings Balance</h4>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Savings Balance:</span>
                                <span className="font-medium text-green-600">{formatCurrency(contributionBalance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Current Balance:</span>
                                <span className="font-medium">{formatCurrency(remainingBalance)}</span>
                              </div>
                              <Separator className="bg-green-200" />
                              <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">Offset Amount:</span>
                                <span className="font-medium text-orange-600">{formatCurrency(offsetAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">New Balance:</span>
                                <span className="font-medium text-green-600">{formatCurrency(newBalance)}</span>
                              </div>
                            </div>

                            <Alert className="bg-blue-50 border-blue-200">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-800 text-xs">
                                This request requires admin approval. Your savings balance will be used to reduce your loan balance.
                              </AlertDescription>
                            </Alert>
                            
                            <Button 
                              onClick={() => handleRequestContributionOffset(loan)}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                              <TrendingDown className="h-4 w-4 mr-2" />
                              Offset with Savings
                            </Button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Bank Account Offset Option */}
                  {(() => {
                    const remainingBalance = loan.amount - loan.repaid;
                    const hasPaymentMethods = paymentMethods.length > 0;
                    
                    if (remainingBalance > 0) {
                      return (
                        <div className="pt-4 border-t mt-4">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Building2 className="h-4 w-4 text-blue-600" />
                              </div>
                              <h4 className="text-blue-900">Pay from Bank Account</h4>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Current Loan Balance:</span>
                                <span className="font-medium">{formatCurrency(remainingBalance)}</span>
                              </div>
                              <p className="text-gray-600 text-xs">
                                Pay any amount to reduce your loan balance using your bank account
                              </p>
                            </div>

                            {!hasPaymentMethods ? (
                              <Alert className="bg-orange-50 border-orange-200">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800 text-xs">
                                  Please add a bank account in Payment Methods first
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <Alert className="bg-blue-50 border-blue-200">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800 text-xs">
                                  Choose the amount you want to pay. Funds will be debited from your bank account after admin approval.
                                </AlertDescription>
                              </Alert>
                            )}
                            
                            <Button 
                              onClick={() => {
                                if (!hasPaymentMethods) {
                                  // onNavigate('payments');
                                  toast.error("Please add a bank account first");
                                } else {
                                  setSelectedLoanId(loan.id);
                                  setBankOffsetDialogOpen(true);
                                }
                              }}
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              disabled={!hasPaymentMethods}
                            >
                              <Building2 className="h-4 w-4 mr-2" />
                              {hasPaymentMethods ? "Pay from Bank Account" : "Add Bank Account"}
                            </Button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Loan History */}
      {loanHistory.length > 0 && (
        <div className="space-y-4">
          <h3>Loan History</h3>
          {loanHistory.map((loan) => {
            const loanTypeLabel = loan.loanType ? loanTypes[loan.loanType as LoanType]?.name : "Loan";
            return (
              <Card key={loan.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="bg-green-100 p-2 rounded-full h-fit">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4>Loan #{loan.id}</h4>
                          {loan.loanType && (
                            <Badge variant="outline" className="text-xs">
                              {loanTypeLabel}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{formatCurrency(loan.amount)}</p>
                        <p className="text-xs text-gray-500">
                          {loan.startDate} - {loan.endDate}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700">Completed</Badge>
                  </div>

                  {/* Loan Deposit Refund Section */}
                  {loan.depositAmount && !loan.depositRefunded && (
                    <div className="pt-3 border-t">
                      <Alert className="bg-blue-50 border-blue-200 mb-3">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>Refundable Loan Deposit (10%):</strong> {formatCurrency(loan.depositAmount)} available to claim
                        </AlertDescription>
                      </Alert>
                      <Button 
                        onClick={() => handleClaimDeposit(loan)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Claim Loan Deposit
                      </Button>
                    </div>
                  )}

                  {loan.depositAmount && loan.depositRefunded && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Loan Deposit of {formatCurrency(loan.depositAmount)} has been refunded</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false);
          setSelectedLoanId(null);
          setUseDepositForPayment(false);
          setDepositAmountToUse(0);
        }}
        amount={repaymentAmount}
        purpose={(() => {
          // Check if this is an upfront payment
          const applications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
          const application = applications.find((app: any) => app.id === selectedLoanId);
          if (application && application.status === "pending") {
            return `Upfront Payment - ${application.loanTypeName}`;
          }
          return `Loan #${selectedLoanId} Repayment`;
        })()}
        onPaymentComplete={(amount, method) => {
          // Check if this is an upfront payment for a loan application
          const applications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
          const applicationIndex = applications.findIndex((app: any) => app.id === selectedLoanId && app.status === "pending");
          
          if (applicationIndex !== -1) {
            // This is an upfront payment for a loan application
            applications[applicationIndex].upfrontCosts.paid = true;
            applications[applicationIndex].upfrontCosts.paidAt = new Date().toISOString();
            applications[applicationIndex].upfrontCosts.paidFrom = "bank_transfer";
            localStorage.setItem("loanApplications", JSON.stringify(applications));
            
            // Add transaction record
            const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
            transactions.unshift({
              id: Date.now(),
              type: "upfront_payment",
              amount: -amount,
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              description: `Upfront Payment - ${applications[applicationIndex].loanTypeName}`,
              status: "completed",
              breakdown: {
                deposit: applications[applicationIndex].upfrontCosts.deposit,
                insurance: applications[applicationIndex].upfrontCosts.insurance,
                serviceCharge: applications[applicationIndex].upfrontCosts.serviceCharge
              }
            });
            localStorage.setItem("transactions", JSON.stringify(transactions));
            
            // Trigger balance update event for admin dashboard
            window.dispatchEvent(new Event("balanceUpdated"));
            
            toast.success("Upfront payment successful! Your application will be reviewed shortly.");
            
            // Force re-render to update pending applications display
            setTimeout(() => window.location.reload(), 500);
          } else {
            // This is a loan repayment
            let totalPaymentAmount = amount;
            
            // If using deposit, add it to the payment amount
            if (useDepositForPayment && depositAmountToUse > 0) {
              totalPaymentAmount = amount + depositAmountToUse;
            }
            
            const updatedLoans = activeLoans.map(loan => {
              if (loan.id === selectedLoanId) {
                const newRepaid = loan.repaid + totalPaymentAmount;
                
                // Calculate interest portion of this payment (including deposit if used)
                // Use stored interest rate (10% or 20%) or default to 20% for backward compatibility
                const interestRate = loan.interestRate || 0.20;
                const principal = loan.principal || loan.amount / (1 + interestRate);
                const totalWithInterest = loan.amount;
                const totalInterest = principal * interestRate;
                const interestPortion = (totalPaymentAmount / totalWithInterest) * totalInterest;
                
                // Add interest to total balance
                const currentInterestBalance = parseFloat(localStorage.getItem("loanInterestBalance") || "0");
                const newInterestBalance = currentInterestBalance + interestPortion;
                localStorage.setItem("loanInterestBalance", newInterestBalance.toString());
                
                // Add interest to breakdown by loan type
                const loanType = loan.loanType || "sme";
                const currentTypeBalance = parseFloat(localStorage.getItem(`loanInterest_${loanType}`) || "0");
                localStorage.setItem(`loanInterest_${loanType}`, (currentTypeBalance + interestPortion).toString());
                
                // Store interest transaction for historical tracking
                const interestTransactions = JSON.parse(localStorage.getItem("interestTransactions") || "[]");
                interestTransactions.push({
                  id: Date.now(),
                  date: new Date().toISOString(),
                  amount: interestPortion,
                  loanType: loanType,
                  loanId: loan.id,
                  principal: principal,
                  payment: totalPaymentAmount,
                  depositUsed: useDepositForPayment ? depositAmountToUse : 0
                });
                localStorage.setItem("interestTransactions", JSON.stringify(interestTransactions));
                
                // If deposit was used, deduct it from loan deposits and mark as refunded
                if (useDepositForPayment && depositAmountToUse > 0) {
                  const currentLoanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
                  const newLoanDeposits = Math.max(0, currentLoanDeposits - depositAmountToUse);
                  localStorage.setItem("loanDeposits", newLoanDeposits.toString());
                  
                  // Add transaction for deposit usage
                  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
                  transactions.unshift({
                    id: Date.now(),
                    type: "deposit_offset",
                    amount: depositAmountToUse,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    description: `Loan Deposit Applied to Loan #${loan.id}`,
                    status: "completed"
                  });
                  localStorage.setItem("transactions", JSON.stringify(transactions));
                  
                  // Update loan to mark deposit as refunded/used
                  return {
                    ...loan,
                    repaid: newRepaid,
                    depositRefunded: true
                  };
                }
                
                return {
                  ...loan,
                  repaid: newRepaid
                };
              }
              return loan;
            });
            setActiveLoans(updatedLoans);
            localStorage.setItem("activeLoans", JSON.stringify(updatedLoans));
            
            // Reset deposit usage states
            if (useDepositForPayment) {
              setUseDepositForPayment(false);
              setDepositAmountToUse(0);
              
              // Show success message
              if (depositAmountToUse > 0) {
                toast.success(`Payment successful! ${formatCurrency(depositAmountToUse)} from your deposit was applied.`);
              }
            }
          }
          
          // Trigger balance update event
          window.dispatchEvent(new Event("balanceUpdated"));
          setSelectedLoanId(null);
        }}
      />

      {/* Loan Terms and Conditions Dialog */}
      <LoanTermsAndConditions
        isOpen={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setTermsDialogOpen(false);
          toast.success("Thank you for accepting the loan terms and conditions");
        }}
        loanAmount={loanAmount[0]}
        loanType={currentLoanConfig.name}
      />

      {/* Bank Account Offset Dialog */}
      <Dialog open={bankOffsetDialogOpen} onOpenChange={setBankOffsetDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pay from Bank Account</DialogTitle>
            <DialogDescription>
              Enter the amount you want to pay towards your loan balance
            </DialogDescription>
          </DialogHeader>

          {(() => {
            const loan = activeLoans.find((l: any) => l.id === selectedLoanId);
            if (!loan) return null;

            const remainingBalance = loan.amount - loan.repaid;
            const defaultMethod = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];
            const loanTypeLabel = loan.loanType ? loanTypes[loan.loanType as LoanType]?.name : "Loan";

            return (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 space-y-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-blue-900">Loan Details</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Loan Type:</span>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        {loanTypeLabel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Loan ID:</span>
                      <span className="font-medium">#{loan.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Loan Amount:</span>
                      <span className="font-medium">{formatCurrency(loan.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount Repaid:</span>
                      <span className="font-medium text-green-600">{formatCurrency(loan.repaid)}</span>
                    </div>
                    <Separator className="bg-blue-200" />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Current Balance:</span>
                      <span className="font-semibold text-orange-600">{formatCurrency(remainingBalance)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Payment Method</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{defaultMethod?.bankName}</span>
                    <span className="font-medium">****{defaultMethod?.last4}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offset-amount" className="text-base">Payment Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
                    <Input
                      id="offset-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={bankOffsetAmount}
                      onChange={(e) => setBankOffsetAmount(e.target.value)}
                      className="pl-8 text-lg h-12"
                      min="0"
                      max={remainingBalance}
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Minimum: ₦1.00</span>
                    <span>Maximum: {formatCurrency(remainingBalance)}</span>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    Your bank account will be debited after admin approval. This payment will reduce your loan balance accordingly.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBankOffsetDialogOpen(false);
                      setBankOffsetAmount("");
                      setSelectedLoanId(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRequestBankOffset}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={!bankOffsetAmount || parseFloat(bankOffsetAmount) <= 0}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderLoanApplicationDialog() {
    return (
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Apply for {currentLoanConfig.name}</DialogTitle>
          <DialogDescription>
            Fill in all required details to submit your loan application
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(100vh-160px)] pr-3">
          <div className="space-y-3 py-2">
            {/* Loan Type Badge */}
            <div className="flex items-center gap-2 pb-2 border-b">
              <LoanIcon className="h-4 w-4 text-gray-600" />
              <Badge className={`bg-gradient-to-r ${currentLoanConfig.gradient} text-white text-xs`}>
                {currentLoanConfig.name}
              </Badge>
              <span className="text-xs text-gray-600">
                {formatCurrency(currentLoanConfig.minAmount)} - {currentLoanConfig.maxAmount === 50000000 ? formatCurrency(currentLoanConfig.maxAmount) + "+" : formatCurrency(currentLoanConfig.maxAmount)}
              </span>
            </div>

            {/* Loan Details Section */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4" />
                Loan Details
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-sm">Loan Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₦</span>
                    <Input
                      type="number"
                      value={loanAmountInput}
                      onChange={(e) => handleLoanAmountInputChange(e.target.value)}
                      className="pl-8 h-9 text-sm"
                      placeholder={currentLoanConfig.minAmount.toString()}
                      min={currentLoanConfig.minAmount}
                      max={currentLoanConfig.maxAmount}
                    />
                  </div>
                  <p className="text-xs text-center">{formatCurrency(loanAmount[0])}</p>
                  <Slider
                    value={loanAmount}
                    onValueChange={handleSliderChange}
                    min={currentLoanConfig.minAmount}
                    max={currentLoanConfig.maxAmount}
                    step={currentLoanConfig.minAmount >= 1000000 ? 100000 : currentLoanConfig.minAmount >= 50000 ? 10000 : 1000}
                    className="my-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="period" className="text-sm">Repayment Period</Label>
                  <Select value={loanPeriod} onValueChange={setLoanPeriod}>
                    <SelectTrigger id="period" className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 weeks</SelectItem>
                      <SelectItem value="12">12 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="purpose" className="text-sm">Loan Purpose *</Label>
                  <Input 
                    id="purpose" 
                    placeholder="e.g., Business expansion, Equipment purchase" 
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    className="h-9 text-sm"
                    required 
                  />
                </div>
              </div>

              {/* Upfront Costs & Repayment Cards - Compact */}
              <div className="grid grid-cols-2 gap-2">
                <Card className="p-2.5 bg-orange-50 border-orange-200">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-orange-200">
                      <Coins className="h-3.5 w-3.5 text-orange-600" />
                      <h4 className="text-xs text-orange-900">Upfront Costs</h4>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposit (10%) ✓:</span>
                        <span className="text-green-700">{formatCurrency(upfrontCosts.deposit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance:</span>
                        <span>{formatCurrency(upfrontCosts.insurance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span>{formatCurrency(upfrontCosts.serviceCharge)}</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex justify-between pt-1">
                        <span className="font-semibold text-orange-900">Total:</span>
                        <span className="font-semibold text-orange-900">{formatCurrency(upfrontCosts.totalUpfront)}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-2.5 bg-blue-50 border-blue-200">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-blue-200">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <h4 className="text-xs text-blue-900">Repayment</h4>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Principal:</span>
                        <span>{formatCurrency(loanCalculation.principal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest ({interestRate}%):</span>
                        <span>{formatCurrency(loanCalculation.interest)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span>{formatCurrency(loanCalculation.totalAmount)}</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex justify-between pt-1">
                        <span className="font-semibold">Weekly:</span>
                        <span className="font-semibold text-blue-900">{formatCurrency(loanCalculation.weeklyPayment)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Guarantor Information Section */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Guarantor Information
              </h3>
              <p className="text-xs text-gray-600">
                A guarantor is required. Must be employed and willing to guarantee repayment.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {/* NIN Lookup Field */}
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="guarantorNIN" className="text-sm">Guarantor NIN *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id="guarantorNIN"
                      placeholder="11-digit NIN"
                      value={guarantorNIN}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                        handleNINLookup(value);
                      }}
                      className="pl-9 h-9 text-sm"
                      maxLength={11}
                      required
                    />
                    {isGuarantorRegistered && (
                      <div className="absolute right-3 top-2.5">
                        <UserCheck className="h-3.5 w-3.5 text-green-600" />
                      </div>
                    )}
                  </div>
                  {guarantorNIN.length > 0 && guarantorNIN.length < 11 && (
                    <p className="text-xs text-orange-600">
                      {11 - guarantorNIN.length} more digits required
                    </p>
                  )}
                  {isGuarantorRegistered && (
                    <Alert className="bg-green-50 border-green-200 py-1.5 px-2">
                      <UserCheck className="h-3 w-3 text-green-600" />
                      <AlertDescription className="text-green-800 text-xs">
                        <strong>Verified!</strong> Info auto-filled.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="guarantorName" className="text-sm">Full Name *</Label>
                  <Input
                    id="guarantorName"
                    placeholder="Guarantor's full name"
                    value={guarantorName}
                    onChange={(e) => setGuarantorName(e.target.value)}
                    disabled={isGuarantorRegistered}
                    className={isGuarantorRegistered ? "bg-gray-100 h-9 text-sm" : "h-9 text-sm"}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guarantorPhone" className="text-sm">Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id="guarantorPhone"
                      placeholder="08012345678"
                      value={guarantorPhone}
                      onChange={(e) => setGuarantorPhone(e.target.value)}
                      className={isGuarantorRegistered ? "pl-9 bg-gray-100 h-9 text-sm" : "pl-9 h-9 text-sm"}
                      disabled={isGuarantorRegistered}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guarantorRelationship" className="text-sm">Relationship *</Label>
                  <Select value={guarantorRelationship} onValueChange={setGuarantorRelationship}>
                    <SelectTrigger id="guarantorRelationship" className="h-9 text-sm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="business_partner">Business Partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="guarantorAddress" className="text-sm">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id="guarantorAddress"
                      placeholder="Guarantor's address"
                      value={guarantorAddress}
                      onChange={(e) => setGuarantorAddress(e.target.value)}
                      className={isGuarantorRegistered ? "pl-9 bg-gray-100 h-9 text-sm" : "pl-9 h-9 text-sm"}
                      disabled={isGuarantorRegistered}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="guarantorEmployer" className="text-sm">Employer (Optional)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id="guarantorEmployer"
                      placeholder="Guarantor's employer"
                      value={guarantorEmployer}
                      onChange={(e) => setGuarantorEmployer(e.target.value)}
                      className={isGuarantorRegistered ? "pl-9 bg-gray-100 h-9 text-sm" : "pl-9 h-9 text-sm"}
                      disabled={isGuarantorRegistered}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Upfront Payment Section */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4" />
                Upfront Payment
              </h3>
              <Alert className="bg-orange-50 border-orange-200 py-2 px-3">
                <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
                <AlertDescription className="text-orange-800 text-xs">
                  <strong>Required:</strong> Pay upfront costs before submitting. 10% deposit is refundable.
                </AlertDescription>
              </Alert>

              {(() => {
                const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
                const canPayFromContributions = contributionBalance >= upfrontCosts.totalUpfront;
                const paymentCompleted = payUpfrontFromContributions || upfrontPaidInDialog;

                return (
                  <>
                    {/* Payment Status Display */}
                    {paymentCompleted ? (
                      <Card className="p-2.5 bg-green-50 border-green-200">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-600 p-1.5 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm text-green-900">Payment Confirmed</h4>
                            <p className="text-xs text-green-800">
                              {formatCurrency(upfrontCosts.totalUpfront)} paid. Ready to submit.
                            </p>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <>
                        <Card className={`p-2.5 ${canPayFromContributions ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs">Payment Options</h4>
                              {canPayFromContributions && (
                                <Badge className="bg-green-600 text-white text-xs py-0">
                                  Available
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-700">Balance:</span>
                                <span className="font-semibold">{formatCurrency(contributionBalance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Required:</span>
                                <span className="font-semibold text-orange-600">{formatCurrency(upfrontCosts.totalUpfront)}</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Option 1: Pay from Contributions */}
                        {canPayFromContributions && (
                          <div className="flex items-start space-x-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <Checkbox
                              id="payFromContributions"
                              checked={payUpfrontFromContributions}
                              onCheckedChange={(checked) => {
                                setPayUpfrontFromContributions(checked as boolean);
                                if (checked) {
                                  setUpfrontPaidInDialog(false);
                                }
                              }}
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor="payFromContributions"
                              className="text-xs cursor-pointer"
                            >
                              Pay from contribution balance ({formatCurrency(upfrontCosts.totalUpfront)})
                            </Label>
                          </div>
                        )}

                        {/* Option 2: Pay via Bank Transfer */}
                        <Button
                          type="button"
                          onClick={() => setUpfrontPaymentDialogOpen(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                          variant="default"
                        >
                          <DollarSignIcon className="h-3.5 w-3.5 mr-1.5" />
                          {canPayFromContributions ? "Or Pay" : "Pay"} via Bank ({formatCurrency(upfrontCosts.totalUpfront)})
                        </Button>

                        {/* Insufficient funds message */}
                        {!canPayFromContributions && (
                          <Alert className="bg-yellow-50 border-yellow-200 py-1.5 px-2.5">
                            <AlertCircle className="h-3 w-3 text-yellow-600" />
                            <AlertDescription className="text-yellow-800 text-xs">
                              Insufficient balance. Use bank transfer button above.
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </>
                );
              })()}
            </div>

            <Separator className="my-2" />

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Terms & Conditions
              </h3>

              {/* Loan Terms */}
              <Card className="p-2.5 bg-yellow-50 border-yellow-200">
                <h4 className="text-xs text-yellow-900 mb-1.5">Loan Terms:</h4>
                <ul className="text-xs text-yellow-800 space-y-0.5 list-disc list-inside">
                  <li>Interest: {interestRate}% (6wks=10%, 12wks=20%)</li>
                  <li>Weekly installments via direct debit</li>
                  <li>No early repayment penalties</li>
                  <li>Default: Account frozen, legal action</li>
                  {selectedLoanType === "jumbo" && (
                    <li>Collateral may be required</li>
                  )}
                </ul>
              </Card>

              {/* Guarantor Terms */}
              <Card className="p-2.5 bg-orange-50 border-orange-200">
                <h4 className="text-xs text-orange-900 mb-1.5">Guarantor:</h4>
                <ul className="text-xs text-orange-800 space-y-0.5 list-disc list-inside">
                  <li>Must be 18+ and employed</li>
                  <li>Will be verified</li>
                  <li>Liable if borrower defaults</li>
                  <li>Consent required</li>
                </ul>
              </Card>

              {/* Agreement Checkboxes */}
              <div className="space-y-2 pt-1">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-xs cursor-pointer"
                  >
                    I accept loan terms: {interestRate}% interest, weekly repayment. Legal action if default.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptGuarantorTerms"
                    checked={acceptedGuarantorTerms}
                    onCheckedChange={(checked) => setAcceptedGuarantorTerms(checked as boolean)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="acceptGuarantorTerms"
                    className="text-xs cursor-pointer"
                  >
                    Guarantor aware and agrees. Will be verified, liable if default.
                  </Label>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Main Loan Agreement - MUST READ */}
            <Alert className="bg-red-50 border-red-300 py-2 px-3">
              <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              <AlertDescription className="space-y-2">
                <p className="text-red-900 text-xs">
                  <strong>REQUIRED:</strong> Read and accept full Loan Agreement.
                </p>
                <Button
                  type="button"
                  onClick={() => setTermsDialogOpen(true)}
                  className={`w-full h-8 text-xs ${termsAccepted ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {termsAccepted ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Terms Accepted
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                      Read Full Agreement (Required)
                    </>
                  )}
                </Button>
                {termsAccepted && (
                  <p className="text-xs text-green-700 text-center">
                    ✓ Accepted {new Date().toLocaleDateString()}
                  </p>
                )}
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleApplyLoan} 
              className="w-full h-9 text-sm mt-2"
              disabled={!acceptedTerms || !acceptedGuarantorTerms || !termsAccepted || (!payUpfrontFromContributions && !upfrontPaidInDialog)}
            >
              {!termsAccepted 
                ? "Accept Terms First"
                : !payUpfrontFromContributions && !upfrontPaidInDialog 
                  ? "Pay Upfront Costs" 
                  : `Submit Application`}
            </Button>
            {(!termsAccepted || (!payUpfrontFromContributions && !upfrontPaidInDialog)) && (
              <p className="text-xs text-center text-orange-600">
                {!termsAccepted ? "Read & accept terms above" : "Pay upfront costs to submit"}
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Upfront Payment Dialog - Nested within application dialog */}
        <PaymentDialog
          isOpen={upfrontPaymentDialogOpen}
          onClose={() => setUpfrontPaymentDialogOpen(false)}
          amount={upfrontCosts.totalUpfront}
          purpose={`Upfront Payment - ${currentLoanConfig.name}`}
          onPaymentComplete={handleUpfrontPaymentInDialog}
        />
      </DialogContent>
    );
  }

}
