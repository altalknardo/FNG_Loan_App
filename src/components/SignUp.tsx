import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { BrandLogo } from "./BrandLogo";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { signUp, checkPhoneExists, type ApiError } from "../lib/auth-api";

interface Props {
  onSignUp: (phoneNumber: string, userData: any) => void;
  onSwitchToLogin: () => void;
}

export function SignUp({ onSignUp, onSwitchToLogin }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 3: Address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Step 4: Agreement
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingPhone, setCheckingPhone] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const isValidPhone = (str: string) => {
    return /^(\+?234|0)?[789]\d{9}$/.test(str.replace(/\s/g, ""));
  };

  const normalizePhoneNumber = (phone: string | undefined | null): string => {
    // Handle undefined/null/empty values
    if (!phone) return "";

    // Remove all spaces and convert to standard format +234XXXXXXXXXX
    let cleaned = phone.replace(/\s/g, "");

    // If starts with 0, replace with +234
    if (cleaned.startsWith("0")) {
      cleaned = "+234" + cleaned.slice(1);
    }

    // If starts with 234, add +
    else if (cleaned.startsWith("234")) {
      cleaned = "+" + cleaned;
    }

    // If doesn't start with +234, assume it's missing
    else if (!cleaned.startsWith("+234")) {
      cleaned = "+234" + cleaned;
    }

    return cleaned;
  };

  const validateStep1 = async () => {
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (fullName.trim().split(" ").length < 2) {
      setError("Please enter your full name (first and last name)");
      return false;
    }
    if (!phone) {
      setError("Please enter your phone number");
      return false;
    }
    if (!isValidPhone(phone)) {
      setError("Please enter a valid Nigerian phone number");
      return false;
    }

    // Email is optional, but if provided must be valid
    if (email && !isValidEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Check if phone number already exists via API
    const normalizedPhone = normalizePhoneNumber(phone);
    setCheckingPhone(true);
    try {
      const phoneExists = await checkPhoneExists(normalizedPhone);
      if (phoneExists) {
        setError(
          "This phone number is already registered. Please login instead."
        );
        setCheckingPhone(false);
        return false;
      }
    } catch (error) {
      // If API check fails, fall back to localStorage check for backward compatibility
      console.warn(
        "Phone check API failed, using localStorage fallback:",
        error
      );
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
      if (
        existingUsers.some((u: any) => {
          const userPhone = u.phoneNumber || u.phone;
          return (
            userPhone && normalizePhoneNumber(userPhone) === normalizedPhone
          );
        })
      ) {
        setError(
          "This phone number is already registered. Please login instead."
        );
        setCheckingPhone(false);
        return false;
      }
    } finally {
      setCheckingPhone(false);
    }

    return true;
  };

  const validateStep2 = () => {
    if (!password) {
      setError("Please enter a password");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain both letters and numbers");
      return false;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!address.trim()) {
      setError("Please enter your address");
      return false;
    }
    if (!city.trim()) {
      setError("Please enter your city");
      return false;
    }
    if (!state.trim()) {
      setError("Please enter your state");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      return false;
    }
    if (!acceptPrivacy) {
      setError("You must accept the privacy policy");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    setError("");

    if (step === 1) {
      const isValid = await validateStep1();
      if (!isValid) return;
    }
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep4()) return;

    setIsLoading(true);

    try {
      const normalizedPhone = normalizePhoneNumber(phone);

      // Prepare signup data
      const signupData = {
        fullName: fullName.trim(),
        email: email?.trim() || undefined, // Only include if provided
        phone: normalizedPhone,
        password,
        streetAddress: address.trim(),
        city: city.trim(),
        state: state.trim(),
      };

      // Call API to sign up
      const response = await signUp(signupData);

      if (response.success && response.data) {
        // Store auth token if provided by backend
        if (response?.token) {
          localStorage.setItem(
            "authToken",
            response?.token || ""
          );
        }

        // Store user data in localStorage for backward compatibility
        // (Remove this once fully migrated to API)
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...response?.data,
            token: response?.token || response.data.token,
          })
        );
        const userData = {
          ...response.data,
          // password, // Note: In production, never store password
          address,
          city,
          state,
          token: response.data.token,
        };

        const existingUsers = JSON.parse(
          localStorage.getItem("registeredUsers") || "[]"
        );
        existingUsers.push(userData);
        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));

        toast.success(
          response.message ||
            "Account created successfully! Please verify your phone number."
        );
        onSignUp(normalizedPhone, response.data.user);
      } else {
        setError(response.message || "Registration failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      // Handle API errors
      const apiError = error as ApiError;

      // Check for field-specific errors
      if (apiError.errors && Object.keys(apiError.errors).length > 0) {
        const firstError = Object.values(apiError.errors)[0][0];
        setError(firstError || apiError.message);
      } else {
        setError(apiError.message || "Registration failed. Please try again.");
      }

      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-orange-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength();
    if (strength < 50) return "Weak";
    if (strength < 75) return "Medium";
    return "Strong";
  };

  const stepTitles = [
    "Basic Information",
    "Create Password",
    "Address Details",
    "Terms & Agreement",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <Card className="p-6 sm:p-8 shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <BrandLogo size="sm" animated />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <h2 className="text-gray-900 mb-1">Create Your Account</h2>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3 text-purple-600" />
                Start saving today
                <Sparkles className="h-3 w-3 text-purple-600" />
              </p>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-gray-600">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className={step >= 1 ? "text-purple-600" : ""}>Basic</span>
              <span className={step >= 2 ? "text-purple-600" : ""}>
                Password
              </span>
              <span className={step >= 3 ? "text-purple-600" : ""}>
                Address
              </span>
              <span className={step >= 4 ? "text-purple-600" : ""}>
                Confirm
              </span>
            </div>
          </div>

          {/* Step Title */}
          <div className="mb-4">
            <h3 className="text-gray-900">{stepTitles[step - 1]}</h3>
          </div>

          {/* Demo Mode Notice */}
          {step === 1 && (
            <Alert className="mb-4 bg-green-50 border-green-300">
              <Smartphone className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 text-xs">
                <strong>Phone Verification:</strong> SMS code will be shown
                on-screen (90% of customers use phone verification)
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                      <Input
                        id="phone"
                        placeholder="08012345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-green-600 focus:ring-green-600"
                        disabled={isLoading || checkingPhone}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Your primary identifier (e.g., 08012345678 or
                      +2348012345678)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Optional - for account recovery only
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Password */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            Password strength:
                          </span>
                          <span
                            className={`${
                              passwordStrength() < 50
                                ? "text-red-600"
                                : passwordStrength() < 75
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength()}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      At least 6 characters with letters and numbers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && password === confirmPassword && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Passwords match</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Address */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Lagos"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="Lagos"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Agreement */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <h4 className="text-gray-900 mb-3">
                      Review Your Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="text-gray-900">{fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-900">{phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="text-gray-900 text-right">
                          {address}, {city}, {state}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked as boolean)
                        }
                        disabled={isLoading}
                        className="mt-1"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm cursor-pointer select-none leading-relaxed"
                      >
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-purple-600 hover:underline"
                        >
                          Terms and Conditions
                        </button>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={acceptPrivacy}
                        onCheckedChange={(checked) =>
                          setAcceptPrivacy(checked as boolean)
                        }
                        disabled={isLoading}
                        className="mt-1"
                      />
                      <Label
                        htmlFor="privacy"
                        className="text-sm cursor-pointer select-none leading-relaxed"
                      >
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-purple-600 hover:underline"
                        >
                          Privacy Policy
                        </button>
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 h-11 border-gray-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading || checkingPhone}
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {checkingPhone ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-purple-600 hover:text-purple-700 hover:underline"
                type="button"
              >
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
