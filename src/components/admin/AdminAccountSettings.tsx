import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield, Crown } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AdminAccountSettingsProps {
  adminEmail: string;
  onEmailChange: (newEmail: string) => void;
}

export function AdminAccountSettings({ adminEmail, onEmailChange }: AdminAccountSettingsProps) {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Change Email States
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  
  // Change Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false
  });

  // Get current admin role
  const currentRole = localStorage.getItem("currentAdminRole") || "unknown";

  useEffect(() => {
    if (newPassword) {
      setPasswordStrength({
        hasLength: newPassword.length >= 8,
        hasUpperCase: /[A-Z]/.test(newPassword),
        hasLowerCase: /[a-z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
      });
    }
  }, [newPassword]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getCurrentAdminPassword = () => {
    // Demo admin credentials
    const demoAdmins = [
      { email: "admin@fng.com", password: "admin123", role: "Super Admin" },
      { email: "manager@fng.com", password: "manager123", role: "Manager" },
      { email: "support@fng.com", password: "support123", role: "Support" }
    ];

    // Check registered admins
    const registeredAdmins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
    const allAdmins = [...demoAdmins, ...registeredAdmins];
    
    const currentAdmin = allAdmins.find(a => a.email === adminEmail);
    return currentAdmin?.password || null;
  };

  const updateAdminPassword = (oldPassword: string, newPassword: string) => {
    const registeredAdmins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
    const adminIndex = registeredAdmins.findIndex((a: any) => a.email === adminEmail);
    
    if (adminIndex !== -1) {
      registeredAdmins[adminIndex].password = newPassword;
      localStorage.setItem("adminUsers", JSON.stringify(registeredAdmins));
      return true;
    }
    return false;
  };

  const updateAdminEmail = (newEmail: string) => {
    const registeredAdmins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
    const adminIndex = registeredAdmins.findIndex((a: any) => a.email === adminEmail);
    
    if (adminIndex !== -1) {
      const oldEmail = registeredAdmins[adminIndex].email;
      registeredAdmins[adminIndex].email = newEmail;
      localStorage.setItem("adminUsers", JSON.stringify(registeredAdmins));
      
      // Update current admin email in localStorage
      if (localStorage.getItem("currentAdminEmail") === oldEmail) {
        localStorage.setItem("currentAdminEmail", newEmail);
      }
      
      return true;
    }
    return false;
  };

  const handleChangeEmail = () => {
    setEmailError("");

    if (!newEmail || !confirmEmail || !emailPassword) {
      setEmailError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (newEmail === adminEmail) {
      setEmailError("New email must be different from current email");
      return;
    }

    if (newEmail !== confirmEmail) {
      setEmailError("Email addresses do not match");
      return;
    }

    const currentAdminPassword = getCurrentAdminPassword();
    if (currentAdminPassword !== emailPassword) {
      setEmailError("Incorrect password");
      return;
    }

    // Check if email already exists
    const registeredAdmins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
    const emailExists = registeredAdmins.some((a: any) => a.email === newEmail);
    
    if (emailExists) {
      setEmailError("This email is already registered");
      return;
    }

    setEmailLoading(true);

    setTimeout(() => {
      if (updateAdminEmail(newEmail)) {
        toast.success("Email updated successfully!");
        onEmailChange(newEmail);
        setShowChangeEmail(false);
        setNewEmail("");
        setConfirmEmail("");
        setEmailPassword("");
      } else {
        setEmailError("Failed to update email. Please try again.");
      }
      setEmailLoading(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields");
      return;
    }

    const currentAdminPassword = getCurrentAdminPassword();
    if (currentAdminPassword !== currentPassword) {
      setPasswordError("Current password is incorrect");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    const isStrongPassword = Object.values(passwordStrength).filter(Boolean).length >= 4;
    if (!isStrongPassword) {
      setPasswordError("Password must meet at least 4 security requirements");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);

    setTimeout(() => {
      if (updateAdminPassword(currentPassword, newPassword)) {
        toast.success("Password updated successfully!");
        setShowChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
      setPasswordLoading(false);
    }, 1000);
  };

  const StrengthIndicator = ({ label, met }: { label: string; met: boolean }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />
      )}
      <span className={met ? "text-green-600" : "text-gray-500"}>{label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-orange-600" />
          Admin Account Security
        </h2>
        <p className="text-sm text-gray-600 mt-1">Manage your administrative credentials</p>
      </div>

      {/* Current Account Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-900">Admin Role</p>
                <p className="text-xs text-orange-700">{currentRole}</p>
              </div>
            </div>
            <Shield className="h-5 w-5 text-orange-400" />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Current Email</Label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <p className="text-sm">{adminEmail}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-gray-600">Password</Label>
            <div className="flex items-center gap-2 mt-1">
              <Lock className="h-4 w-4 text-gray-400" />
              <p className="text-sm">••••••••</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowChangeEmail(true)}>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm">Change Email</h4>
              <p className="text-xs text-gray-500 mt-1">Update your admin email address</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowChangePassword(true)}>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm">Change Password</h4>
              <p className="text-xs text-gray-500 mt-1">Update your admin password</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Tips */}
      <Alert className="bg-orange-50 border-orange-200">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 text-xs sm:text-sm">
          <p className="mb-2">Admin Security Best Practices:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Use a unique, strong password for your admin account</li>
            <li>Never share your admin credentials with anyone</li>
            <li>Change your password regularly (every 90 days recommended)</li>
            <li>Log out when using shared or public computers</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Change Email Dialog */}
      <Dialog open={showChangeEmail} onOpenChange={setShowChangeEmail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Admin Email</DialogTitle>
            <DialogDescription>
              Update your administrative email address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {emailError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{emailError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                type="email"
                value={adminEmail}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">New Email Address</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={emailLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-email">Confirm New Email</Label>
              <Input
                id="confirm-email"
                type="email"
                placeholder="Confirm new email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                disabled={emailLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-password">Current Password</Label>
              <Input
                id="email-password"
                type="password"
                placeholder="Enter your password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                disabled={emailLoading}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowChangeEmail(false);
                setEmailError("");
                setNewEmail("");
                setConfirmEmail("");
                setEmailPassword("");
              }}
              disabled={emailLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleChangeEmail} disabled={emailLoading}>
              {emailLoading ? "Updating..." : "Update Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>
              Choose a strong password for your admin account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {passwordError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{passwordError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicators */}
              {newPassword && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-xs text-gray-600 mb-2">Password Requirements:</p>
                  <StrengthIndicator label="At least 8 characters" met={passwordStrength.hasLength} />
                  <StrengthIndicator label="One uppercase letter" met={passwordStrength.hasUpperCase} />
                  <StrengthIndicator label="One lowercase letter" met={passwordStrength.hasLowerCase} />
                  <StrengthIndicator label="One number" met={passwordStrength.hasNumber} />
                  <StrengthIndicator label="One special character" met={passwordStrength.hasSpecial} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowChangePassword(false);
                setPasswordError("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              disabled={passwordLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={passwordLoading}>
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
