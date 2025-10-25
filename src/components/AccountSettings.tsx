import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, Shield, Phone } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AccountSettingsProps {
  userEmail: string;
  onEmailChange: (newEmail: string) => void;
  onBack: () => void;
}

export function AccountSettings({ userEmail, onEmailChange, onBack }: AccountSettingsProps) {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Get current user data
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  
  // Change Email States
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  
  // Change Phone States
  const [newPhone, setNewPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [phonePassword, setPhonePassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  
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

  // Load current user data
  useEffect(() => {
    const userData = getCurrentUser();
    setCurrentUserData(userData);
  }, [userEmail]);

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

  const isValidPhone = (phone: string) => {
    // Nigerian phone numbers: 11 digits starting with 0, or 10 digits, or with +234
    return /^(\+?234|0)?[789]\d{9}$/.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('234')) {
      return '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      return cleaned;
    } else if (cleaned.length === 10) {
      return '0' + cleaned;
    }
    
    return phone;
  };

  const getCurrentUser = () => {
    // Check demo users
    const demoUsers = [
      { email: "user@fng.com", phone: "08012345678", password: "user123" },
      { email: "customer@fng.com", phone: "08087654321", password: "customer123" },
      { email: "demo@fng.com", phone: "07011111111", password: "demo123" }
    ];

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const allUsers = [...demoUsers, ...registeredUsers];
    
    const currentUser = allUsers.find(u => u.email === userEmail || u.phone === userEmail);
    return currentUser || null;
  };

  const getCurrentUserPassword = () => {
    const user = getCurrentUser();
    return user?.password || null;
  };

  const updateUserPassword = (oldPassword: string, newPassword: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userIndex = registeredUsers.findIndex((u: any) => u.email === userEmail || u.phone === userEmail);
    
    if (userIndex !== -1) {
      registeredUsers[userIndex].password = newPassword;
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      
      // Update saved password if remember me is active
      if (localStorage.getItem("rememberMe") === "true") {
        localStorage.setItem("savedPassword", newPassword);
      }
      
      return true;
    }
    return false;
  };

  const updateUserEmail = (newEmail: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userIndex = registeredUsers.findIndex((u: any) => u.email === userEmail || u.phone === userEmail);
    
    if (userIndex !== -1) {
      const oldEmail = registeredUsers[userIndex].email;
      registeredUsers[userIndex].email = newEmail;
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      
      // Update saved username if remember me is active
      if (localStorage.getItem("rememberMe") === "true" && localStorage.getItem("savedUsername") === oldEmail) {
        localStorage.setItem("savedUsername", newEmail);
      }
      
      return true;
    }
    return false;
  };

  const updateUserPhone = (newPhone: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userIndex = registeredUsers.findIndex((u: any) => u.email === userEmail || u.phone === userEmail);
    
    if (userIndex !== -1) {
      const oldPhone = registeredUsers[userIndex].phone;
      const formattedPhone = formatPhoneNumber(newPhone);
      registeredUsers[userIndex].phone = formattedPhone;
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      
      // Update saved username if remember me is active and user logged in with phone
      if (localStorage.getItem("rememberMe") === "true" && localStorage.getItem("savedUsername") === oldPhone) {
        localStorage.setItem("savedUsername", formattedPhone);
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

    if (newEmail === currentUserData?.email) {
      setEmailError("New email must be different from current email");
      return;
    }

    if (newEmail !== confirmEmail) {
      setEmailError("Email addresses do not match");
      return;
    }

    const currentUserPassword = getCurrentUserPassword();
    if (currentUserPassword !== emailPassword) {
      setEmailError("Incorrect password");
      return;
    }

    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const emailExists = registeredUsers.some((u: any) => u.email === newEmail);
    
    if (emailExists) {
      setEmailError("This email is already registered");
      return;
    }

    setEmailLoading(true);

    setTimeout(() => {
      if (updateUserEmail(newEmail)) {
        toast.success("Email updated successfully!");
        onEmailChange(newEmail);
        setShowChangeEmail(false);
        setNewEmail("");
        setConfirmEmail("");
        setEmailPassword("");
        // Reload user data
        const userData = getCurrentUser();
        setCurrentUserData(userData);
      } else {
        setEmailError("Failed to update email. Please try again.");
      }
      setEmailLoading(false);
    }, 1000);
  };

  const handleChangePhone = () => {
    setPhoneError("");

    if (!newPhone || !confirmPhone || !phonePassword) {
      setPhoneError("Please fill in all fields");
      return;
    }

    if (!isValidPhone(newPhone)) {
      setPhoneError("Please enter a valid Nigerian phone number (e.g., 08012345678)");
      return;
    }

    const formattedNewPhone = formatPhoneNumber(newPhone);
    const formattedConfirmPhone = formatPhoneNumber(confirmPhone);

    if (formattedNewPhone === currentUserData?.phone) {
      setPhoneError("New phone number must be different from current number");
      return;
    }

    if (formattedNewPhone !== formattedConfirmPhone) {
      setPhoneError("Phone numbers do not match");
      return;
    }

    const currentUserPassword = getCurrentUserPassword();
    if (currentUserPassword !== phonePassword) {
      setPhoneError("Incorrect password");
      return;
    }

    // Check if phone already exists
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const phoneExists = registeredUsers.some((u: any) => u.phone === formattedNewPhone);
    
    if (phoneExists) {
      setPhoneError("This phone number is already registered");
      return;
    }

    setPhoneLoading(true);

    setTimeout(() => {
      if (updateUserPhone(formattedNewPhone)) {
        toast.success("Phone number updated successfully!");
        setShowChangePhone(false);
        setNewPhone("");
        setConfirmPhone("");
        setPhonePassword("");
        // Reload user data
        const userData = getCurrentUser();
        setCurrentUserData(userData);
      } else {
        setPhoneError("Failed to update phone number. Please try again.");
      }
      setPhoneLoading(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields");
      return;
    }

    const currentUserPassword = getCurrentUserPassword();
    if (currentUserPassword !== currentPassword) {
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
      if (updateUserPassword(currentPassword, newPassword)) {
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
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-9 px-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Account Security
          </h2>
          <p className="text-sm text-gray-600">Manage your login credentials</p>
        </div>
      </div>

      {/* Current Account Info */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-600">Current Email</Label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <p className="text-sm">{currentUserData?.email || userEmail}</p>
            </div>
          </div>

          {currentUserData?.phone && (
            <div>
              <Label className="text-xs text-gray-600">Current Phone Number</Label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm">{currentUserData.phone}</p>
              </div>
            </div>
          )}
          
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
      <div className="space-y-3">
        <Card className="p-4">
          <button
            onClick={() => setShowChangeEmail(true)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm">Change Email Address</p>
                <p className="text-xs text-gray-500">Update your login email</p>
              </div>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
          </button>
        </Card>

        <Card className="p-4">
          <button
            onClick={() => setShowChangePhone(true)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm">Change Phone Number</p>
                <p className="text-xs text-gray-500">Update your login phone</p>
              </div>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
          </button>
        </Card>

        <Card className="p-4">
          <button
            onClick={() => setShowChangePassword(true)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
          </button>
        </Card>
      </div>

      {/* Security Tips */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs sm:text-sm">
          <p className="mb-2">Security Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Use a unique password you don't use elsewhere</li>
            <li>Keep your phone number up to date for account recovery</li>
            <li>Never share your password with anyone</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Change Email Dialog */}
      <Dialog open={showChangeEmail} onOpenChange={setShowChangeEmail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Enter your new email address and confirm with your password
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
                value={currentUserData?.email || ""}
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

      {/* Change Phone Dialog */}
      <Dialog open={showChangePhone} onOpenChange={setShowChangePhone}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Phone Number</DialogTitle>
            <DialogDescription>
              Enter your new phone number and confirm with your password
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {phoneError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{phoneError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-phone">Current Phone Number</Label>
              <Input
                id="current-phone"
                type="tel"
                value={currentUserData?.phone || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-phone">New Phone Number</Label>
              <Input
                id="new-phone"
                type="tel"
                placeholder="e.g., 08012345678"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                disabled={phoneLoading}
              />
              <p className="text-xs text-gray-500">Format: 08012345678 or +2348012345678</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-phone">Confirm New Phone Number</Label>
              <Input
                id="confirm-phone"
                type="tel"
                placeholder="Confirm new phone"
                value={confirmPhone}
                onChange={(e) => setConfirmPhone(e.target.value)}
                disabled={phoneLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-password">Current Password</Label>
              <Input
                id="phone-password"
                type="password"
                placeholder="Enter your password"
                value={phonePassword}
                onChange={(e) => setPhonePassword(e.target.value)}
                disabled={phoneLoading}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowChangePhone(false);
                setPhoneError("");
                setNewPhone("");
                setConfirmPhone("");
                setPhonePassword("");
              }}
              disabled={phoneLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePhone} disabled={phoneLoading}>
              {phoneLoading ? "Updating..." : "Update Phone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Choose a strong password to keep your account secure
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
