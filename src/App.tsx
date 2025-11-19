import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import {
  OnboardingTutorial,
  useOnboarding,
} from "./components/OnboardingTutorial";
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
import {
  Home,
  DollarSign,
  Wallet,
  History,
  User,
  Settings,
  LayoutDashboard,
  UserCheck,
  FileCheck,
  Activity,
  Database,
  LogOut,
  Building2,
  Menu,
  X,
  Clock,
  XCircle,
  Users,
  RefreshCw,
  Edit,
  TrendingDown,
  BarChart3,
  FileText,
  HandCoins,
  MessageCircle,
  Headphones,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { UserData } from "lib/userData";
import { clearStorage } from "./lib/utils";
import { DashboardLayout } from "./components/Layouts/DashboardLayout";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [pendingVerificationPhone, setPendingVerificationPhone] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<
    "not_submitted" | "pending" | "approved" | "rejected"
  >("not_submitted");

  // Onboarding hook
  const { shouldShowOnboarding, setShouldShowOnboarding } =
    useOnboarding(isAdmin);

  // Helper function to check if KYC is completed
  const isKycCompleted = () => {
    if (isAdmin) return true;

    // const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
    // const user = users.find((u: any) =>
    //   u.email === userEmail || u.phoneNumber === userEmail
    // );

    return userData?.kyc === true;
  };

  // Check authentication status from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (token && users.length > 0) {
      const user = users[users.length - 1];
      setIsAuthenticated(true);
      setUserEmail(user.email || user.phoneNumber);
      setIsAdmin(user.role === "admin");
      if (user.role === "admin") {
        setActiveTab("admin-dashboard");
      }
      // Check KYC status
      checkKycStatus();
    }
  }, []);

  // Check if splash screen should be shown (only on first visit)
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash === "true") {
      setShowSplash(false);
    }
  }, []);

  // Initialize balances and check KYC status on mount
  useEffect(() => {
    // Initialize contribution balance if it doesn't exist
    if (!localStorage.getItem("contributionBalance")) {
      const totalContributions =
        localStorage.getItem("totalContributions") || "3200.00";
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

    // Check KYC status from user data first
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = JSON.parse(localStorage.getItem("userData") || "[]");
    const user = users.find(
      (u: any) => u.email === userEmail || u.phoneNumber === userEmail
    );

    if (userData) {
      // Check if user has kycCompleted flag
      if (!userData.kyc) {
        setKycStatus("not_submitted");
        return;
      }

      // Check kycStatus from user data
      if (userData.kyc) {
        setKycStatus(userData.kyc);
        return;
      }

      // Fallback: Check from kycSubmissions
      const submissions = JSON.parse(
        localStorage.getItem("kycSubmissions") || "[]"
      );
      const userSubmission = submissions.find(
        (s: any) => s.phone === userData.phone || s.email === userData.email
      );

      if (userSubmission) {
        setKycStatus(userSubmission.status);
        // Update user data with status
        const userIndex = users.findIndex(
          (u: any) => u.email === userEmail || u.phoneNumber === userEmail
        );
        if (userIndex !== -1) {
          users[userIndex].kyc = userSubmission.status;
          localStorage.setItem("users", JSON.stringify(users));
        }
      } else {
        setKycStatus("not_submitted");
      }
    } else {
      // No user found, check from submissions
      const submissions = JSON.parse(
        localStorage.getItem("kycSubmissions") || "[]"
      );
      if (submissions.length > 0) {
        const latestSubmission = submissions[submissions.length - 1];
        setKycStatus(latestSubmission.status);
      } else {
        setKycStatus("not_submitted");
      }
    }
  };

  const handleRegistrationComplete = () => {
    setKycStatus("pending");

    // Update user data with KYC completion
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = JSON.parse(localStorage.getItem("userData") || "[]");
    const userIndex = users.findIndex(
      (u: any) => u.email === userEmail || u.phoneNumber === userEmail
    );

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        kyc: true,
      };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...userData,
          kyc: true,
        })
      );
    }

    // Also update registeredUsers
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );
    const registeredUserIndex = registeredUsers.findIndex(
      (u: any) => u.email === userEmail || u.phoneNumber === userEmail
    );

    if (registeredUserIndex !== -1) {
      registeredUsers[registeredUserIndex] = {
        ...registeredUsers[registeredUserIndex],
        kyc: true,
      };
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    }
    // Navigate to dashboard after KYC completion
    navigate("/");
  };

  const renderUserContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} userEmail={userEmail} />;
      case "loans":
        return <LoanSection />;
      case "contributions":
        return <Contributions userEmail={userEmail} />;
      case "history":
        return <TransactionHistory />;
      case "support":
        return <CustomerService userEmail={userEmail} />;
      case "profile":
        return (
          <Profile
            onNavigate={setActiveTab}
            userEmail={userEmail}
            onEmailChange={setUserEmail}
          />
        );
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
        return (
          <CompanySettings
            adminEmail={userEmail}
            onEmailChange={setUserEmail}
          />
        );
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
    {
      id: "customer-enquiries",
      label: "Customer Enquiries",
      icon: MessageCircle,
    },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "data-management", label: "Data", icon: Database },
    { id: "company-settings", label: "Settings", icon: Building2 },
  ];

  const handleUserLogin = (userData: UserData) => {
    // Check if phone number is verified
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    // const userData = JSON.parse(localStorage.getItem("userData") || "");
    const user = users.find(
      (u: any) =>
        u.phoneNumber === userData?.phone || u.email === userData?.email
    );

    if (user && !userData.phoneVerified) {
      // Navigate to phone verification
      setPendingVerificationPhone(userData.phone);
      navigate("/verify-phone");
      return;
    }
    setUserEmail(user ? user.email || user.phoneNumber : "");
    setIsAuthenticated(true);
    setIsAdmin(false);
    checkKycStatus();

    // Check if KYC is completed
    if (user && !userData.kyc) {
      // User needs to complete KYC before accessing dashboard
      setUserEmail(user ? userData.email || userData.phone : "");
      setIsAuthenticated(true);
      setIsAdmin(false);
      setKycStatus("not_submitted");
      navigate("/kycRegistration"); // Will show KYC form
      return;
    }
    // User is fully verified, go to dashboard
    navigate("/");
  };

  const handleSignUp = (phoneNumber: string, userData: any) => {
    // New users need phone verification
    setPendingVerificationPhone(phoneNumber);
    navigate("/verify-phone");
  };

  const handleAdminLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setIsAdmin(true);
    setActiveTab("admin-dashboard");
    navigate("/admin");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setIsAdmin(false);
    setPendingVerificationPhone("");
    setActiveTab("dashboard");
    setKycStatus("not_submitted");
    setShouldShowOnboarding(false);
    clearStorage();
    navigate("/login");
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasSeenSplash", "true");
  };

  const handleVerificationComplete = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.phoneNumber === pendingVerificationPhone
    );
    setUserEmail(
      user ? user.email || user.phoneNumber : pendingVerificationPhone
    );
    setIsAuthenticated(true);
    setIsAdmin(false);
    setPendingVerificationPhone("");

    // Check KYC status - if not completed, show KYC form
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
    if (!userData?.kyc) {
      setKycStatus("not_submitted");
      navigate("/kycRegistration");
    } else {
      checkKycStatus();
      navigate("/");
    }
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Main routing structure
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login
                onLogin={handleUserLogin}
                onAdminLogin={handleAdminLogin}
                onSwitchToSignUp={() => navigate("/signup")}
                onForgotPassword={() => navigate("/forgot-password")}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUp
                onSignUp={handleSignUp}
                onSwitchToLogin={() => navigate("/login")}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            !isAuthenticated ? (
              <ForgotPassword
                onBack={() => navigate("/login")}
                onResetRequested={(email, token) => {
                  setResetEmail(email);
                  setResetToken(token);
                  navigate(
                    `/reset-password?email=${encodeURIComponent(
                      email
                    )}&token=${token}`
                  );
                }}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/reset-password"
          element={
            !isAuthenticated ? (
              <ResetPasswordRoute />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/verify-phone"
          element={
            pendingVerificationPhone ? (
              <SMSVerification
                phoneNumber={pendingVerificationPhone}
                onVerificationComplete={handleVerificationComplete}
                onResendSMS={() => {}}
                onLogout={() => {
                  setPendingVerificationPhone("");
                  navigate("/login");
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/login"
          element={
            !isAuthenticated ? (
              <AdminLogin
                onLogin={handleAdminLogin}
                onBack={() => navigate("/login")}
              />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/terms"
          element={<TermsOfService onBack={() => navigate(-1)} />}
        />
        <Route
          path="/privacy"
          element={<PrivacyPolicy onBack={() => navigate(-1)} />}
        />
        <Route
          path="/about"
          element={<AboutUs onBack={() => navigate(-1)} />}
        />
        <Route
          path="/contact"
          element={<ContactPage onBack={() => navigate(-1)} />}
        />

        {/* Protected Routes */}
        {/* KYC Registration Route - Protected but separate */}
        <Route
          path="/kycRegistration"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {!isAdmin && !isKycCompleted() ? (
                <KYCRegistration
                  onRegistrationComplete={handleRegistrationComplete}
                  userEmail={userEmail}
                />
              ) : (
                <Navigate to="/" replace />
                // <DashboardContent />
              )}
            </ProtectedRoute>
          }
        />

        {/* Main Dashboard Route - Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {!isAdmin && !isKycCompleted() ? (
                <Navigate to="/kycRegistration" replace />
              ) : (
                // <DashboardContent />
                <DashboardDefault renderedContent={<DashboardContent />} />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-loan"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {!isAdmin && !isKycCompleted() ? (
                <Navigate to="/kycRegistration" replace />
              ) : (
                // <LoanSection />
                <DashboardDefault renderedContent={<LoanSection />} />
              )}
            </ProtectedRoute>
          }
        />
        {/* Admin Route - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              redirectTo="/admin/login"
            >
              {isAdmin ? (
                // <AdminDashboardContent />
                <DashboardDefault renderedContent={<AdminDashboardContent />} />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
      <Toaster />
    </>
  );

  // Dashboard Content Component
  function DashboardContent() {
    return (
      <div className="">
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
      </div>
    );
  }

  function DashboardDefault({
    renderedContent,
  }: {
    renderedContent: React.ReactNode;
  }) {
    return (
      <DashboardLayout
        isAdmin={isAdmin}
        kycStatus={kycStatus}
        userEmail={userEmail}
        isAuthenticated={isAuthenticated}
        shouldShowOnboarding={shouldShowOnboarding}
        handleLogout={handleLogout}
        setShouldShowOnboarding={setShouldShowOnboarding}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        renderAdminContent={renderAdminContent}
        renderContent={() => renderedContent} // pass your component
        userNavItems={userNavItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminNavItems={adminNavItems}
      />
    );
  }

  // Reset Password Route Component
  function ResetPasswordRoute() {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email") || resetEmail;
    const token = searchParams.get("token") || resetToken;

    if (!email || !token) {
      return <Navigate to="/login" replace />;
    }

    return (
      <ResetPassword
        email={email}
        token={token}
        onResetComplete={() => {
          setResetToken("");
          setResetEmail("");
          navigate("/login");
        }}
        onCancel={() => {
          setResetToken("");
          setResetEmail("");
          navigate("/login");
        }}
      />
    );
  }

  // Admin Dashboard Content Component
  function AdminDashboardContent() {
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
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>

                <div className="flex-shrink-0">
                  <BrandLogoCompact />
                </div>

                <span className="hidden xs:inline-flex items-center px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs flex-shrink-0">
                  Admin
                </span>

                <div className="hidden lg:block min-w-0 flex-1">
                  <p className="text-xs text-gray-600 truncate max-w-[180px] xl:max-w-[250px]">
                    {userEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex items-center h-9 px-3"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-sm">Logout</span>
                </Button>

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

        {/* Main Content */}
        <main
          className={`mx-auto px-4 sm:px-6 py-4 sm:py-6 transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-16 max-w-7xl" : "lg:ml-64 max-w-7xl"
          }`}
        >
          {renderAdminContent()}
        </main>

        {/* Admin Sidebar - Desktop */}
        <aside
          className={`hidden lg:block fixed left-0 top-0 bottom-0 bg-white border-r pt-16 sm:pt-20 overflow-y-auto transition-all duration-300 z-20 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
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
                  {!sidebarCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Admin Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

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
      </div>
    );
  }
}
