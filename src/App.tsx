import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { LoanSection } from "./components/LoanSection";
import { Contributions } from "./components/Contributions";
import { TransactionHistory } from "./components/TransactionHistory";
import { Profile } from "./components/Profile";
import { PaymentMethods } from "./components/PaymentMethods";
import { KYCRegistration } from "./components/KYCRegistration";
import { CustomerService } from "./components/CustomerService";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { AdminLogin } from "./components/AdminLogin";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
import { TermsOfService } from "./components/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { AboutUs } from "./components/AboutUs";
import { ContactPage } from "./components/ContactPage";
import { EmailVerification } from "./components/EmailVerification";
import { SMSVerification } from "./components/SMSVerification";
import { SessionTimeoutHandler } from "./components/SessionTimeoutHandler";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { OnboardingTutorial, useOnboarding } from "./components/OnboardingTutorial";
import { SplashScreen } from "./components/SplashScreen";
import { BrandLogoCompact } from "./components/BrandLogo";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { LoanApprovals } from "./components/admin/LoanApprovals";
import { LoanDefaulters } from "./components/admin/LoanDefaulters";
import { WithdrawalApprovals } from "./components/admin/WithdrawalApprovals";
import { CustomerApprovals } from "./components/admin/CustomerApprovals";
import { CustomerProfiles } from "./components/admin/CustomerProfiles";
import { CustomerEnquiries } from "./components/admin/CustomerEnquiries";
import { RealtimeActivity } from "./components/admin/RealtimeActivity";
import { DataManagement } from "./components/admin/DataManagement";
import { CompanySettings } from "./components/admin/CompanySettings";
import { UpfrontRefunds } from "./components/admin/UpfrontRefunds";
import { CustomerManagement } from "./components/admin/CustomerManagement";
import { DepositOffsetApprovals } from "./components/admin/DepositOffsetApprovals";
import { RevenueAnalytics } from "./components/admin/RevenueAnalytics";
import { ReportGenerator } from "./components/admin/ReportGenerator";
import { AccountingReports } from "./components/admin/AccountingReports";
import { CustomerLoanContributionReport } from "./components/admin/CustomerLoanContributionReport";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Home, DollarSign, Wallet, History, User, Settings, LayoutDashboard, UserCheck, FileCheck, Activity, Database, LogOut, Building2, Menu, X, Clock, XCircle, Users, RefreshCw, Edit, TrendingDown, BarChart3, FileText, HandCoins, MessageCircle, Headphones, Receipt, AlertTriangle } from "lucide-react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");
  const [showSMSVerification, setShowSMSVerification] = useState(false);
  const [pendingVerificationPhone, setPendingVerificationPhone] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<"not_submitted" | "pending" | "approved" | "rejected">("not_submitted");
  
  // Onboarding hook
  const { shouldShowOnboarding, setShouldShowOnboarding } = useOnboarding(isAdmin);

  // Check if accessing admin via URL (hash, query param, or path)
  const checkAdminAccess = () => {
    // Check hash-based routing (works in development)
    if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
      return true;
    }
    
    // Check query parameter (alternative access method)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      return true;
    }
    
    // Check pathname (works in production with proper routing)
    if (window.location.pathname === '/admin') {
      return true;
    }
    
    return false;
  };

  // Check if splash screen should be shown (only on first visit)
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash === "true") {
      setShowSplash(false);
    }
    
    // Check if accessing admin via URL
    if (checkAdminAccess() && !isAuthenticated) {
      setShowAdminLogin(true);
    }
  }, []);
  
  // Listen for URL changes to detect admin access
  useEffect(() => {
    const handleLocationChange = () => {
      if (checkAdminAccess() && !isAuthenticated) {
        setShowAdminLogin(true);
      }
    };
    
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [isAuthenticated]);

  // Initialize balances and check KYC status on mount
  useEffect(() => {
    // Initialize contribution balance if it doesn't exist
    if (!localStorage.getItem("contributionBalance")) {
      const totalContributions = localStorage.getItem("totalContributions") || "3200.00";
      localStorage.setItem("contributionBalance", totalContributions);
    }
    
    // Initialize loan deposits if it doesn't exist
    if (!localStorage.getItem("loanDeposits")) {
      localStorage.setItem("loanDeposits", "0");
    }
    
    // Initialize upfront refund requests if it doesn't exist
    if (!localStorage.getItem("upfrontRefundRequests")) {
      localStorage.setItem("upfrontRefundRequests", "[]");
    }
    
    // Initialize deposit offset requests if it doesn't exist
    if (!localStorage.getItem("depositOffsetRequests")) {
      localStorage.setItem("depositOffsetRequests", "[]");
    }
    
    // Initialize company balance if it doesn't exist
    if (!localStorage.getItem("companyBalance")) {
      localStorage.setItem("companyBalance", "0");
    }
    
    // Initialize insurance balance if it doesn't exist
    if (!localStorage.getItem("insuranceBalance")) {
      localStorage.setItem("insuranceBalance", "0");
    }
    
    // Initialize loan interest balance if it doesn't exist
    if (!localStorage.getItem("loanInterestBalance")) {
      localStorage.setItem("loanInterestBalance", "0");
    }
    
    // Initialize loan service charge balance if it doesn't exist
    if (!localStorage.getItem("loanServiceChargeBalance")) {
      localStorage.setItem("loanServiceChargeBalance", "0");
    }
    
    // Initialize loan interest breakdown by type
    if (!localStorage.getItem("loanInterest_sme")) {
      localStorage.setItem("loanInterest_sme", "0");
    }
    if (!localStorage.getItem("loanInterest_business")) {
      localStorage.setItem("loanInterest_business", "0");
    }
    if (!localStorage.getItem("loanInterest_jumbo")) {
      localStorage.setItem("loanInterest_jumbo", "0");
    }
    
    // Initialize interest transactions history
    if (!localStorage.getItem("interestTransactions")) {
      localStorage.setItem("interestTransactions", "[]");
    }
    
    checkKycStatus();
    
    // Listen for navigation events from child components
    const handleNavigate = (event: any) => {
      if (event.detail) {
        setActiveTab(event.detail);
      }
    };
    
    window.addEventListener("navigate", handleNavigate);
    return () => window.removeEventListener("navigate", handleNavigate);
  }, [isAdmin]);

  const checkKycStatus = () => {
    // In admin mode, bypass KYC check
    if (isAdmin) return;

    const submissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
    
    // For demo purposes, check the most recent submission
    // In production, you'd check for the current user's submission
    if (submissions.length > 0) {
      const latestSubmission = submissions[submissions.length - 1];
      setKycStatus(latestSubmission.status);
    } else {
      setKycStatus("not_submitted");
    }
  };

  const handleRegistrationComplete = () => {
    setKycStatus("pending");
  };

  const renderUserContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} userEmail={userEmail} />;
      case "loans":
        return <LoanSection onNavigate={setActiveTab} userEmail={userEmail} />;
      case "contributions":
        return <Contributions userEmail={userEmail} />;
      case "history":
        return <TransactionHistory />;
      case "support":
        return <CustomerService userEmail={userEmail} />;
      case "profile":
        return <Profile onNavigate={setActiveTab} userEmail={userEmail} onEmailChange={setUserEmail} />;
      case "payments":
        return <PaymentMethods />;
      default:
        return <Dashboard onNavigate={setActiveTab} userEmail={userEmail} />;
    }
  };

  const renderAdminContent = () => {
    switch (activeTab) {
      case "admin-dashboard":
        return <AdminDashboard onNavigate={setActiveTab} />;
      case "loan-approvals":
        return <LoanApprovals />;
      case "loan-defaulters":
        return <LoanDefaulters />;
      case "withdrawal-approvals":
        return <WithdrawalApprovals />;
      case "upfront-refunds":
        return <UpfrontRefunds />;
      case "deposit-offset":
        return <DepositOffsetApprovals />;
      case "customer-approvals":
        return <CustomerApprovals />;
      case "customer-profiles":
        return <CustomerProfiles />;
      case "customer-management":
        return <CustomerManagement />;
      case "customer-enquiries":
        return <CustomerEnquiries />;
      case "activity":
        return <RealtimeActivity />;
      case "data-management":
        return <DataManagement />;
      case "company-settings":
        return <CompanySettings adminEmail={userEmail} onEmailChange={setUserEmail} />;
      case "revenue-analytics":
        return <RevenueAnalytics onNavigate={setActiveTab} />;
      case "reports":
        return <ReportGenerator />;
      case "accounting-reports":
        return <AccountingReports />;
      case "customer-loan-report":
        return <CustomerLoanContributionReport />;
      default:
        return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  const userNavItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "loans", label: "Loans", icon: HandCoins },
    { id: "contributions", label: "Save", icon: Wallet },
    { id: "history", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: User },
  ];

  const adminNavItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "revenue-analytics", label: "Revenue Analytics", icon: BarChart3 },
    { id: "accounting-reports", label: "Accounting Reports", icon: Receipt },
    { id: "customer-loan-report", label: "Customer Report", icon: Users },
    { id: "reports", label: "Generate Reports", icon: FileText },
    { id: "loan-approvals", label: "Loans", icon: FileCheck },
    { id: "loan-defaulters", label: "Loan Defaulters", icon: AlertTriangle },
    { id: "withdrawal-approvals", label: "Withdrawals", icon: DollarSign },
    { id: "upfront-refunds", label: "Deposit Refunds", icon: RefreshCw },
    { id: "deposit-offset", label: "Balance Offset", icon: TrendingDown },
    { id: "customer-approvals", label: "KYC Approvals", icon: UserCheck },
    { id: "customer-profiles", label: "Customers", icon: Users },
    { id: "customer-management", label: "Manage Customers", icon: Edit },
    { id: "customer-enquiries", label: "Customer Enquiries", icon: MessageCircle },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "data-management", label: "Data", icon: Database },
    { id: "company-settings", label: "Settings", icon: Building2 },
  ];

  const handleUserLogin = (emailOrPhone: string) => {
    // Check if phone number is verified
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => 
      u.phoneNumber === emailOrPhone || u.email === emailOrPhone
    );
    
    if (user && !user.phoneVerified) {
      // Show SMS verification screen
      setPendingVerificationPhone(user.phoneNumber);
      setShowSMSVerification(true);
      return;
    }

    setUserEmail(user ? (user.email || user.phoneNumber) : emailOrPhone);
    setIsAuthenticated(true);
    setIsAdmin(false);
    setShowAdminLogin(false);
    setShowSignUp(false);
    checkKycStatus();
  };

  const handleSignUp = (phoneNumber: string, userData: any) => {
    // New users need phone verification
    setPendingVerificationPhone(phoneNumber);
    setShowSMSVerification(true);
  };

  const handleAdminLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setIsAdmin(true);
    setShowAdminLogin(false);
    setShowSignUp(false);
    setActiveTab("admin-dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setIsAdmin(false);
    setShowAdminLogin(false);
    setShowSignUp(false);
    setShowEmailVerification(false);
    setPendingVerificationEmail("");
    setShowSMSVerification(false);
    setPendingVerificationPhone("");
    setActiveTab("dashboard");
    setKycStatus("not_submitted");
    setShouldShowOnboarding(false);
    // Clear admin role and permissions
    localStorage.removeItem("currentAdminRole");
    localStorage.removeItem("currentAdminEmail");
    localStorage.removeItem("currentAdminPermissions");
  };



  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasSeenSplash", "true");
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show public pages (accessible without authentication)
  if (showTerms) {
    return (
      <>
        <TermsOfService onBack={() => setShowTerms(false)} />
        <Toaster />
      </>
    );
  }

  if (showPrivacy) {
    return (
      <>
        <PrivacyPolicy onBack={() => setShowPrivacy(false)} />
        <Toaster />
      </>
    );
  }

  if (showAbout) {
    return (
      <>
        <AboutUs onBack={() => setShowAbout(false)} />
        <Toaster />
      </>
    );
  }

  if (showContact) {
    return (
      <>
        <ContactPage onBack={() => setShowContact(false)} />
        <Toaster />
      </>
    );
  }

  // Show SMS verification if needed (primary method)
  if (showSMSVerification && pendingVerificationPhone) {
    return (
      <>
        <SMSVerification
          phoneNumber={pendingVerificationPhone}
          onVerificationComplete={() => {
            // Complete authentication after verification
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const user = users.find((u: any) => u.phoneNumber === pendingVerificationPhone);
            setUserEmail(user ? (user.email || user.phoneNumber) : pendingVerificationPhone);
            setIsAuthenticated(true);
            setIsAdmin(false);
            setShowSMSVerification(false);
            setPendingVerificationPhone("");
            setShowAdminLogin(false);
            setShowSignUp(false);
            setKycStatus("not_submitted");
          }}
          onResendSMS={() => {
            // Resend logic handled in component
          }}
          onLogout={() => {
            setShowSMSVerification(false);
            setPendingVerificationPhone("");
          }}
        />
        <Toaster />
      </>
    );
  }

  // Show email verification if needed (legacy/fallback)
  if (showEmailVerification && pendingVerificationEmail) {
    return (
      <>
        <EmailVerification
          email={pendingVerificationEmail}
          onVerificationComplete={() => {
            // Complete authentication after verification
            setUserEmail(pendingVerificationEmail);
            setIsAuthenticated(true);
            setIsAdmin(false);
            setShowEmailVerification(false);
            setPendingVerificationEmail("");
            setShowAdminLogin(false);
            setShowSignUp(false);
            setKycStatus("not_submitted");
          }}
          onResendEmail={() => {
            // Resend logic handled in component
          }}
          onLogout={() => {
            setShowEmailVerification(false);
            setPendingVerificationEmail("");
          }}
        />
        <Toaster />
      </>
    );
  }

  // Show login screens if not authenticated
  if (!isAuthenticated) {
    if (showResetPassword && resetToken && resetEmail) {
      return (
        <>
          <ResetPassword
            email={resetEmail}
            token={resetToken}
            onResetComplete={() => {
              setShowResetPassword(false);
              setResetToken("");
              setResetEmail("");
              setShowForgotPassword(false);
            }}
            onCancel={() => {
              setShowResetPassword(false);
              setResetToken("");
              setResetEmail("");
              setShowForgotPassword(false);
            }}
          />
          <Toaster />
        </>
      );
    }

    if (showForgotPassword) {
      return (
        <>
          <ForgotPassword
            onBack={() => setShowForgotPassword(false)}
            onResetRequested={(email, token) => {
              setResetEmail(email);
              setResetToken(token);
              setShowResetPassword(true);
            }}
          />
          <Toaster />
        </>
      );
    }

    if (showSignUp) {
      return (
        <>
          <SignUp
            onSignUp={handleSignUp}
            onSwitchToLogin={() => setShowSignUp(false)}
          />
          <Toaster />
        </>
      );
    }
    
    // Show admin login only if accessing via admin URL
    if (checkAdminAccess()) {
      return (
        <>
          <AdminLogin 
            onLogin={handleAdminLogin}
            onBack={() => {
              setShowAdminLogin(false);
              // Clear admin access indicators from URL
              window.location.hash = '';
              const url = new URL(window.location.href);
              url.searchParams.delete('admin');
              window.history.pushState({}, '', url.pathname);
            }}
          />
          <Toaster />
        </>
      );
    }
    
    return (
      <>
        <Login 
          onLogin={handleUserLogin}
          onAdminLogin={handleAdminLogin}
          onSwitchToSignUp={() => setShowSignUp(true)}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
        <Toaster />
      </>
    );
  }

  // Show KYC registration if user hasn't submitted yet
  if (!isAdmin && kycStatus === "not_submitted") {
    return (
      <>
        <KYCRegistration onRegistrationComplete={handleRegistrationComplete} />
        <Toaster />
      </>
    );
  }

  // Show pending message if KYC is under review
  const showKYCPendingBanner = !isAdmin && kycStatus === "pending";
  const showKYCRejectedBanner = !isAdmin && kycStatus === "rejected";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Timeout Handler */}
      <SessionTimeoutHandler
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        timeoutMinutes={30}
        warningMinutes={5}
      />

      {/* PWA Update Prompt */}
      <PWAUpdatePrompt />

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Onboarding Tutorial */}
      {isAuthenticated && shouldShowOnboarding && (
        <OnboardingTutorial
          isAdmin={isAdmin}
          onComplete={() => setShouldShowOnboarding(false)}
          onSkip={() => setShouldShowOnboarding(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className={`${isAdmin ? 'max-w-7xl' : 'max-w-md'} mx-auto px-3 sm:px-4 lg:px-6`}>
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Mobile Menu Button (Admin Only) */}
              {isAdmin && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>
              )}
              
              {/* Brand Logo */}
              <div className="flex-shrink-0">
                <BrandLogoCompact />
              </div>
              
              {/* Admin Badge */}
              {isAdmin && (
                <span className="hidden xs:inline-flex items-center px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs flex-shrink-0">
                  Admin
                </span>
              )}
              
              {/* User Email - Desktop Only */}
              {!isAdmin && (
                <div className="hidden md:block min-w-0 flex-1">
                  <p className="text-xs text-gray-600 truncate max-w-[200px]">{userEmail}</p>
                </div>
              )}
              {isAdmin && (
                <div className="hidden lg:block min-w-0 flex-1">
                  <p className="text-xs text-gray-600 truncate max-w-[180px] xl:max-w-[250px]">{userEmail}</p>
                </div>
              )}
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Logout Button - Desktop & Tablet */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex items-center h-9 px-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm">Logout</span>
              </Button>
              
              {/* Logout Button - Mobile */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex sm:hidden items-center h-9 px-2.5"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* KYC Status Banners */}
      {showKYCPendingBanner && (
        <div className="max-w-md mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <Alert className="bg-orange-50 border-orange-200">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 text-xs sm:text-sm">
              Your KYC application is under review. You'll be notified once it's approved. Limited access until approval.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {showKYCRejectedBanner && (
        <div className="max-w-md mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs sm:text-sm">
              Your KYC application was rejected. Please contact support for assistance or resubmit your application.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main 
        className={`mx-auto px-4 sm:px-6 py-4 sm:py-6 transition-all duration-300 ${
          isAdmin 
            ? sidebarCollapsed 
              ? "lg:ml-16 max-w-7xl" 
              : "lg:ml-64 max-w-7xl"
            : "max-w-md pb-20"
        }`}
      >
        {isAdmin ? renderAdminContent() : renderUserContent()}
      </main>

      {/* Bottom Navigation - Only for User Mode */}
      {!isAdmin && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-md mx-auto">
            <div className="flex justify-around">
              {userNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Admin Sidebar - Desktop */}
      {isAdmin && (
        <aside 
          className={`hidden lg:block fixed left-0 top-0 bottom-0 bg-white border-r pt-16 sm:pt-20 overflow-y-auto transition-all duration-300 z-20 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 sm:top-24 bg-white border rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4 text-gray-600" />
            ) : (
              <X className="h-4 w-4 text-gray-600" />
            )}
          </button>

          <nav className="p-4 space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${sidebarCollapsed ? "justify-center" : ""}`}
                  title={sidebarCollapsed ? item.label : ""}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Admin Mobile Menu */}
      {isAdmin && mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Drawer */}
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r pt-16 overflow-y-auto z-50 shadow-xl">
            <div className="p-4 border-b">
              <p className="text-xs text-gray-600 truncate">{userEmail}</p>
            </div>
            
            <nav className="p-4 space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      <Toaster />
    </div>
  );
}
