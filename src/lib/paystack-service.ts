/**
 * Paystack Payment Service
 * 
 * This service integrates with Paystack to process real payments
 * for contributions and loan repayments.
 */

// Paystack configuration - with safe environment variable access
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    return (import.meta?.env?.[key] as string) || defaultValue;
  } catch {
    return defaultValue;
  }
};

const PAYSTACK_PUBLIC_KEY = getEnvVar("VITE_PAYSTACK_PUBLIC_KEY", "pk_test_YOUR_PAYSTACK_PUBLIC_KEY");
const PAYSTACK_SECRET_KEY = getEnvVar("VITE_PAYSTACK_SECRET_KEY", "sk_test_YOUR_SECRET_KEY");
const PAYSTACK_API_URL = "https://api.paystack.co";

export interface PaystackPaymentData {
  email: string;
  amount: number; // In kobo (multiply naira by 100)
  reference?: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string | number;
    }>;
    paymentType?: "contribution" | "loan_repayment";
    loanId?: string;
    userId?: string;
    customerName?: string;
  };
  callback_url?: string;
  channels?: string[]; // ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
}

export interface PaystackTransaction {
  reference: string;
  trans: string;
  status: "success" | "failed" | "abandoned";
  message: string;
  transaction: string;
  trxref: string;
  redirecturl?: string;
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
      risk_action: string;
    };
    plan: any;
    order_id: any | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any | null;
    source: any | null;
    fees_breakdown: any | null;
    transaction_date: string;
    plan_object: any;
    subaccount: any;
  };
}

/**
 * Initialize Paystack payment
 * Opens Paystack popup for payment
 */
export function initializePaystackPayment(
  paymentData: PaystackPaymentData,
  onSuccess: (transaction: PaystackTransaction) => void,
  onClose: () => void
): void {
  // Check if Paystack is loaded
  if (typeof (window as any).PaystackPop === "undefined") {
    console.error("Paystack library not loaded");
    // Load Paystack script dynamically
    loadPaystackScript(() => {
      try {
        initializePayment();
      } catch (error) {
        console.error("Error initializing Paystack after loading:", error);
        alert("Failed to initialize payment. Please refresh the page and try again.");
      }
    });
    return;
  }

  try {
    initializePayment();
  } catch (error) {
    console.error("Error initializing Paystack payment:", error);
    alert("Failed to initialize payment. Please try again.");
  }

  function initializePayment() {
    try {
      // Generate reference if not provided
      const reference = paymentData.reference || generateReference();

      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: paymentData.email,
        amount: paymentData.amount, // Amount in kobo
        ref: reference,
        metadata: paymentData.metadata || {},
        channels: paymentData.channels || ['card', 'bank', 'ussd', 'bank_transfer'],
        callback: function(response: PaystackTransaction) {
          // Payment successful
          console.log("Payment successful:", response);
          try {
            onSuccess(response);
          } catch (error) {
            console.error("Error in payment success callback:", error);
          }
        },
        onClose: function() {
          // User closed payment popup
          console.log("Payment popup closed");
          try {
            onClose();
          } catch (error) {
            console.error("Error in payment close callback:", error);
          }
        }
      });

      // Open Paystack popup
      handler.openIframe();
    } catch (error) {
      console.error("Error setting up Paystack payment:", error);
      throw error;
    }
  }
}

/**
 * Verify payment with Paystack
 * This should be called after receiving payment callback
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerificationResponse> {
  try {
    // In production, this verification should be done on your backend
    // to keep your secret key secure. For demo purposes, we'll simulate it.
    
    // NOTE: DO NOT use secret key on frontend in production!
    // This is just for demonstration
    
    const response = await fetch(
      `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    const data: PaystackVerificationResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}

/**
 * Simulate payment verification (for demo without backend)
 */
export function simulatePaymentVerification(
  reference: string,
  amount: number,
  email: string
): PaystackVerificationResponse {
  return {
    status: true,
    message: "Verification successful",
    data: {
      id: Math.floor(Math.random() * 1000000),
      domain: "test",
      status: "success",
      reference: reference,
      amount: amount,
      message: null,
      gateway_response: "Successful",
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      channel: "card",
      currency: "NGN",
      ip_address: "0.0.0.0",
      metadata: {},
      log: null,
      fees: Math.floor(amount * 0.015), // 1.5% fee
      fees_split: null,
      authorization: {
        authorization_code: `AUTH_${generateReference()}`,
        bin: "408408",
        last4: "4081",
        exp_month: "12",
        exp_year: "2030",
        channel: "card",
        card_type: "visa",
        bank: "TEST BANK",
        country_code: "NG",
        brand: "visa",
        reusable: true,
        signature: "SIG_" + generateReference(),
        account_name: null,
      },
      customer: {
        id: Math.floor(Math.random() * 1000000),
        first_name: null,
        last_name: null,
        email: email,
        customer_code: `CUS_${generateReference()}`,
        phone: null,
        metadata: {},
        risk_action: "default",
      },
      plan: null,
      order_id: null,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      requested_amount: amount,
      pos_transaction_data: null,
      source: null,
      fees_breakdown: null,
      transaction_date: new Date().toISOString(),
      plan_object: {},
      subaccount: {},
    },
  };
}

/**
 * Generate unique payment reference
 */
export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `FNG_${timestamp}_${random}`;
}

/**
 * Convert Naira to Kobo (Paystack uses kobo)
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Convert Kobo to Naira
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/**
 * Load Paystack script dynamically
 */
function loadPaystackScript(callback: () => void): void {
  // Check if script is already loaded
  if (typeof (window as any).PaystackPop !== "undefined") {
    callback();
    return;
  }

  // Check if script is already being loaded
  const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
  if (existingScript) {
    existingScript.addEventListener('load', callback);
    return;
  }

  const script = document.createElement("script");
  script.src = "https://js.paystack.co/v1/inline.js";
  script.async = true;
  script.onload = () => {
    console.log("Paystack script loaded successfully");
    callback();
  };
  script.onerror = () => {
    console.error("Failed to load Paystack script");
    alert("Failed to load payment system. Please check your internet connection and try again.");
  };
  document.head.appendChild(script);
}

/**
 * Record payment transaction
 */
export function recordPaymentTransaction(
  userId: string,
  amount: number,
  type: "contribution" | "loan_repayment",
  reference: string,
  paymentMethod: string,
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
    paymentMethod: paymentMethod,
    loanId: loanId,
    userId: userId,
    gateway: "paystack",
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
 * Update user balance after successful payment
 */
export function updateUserBalance(
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
 * Get payment history for a user
 */
export function getPaymentHistory(userId: string): any[] {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  return transactions.filter((t: any) => t.userId === userId);
}

/**
 * Check if payment is successful
 */
export function isPaymentSuccessful(status: string): boolean {
  return status === "success";
}
