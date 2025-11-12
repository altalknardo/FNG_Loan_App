import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";
import { toast } from "sonner@2.0.3";
import { verifyPhone, resendOTP, type ApiError } from "../lib/auth-api";

interface SMSVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onResendSMS: () => void;
  onLogout: () => void;
}

export function SMSVerification({
  phoneNumber,
  onVerificationComplete,
  onResendSMS,
  onLogout,
}: SMSVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCode, setShowCode] = useState(false);

  // Start countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  // Generate verification code on mount (for demo/fallback purposes)
  useEffect(() => {
    // For demo mode, generate a code and show it
    // In production, the backend should send the OTP via SMS
    const code = generateVerificationCode();
    setGeneratedCode(code);
    console.log("📱 SMS Verification Code (Demo):", code);

    // Store verification code in localStorage for fallback
    const verifications = JSON.parse(
      localStorage.getItem("smsVerifications") || "[]"
    );
    verifications.push({
      phoneNumber,
      code,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000, // 10 minutes
      verified: false,
    });
    localStorage.setItem("smsVerifications", JSON.stringify(verifications));
  }, [phoneNumber]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      toast.error("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits");
      toast.error("Verification code must be 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");
    setAttempts(attempts + 1);

    try {
      // Call API to verify phone number
      const response = await verifyPhone(phoneNumber, verificationCode);

      if (response.success) {
        // Update user as verified in localStorage for backward compatibility
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userData = JSON.parse(localStorage.getItem("userData") || "null");
        const userIndex = users.findIndex(
          (u: any) => u.phoneNumber === phoneNumber
        );
        if (userIndex !== -1) {
          users[userIndex].phoneVerified = true;
          users[userIndex].verifiedAt = new Date().toISOString();
          localStorage.setItem("users", JSON.stringify(users));
        }
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...userData,
            phoneVerified: true,
          })
        );

        // Mark verification as complete in localStorage
        const verifications = JSON.parse(
          localStorage.getItem("smsVerifications") || "[]"
        );
        const verification = verifications.find(
          (v: any) => v.phoneNumber === phoneNumber && !v.verified
        );
        if (verification) {
          verification.verified = true;
          verification.verifiedAt = Date.now();
          localStorage.setItem(
            "smsVerifications",
            JSON.stringify(verifications)
          );
        }

        toast.success(
          response.message || "Phone number verified successfully!"
        );
        setIsVerifying(false);
        onVerificationComplete();
      } else {
        setError(response.message || "Verification failed. Please try again.");
        setIsVerifying(false);
      }
    } catch (error: any) {
      // Handle API errors
      const apiError = error as ApiError;
      setError(apiError.message || "Verification failed. Please try again.");
      setIsVerifying(false);

      // Lock after 5 failed attempts
      if (attempts >= 4) {
        toast.error("Too many failed attempts. Please request a new code.");
        handleResendCode();
      } else {
        toast.error(
          apiError.message || "Invalid verification code. Please try again."
        );
      }
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled || isResending) return;

    setIsResending(true);
    setError("");
    setResendDisabled(true);
    setCountdown(60); // 60 second cooldown
    setAttempts(0);
    setVerificationCode("");

    try {
      // Call API to resend OTP
      const response = await resendOTP(phoneNumber);

      if (response.success) {
        // Generate new code for demo/fallback
        const code = generateVerificationCode();
        setGeneratedCode(code);
        console.log("📱 New SMS Verification Code (Demo):", code);

        // Update verification record in localStorage for fallback
        const verifications = JSON.parse(
          localStorage.getItem("smsVerifications") || "[]"
        );
        const verification = verifications.find(
          (v: any) => v.phoneNumber === phoneNumber && !v.verified
        );

        if (verification) {
          verification.code = code;
          verification.createdAt = Date.now();
          verification.expiresAt = Date.now() + 600000; // 10 minutes
          localStorage.setItem(
            "smsVerifications",
            JSON.stringify(verifications)
          );
        }

        toast.success(
          response.message || "New verification code sent successfully!"
        );
        onResendSMS();
      } else {
        setError(
          response.message || "Failed to resend code. Please try again."
        );
        toast.error(
          response.message || "Failed to resend code. Please try again."
        );
        setResendDisabled(false);
        setCountdown(0);
      }
    } catch (error: any) {
      // Handle API errors - fall back to localStorage method
      const apiError = error as ApiError;
      console.warn("Resend OTP API failed, using fallback:", apiError);

      // Fallback: Generate new code locally
      const code = generateVerificationCode();
      setGeneratedCode(code);
      console.log("📱 New SMS Verification Code (Fallback):", code);

      // Update verification record
      const verifications = JSON.parse(
        localStorage.getItem("smsVerifications") || "[]"
      );
      const verification = verifications.find(
        (v: any) => v.phoneNumber === phoneNumber && !v.verified
      );

      if (verification) {
        verification.code = code;
        verification.createdAt = Date.now();
        verification.expiresAt = Date.now() + 600000; // 10 minutes
        localStorage.setItem("smsVerifications", JSON.stringify(verifications));
      }

      toast.success("New verification code generated (fallback mode)");
      onResendSMS();
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && verificationCode.length === 6) {
      handleVerify();
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    // Assuming Nigerian format: +234 XXX XXX XXXX
    if (phone.startsWith("+234")) {
      const digits = phone.slice(4);
      return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6
      )}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <BrandLogoCompact className="mx-auto mb-4" />

          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="mb-2">Verify Your Phone Number</h2>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm text-green-600 mt-1">
            {formatPhoneNumber(phoneNumber)}
          </p>
        </div>

        {/* <Alert className="bg-amber-50 border-amber-300 mb-6">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 text-xs">
            <strong>Demo Mode:</strong> SMS sending is not configured. Your verification code is displayed below.
          </AlertDescription>
        </Alert> */}

        {/* <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-900">Your Verification Code:</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCode(!showCode)}
              className="text-xs h-auto py-1 px-2"
            >
              {showCode ? "Hide" : "Show"}
            </Button>
          </div>
          {showCode && (
            <div className="text-center">
              <p className="text-3xl tracking-widest text-green-700 font-mono select-all">
                {generatedCode}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Click to copy or type it in the field below
              </p>
            </div>
          )}
          {!showCode && (
            <p className="text-xs text-green-600 text-center">
              Click "Show" to reveal your code
            </p>
          )}
        </div> */}

        <div className="space-y-4">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="code" className="text-sm">
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
                setError(""); // Clear error when user types
              }}
              onKeyPress={handleKeyPress}
              disabled={isVerifying}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              autoFocus
            />
            {verificationCode && verificationCode.length < 6 && (
              <p className="text-xs text-gray-500 text-center">
                {6 - verificationCode.length} digits remaining
              </p>
            )}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={isVerifying || verificationCode.length !== 6}
          >
            {isVerifying ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Verify Phone Number
              </>
            )}
          </Button>

          <div className="text-center space-y-3">
            <p className="text-xs text-gray-600">Didn't receive the code?</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendCode}
              disabled={resendDisabled || isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {resendDisabled
                    ? `Resend Code (${countdown}s)`
                    : "Resend Code"}
                </>
              )}
            </Button>
          </div>

          {attempts > 2 && attempts < 5 && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-xs">
                {5 - attempts} attempt{5 - attempts !== 1 ? "s" : ""} remaining
                before code reset
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-gray-600 mb-3">
            Need help? Contact support at{" "}
            <a
              href="tel:+2348012345678"
              className="text-blue-600 hover:underline"
            >
              +234 801 234 5678
            </a>
          </p>
          <button
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
          >
            Wrong number? Sign out and try again
          </button>
        </div>
      </Card>
    </div>
  );
}
