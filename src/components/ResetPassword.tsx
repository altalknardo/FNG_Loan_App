import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";
import { toast } from "sonner@2.0.3";

interface ResetPasswordProps {
  email: string;
  token: string;
  onResetComplete: () => void;
  onCancel: () => void;
}

export function ResetPassword({ email, token, onResetComplete, onCancel }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Verify token
      const resetTokens = JSON.parse(localStorage.getItem("passwordResetTokens") || "[]");
      const tokenData = resetTokens.find((t: any) => t.email === email && t.token === token);

      if (!tokenData) {
        toast.error("Invalid or expired reset link");
        setIsSubmitting(false);
        return;
      }

      if (tokenData.used) {
        toast.error("This reset link has already been used");
        setIsSubmitting(false);
        return;
      }

      if (Date.now() > tokenData.expiry) {
        toast.error("Reset link has expired");
        setIsSubmitting(false);
        return;
      }

      // Update user password
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.email === email);

      if (userIndex === -1) {
        toast.error("User not found");
        setIsSubmitting(false);
        return;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));

      // Mark token as used
      tokenData.used = true;
      localStorage.setItem("passwordResetTokens", JSON.stringify(resetTokens));

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="mb-2">Password Reset Successful!</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been updated. You can now sign in with your new password.
          </p>

          <Button onClick={onResetComplete} className="w-full">
            Continue to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-6">
          <BrandLogoCompact className="mb-4" />
          
          <h2 className="mb-2">Reset Your Password</h2>
          <p className="text-sm text-gray-600">
            Enter a new password for <strong>{email}</strong>
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200 mb-6">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-xs">
            Choose a strong password with at least 8 characters
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword && newPassword.length < 8 && (
              <p className="text-xs text-red-600">Password must be at least 8 characters</p>
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
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
              className="w-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t">
          <Alert className="bg-gray-50 border-gray-200">
            <AlertCircle className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-700 text-xs">
              <strong>Password Tips:</strong>
              <ul className="list-disc ml-4 mt-1 space-y-0.5">
                <li>Use at least 8 characters</li>
                <li>Mix uppercase and lowercase letters</li>
                <li>Include numbers and symbols</li>
                <li>Avoid common words or patterns</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    </div>
  );
}
