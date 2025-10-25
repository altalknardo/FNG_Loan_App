import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, CheckCircle2, Smartphone, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";

interface PhoneVerificationProps {
  phone: string;
  onVerificationComplete: () => void;
  onResendCode: () => void;
  onLogout: () => void;
}

export function PhoneVerification({
  phone,
  onVerificationComplete,
  onResendCode,
  onLogout,
}: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Send initial verification code
    sendVerificationCode();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const sendVerificationCode = () => {
    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code with phone number
    const verificationData = {
      phone,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      createdAt: Date.now(),
    };
    
    localStorage.setItem(`verification_${phone}`, JSON.stringify(verificationData));
    
    // In production, this would send an SMS
    console.log(`Verification code for ${phone}: ${code}`);
    
    // For demo/testing, show the code in a toast
    toast.success(`Verification code sent to ${phone}`, {
      description: `Demo code: ${code} (In production, this would be sent via SMS)`,
      duration: 10000,
    });
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get stored verification data
    const storedData = localStorage.getItem(`verification_${phone}`);
    
    if (!storedData) {
      setError("Verification code expired. Please request a new one.");
      setIsVerifying(false);
      return;
    }

    const verificationData = JSON.parse(storedData);

    // Check if code is expired
    if (Date.now() > verificationData.expiresAt) {
      setError("Verification code expired. Please request a new one.");
      localStorage.removeItem(`verification_${phone}`);
      setIsVerifying(false);
      return;
    }

    // Verify the code
    if (verificationCode === verificationData.code) {
      // Mark phone as verified
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.phone === phone);
      
      if (userIndex !== -1) {
        users[userIndex].phoneVerified = true;
        users[userIndex].verifiedAt = new Date().toISOString();
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Clean up verification data
      localStorage.removeItem(`verification_${phone}`);

      toast.success("Phone number verified successfully!");
      onVerificationComplete();
    } else {
      setError("Invalid verification code. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;

    sendVerificationCode();
    setResendTimer(60);
    setCanResend(false);
    setVerificationCode("");
    setError("");
    onResendCode();
  };

  const formatPhone = (phone: string) => {
    // Format Nigerian phone number for display
    if (phone.startsWith("+234")) {
      return phone.replace("+234", "0");
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Smartphone className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mb-2">Verify Your Phone Number</h2>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit code to{" "}
            <strong className="text-gray-900">{formatPhone(phone)}</strong>
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setVerificationCode(value);
                setError("");
              }}
              className="mt-1.5 text-center text-xl tracking-widest"
              autoFocus
              disabled={isVerifying}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Enter the code sent to your phone
            </p>
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || verificationCode.length !== 6}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Verify Phone Number
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={!canResend}
              className="w-full"
            >
              {canResend ? (
                "Resend Code"
              ) : (
                `Resend in ${resendTimer}s`
              )}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>📱 Demo Mode:</strong> The verification code is shown in the notification above.
            In production, codes are sent via SMS to your phone number.
          </p>
        </div>
      </Card>
    </div>
  );
}
