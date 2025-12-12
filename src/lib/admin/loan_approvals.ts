import api from "../api";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface LoanResponse {
  success: boolean;
  message: string;
  loanRequests: any[];
}

export const getLoanApplications = async () => {
  try {
    const response = await api.get<LoanResponse>("loan/allRequests");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        message:
          data?.message || "Failed to fetch loan data. Please try again.",
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

export const decideUpfront = async (status: string, id: number) => {
  try {
    const response = await api.get<LoanResponse>(
      `loan/decideUpfrontCostPayment/${id}?status=${status}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        message:
          data?.message || "Failed to fetch loan data. Please try again.",
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

export const decideLoan = async (status: string, id: number) => {
  try {
    const response = await api.get<LoanResponse>(
      `loan/decideRequest/${id}?status=${status}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        message:
          data?.message || "Failed to fetch loan data. Please try again.",
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
export const upfrontTransfer = async (loanData: any) => {
  try {
    const response = await api.post("loan/initiateRequest", loanData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        message:
          data?.message ||
          "Failed to initiate upfront confirmation. Please try again.",
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
