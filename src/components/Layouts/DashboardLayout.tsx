import { BrandLogoCompact } from "../../components/BrandLogo";
import { OfflineIndicator } from "../../components/OfflineIndicator";
import { OnboardingTutorial } from "../../components/OnboardingTutorial";
import { PWAUpdatePrompt } from "../../components/PWAUpdatePrompt";
import { SessionTimeoutHandler } from "../../components/SessionTimeoutHandler";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";

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

// DashboardLayout.tsx
interface DashboardLayoutProps {
  isAdmin: boolean;
  kycStatus: "not_submitted" | "pending" | "approved" | "rejected";

  userEmail: string;
  isAuthenticated: boolean;
  shouldShowOnboarding: boolean;
  renderContent: () => React.ReactNode; // <-- THIS MAKES IT REUSABLE
  [key: string]: any; // For any additional props like handlers
}

export function DashboardLayout({
  isAdmin,
  kycStatus,
  userEmail,
  isAuthenticated,
  shouldShowOnboarding,
  renderContent,
  ...props
}: DashboardLayoutProps) {
  const showKYCPendingBanner = !isAdmin && kycStatus === "pending";
  const showKYCRejectedBanner = !isAdmin && kycStatus === "rejected";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your session timeout, PWA prompts, header, sidebar etc... */}

      {/* Session Timeout Handler */}
      <SessionTimeoutHandler
        isAuthenticated={isAuthenticated}
        onLogout={props?.handleLogout}
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
          onComplete={() => props?.setShouldShowOnboarding(false)}
          onSkip={() => props?.setShouldShowOnboarding(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div
          className={`${
            isAdmin ? "max-w-7xl" : "max-w-md"
          } mx-auto px-3 sm:px-4 lg:px-6`}
        >
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Mobile Menu Button (Admin Only) */}
              {isAdmin && (
                <button
                  onClick={() =>
                    props?.setMobileMenuOpen(!props?.mobileMenuOpen)
                  }
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
                  <p className="text-xs text-gray-600 truncate max-w-[200px]">
                    {userEmail}
                  </p>
                </div>
              )}
              {isAdmin && (
                <div className="hidden lg:block min-w-0 flex-1">
                  <p className="text-xs text-gray-600 truncate max-w-[180px] xl:max-w-[250px]">
                    {userEmail}
                  </p>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Logout Button - Desktop & Tablet */}
              <Button
                variant="outline"
                size="sm"
                onClick={props?.handleLogout}
                className="hidden sm:flex items-center h-9 px-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm">Logout</span>
              </Button>

              {/* Logout Button - Mobile */}
              <Button
                variant="outline"
                size="sm"
                onClick={props?.handleLogout}
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
              Your KYC application is under review. You'll be notified once it's
              approved. Limited access until approval.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {showKYCRejectedBanner && (
        <div className="max-w-md mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs sm:text-sm">
              Your KYC application was rejected. Please contact support for
              assistance or resubmit your application.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {/* ...REMOVE hard-coded renderAdminContent/renderUserContent here... */}

      <main
        className={`mx-auto px-4 sm:px-6 py-4 sm:py-6 transition-all duration-300 ${
          isAdmin ? "max-w-7xl" : "max-w-md pb-20"
        }`}
      >
        {renderContent()} {/* 🔥 Render whatever page you pass */}
      </main>

      {/* Bottom Navigation - Only for User Mode */}
      {!isAdmin && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-md mx-auto">
            <div className="flex justify-around">
              {props?.userNavItems.map((item: any) => {
                const Icon = item.icon;
                const isActive = props?.activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => props?.setActiveTab(item.id)}
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
            props?.sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Collapse Toggle Button */}
          <button
            onClick={() => props?.setSidebarCollapsed(!props?.sidebarCollapsed)}
            className="absolute -right-3 top-20 sm:top-24 bg-white border rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow"
            title={
              props?.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {props?.sidebarCollapsed ? (
              <Menu className="h-4 w-4 text-gray-600" />
            ) : (
              <X className="h-4 w-4 text-gray-600" />
            )}
          </button>

          <nav className="p-4 space-y-2">
            {props?.adminNavItems.map((item: any) => {
              const Icon = item.icon;
              const isActive = props?.activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => props?.setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${props?.sidebarCollapsed ? "justify-center" : ""}`}
                  title={props?.sidebarCollapsed ? item.label : ""}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!props?.sidebarCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Admin Mobile Menu */}
      {isAdmin && props?.mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => props?.setMobileMenuOpen(false)}
          />

          {/* Mobile Drawer */}
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r pt-16 overflow-y-auto z-50 shadow-xl">
            <div className="p-4 border-b">
              <p className="text-xs text-gray-600 truncate">{userEmail}</p>
            </div>

            <nav className="p-4 space-y-2">
              {props?.adminNavItems.map((item: any) => {
                const Icon = item.icon;
                const isActive = props?.activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      props?.setActiveTab(item.id);
                      props?.setMobileMenuOpen(false);
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
