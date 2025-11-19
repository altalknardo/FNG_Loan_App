import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";
import { toast } from "sonner@2.0.3";

interface ForgotPasswordProps {
  onBack: () => void;
  onResetRequested: (email: string, token: string) => void;
}

export function ForgotPassword({ onBack, onResetRequested }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Check if user exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((u: any) => u.email === email);

      if (userExists) {
        toast.error("No account found with this email address");
        setIsSubmitting(false);
        return;
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const resetExpiry = Date.now() + 3600000; // 1 hour from now

      // Store reset token
      const resetTokens = JSON.parse(localStorage.getItem("passwordResetTokens") || "[]");
      resetTokens.push({
        email,
        token: resetToken,
        expiry: resetExpiry,
        used: false
      });
      localStorage.setItem("passwordResetTokens", JSON.stringify(resetTokens));

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // In production, this would send an email. For demo, we'll show the token
      toast.success("Password reset link sent to your email!");
      
      // Pass token to parent for demo purposes
      onResetRequested(email, resetToken);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-6">
            <BrandLogoCompact className="mx-auto mb-4" />
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2">Check Your Email</h2>
            <p className="text-sm text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs">
              The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button onClick={onBack} className="w-full">
              Back to Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full"
            >
              Resend Email
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-6">
            Didn't receive the email? Contact{" "}
            <a href="mailto:support@fng.ng" className="text-blue-600 hover:underline">
              support@fng.ng
            </a>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <BrandLogoCompact className="mb-4" />
          
          <h2 className="mb-2">Forgot Password?</h2>
          <p className="text-sm text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-center text-gray-600">
            Remember your password?{" "}
            <button
              onClick={onBack}
              className="text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
