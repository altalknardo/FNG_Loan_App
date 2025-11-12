import api from "./api";

// Types for signup request and response
export interface SignUpRequest {
  fullName: string;
  email?: string;
  phone: string;
  password: string;
  streetAddress: string;
  city: string;
  state: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      fullName: string;
      email?: string;
      phoneNumber: string;
      role: string;
      status: string;
      phoneVerified: boolean;
      createdAt: string;
    };
    token?: string; // If backend returns auth token
  };
  token?: string;
  errors?: Record<string, string[]>; // Field-specific errors
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Types for login request and response
export interface LoginRequest {
  emailOrPhone: string; // Can be email or phone number
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      fullName: string;
      email?: string;
      phoneNumber: string;
      role: string;
      status: string;
      phoneVerified: boolean;
      kyc?: boolean; // KYC flag
      // kycCompleted?: boolean; // KYC completion flag
      // kycStatus?: "not_submitted" | "pending" | "approved" | "rejected"; // KYC status
    };
    token: string; // Auth token
  };
  token?: string;
  errors?: Record<string, string[]>;
}

export interface KycRequest {
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
  gender?: string;
  paymentType?: string;
  idDocumentUrl?: string;
  proofOfAddressUrl?: string;
  selfieUrl?: string;
}

export interface KycResponse {
  success: boolean;
  message: string;
  data: {
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
    _id: string;
    name: string;
    profileImageUrl: string;
    email: string;
    city: string;
    state: string;
    streetAddress: string;
    phone: string;
    role: string;
    phoneVerified: boolean;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    dob: string;
    firstName: string;
    gender: string;
    lastName: string;
    paymentType: string;
    idDocumentUrl: string;
    proofOfAddressUrl: string;
    selfieUrl: string;
  };
}

/**
 * Sign up a new user
 * @param userData - User registration data
 * @returns Promise with signup response
 */
export const signUp = async (
  userData: SignUpRequest
): Promise<SignUpResponse> => {
  try {
    const response = await api.post<SignUpResponse>("user/register", userData);
    return response.data;
  } catch (error: any) {
    // Handle API errors
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      throw {
        message: data?.message || "Registration failed. Please try again.",
        errors: data?.errors || {},
        status,
      } as ApiError;
    } else if (error.request) {
      // Request was made but no response received
      throw {
        message: "Network error. Please check your connection and try again.",
      } as ApiError;
    } else {
      // Something else happened
      throw {
        message:
          error.message || "An unexpected error occurred. Please try again.",
      } as ApiError;
    }
  }
};

/**
 * Check if phone number is already registered
 * @param phoneNumber - Phone number to check
 * @returns Promise with boolean indicating if phone exists
 */
export const checkPhoneExists = async (
  phoneNumber: string
): Promise<boolean> => {
  try {
    const response = await api.get<{ exists: boolean }>(
      `/auth/check-phone/${encodeURIComponent(phoneNumber)}`
    );
    return response.data.exists;
  } catch (error: any) {
    // If endpoint doesn't exist or error occurs, return false to allow signup
    console.warn("Phone check failed:", error.message);
    return false;
  }
};

/**
 * Verify phone number with OTP
 * @param phoneNumber - Phone number to verify
 * @param otp - OTP code
 * @returns Promise with verification response
 */
export const verifyPhone = async (
  phoneNumber: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(
      "user/verify-otp",
      {
        phone: phoneNumber,
        otp,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;
      throw {
        message: data?.message || "Verification failed. Please try again.",
      } as ApiError;
    }
    throw {
      message: "Network error. Please check your connection and try again.",
    } as ApiError;
  }
};

/**
 * Resend OTP to phone number
 * @param phoneNumber - Phone number to resend OTP to
 * @returns Promise with response
 */
export const resendOTP = async (
  phoneNumber: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(
      "user/resend-otp",
      {
        phone: phoneNumber,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;
      throw {
        message: data?.message || "Failed to resend OTP. Please try again.",
      } as ApiError;
    }
    throw {
      message: "Network error. Please check your connection and try again.",
    } as ApiError;
  }
};

/**
 * Login user with email/phone and password
 * @param credentials - Login credentials (username can be email or phone)
 * @returns Promise with login response
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("user/login", credentials);
    return response.data;
  } catch (error: any) {
    // Handle API errors
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      throw {
        message:
          data?.message ||
          "Login failed. Please check your credentials and try again.",
        errors: data?.errors || {},
        status,
      } as ApiError;
    } else if (error.request) {
      // Request was made but no response received
      throw {
        message: "Network error. Please check your connection and try again.",
      } as ApiError;
    } else {
      // Something else happened
      throw {
        message:
          error.message || "An unexpected error occurred. Please try again.",
      } as ApiError;
    }
  }
};

export const updateKYC = async (kycData: KycRequest): Promise<KycResponse> => {
  try {
    const response = await api.post<KycResponse>("user/update-kyc", kycData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        message:
          data?.message ||
          "KYC update failed. Please check your information and try again.",
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
