/**
 * Format a number as Nigerian Naira currency with commas
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the ₦ symbol (default: true)
 * @returns Formatted currency string
 * 
 * Examples:
 * formatCurrency(1000) => "₦1,000"
 * formatCurrency(1234567) => "₦1,234,567"
 * formatCurrency(1000.50) => "₦1,000.50"
 */
export function formatCurrency(amount: number, includeSymbol: boolean = true): string {
  // Handle invalid inputs
  if (isNaN(amount) || amount === null || amount === undefined) {
    return includeSymbol ? "₦0" : "0";
  }

  // Format number with commas
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return includeSymbol ? `₦${formatted}` : formatted;
}

/**
 * Format a number with commas (no currency symbol)
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  if (isNaN(num) || num === null || num === undefined) {
    return "0";
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

/**
 * Parse a formatted currency string back to a number
 * @param value - The formatted string (e.g., "₦1,234.56")
 * @returns The numeric value
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove currency symbol and commas
  const cleaned = value.replace(/[₦,]/g, '').trim();
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate loan repayment amount with variable interest rate
 * @param principal - The loan amount
 * @param weeks - Number of weeks for repayment
 * @param interestRate - Interest rate as decimal (default: 0.20 for 20%)
 * @returns Object with total amount and weekly payment
 */
export function calculateLoanRepayment(principal: number, weeks: number, interestRate: number = 0.20) {
  const totalAmount = principal * (1 + interestRate);
  const weeklyPayment = totalAmount / weeks;

  return {
    principal,
    interest: principal * interestRate,
    interestRate: interestRate * 100, // Return as percentage for display
    totalAmount,
    weeklyPayment,
    weeks
  };
}

/**
 * Calculate upfront costs for a loan
 * @param principal - The loan amount
 * @param loanType - The type of loan (sme, business, jumbo)
 * @returns Object with breakdown of upfront costs
 */
export function calculateUpfrontCosts(principal: number, loanType: 'sme' | 'business' | 'jumbo') {
  const depositRate = 0.10; // 10% loan deposit (refundable)
  const serviceCharge = 3500; // ₦3,500 service charge
  
  // Insurance rates by loan type
  const insuranceRates = {
    sme: 0.015,     // 1.5%
    business: 0.02,  // 2%
    jumbo: 0.03      // 3%
  };
  
  const deposit = principal * depositRate;
  const insurance = principal * insuranceRates[loanType];
  const totalUpfront = deposit + insurance + serviceCharge;
  
  return {
    deposit,
    insurance,
    insuranceRate: insuranceRates[loanType] * 100, // For display as percentage
    serviceCharge,
    totalUpfront,
    loanType
  };
}
