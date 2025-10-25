import { motion } from "motion/react";
import { Button } from "./ui/button";
import { BrandLogoCompact } from "./BrandLogo";
import { Home, DollarSign, Wallet, History, User, Settings, LayoutDashboard, UserCheck, FileCheck, Activity, Database, LogOut, Building2, Menu, X, HandCoins, MessageCircle, Headphones, RefreshCw, Edit, TrendingDown, BarChart3, FileText, Users } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}

interface AppNavigationProps {
  isAdmin: boolean;
  hasAdminAccess: boolean;
  userEmail: string;
  activeTab: string;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  onTabChange: (tab: string) => void;
  onToggleMode: () => void;
  onToggleSidebar: () => void;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
}

export function AppNavigation({
  isAdmin,
  hasAdminAccess,
  userEmail,
  activeTab,
  sidebarCollapsed,
  mobileMenuOpen,
  onTabChange,
  onToggleMode,
  onToggleSidebar,
  onToggleMobileMenu,
  onLogout
}: AppNavigationProps) {
  const userNavItems: NavigationItem[] = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "loans", label: "Loans", icon: HandCoins },
    { id: "contributions", label: "Save", icon: Wallet },
    { id: "support", label: "Support", icon: Headphones },
    { id: "profile", label: "Profile", icon: User },
  ];

  const adminNavItems: NavigationItem[] = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "revenue-analytics", label: "Revenue Analytics", icon: BarChart3 },
    { id: "reports", label: "Generate Reports", icon: FileText },
    { id: "loan-approvals", label: "Loans", icon: FileCheck },
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

  return (
    <>
      {/* Header */}
      <motion.header 
        className="bg-white border-b sticky top-0 z-30 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className={`${isAdmin ? 'max-w-7xl' : 'max-w-md'} mx-auto px-3 sm:px-4 lg:px-6`}>
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Mobile Menu Button (Admin Only) */}
              {isAdmin && (
                <motion.button
                  onClick={onToggleMobileMenu}
                  className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 transition-colors"
                  aria-label="Toggle menu"
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </motion.button>
              )}
              
              {/* Brand Logo */}
              <div className="flex-shrink-0">
                <BrandLogoCompact />
              </div>
              
              {/* Admin Badge */}
              {isAdmin && (
                <motion.span 
                  className="hidden xs:inline-flex items-center px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  Admin
                </motion.span>
              )}
              
              {/* User Email - Responsive */}
              <div className={`${isAdmin ? 'hidden lg:block' : 'hidden md:block'} min-w-0 flex-1`}>
                <p className={`text-xs text-gray-600 truncate ${isAdmin ? 'max-w-[180px] xl:max-w-[250px]' : 'max-w-[200px]'}`}>
                  {userEmail}
                </p>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Toggle Mode Button - Only for Admin Users */}
              {hasAdminAccess && (
                <>
                  {/* Desktop */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleMode}
                      className="hidden lg:flex items-center h-9 px-3 transition-all hover:shadow-sm"
                    >
                      {isAdmin ? <User className="h-4 w-4 mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                      <span className="text-sm">{isAdmin ? "User Mode" : "Admin Mode"}</span>
                    </Button>
                  </motion.div>
                  
                  {/* Tablet */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleMode}
                      className="hidden md:flex lg:hidden items-center h-9 px-2.5 transition-all hover:shadow-sm"
                      title={isAdmin ? "Switch to User Mode" : "Switch to Admin Mode"}
                    >
                      {isAdmin ? <User className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                </>
              )}
              
              {/* Logout Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="hidden sm:flex items-center h-9 px-3 transition-all hover:shadow-sm hover:bg-red-50 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-sm">Logout</span>
                </Button>
              </motion.div>
              
              {/* Mobile Logout */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="flex sm:hidden items-center h-9 px-2.5 transition-all hover:shadow-sm hover:bg-red-50 hover:border-red-200"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Bottom Navigation - User Mode Only */}
      {!isAdmin && (
        <motion.nav 
          className="fixed bottom-0 left-0 right-0 bg-white border-t z-30 shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="max-w-md mx-auto">
            <div className="flex justify-around">
              {userNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex flex-col items-center gap-1 py-3 px-4 transition-all ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span className="text-xs">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}

      {/* Admin Sidebar - Desktop */}
      {isAdmin && (
        <motion.aside 
          className={`hidden lg:block fixed left-0 top-0 bottom-0 bg-white border-r pt-16 sm:pt-20 overflow-y-auto transition-all duration-300 z-20 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
          initial={{ x: -264 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Collapse Toggle Button */}
          <motion.button
            onClick={onToggleSidebar}
            className="absolute -right-3 top-20 sm:top-24 bg-white border rounded-full p-1.5 shadow-md hover:shadow-lg transition-all"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4 text-gray-600" />
            ) : (
              <X className="h-4 w-4 text-gray-600" />
            )}
          </motion.button>

          <nav className="p-4 space-y-2">
            {adminNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${sidebarCollapsed ? "justify-center" : ""}`}
                  title={sidebarCollapsed ? item.label : ""}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>
      )}

      {/* Admin Mobile Menu */}
      {isAdmin && mobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onToggleMobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Mobile Drawer */}
          <motion.aside 
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r pt-16 overflow-y-auto z-50 shadow-xl"
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="p-4 border-b">
              <p className="text-xs text-gray-600 truncate">{userEmail}</p>
              {hasAdminAccess && (
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onToggleMode();
                      onToggleMobileMenu();
                    }}
                    className="flex-1 text-xs"
                  >
                    <User className="h-3 w-3 mr-1" />
                    User Mode
                  </Button>
                </div>
              )}
            </div>
            
            <nav className="p-4 space-y-2">
              {adminNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onToggleMobileMenu();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </>
  );
}