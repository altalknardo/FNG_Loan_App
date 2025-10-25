/**
 * OPay Payment Service
 * 
 * This service integrates with OPay to process real payments
 * for contributions and loan repayments.
 * OPay is popular in Nigeria with 90% of FNG customers using it.
 */

// OPay configuration - with safe environment variable access
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    return (import.meta?.env?.[key] as string) || defaultValue;
  } catch {
    return defaultValue;
  }
};

const OPAY_PUBLIC_KEY = getEnvVar("VITE_OPAY_PUBLIC_KEY", "OPAYPUB17609854672500.8480023157634686");
const OPAY_PRIVATE_KEY = getEnvVar("VITE_OPAY_PRIVATE_KEY", "OPAYPRV17609854672500.6398724828967506");
const OPAY_MERCHANT_ID = getEnvVar("VITE_OPAY_MERCHANT_ID", "256100000001");
const OPAY_API_URL = "https://api.opayweb.com";

export interface OpayPaymentData {
  email: string;
  amount: number; // In Naira (OPay uses Naira directly, not kobo)
  reference?: string;
  country?: string; // Default: "NG"
  currency?: string; // Default: "NGN"
  metadata?: {
    paymentType?: "contribution" | "loan_repayment";
    loanId?: string;
    userId?: string;
    customerName?: string;
  };
  callbackUrl?: string;
}

export interface OpayTransaction {
  reference: string;
  status: "SUCCESS" | "FAILED" | "PENDING" | "INITIAL";
  message: string;
  orderNo: string;
  data?: {
    cashierUrl?: string;
  };
}

export interface OpayVerificationResponse {
  code: string;
  message: string;
  data: {
    orderNo: string;
    reference: string;
    amount: {
      total: number;
      currency: string;
    };
    status: "SUCCESS" | "FAILED" | "PENDING" | "INITIAL";
    country: string;
    product: {
      name: string;
      description: string;
    };
    payChannel: string;
    paymentTime?: string;
  };
}

/**
 * Initialize OPay payment
 * Opens OPay payment page or redirects to cashier
 */
export function initializeOpayPayment(
  paymentData: OpayPaymentData,
  onSuccess: (transaction: OpayTransaction) => void,
  onClose: () => void
): void {
  // Generate reference if not provided
  const reference = paymentData.reference || generateOpayReference();

  // Create payment request
  const paymentRequest = {
    reference: reference,
    mchShortName: "FNG",
    productName: paymentData.metadata?.paymentType === "contribution" 
      ? "Daily Contribution" 
      : "Loan Repayment",
    productDesc: `Payment for ${paymentData.metadata?.paymentType === "contribution" ? "contribution" : "loan repayment"}`,
    userPhone: paymentData.email, // OPay can use email or phone
    userRequestIp: "127.0.0.1",
    amount: {
      total: paymentData.amount,
      currency: paymentData.currency || "NGN"
    },
    country: paymentData.country || "NG",
    returnUrl: paymentData.callbackUrl || window.location.origin,
    callbackUrl: paymentData.callbackUrl || window.location.origin,
  };

  // Check if OPay SDK is loaded
  if (typeof (window as any).OpayCheckout === "undefined") {
    console.log("OPay SDK not loaded, using simulation mode");
    // Load OPay script dynamically
    loadOpayScript(() => {
      try {
        if (typeof (window as any).OpayCheckout !== "undefined") {
          initializeOpayCheckout();
        } else {
          // Fallback to simulation if script still not loaded
          simulateOpayPayment(paymentRequest, onSuccess, onClose);
        }
      } catch (error) {
        console.error("Error after loading OPay script:", error);
        simulateOpayPayment(paymentRequest, onSuccess, onClose);
      }
    });
    return;
  }

  initializeOpayCheckout();

  function initializeOpayCheckout() {
    try {
      const checkout = new (window as any).OpayCheckout({
        publicKey: OPAY_PUBLIC_KEY,
        merchantId: OPAY_MERCHANT_ID,
      });

      checkout.setup({
        ...paymentRequest,
        onSuccess: function(response: OpayTransaction) {
          console.log("OPay payment successful:", response);
          try {
            onSuccess(response);
          } catch (error) {
            console.error("Error in OPay success callback:", error);
          }
        },
        onError: function(error: any) {
          console.error("OPay payment error:", error);
          try {
            onClose();
          } catch (e) {
            console.error("Error in OPay error callback:", e);
          }
        },
        onClose: function() {
          console.log("OPay payment closed");
          try {
            onClose();
          } catch (error) {
            console.error("Error in OPay close callback:", error);
          }
        }
      });

      checkout.open();
    } catch (error) {
      console.error("OPay initialization error:", error);
      // Fallback to simulation
      simulateOpayPayment(paymentRequest, onSuccess, onClose);
    }
  }
}

/**
 * Simulate OPay payment for demo/development
 */
function simulateOpayPayment(
  paymentRequest: any,
  onSuccess: (transaction: OpayTransaction) => void,
  onClose: () => void
): void {
  // Show a simulated payment dialog
  const shouldSucceed = confirm(
    `OPay Payment Simulation\n\n` +
    `Amount: ₦${paymentRequest.amount.total.toLocaleString()}\n` +
    `Reference: ${paymentRequest.reference}\n\n` +
    `Click OK to simulate successful payment\n` +
    `Click Cancel to simulate payment cancellation`
  );

  if (shouldSucceed) {
    // Simulate successful payment after a delay
    setTimeout(() => {
      const transaction: OpayTransaction = {
        reference: paymentRequest.reference,
        status: "SUCCESS",
        message: "Payment successful (Simulated)",
        orderNo: `OPAY_${Date.now()}`,
      };
      onSuccess(transaction);
    }, 1500);
  } else {
    onClose();
  }
}

/**
 * Verify payment with OPay
 * This should be called after receiving payment callback
 */
export async function verifyOpayPayment(
  reference: string,
  orderNo: string
): Promise<OpayVerificationResponse> {
  try {
    // In production, this verification should be done on your backend
    // to keep your secret key secure
    
    const response = await fetch(
      `${OPAY_API_URL}/api/v1/international/transaction/status`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPAY_PUBLIC_KEY}`,
          "Content-Type": "application/json",
          "MerchantId": OPAY_MERCHANT_ID,
        },
        body: JSON.stringify({
          reference: reference,
          orderNo: orderNo,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    const data: OpayVerificationResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying OPay payment:", error);
    throw error;
  }
}

/**
 * Simulate payment verification (for demo without backend)
 */
export function simulateOpayVerification(
  reference: string,
  orderNo: string,
  amount: number
): OpayVerificationResponse {
  return {
    code: "00000",
    message: "Successful",
    data: {
      orderNo: orderNo,
      reference: reference,
      amount: {
        total: amount,
        currency: "NGN"
      },
      status: "SUCCESS",
      country: "NG",
      product: {
        name: "FNG Payment",
        description: "Payment for FNG services"
      },
      payChannel: "OPay",
      paymentTime: new Date().toISOString(),
    }
  };
}

/**
 * Load OPay script dynamically
 */
function loadOpayScript(callback: () => void): void {
  // Check if script is already loaded
  if (typeof (window as any).OpayCheckout !== "undefined") {
    callback();
    return;
  }

  // Check if script is already being loaded
  const existingScript = document.querySelector('script[src="https://webpay.opayweb.com/v3/cashier.js"]');
  if (existingScript) {
    existingScript.addEventListener('load', callback);
    return;
  }

  const script = document.createElement("script");
  script.src = "https://webpay.opayweb.com/v3/cashier.js";
  script.async = true;
  script.onload = () => {
    console.log("OPay script loaded successfully");
    callback();
  };
  script.onerror = () => {
    console.error("Failed to load OPay script");
    alert("Failed to load OPay payment system. Using simulation mode.");
    callback(); // Still call callback to trigger simulation
  };
  document.head.appendChild(script);
}

/**
 * Generate unique payment reference for OPay
 */
export function generateOpayReference(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `FNG_OPAY_${timestamp}_${random}`;
}

/**
 * Record OPay payment transaction
 */
export function recordOpayTransaction(
  userId: string,
  amount: number,
  type: "contribution" | "loan_repayment",
  reference: string,
  orderNo: string,
  loanId?: string
): void {
  // Get existing transactions
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

  // Create new transaction
  const transaction = {
    id: Date.now(),
    date: new Date().toISOString(),
    type: type === "contribution" ? "contribution" : "repayment",
    amount: amount,
    balance: 0, // Will be updated by caller
    status: "completed",
    reference: reference,
    orderNo: orderNo,
    paymentMethod: "OPay",
    loanId: loanId,
    userId: userId,
    gateway: "opay",
    timestamp: Date.now(),
  };

  // Add transaction
  transactions.unshift(transaction);

  // Save back to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Trigger storage event for other components
  window.dispatchEvent(new Event("storage"));
}

/**
 * Update user balance after successful OPay payment
 */
export function updateBalanceAfterOpayPayment(
  type: "contribution" | "loan_repayment",
  amount: number,
  loanId?: string
): void {
  if (type === "contribution") {
    // Update contribution balance
    const currentBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
    const newBalance = currentBalance + amount;
    localStorage.setItem("contributionBalance", newBalance.toFixed(2));

    // Update total contributions
    const totalContributions = parseFloat(localStorage.getItem("totalContributions") || "0");
    localStorage.setItem("totalContributions", (totalContributions + amount).toFixed(2));

    // Update company balance (company receives the contribution)
    const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
    localStorage.setItem("companyBalance", (companyBalance + amount).toFixed(2));

  } else if (type === "loan_repayment" && loanId) {
    // Update loan repayment
    const loans = JSON.parse(localStorage.getItem("loans") || "[]");
    const loanIndex = loans.findIndex((l: any) => l.id === parseInt(loanId));

    if (loanIndex !== -1) {
      const loan = loans[loanIndex];
      const amountPaid = parseFloat(loan.amountPaid || "0");
      loan.amountPaid = (amountPaid + amount).toFixed(2);

      // Calculate remaining balance
      const totalAmount = parseFloat(loan.totalAmount);
      const remaining = totalAmount - parseFloat(loan.amountPaid);
      loan.remainingBalance = remaining.toFixed(2);

      // Update status if fully paid
      if (remaining <= 0) {
        loan.status = "paid";
        loan.paidDate = new Date().toISOString();
      }

      // Save updated loans
      loans[loanIndex] = loan;
      localStorage.setItem("loans", JSON.stringify(loans));

      // Update company revenue (loan repayment goes to company)
      const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
      localStorage.setItem("companyBalance", (companyBalance + amount).toFixed(2));

      // Calculate and update interest earned
      const interestRate = 0.20; // 20% APR
      const interestAmount = amount * (interestRate / (loan.repaymentPeriod || 8)); // Weekly interest
      const loanInterestBalance = parseFloat(localStorage.getItem("loanInterestBalance") || "0");
      localStorage.setItem("loanInterestBalance", (loanInterestBalance + interestAmount).toFixed(2));
    }
  }

  // Trigger storage event to update UI
  window.dispatchEvent(new Event("storage"));
}

/**
 * Get OPay payment history for a user
 */
export function getOpayPaymentHistory(userId: string): any[] {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  return transactions.filter((t: any) => t.userId === userId && t.gateway === "opay");
}

/**
 * Check if OPay payment is successful
 */
export function isOpayPaymentSuccessful(status: string): boolean {
  return status === "SUCCESS";
}

/**
 * Check if OPay is available in user's region
 */
export function isOpayAvailable(): boolean {
  // OPay is primarily available in Nigeria
  // You can add more sophisticated location detection here
  return true;
}

/**
 * Get OPay payment channels
 */
export function getOpayPaymentChannels(): string[] {
  return [
    "OPay Wallet",
    "Bank Card",
    "Bank Transfer",
    "USSD",
  ];
}
