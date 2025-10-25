import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Award,
  Star,
  CreditCard,
  TrendingDown,
  Coins,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { formatCurrency } from "../lib/utils";
import { AccountSettings } from "./AccountSettings";
import { PersonalInformation } from "./PersonalInformation";
import { NotificationSettings } from "./NotificationSettings";
import { HelpAndSupport } from "./HelpAndSupport";

interface ProfileProps {
  onNavigate?: (tab: string) => void;
  userEmail?: string;
  onEmailChange?: (newEmail: string) => void;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  tier: string;
  initials: string;
  city?: string;
  state?: string;
}

export function Profile({ onNavigate, userEmail = "sarah.johnson@email.com", onEmailChange }: ProfileProps = {}) {
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "User",
    email: userEmail,
    phone: "",
    memberSince: "January 2024",
    tier: "Gold Member",
    initials: "U"
  });

  // Load customer data from KYC submissions or user registration
  useEffect(() => {
    loadCustomerData();
  }, [userEmail]);

  const loadCustomerData = () => {
    // Try to find user in registered users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const registeredUser = users.find((u: any) => 
      u.email === userEmail || u.phoneNumber === userEmail
    );

    // Try to find user in KYC submissions
    const kycSubmissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
    const kycData = kycSubmissions.find((submission: any) => 
      submission.email === userEmail || 
      submission.phone === userEmail ||
      (registeredUser && submission.phone === registeredUser.phoneNumber)
    );

    if (kycData) {
      // User has completed KYC - use that data
      const fullName = `${kycData.firstName || ""} ${kycData.lastName || ""}`.trim();
      const initials = `${kycData.firstName?.[0] || ""}${kycData.lastName?.[0] || ""}`.toUpperCase();
      
      setCustomerData({
        name: fullName || "User",
        email: kycData.email || userEmail,
        phone: kycData.phone || "",
        memberSince: kycData.submittedAt 
          ? new Date(kycData.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
          : "January 2024",
        tier: kycData.status === "approved" ? "Gold Member" : "Silver Member",
        initials: initials || "U",
        city: kycData.city,
        state: kycData.state
      });
    } else if (registeredUser) {
      // User has registered but not completed KYC
      const name = registeredUser.fullName || registeredUser.firstName || "User";
      const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
      
      setCustomerData({
        name: name,
        email: registeredUser.email || userEmail,
        phone: registeredUser.phoneNumber || "",
        memberSince: registeredUser.createdAt 
          ? new Date(registeredUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
          : "January 2024",
        tier: "Silver Member",
        initials: initials || "U"
      });
    }
  };

  const user = {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    memberSince: customerData.memberSince,
    tier: customerData.tier,
    location: customerData.city && customerData.state 
      ? `${customerData.city}, ${customerData.state}` 
      : undefined
  };

  // Calculate real stats from localStorage
  const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
  
  // Count completed loans (loans that are fully repaid)
  const loanHistory = JSON.parse(localStorage.getItem("loanHistory") || "[]");
  const completedLoans = loanHistory.filter((loan: any) => 
    loan.status === "completed" || loan.repaid >= loan.amount
  ).length;
  
  // Calculate contribution streak (days with contributions)
  const contributions = JSON.parse(localStorage.getItem("contributions") || "[]");
  const userContributions = contributions.filter((c: any) => 
    c.userEmail === userEmail || c.userPhone === user.phone
  );
  
  // Simple streak calculation - count consecutive days
  let currentStreak = 0;
  if (userContributions.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort contributions by date (newest first)
    const sortedContributions = [...userContributions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let checkDate = new Date(today);
    for (const contribution of sortedContributions) {
      const contribDate = new Date(contribution.date);
      contribDate.setHours(0, 0, 0, 0);
      
      if (contribDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const stats = [
    { label: "Total Saved", value: formatCurrency(contributionBalance), color: "text-green-600" },
    { label: "Loans Completed", value: completedLoans.toString(), color: "text-blue-600" },
    { label: "Current Streak", value: currentStreak > 0 ? `${currentStreak} day${currentStreak !== 1 ? 's' : ''}` : "0 days", color: "text-orange-600" },
  ];

  const menuItems = [
    { icon: User, label: "Personal Information", action: () => setShowPersonalInfo(true) },
    { icon: CreditCard, label: "Payment Methods", action: () => onNavigate?.("payments") },
    { icon: Shield, label: "Account Security", action: () => setShowAccountSettings(true) },
    { icon: Bell, label: "Notifications", action: () => setShowNotifications(true) },
    { icon: HelpCircle, label: "Help & Support", action: () => setShowHelp(true) },
  ];

  const handleEmailChange = (newEmail: string) => {
    onEmailChange?.(newEmail);
  };

  // If viewing personal information, show that component instead
  if (showPersonalInfo) {
    return (
      <PersonalInformation
        userEmail={userEmail}
        onBack={() => setShowPersonalInfo(false)}
      />
    );
  }

  // If viewing account settings, show that component instead
  if (showAccountSettings) {
    return (
      <AccountSettings
        userEmail={userEmail}
        onEmailChange={handleEmailChange}
        onBack={() => setShowAccountSettings(false)}
      />
    );
  }

  // If viewing notifications, show that component instead
  if (showNotifications) {
    return (
      <NotificationSettings
        userEmail={userEmail}
        onBack={() => setShowNotifications(false)}
      />
    );
  }

  // If viewing help & support, show that component instead
  if (showHelp) {
    return (
      <HelpAndSupport
        userEmail={userEmail}
        onBack={() => setShowHelp(false)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {customerData.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2>{user.name}</h2>
                {user.phone && (
                  <p className="text-sm text-gray-600">{user.phone}</p>
                )}
                {user.email && user.email !== user.phone && (
                  <p className="text-xs text-gray-500">{user.email}</p>
                )}
                {user.location && (
                  <p className="text-xs text-gray-500">{user.location}</p>
                )}
                <p className="text-xs text-gray-500">Member since {user.memberSince}</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                {user.tier}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="text-center space-y-1">
              <p className={`text-lg ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Deposit Offset Alert */}
      {(() => {
        const loanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
        const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
        const hasActiveLoan = loans.length > 0;
        const activeLoan = loans[0];
        const remainingBalance = hasActiveLoan ? activeLoan.amount - activeLoan.repaid : 0;
        
        if (loanDeposits > 0 && hasActiveLoan && remainingBalance > 0) {
          return (
            <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Coins className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-purple-900">Offset Your Loan Balance</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      You have {formatCurrency(loanDeposits)} in refundable deposits available
                    </p>
                  </div>
                  <Badge className="bg-purple-600 text-white">
                    Action Required
                  </Badge>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-xs">
                    Apply your deposit to reduce your loan balance and save on future payments
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={() => onNavigate?.("loans")}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  size="sm"
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Apply Deposit Now
                </Button>
              </div>
            </Card>
          );
        }
        return null;
      })()}

      {/* Achievements */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            <h3>Achievements</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: "🔥", label: "14 Day Streak", unlocked: true },
              { icon: "💰", label: "First ₦1000", unlocked: true },
              { icon: "⭐", label: "Gold Member", unlocked: true },
              { icon: "🎯", label: "Monthly Goal", unlocked: false },
            ].map((achievement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center ${
                  achievement.unlocked ? "bg-purple-100" : "bg-gray-100"
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className={`text-xs ${achievement.unlocked ? "text-purple-700" : "text-gray-500"}`}>
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3>Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-xs text-gray-500">Receive daily reminders</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-updates">Email Updates</Label>
                <p className="text-xs text-gray-500">Get weekly summaries</p>
              </div>
              <Switch id="email-updates" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-contribute">Auto-Contribute</Label>
                <p className="text-xs text-gray-500">Automatic daily contributions</p>
              </div>
              <Switch id="auto-contribute" />
            </div>
          </div>
        </div>
      </Card>

      {/* Menu Items */}
      <Card className="divide-y">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-gray-600" />
              <span>{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        ))}
      </Card>

      {/* Logout */}
      <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
