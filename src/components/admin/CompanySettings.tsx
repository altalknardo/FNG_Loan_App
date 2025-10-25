import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { 
  Building2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Shield, 
  UserPlus, 
  Trash2, 
  Mail, 
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Coins,
  Edit,
  Users,
  DollarSign,
  Wallet,
  TrendingUp,
  Calendar,
  Crown
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../../lib/utils";
import { AdminAccountSettings } from "./AdminAccountSettings";

interface CompanyAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface AdminPermissions {
  canManageLoanApprovals: boolean;
  canManageWithdrawals: boolean;
  canManageDepositRefunds: boolean;
  canManageKYC: boolean;
  canViewCustomerProfiles: boolean;
  canManageCustomers: boolean;
  canViewActivity: boolean;
  canManageData: boolean;
  canManageSettings: boolean;
  canManageAdmins: boolean; // Only for super admins
}

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "superadmin" | "admin";
  permissions?: AdminPermissions;
  createdAt: string;
  createdBy: string;
  status: "active" | "inactive";
}

interface CompanySettingsProps {
  adminEmail?: string;
  onEmailChange?: (newEmail: string) => void;
}

export function CompanySettings({ adminEmail = "admin@fng.com", onEmailChange }: CompanySettingsProps = {}) {
  // Company Balance
  const [companyBalance, setCompanyBalance] = useState(() => {
    const saved = localStorage.getItem("companyBalance");
    return saved ? parseFloat(saved) : 0;
  });

  // Insurance Balance
  const [insuranceBalance, setInsuranceBalance] = useState(() => {
    const saved = localStorage.getItem("insuranceBalance");
    return saved ? parseFloat(saved) : 0;
  });

  // Loan Service Charge Balance
  const [loanServiceChargeBalance, setLoanServiceChargeBalance] = useState(() => {
    const saved = localStorage.getItem("loanServiceChargeBalance");
    return saved ? parseFloat(saved) : 0;
  });

  // Reload company balance and insurance balance periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const savedCompanyBalance = localStorage.getItem("companyBalance");
      setCompanyBalance(savedCompanyBalance ? parseFloat(savedCompanyBalance) : 0);
      
      const savedInsuranceBalance = localStorage.getItem("insuranceBalance");
      setInsuranceBalance(savedInsuranceBalance ? parseFloat(savedInsuranceBalance) : 0);
      
      const savedLoanServiceCharge = localStorage.getItem("loanServiceChargeBalance");
      setLoanServiceChargeBalance(savedLoanServiceCharge ? parseFloat(savedLoanServiceCharge) : 0);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Loan Policy Settings
  const [requireUpfrontPayment, setRequireUpfrontPayment] = useState(() => {
    const saved = localStorage.getItem("requireUpfrontPayment");
    return saved ? JSON.parse(saved) : true; // Default to true (required)
  });

  const [companyAccount, setCompanyAccount] = useState<CompanyAccount>(() => {
    const saved = localStorage.getItem("companyAccount");
    return saved ? JSON.parse(saved) : {
      bankName: "First Bank of Nigeria",
      accountNumber: "0123456789",
      accountName: "FNG FINANCIAL SERVICES",
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempAccount, setTempAccount] = useState<CompanyAccount>(companyAccount);
  const [isSaving, setIsSaving] = useState(false);

  // Admin Management State
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem("adminUsers");
    return saved ? JSON.parse(saved) : [
      {
        id: "admin-1",
        fullName: "Super Administrator",
        email: "admin@fng.com",
        phone: "09012345678",
        password: "admin123",
        role: "superadmin",
        createdAt: new Date().toISOString(),
        createdBy: "system",
        status: "active"
      }
    ];
  });

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPhone, setNewAdminPhone] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "superadmin">("admin");
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermissions>({
    canManageLoanApprovals: true,
    canManageWithdrawals: true,
    canManageDepositRefunds: true,
    canManageKYC: true,
    canViewCustomerProfiles: true,
    canManageCustomers: false,
    canViewActivity: true,
    canManageData: false,
    canManageSettings: false,
    canManageAdmins: false,
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Get current logged-in admin role
  const [currentAdminRole, setCurrentAdminRole] = useState<"superadmin" | "admin">(() => {
    const savedRole = localStorage.getItem("currentAdminRole");
    return savedRole as "superadmin" | "admin" || "superadmin"; // Default to superadmin for now
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("companyAccount", JSON.stringify(companyAccount));
  }, [companyAccount]);

  useEffect(() => {
    localStorage.setItem("requireUpfrontPayment", JSON.stringify(requireUpfrontPayment));
  }, [requireUpfrontPayment]);

  // Save admins to localStorage
  useEffect(() => {
    localStorage.setItem("adminUsers", JSON.stringify(admins));
  }, [admins]);

  const handleEdit = () => {
    setTempAccount(companyAccount);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempAccount(companyAccount);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Validate fields
    if (!tempAccount.bankName || !tempAccount.accountNumber || !tempAccount.accountName) {
      toast.error("All fields are required");
      return;
    }

    if (tempAccount.accountNumber.length < 10) {
      toast.error("Account number must be at least 10 digits");
      return;
    }

    setIsSaving(true);

    // Simulate save delay
    setTimeout(() => {
      setCompanyAccount(tempAccount);
      setIsEditing(false);
      setIsSaving(false);
      toast.success("Company account details updated successfully!");
    }, 500);
  };

  const handleReset = () => {
    const defaultAccount = {
      bankName: "First Bank of Nigeria",
      accountNumber: "0123456789",
      accountName: "FNG FINANCIAL SERVICES",
    };
    setTempAccount(defaultAccount);
  };

  // Admin Management Functions
  const handleCreateAdmin = () => {
    if (!newAdminName || !newAdminEmail || !newAdminPhone || !newAdminPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdminEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!/^(\+?234|0)?[789]\d{9}$/.test(newAdminPhone.replace(/\s/g, ''))) {
      toast.error("Please enter a valid Nigerian phone number");
      return;
    }

    if (newAdminPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Check if email already exists
    if (admins.some(admin => admin.email === newAdminEmail)) {
      toast.error("An admin with this email already exists");
      return;
    }

    setIsCreating(true);

    setTimeout(() => {
      const newAdmin: AdminUser = {
        id: `admin-${Date.now()}`,
        fullName: newAdminName,
        email: newAdminEmail,
        phone: newAdminPhone,
        password: newAdminPassword,
        role: newAdminRole,
        permissions: newAdminRole === "admin" ? newAdminPermissions : undefined, // Super admins have all permissions
        createdAt: new Date().toISOString(),
        createdBy: "current-admin", // In production, use actual admin ID
        status: "active"
      };

      setAdmins([...admins, newAdmin]);
      
      // Reset form
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPhone("");
      setNewAdminPassword("");
      setNewAdminRole("admin");
      setNewAdminPermissions({
        canManageLoanApprovals: true,
        canManageWithdrawals: true,
        canManageDepositRefunds: true,
        canManageKYC: true,
        canViewCustomerProfiles: true,
        canManageCustomers: false,
        canViewActivity: true,
        canManageData: false,
        canManageSettings: false,
        canManageAdmins: false,
      });
      setIsAddAdminOpen(false);
      setIsCreating(false);
      
      toast.success(`Admin account created successfully! Credentials sent to ${newAdminEmail}`);
    }, 1000);
  };

  const handleDeleteAdmin = (adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    
    if (admin?.role === "superadmin" && admins.filter(a => a.role === "superadmin").length === 1) {
      toast.error("Cannot delete the last super administrator");
      return;
    }

    if (confirm(`Are you sure you want to delete ${admin?.fullName}?`)) {
      setAdmins(admins.filter(a => a.id !== adminId));
      toast.success("Admin deleted successfully");
    }
  };

  const handleToggleStatus = (adminId: string) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === "active" ? "inactive" : "active" }
        : admin
    ));
    toast.success("Admin status updated");
  };

  const handleEmailChange = (newEmail: string) => {
    onEmailChange?.(newEmail);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl">Company Settings</h2>
        <p className="text-gray-600">
          Manage your account, company policies, and administrative settings
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Crown className="h-4 w-4" />
            Account Security
          </TabsTrigger>
        </TabsList>

        {/* Account Security Tab */}
        <TabsContent value="account" className="space-y-6">
          <AdminAccountSettings
            adminEmail={adminEmail}
            onEmailChange={handleEmailChange}
          />
        </TabsContent>

        {/* Company Settings Tab */}
        <TabsContent value="company" className="space-y-6">

      {/* Company Balance Tracker */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-4 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-green-900">Company Balance</h3>
                <p className="text-sm text-green-700 mt-1">
                  Total service charges collected from customer contributions
                </p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white">
              Active
            </Badge>
          </div>
          
          <Separator className="bg-green-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 border-2 border-green-300">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Wallet className="h-5 w-5 text-green-600" />
                <p>Total Collected</p>
              </div>
              <p className="text-4xl text-green-700">{formatCurrency(companyBalance)}</p>
              <p className="text-xs text-gray-500 mt-2">
                From monthly service charges
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-2 border-green-300">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <p>Service Charge Policy</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Automatic Deduction:</strong> One unit of customer's daily contribution amount is deducted monthly from their savings balance and credited to the company account.
              </p>
            </div>
          </div>
          
          <Alert className="bg-green-100 border-green-300">
            <AlertCircle className="h-4 w-4 text-green-700" />
            <AlertDescription className="text-green-800 text-sm">
              <strong>How it works:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Service charge equals one day's contribution target (e.g., if daily target is ₦500, charge is ₦500/month)</li>
                <li>Deducted automatically when active contributors make contributions</li>
                <li>Only charged if customer has sufficient balance</li>
                <li>Skipped if balance is insufficient (no debt accumulation)</li>
                <li>Tracked from first contribution date</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Insurance Balance Tracker */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-4 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-purple-900">Insurance Balance</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Total loan insurance charges collected from upfront payments
                </p>
              </div>
            </div>
            <Badge className="bg-purple-600 text-white">
              Active
            </Badge>
          </div>
          
          <Separator className="bg-purple-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 border-2 border-purple-300">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <p>Total Collected</p>
              </div>
              <p className="text-4xl text-purple-700">{formatCurrency(insuranceBalance)}</p>
              <p className="text-xs text-gray-500 mt-2">
                From loan insurance charges
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-2 border-purple-300">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Coins className="h-5 w-5 text-purple-600" />
                <p>Insurance Rates by Loan Type</p>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>SME Loan:</span>
                  <span className="font-medium">1.5% of loan amount</span>
                </div>
                <div className="flex justify-between">
                  <span>Business Loan:</span>
                  <span className="font-medium">2% of loan amount</span>
                </div>
                <div className="flex justify-between">
                  <span>Jumbo Loan:</span>
                  <span className="font-medium">3% of loan amount</span>
                </div>
              </div>
            </div>
          </div>
          
          <Alert className="bg-purple-100 border-purple-300">
            <AlertCircle className="h-4 w-4 text-purple-700" />
            <AlertDescription className="text-purple-800 text-sm">
              <strong>How it works:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Insurance charge is calculated based on loan type and amount</li>
                <li>Collected as part of upfront payment before loan approval</li>
                <li>Non-refundable (unlike deposit which is refundable after full repayment)</li>
                <li>Provides loan protection and risk coverage</li>
                <li>Automatically tracked when customers pay upfront costs</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Loan Service Charge Balance Tracker */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-4 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-orange-900">Loan Service Charge Revenue</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Processing fees collected when loans are approved
                </p>
              </div>
            </div>
            <Badge className="bg-orange-600 text-white">
              Active
            </Badge>
          </div>
          
          <Separator className="bg-orange-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 border-2 border-orange-300">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <p>Total Collected</p>
              </div>
              <p className="text-4xl text-orange-700">{formatCurrency(loanServiceChargeBalance)}</p>
              <p className="text-xs text-gray-500 mt-2">
                From loan processing fees
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-2 border-orange-300">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Coins className="h-5 w-5 text-orange-600" />
                <p>Service Charge Policy</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>One-time Fee:</strong> A processing/service charge is collected when a loan is approved and disbursed. This covers administrative costs and loan processing.
              </p>
            </div>
          </div>
          
          <Alert className="bg-orange-100 border-orange-300">
            <AlertCircle className="h-4 w-4 text-orange-700" />
            <AlertDescription className="text-orange-800 text-sm">
              <strong>How it works:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Service charge collected when loan is approved (typically 2-5% of loan amount)</li>
                <li>One-time fee separate from insurance and deposit</li>
                <li>Covers loan processing, document preparation, and administrative costs</li>
                <li>Non-refundable fee automatically tracked in system</li>
                <li>Different from monthly contribution service charges</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Quick Access - Customer Management */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3>Customer Management</h3>
              <p className="text-sm text-gray-600 mt-1">
                Update customer information, daily contribution amounts, and loan repayment settings
              </p>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Edit customer profiles</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-green-600" />
                  <span>Set contribution amounts</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <span>Adjust loan repayments</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              // Navigate to customer management
              window.dispatchEvent(new CustomEvent("navigate", { detail: "customer-management" }));
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Manage Customers
          </Button>
        </div>
      </Card>

      {/* Loan Policy Settings */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Coins className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3>Loan Policy Settings</h3>
                <p className="text-sm text-gray-600">
                  Configure loan approval requirements
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="require-upfront" className="cursor-pointer">
                    Require Upfront Payment Before Loan Approval
                  </Label>
                  <Badge variant={requireUpfrontPayment ? "default" : "outline"} className={requireUpfrontPayment ? "bg-orange-600" : ""}>
                    {requireUpfrontPayment ? "Required" : "Optional"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, customers must pay upfront costs (deposit + insurance + service charge) before their loan application can be approved
                </p>
              </div>
              <Switch
                id="require-upfront"
                checked={requireUpfrontPayment}
                onCheckedChange={(checked) => {
                  setRequireUpfrontPayment(checked);
                  toast.success(
                    checked 
                      ? "Upfront payment is now required for loan approval" 
                      : "Upfront payment is now optional for loan approval"
                  );
                }}
                className="ml-4"
              />
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Upfront Costs Include:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Loan Deposit: 10% of loan amount (refundable after full repayment)</li>
                  <li>Insurance: 1.5% (SME), 2% (Business), 3% (Jumbo) - Non-refundable</li>
                  <li>Service Charge: ₦3,500 flat fee - Non-refundable</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Card>

      {/* Company Account Details */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3>Company Bank Account</h3>
                <p className="text-sm text-gray-600">
                  This account will be displayed to customers for payments
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Active
            </Badge>
          </div>

          <Separator />

          {!isEditing ? (
            /* Display Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-600">Bank Name</Label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p>{companyAccount.bankName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">Account Number</Label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="font-mono text-lg">{companyAccount.accountNumber}</p>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-600">Account Name</Label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p>{companyAccount.accountName}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleEdit} className="flex-1">
                  Edit Account Details
                </Button>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={tempAccount.bankName}
                    onChange={(e) =>
                      setTempAccount({ ...tempAccount, bankName: e.target.value })
                    }
                    placeholder="e.g., First Bank of Nigeria"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={tempAccount.accountNumber}
                    onChange={(e) =>
                      setTempAccount({ ...tempAccount, accountNumber: e.target.value })
                    }
                    placeholder="0000000000"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500">
                    {tempAccount.accountNumber.length}/10 digits
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={tempAccount.accountName}
                    onChange={(e) =>
                      setTempAccount({ ...tempAccount, accountName: e.target.value })
                    }
                    placeholder="e.g., FNG FINANCIAL SERVICES"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleReset} variant="ghost">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Preview Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <h4 className="text-blue-900">Customer View Preview</h4>
          </div>
          <p className="text-sm text-blue-700">
            This is how customers will see the account details when making payments:
          </p>

          <Card className="p-4 bg-white">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bank Name:</span>
                <span className="text-sm">{companyAccount.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Number:</span>
                <span className="text-lg font-mono">{companyAccount.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Name:</span>
                <span className="text-sm">{companyAccount.accountName}</span>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {/* Information Card */}
      <Card className="p-6 bg-orange-50 border-orange-200">
        <div className="space-y-2">
          <h4 className="text-orange-900">Important Information</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
            <li>These details will be shown to all customers when making payments</li>
            <li>Ensure the account details are accurate before saving</li>
            <li>Changes will take effect immediately for all new payment requests</li>
            <li>Customers will use these details for both contributions and loan repayments</li>
            <li>Keep this information secure and only share with authorized personnel</li>
          </ul>
        </div>
      </Card>

      {/* Admin Management Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3>Administrator Management</h3>
                <p className="text-sm text-gray-600">
                  Create and manage admin accounts
                  {currentAdminRole !== "superadmin" && (
                    <Badge className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-200">
                      View Only
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            
            {/* Only super admins can add new admins */}
            {currentAdminRole === "superadmin" && (
              <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Administrator</DialogTitle>
                  <DialogDescription>
                    Add a new administrator to manage the FNG platform
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Full Name *</Label>
                    <Input
                      id="adminName"
                      placeholder="John Doe"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@fng.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPhone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="adminPhone"
                        placeholder="09012345678"
                        value={newAdminPhone}
                        onChange={(e) => setNewAdminPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="adminPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Minimum 6 characters"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminRole">Role *</Label>
                    <select
                      id="adminRole"
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as "admin" | "superadmin")}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      Super Admins have full access to all features including admin management
                    </p>
                  </div>

                  {/* Access Rights - Only show for regular admins */}
                  {newAdminRole === "admin" && (
                    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                      <Label>Access Rights</Label>
                      <p className="text-xs text-gray-600 mb-3">
                        Select which features this admin can access
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-loans" className="text-sm cursor-pointer">
                            Loan Approvals
                          </Label>
                          <Switch
                            id="perm-loans"
                            checked={newAdminPermissions.canManageLoanApprovals}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canManageLoanApprovals: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-withdrawals" className="text-sm cursor-pointer">
                            Withdrawal Approvals
                          </Label>
                          <Switch
                            id="perm-withdrawals"
                            checked={newAdminPermissions.canManageWithdrawals}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canManageWithdrawals: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-refunds" className="text-sm cursor-pointer">
                            Deposit Refunds
                          </Label>
                          <Switch
                            id="perm-refunds"
                            checked={newAdminPermissions.canManageDepositRefunds}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canManageDepositRefunds: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-kyc" className="text-sm cursor-pointer">
                            KYC Approvals
                          </Label>
                          <Switch
                            id="perm-kyc"
                            checked={newAdminPermissions.canManageKYC}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canManageKYC: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-customers" className="text-sm cursor-pointer">
                            View Customer Profiles
                          </Label>
                          <Switch
                            id="perm-customers"
                            checked={newAdminPermissions.canViewCustomerProfiles}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canViewCustomerProfiles: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-manage-customers" className="text-sm cursor-pointer">
                            Manage Customers
                          </Label>
                          <Switch
                            id="perm-manage-customers"
                            checked={newAdminPermissions.canManageCustomers}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canManageCustomers: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-activity" className="text-sm cursor-pointer">
                            View Activity
                          </Label>
                          <Switch
                            id="perm-activity"
                            checked={newAdminPermissions.canViewActivity}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canViewActivity: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-data" className="text-sm cursor-pointer">
                            Data Management
                          </Label>
                          <Switch
                            id="perm-data"
                            checked={newAdminPermissions.canManageData}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canManageData: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="perm-settings" className="text-sm cursor-pointer">
                            Company Settings
                          </Label>
                          <Switch
                            id="perm-settings"
                            checked={newAdminPermissions.canManageSettings}
                            onCheckedChange={(checked) => 
                              setNewAdminPermissions({...newAdminPermissions, canManageSettings: checked})
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      Login credentials will be automatically sent to the admin's email address.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleCreateAdmin}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Admin Account"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            )}
          </div>

          <Separator />

          {/* Admin List */}
          <div className="space-y-3">
            {admins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No administrators yet</p>
                <p className="text-sm">Click "Add Admin" to create one</p>
              </div>
            ) : (
              admins.map((admin) => (
                <Card key={admin.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-full ${
                        admin.role === "superadmin" ? "bg-purple-100" : "bg-blue-100"
                      }`}>
                        <Shield className={`h-5 w-5 ${
                          admin.role === "superadmin" ? "text-purple-600" : "text-blue-600"
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4>{admin.fullName}</h4>
                          <Badge className={
                            admin.role === "superadmin" 
                              ? "bg-purple-100 text-purple-700 border-purple-200" 
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }>
                            {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                          </Badge>
                          <Badge className={
                            admin.status === "active"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }>
                            {admin.status}
                          </Badge>
                        </div>
                        <div className="flex gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {admin.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {admin.phone}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Created {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                        
                        {/* Show permissions for regular admins */}
                        {admin.role === "admin" && admin.permissions && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-gray-600 mb-1">Access Rights:</p>
                            <div className="flex flex-wrap gap-1">
                              {admin.permissions.canManageLoanApprovals && (
                                <Badge variant="outline" className="text-xs">Loans</Badge>
                              )}
                              {admin.permissions.canManageWithdrawals && (
                                <Badge variant="outline" className="text-xs">Withdrawals</Badge>
                              )}
                              {admin.permissions.canManageDepositRefunds && (
                                <Badge variant="outline" className="text-xs">Refunds</Badge>
                              )}
                              {admin.permissions.canManageKYC && (
                                <Badge variant="outline" className="text-xs">KYC</Badge>
                              )}
                              {admin.permissions.canViewCustomerProfiles && (
                                <Badge variant="outline" className="text-xs">Customers</Badge>
                              )}
                              {admin.permissions.canManageCustomers && (
                                <Badge variant="outline" className="text-xs">Manage Customers</Badge>
                              )}
                              {admin.permissions.canViewActivity && (
                                <Badge variant="outline" className="text-xs">Activity</Badge>
                              )}
                              {admin.permissions.canManageData && (
                                <Badge variant="outline" className="text-xs">Data</Badge>
                              )}
                              {admin.permissions.canManageSettings && (
                                <Badge variant="outline" className="text-xs">Settings</Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Only super admins can manage other admins */}
                    {currentAdminRole === "superadmin" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(admin.id)}
                        >
                          {admin.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Additional Settings Placeholder */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3>Additional Company Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <h4 className="text-sm mb-1">Company Name</h4>
              <p className="text-sm text-gray-600">FNG Financial Services</p>
            </div>
            <div className="p-4 border rounded-md bg-gray-50">
              <h4 className="text-sm mb-1">Currency</h4>
              <p className="text-sm text-gray-600">Nigerian Naira (₦)</p>
            </div>
            <div className="p-4 border rounded-md bg-gray-50">
              <h4 className="text-sm mb-1">Interest Rate</h4>
              <p className="text-sm text-gray-600">20% per loan</p>
            </div>
            <div className="p-4 border rounded-md bg-gray-50">
              <h4 className="text-sm mb-1">Loan Period Options</h4>
              <p className="text-sm text-gray-600">4, 8, 12, 16, 20 weeks</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">
            More settings coming soon...
          </p>
        </div>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
