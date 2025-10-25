import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Building2, CreditCard, Copy, CheckCircle2, AlertCircle, Shield, Zap, Wallet } from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  initializePaystackPayment,
  simulatePaymentVerification,
  generateReference,
  nairaToKobo,
  recordPaymentTransaction,
  updateUserBalance,
  type PaystackTransaction,
} from "../lib/paystack-service";
import {
  initializeOpayPayment,
  simulateOpayVerification,
  generateOpayReference,
  recordOpayTransaction,
  updateBalanceAfterOpayPayment,
  type OpayTransaction,
} from "../lib/opay-service";

interface PaymentMethod {
  id: number;
  type: "card" | "bank";
  name: string;
  last4: string;
  bankName?: string;
  cardBrand?: string;
  bvn?: string;
  bvnVerified?: boolean;
  isDefault: boolean;
}

interface PaymentDialogProps {
  // New interface
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPaymentSuccess?: (amount: number, paymentMethod: PaymentMethod) => void;
  paymentMethods?: PaymentMethod[];
  onAddPaymentMethod?: () => void;
  
  // Old interface (for backward compatibility)
  isOpen?: boolean;
  onClose?: () => void;
  purpose?: string;
  onPaymentComplete?: (amount: number, method: PaymentMethod) => void;
  
  // Common
  amount: number;
  
  // Payment context
  paymentType?: "contribution" | "loan_repayment";
  loanId?: string;
  userEmail?: string;
}

interface CompanyAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export function PaymentDialog(props: PaymentDialogProps) {
  // Support both old and new interfaces
  const {
    open: openProp,
    onOpenChange: onOpenChangeProp,
    onPaymentSuccess: onPaymentSuccessProp,
    paymentMethods: paymentMethodsProp,
    onAddPaymentMethod,
    isOpen,
    onClose,
    onPaymentComplete,
    amount,
    paymentType = "contribution",
    loanId,
    userEmail,
  } = props;
  
  // Use old or new props
  const open = openProp ?? isOpen ?? false;
  const onOpenChange = onOpenChangeProp ?? ((open: boolean) => !open && onClose?.());
  const onPaymentSuccess = onPaymentSuccessProp ?? onPaymentComplete ?? (() => {});
  
  // Load payment methods from localStorage if not provided
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    if (paymentMethodsProp) return paymentMethodsProp;
    const saved = localStorage.getItem("paymentMethods");
    return saved ? JSON.parse(saved) : [];
  });
  const [step, setStep] = useState<"select" | "gateway" | "transfer" | "confirm" | "processing">("select");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<"paystack" | "opay" | null>(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"instant" | "bank_transfer">("instant");

  // Load company account from localStorage
  const [companyAccount, setCompanyAccount] = useState<CompanyAccount>(() => {
    const saved = localStorage.getItem("companyAccount");
    return saved ? JSON.parse(saved) : {
      bankName: "First Bank of Nigeria",
      accountNumber: "0123456789",
      accountName: "FNG FINANCIAL SERVICES",
    };
  });

  // Listen for payment methods updates if not provided via props
  useEffect(() => {
    if (!paymentMethodsProp) {
      const handleUpdate = () => {
        const saved = localStorage.getItem("paymentMethods");
        if (saved) {
          setPaymentMethods(JSON.parse(saved));
        }
      };

      // Check for updates periodically
      const interval = setInterval(handleUpdate, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentMethodsProp]);

  // Listen for company account updates
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("companyAccount");
      if (saved) {
        setCompanyAccount(JSON.parse(saved));
      }
    };

    // Check for updates periodically
    const interval = setInterval(handleUpdate, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-select default payment method when dialog opens
  useEffect(() => {
    if (open && paymentMethods.length > 0 && !selectedMethod) {
      const defaultMethod = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];
      setSelectedMethod(defaultMethod);
    }
  }, [open, paymentMethods]);

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    // Don't auto-advance, let user choose payment mode
  };

  const handleSelectGateway = (gateway: "paystack" | "opay") => {
    setSelectedGateway(gateway);
    setStep("processing");
    
    if (gateway === "paystack") {
      handlePaystackPayment();
    } else {
      handleOpayPayment();
    }
  };

  const handlePayNow = () => {
    if (!selectedMethod || !userEmail) {
      toast.error("Missing required information");
      return;
    }

    // Show gateway selection
    setStep("gateway");
  };

  const handlePaystackPayment = () => {
    if (!selectedMethod || !userEmail) {
      toast.error("Missing required information");
      return;
    }

    setIsProcessing(true);

    // Generate payment reference
    const reference = generateReference();

    try {
      // Initialize Paystack payment
      initializePaystackPayment(
        {
          email: userEmail,
          amount: nairaToKobo(amount),
          reference: reference,
          metadata: {
            paymentType: paymentType,
            loanId: loanId,
            userId: userEmail,
            customerName: selectedMethod.name,
            custom_fields: [
              {
                display_name: "Payment Type",
                variable_name: "payment_type",
                value: paymentType === "contribution" ? "Daily Contribution" : "Loan Repayment",
              },
              ...(loanId ? [{
                display_name: "Loan ID",
                variable_name: "loan_id",
                value: loanId,
              }] : []),
            ],
          },
          channels: ['card', 'bank', 'ussd', 'bank_transfer'],
        },
        (transaction: PaystackTransaction) => {
          // Payment successful
          handlePaystackSuccess(transaction, reference);
        },
        () => {
          // User closed payment popup
          setIsProcessing(false);
          setStep("select");
          toast.info("Payment cancelled");
        }
      );
    } catch (error) {
      console.error("Payment initialization error:", error);
      setIsProcessing(false);
      setStep("select");
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  const handlePaystackSuccess = (transaction: PaystackTransaction, reference: string) => {
    // Simulate payment verification (in production, this should be done on backend)
    const verification = simulatePaymentVerification(
      reference,
      nairaToKobo(amount),
      userEmail || ""
    );

    if (verification.status && verification.data.status === "success") {
      // Update user balance
      updateUserBalance(paymentType, amount, loanId);

      // Record transaction
      recordPaymentTransaction(
        userEmail || "",
        amount,
        paymentType,
        reference,
        `${selectedMethod?.bankName || selectedMethod?.cardBrand} ••••${selectedMethod?.last4}`,
        loanId
      );

      // Show success
      setConfirmationCode(reference);
      setStep("confirm");
      setIsProcessing(false);

      // Notify parent component
      if (selectedMethod) {
        onPaymentSuccess(amount, selectedMethod);
      }

      toast.success("Payment successful! Your balance has been updated in real-time.");
    } else {
      setIsProcessing(false);
      setStep("select");
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const handleOpayPayment = () => {
    if (!selectedMethod || !userEmail) {
      toast.error("Missing required information");
      return;
    }

    setIsProcessing(true);

    // Generate payment reference
    const reference = generateOpayReference();

    try {
      // Initialize OPay payment (script loading handled internally)
      initializeOpayPayment(
        {
          email: userEmail,
          amount: amount, // OPay uses Naira directly
          reference: reference,
          metadata: {
            paymentType: paymentType,
            loanId: loanId,
            userId: userEmail,
            customerName: selectedMethod.name,
          },
        },
        (transaction: OpayTransaction) => {
          // Payment successful
          handleOpaySuccess(transaction, reference);
        },
        () => {
          // User closed payment
          setIsProcessing(false);
          setStep("gateway");
          setSelectedGateway(null);
          toast.info("Payment cancelled");
        }
      );
    } catch (error) {
      console.error("OPay payment initialization error:", error);
      setIsProcessing(false);
      setStep("gateway");
      setSelectedGateway(null);
      toast.error("Failed to initialize OPay payment. Please try again.");
    }
  };

  const handleOpaySuccess = (transaction: OpayTransaction, reference: string) => {
    // Simulate payment verification (in production, this should be done on backend)
    const verification = simulateOpayVerification(
      reference,
      transaction.orderNo,
      amount
    );

    if (verification.code === "00000" && verification.data.status === "SUCCESS") {
      // Update user balance
      updateBalanceAfterOpayPayment(paymentType, amount, loanId);

      // Record transaction
      recordOpayTransaction(
        userEmail || "",
        amount,
        paymentType,
        reference,
        transaction.orderNo,
        loanId
      );

      // Show success
      setConfirmationCode(reference);
      setStep("confirm");
      setIsProcessing(false);

      // Notify parent component
      if (selectedMethod) {
        onPaymentSuccess(amount, selectedMethod);
      }

      toast.success("OPay payment successful! Your balance has been updated in real-time.");
    } else {
      setIsProcessing(false);
      setStep("gateway");
      setSelectedGateway(null);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const handleBankTransfer = () => {
    if (!selectedMethod) return;
    setPaymentMode("bank_transfer");
    setStep("transfer");
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(companyAccount.accountNumber);
    toast.success("Account number copied to clipboard");
  };

  const handleConfirmTransfer = () => {
    setStep("confirm");
    // Generate a mock confirmation code
    const mockCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setConfirmationCode(mockCode);
  };

  const handleCompletePayment = () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      onPaymentSuccess(amount, selectedMethod);
      toast.success("Payment successful! Your balance has been updated.");
      
      // Reset dialog
      setStep("select");
      setSelectedMethod(null);
      setConfirmationCode("");
      setIsProcessing(false);
      onOpenChange(false);
    }, 2000);
  };

  const handleCancel = () => {
    setStep("select");
    setSelectedMethod(null);
    setConfirmationCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[95vh] p-4 sm:p-6">
        <DialogHeader className="pb-1.5 sm:pb-2">
          <DialogTitle className="text-base sm:text-lg">
            {step === "select" && "Select Payment Method"}
            {step === "gateway" && "Choose Payment Gateway"}
            {step === "transfer" && "Transfer Funds"}
            {step === "confirm" && "Confirm Payment"}
            {step === "processing" && "Processing Payment"}
          </DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs">
            {step === "select" && "Choose how you want to pay"}
            {step === "gateway" && "Select your preferred payment provider"}
            {step === "transfer" && "Transfer to our company account"}
            {step === "confirm" && "Verify your payment"}
            {step === "processing" && "Please wait..."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
        <div className="space-y-2 sm:space-y-3 pr-2 sm:pr-4">
          {/* Amount Display - More Compact */}
          <Card className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-[11px] sm:text-xs text-blue-700">Amount to Pay</p>
              <p className="text-xl sm:text-2xl text-blue-900">₦{amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </Card>

          {/* Step 1: Select Payment Method - Compact */}
          {step === "select" && (
            <div className="space-y-1.5 sm:space-y-2">
                {paymentMethods.length === 0 ? (
                  <Card className="p-2 sm:p-3 text-center">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mx-auto mb-1.5" />
                    <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
                      No payment methods available. Please add a payment method first.
                    </p>
                    <div className="flex gap-2 justify-center">
                      {onAddPaymentMethod && (
                        <Button onClick={() => {
                          handleCancel();
                          onAddPaymentMethod();
                        }} size="sm" className="h-7 sm:h-8 text-[11px] sm:text-xs">
                          Add Payment Method
                        </Button>
                      )}
                      <Button variant="outline" onClick={handleCancel} size="sm" className="h-7 sm:h-8 text-[11px] sm:text-xs">
                        Close
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <>
                    <Label className="text-xs sm:text-sm">Payment Method</Label>
                    {selectedMethod && (
                      <p className="text-[11px] sm:text-xs text-gray-500">
                        Default method pre-selected
                      </p>
                    )}
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`p-2 sm:p-2.5 cursor-pointer hover:shadow-md transition-all ${
                          selectedMethod?.id === method.id ? "border-2 border-blue-600 bg-blue-50" : "hover:border-blue-200"
                        }`}
                        onClick={() => handleSelectMethod(method)}
                      >
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div
                            className={`p-1.5 sm:p-2 rounded-full ${
                              method.type === "bank" ? "bg-blue-100" : "bg-purple-100"
                            }`}
                          >
                            {method.type === "bank" ? (
                              <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                            ) : (
                              <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                              <p className="text-xs sm:text-sm truncate">{method.name}</p>
                              {method.isDefault && (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">
                                  Default
                                </Badge>
                              )}
                              {method.type === "bank" && method.bvnVerified && (
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">
                                  <Shield className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-600 truncate">
                              {method.type === "bank" ? method.bankName : method.cardBrand} •••• {method.last4}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {selectedMethod && (
                      <div className="pt-0.5 sm:pt-1 space-y-1.5 sm:space-y-2">
                        <Card className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                          <div className="flex items-start gap-1 sm:gap-1.5">
                            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] sm:text-[11px] text-blue-700">
                              Instant payment available! Pay with card, bank, or USSD.
                            </p>
                          </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-1.5">
                          <Button
                            onClick={handlePayNow}
                            className="w-full h-8 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={!userEmail}
                          >
                            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                            Pay Now (Instant)
                          </Button>
                          <Button
                            onClick={handleBankTransfer}
                            variant="outline"
                            className="w-full h-8 sm:h-9 text-xs sm:text-sm"
                          >
                            <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                            Manual Bank Transfer
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
            </div>
          )}

          {/* Step 2: Show Company Account Details */}
          {step === "transfer" && selectedMethod && (
            <div className="space-y-2 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">Transfer to Company Account</Label>
                  <Card className="p-2.5 sm:p-4 space-y-2 sm:space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Bank:</span>
                      <span className="text-xs sm:text-sm font-semibold">{companyAccount.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Account:</span>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-lg font-bold tracking-wider">{companyAccount.accountNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAccount}
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Name:</span>
                      <span className="text-xs sm:text-sm font-semibold text-right">{companyAccount.accountName}</span>
                    </div>
                  </Card>
                </div>

                <Card className="p-2 sm:p-4 bg-orange-50 border-orange-200">
                  <div className="flex gap-2 sm:gap-3">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm text-orange-700">
                      <p className="font-semibold mb-1 sm:mb-2">Important:</p>
                      <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs">
                        <li>Transfer ₦{amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                        <li>From: {selectedMethod.bankName} ••••{selectedMethod.last4}</li>
                        <li>Save receipt</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">Your Payment Source</Label>
                  <Card className="p-2.5 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">{selectedMethod.name}</p>
                        <p className="text-[11px] sm:text-sm text-gray-600">
                          {selectedMethod.bankName} •••• {selectedMethod.last4}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                  <Button variant="outline" onClick={handleCancel} className="flex-1 h-8 sm:h-10 text-xs sm:text-sm">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmTransfer} className="flex-1 h-8 sm:h-10 text-xs sm:text-sm">
                    I've Completed Transfer
                  </Button>
                </div>
            </div>
          )}

          {/* Step 1.5: Choose Payment Gateway */}
          {step === "gateway" && (
            <div className="space-y-2 sm:space-y-4">
              <Card className="p-2 sm:p-3 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] sm:text-xs font-medium text-blue-900 mb-0.5 sm:mb-1">
                      Choose Your Preferred Payment Gateway
                    </p>
                    <p className="text-[10px] sm:text-xs text-blue-700">
                      Both gateways are secure and instant. Choose the one you prefer!
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-2 sm:space-y-3">
                <Label className="text-xs sm:text-sm">Select Payment Gateway</Label>
                
                {/* OPay Option - Highlighted as Popular */}
                <Card
                  className={`p-2.5 sm:p-4 cursor-pointer hover:shadow-md transition-all border-2 ${
                    selectedGateway === "opay" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => handleSelectGateway("opay")}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                      <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                        <h4 className="text-sm sm:text-base font-semibold text-green-900">OPay</h4>
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                          Popular
                        </Badge>
                      </div>
                      <p className="text-[11px] sm:text-sm text-gray-600 mb-1 sm:mb-2">
                        Pay with OPay Wallet, Cards, or Bank
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] sm:text-xs bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Wallet</span>
                        <span className="text-[10px] sm:text-xs bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Card</span>
                        <span className="text-[10px] sm:text-xs bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Transfer</span>
                        <span className="text-[10px] sm:text-xs bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">USSD</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Paystack Option */}
                <Card
                  className={`p-2.5 sm:p-4 cursor-pointer hover:shadow-md transition-all border-2 ${
                    selectedGateway === "paystack" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => handleSelectGateway("paystack")}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                      <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                        <h4 className="text-sm sm:text-base font-semibold text-blue-900">Paystack</h4>
                        <Badge variant="outline" className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                          Trusted
                        </Badge>
                      </div>
                      <p className="text-[11px] sm:text-sm text-gray-600 mb-1 sm:mb-2">
                        Pay with Cards, Bank Transfer, or USSD
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Visa/MC</span>
                        <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Transfer</span>
                        <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">USSD</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStep("select");
                    setSelectedGateway(null);
                  }} 
                  className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <div className="space-y-2 sm:space-y-4">
              <Card className="p-4 sm:p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4">
                  <div className="relative">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Processing Payment...</p>
                    <p className="text-xs sm:text-sm text-blue-700">
                      {selectedGateway === "opay" 
                        ? "Complete payment in the OPay window"
                        : "Complete payment in the Paystack popup"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-2 sm:p-4 bg-orange-50 border-orange-200">
                <div className="flex gap-2 sm:gap-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-[11px] sm:text-xs text-orange-700">
                    <p className="font-semibold mb-0.5 sm:mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-0.5 sm:space-y-1">
                      <li>Don't close this window</li>
                      <li>Complete payment in the popup</li>
                      <li>Balance updates automatically</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full h-8 sm:h-10 text-xs sm:text-sm"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Step 3: Confirm Payment - Compact */}
          {step === "confirm" && (
            <div className="space-y-1.5 sm:space-y-2.5">
              <Card className="p-2 sm:p-3 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-1 sm:mb-1.5" />
                <p className="text-xs sm:text-sm text-green-900 mb-0.5 sm:mb-1">Payment Received!</p>
                <p className="text-[11px] sm:text-xs text-green-700">
                  Confirm to update your balance
                </p>
              </Card>

              <div className="space-y-0.5 sm:space-y-1">
                <Label className="text-[11px] sm:text-xs">Transaction Reference</Label>
                <Input value={confirmationCode} readOnly className="text-center font-mono text-xs sm:text-sm h-8 sm:h-9" />
                <p className="text-[9px] sm:text-[10px] text-gray-500 text-center">
                  Save this reference for your records
                </p>
              </div>

              <Card className="p-2 sm:p-2.5 space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-[11px] sm:text-xs">
                  <span className="text-gray-600">Amount:</span>
                  <span>₦{amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs">
                  <span className="text-gray-600">Gateway:</span>
                  <span>{selectedGateway === "opay" ? "OPay" : "Paystack"}</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs">
                  <span className="text-gray-600">Method:</span>
                  <span className="truncate ml-2">{selectedMethod?.bankName} ••••{selectedMethod?.last4}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] sm:text-xs">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-700 text-[9px] sm:text-[10px] px-1.5 py-0">
                    <CheckCircle2 className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
                    Verified
                  </Badge>
                </div>
              </Card>

              <Button
                onClick={handleCompletePayment}
                className="w-full h-8 sm:h-9 text-xs sm:text-sm"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                    Processing...
                  </>
                ) : (
                  "Confirm & Update Balance"
                )}
              </Button>
            </div>
          )}
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
