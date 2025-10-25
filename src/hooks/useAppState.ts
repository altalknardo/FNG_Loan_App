import { useState, useEffect, useCallback } from "react";

export type KYCStatus = "not_submitted" | "pending" | "approved" | "rejected";

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  userEmail: string;
  isAdmin: boolean;
  hasAdminAccess: boolean;
  
  // UI State
  activeTab: string;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  
  // Modal States
  showAdminLogin: boolean;
  showSignUp: boolean;
  showForgotPassword: boolean;
  showResetPassword: boolean;
  showTerms: boolean;
  showPrivacy: boolean;
  showAbout: boolean;
  showContact: boolean;
  showEmailVerification: boolean;
  
  // KYC State
  kycStatus: KYCStatus;
  
  // Email Verification
  pendingVerificationEmail: string;
  resetToken: string;
  resetEmail: string;
}

const initialState: AppState = {
  isAuthenticated: false,
  userEmail: "",
  isAdmin: false,
  hasAdminAccess: false,
  activeTab: "dashboard",
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  showAdminLogin: false,
  showSignUp: false,
  showForgotPassword: false,
  showResetPassword: false,
  showTerms: false,
  showPrivacy: false,
  showAbout: false,
  showContact: false,
  showEmailVerification: false,
  kycStatus: "not_submitted",
  pendingVerificationEmail: "",
  resetToken: "",
  resetEmail: ""
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize app data
  const initializeAppData = useCallback(() => {
    setIsLoading(true);
    try {
      // Initialize balances and data if they don't exist
      const initValues = [
        { key: "contributionBalance", defaultValue: localStorage.getItem("totalContributions") || "3200.00" },
        { key: "loanDeposits", defaultValue: "0" },
        { key: "upfrontRefundRequests", defaultValue: "[]" },
        { key: "depositOffsetRequests", defaultValue: "[]" },
        { key: "companyBalance", defaultValue: "0" },
        { key: "insuranceBalance", defaultValue: "0" },
        { key: "loanInterestBalance", defaultValue: "0" },
        { key: "loanServiceChargeBalance", defaultValue: "0" },
        { key: "loanInterest_sme", defaultValue: "0" },
        { key: "loanInterest_business", defaultValue: "0" },
        { key: "loanInterest_jumbo", defaultValue: "0" },
        { key: "interestTransactions", defaultValue: "[]" }
      ];

      initValues.forEach(({ key, defaultValue }) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, defaultValue);
        }
      });
    } catch (error) {
      console.error("Failed to initialize app data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check KYC status
  const checkKycStatus = useCallback(() => {
    if (state.isAdmin) return;

    try {
      const submissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
      
      if (submissions.length > 0) {
        const latestSubmission = submissions[submissions.length - 1];
        setState(prev => ({ ...prev, kycStatus: latestSubmission.status }));
      } else {
        setState(prev => ({ ...prev, kycStatus: "not_submitted" }));
      }
    } catch (error) {
      console.error("Failed to check KYC status:", error);
      setState(prev => ({ ...prev, kycStatus: "not_submitted" }));
    }
  }, [state.isAdmin]);

  // Update specific state properties
  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle user login
  const handleUserLogin = useCallback((email: string) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === email);
      
      if (user && !user.emailVerified) {
        updateState({
          pendingVerificationEmail: email,
          showEmailVerification: true
        });
        return;
      }

      updateState({
        userEmail: email,
        isAuthenticated: true,
        isAdmin: false,
        hasAdminAccess: false,
        showAdminLogin: false,
        showSignUp: false
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, [updateState]);

  // Handle admin login
  const handleAdminLogin = useCallback((email: string) => {
    updateState({
      userEmail: email,
      isAuthenticated: true,
      isAdmin: true,
      hasAdminAccess: true,
      showAdminLogin: false,
      showSignUp: false,
      activeTab: "admin-dashboard"
    });
  }, [updateState]);

  // Handle logout
  const handleLogout = useCallback(() => {
    updateState({
      ...initialState,
      kycStatus: "not_submitted"
    });
    
    // Clear admin data
    localStorage.removeItem("currentAdminRole");
    localStorage.removeItem("currentAdminEmail");
    localStorage.removeItem("currentAdminPermissions");
  }, [updateState]);

  // Toggle between user and admin mode
  const toggleMode = useCallback(() => {
    updateState({
      isAdmin: !state.isAdmin,
      activeTab: state.isAdmin ? "dashboard" : "admin-dashboard",
      sidebarCollapsed: false
    });
  }, [state.isAdmin, updateState]);

  // Initialize app on mount
  useEffect(() => {
    initializeAppData();
  }, [initializeAppData]);

  // Check KYC status when admin mode changes
  useEffect(() => {
    checkKycStatus();
  }, [checkKycStatus]);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigate = (event: any) => {
      if (event.detail) {
        updateState({ activeTab: event.detail });
      }
    };

    window.addEventListener("navigate", handleNavigate);
    return () => window.removeEventListener("navigate", handleNavigate);
  }, [updateState]);

  return {
    state,
    isLoading,
    updateState,
    handleUserLogin,
    handleAdminLogin,
    handleLogout,
    toggleMode,
    checkKycStatus
  };
}