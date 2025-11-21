import api from "./api";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
export interface DashboardRequest {
  idInfo: {
    idType: string;
    idNumber: string;
    bvn: string;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  cardInfo: {
    cardNumber: string;
    cardType: string;
  };
  dob?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  paymentType?: string;
  idDocumentUrl?: string;
  proofOfAddressUrl?: string;
  selfieUrl?: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    balanceInfo: {
      totalBalance: number;
      contributionBalance: number;
      activeLoan: number;
    };
    activeLoan: {
      loanId: string;
      repaidAmount: number;
      totalAmount: number;
      completetionPercentage: number;
      nextPaymentDueDate: string;
      nextPaymentAmount: number;
    };
    dailyContributionStreak: number;
    recenetTransactions: [
      {
        transactionType: string;
        amount: number;
        date: string;
      },
      {
        transactionType: string;
        amount: number;
        date: string;
      }
    ];
  };
}

export const getUserDashboardData = async () => {
  try {
    const response = await api.get<DashboardResponse>("dashboard/overview");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        message:
          data?.message || "Failed to fetch dashboard data. Please try again.",
        errors: data?.errors || {},
        status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: "Network error. Please check your connection and try again.",
      } as ApiError;
    } else {
      throw {
        message:
          error.message || "An unexpected error occurred. Please try again.",
      } as ApiError;
    }
  }
};
