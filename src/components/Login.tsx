import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { BrandLogo } from "./BrandLogo";
import { Lock, Mail, AlertCircle, Phone, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface Props {
  onLogin: (emailOrPhone: string) => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
  onAdminLogin?: (emailOrPhone: string) => void;
}

export function Login({ onLogin, onSwitchToSignUp, onForgotPassword, onAdminLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    const savedRemember = localStorage.getItem("rememberMe");

    if (savedRemember === "true" && savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const isValidPhone = (str: string) => {
    // Nigerian phone numbers: 11 digits starting with 0, or 10 digits, or with +234
    return /^(\+?234|0)?[789]\d{9}$/.test(str.replace(/\s/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    if (!isValidEmail(username) && !isValidPhone(username)) {
      setError("Please enter a valid email address or phone number");
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      // Admin credentials - check first
      const demoAdmins = [
        { email: "admin@fng.com", phone: "09012345678", password: "admin123", status: "active" },
        { email: "superadmin@fng.com", phone: "09087654321", password: "super123", status: "active" }
      ];
      
      // Get registered admins from settings
      const registeredAdmins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
      const allAdmins = [...demoAdmins, ...registeredAdmins];

      const validAdmin = allAdmins.find(
        a => (a.email === username || a.phone === username) && a.password === password && a.status === "active"
      );

      if (validAdmin && onAdminLogin) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
          localStorage.setItem("savedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
          localStorage.removeItem("rememberMe");
        }

        toast.success("Admin login successful!");
        onAdminLogin(username);
        return;
      }

      // Demo credentials - accept email or phone
      const demoUsers = [
        { email: "user@fng.com", phone: "08012345678", password: "user123" },
        { email: "customer@fng.com", phone: "08087654321", password: "customer123" },
        { email: "demo@fng.com", phone: "07011111111", password: "demo123" }
      ];

      // Check registered users from sign up
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const allUsers = [...demoUsers, ...registeredUsers];

      const validUser = allUsers.find(
        u => (u.email === username || u.phone === username || u.phoneNumber === username) && u.password === password
      );

      if (validUser) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
          localStorage.setItem("savedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
          localStorage.removeItem("rememberMe");
        }

        toast.success("Login successful!");
        onLogin(username);
      } else {
        setError("Invalid credentials. Please check your email/phone and password.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const inputIcon = isValidEmail(username) ? Mail : Phone;
  const InputIcon = inputIcon;

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
          {/* Logo */}
          <div className="text-center mb-6">
            <BrandLogo size="md" showFullName animated />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>Welcome back!</span>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Email or Phone Number</Label>
              <div className="relative group">
                <InputIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="username"
                  type="text"
                  placeholder="email@example.com or 08012345678"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-purple-600 focus:ring-purple-600"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-purple-600 transition-colors"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm cursor-pointer select-none"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-purple-600 hover:text-purple-700 hover:underline"
                  type="button"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4">
              {/* Regular User Account */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700 mb-2">Test Account:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span>user@fng.com</span>
                    <span className="text-gray-400">or</span>
                    <Phone className="h-3 w-3" />
                    <span>08012345678</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lock className="h-3 w-3" />
                    <span>user123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact{" "}
              <a href="mailto:support@fng.com" className="text-purple-600 hover:underline">
                support@fng.com
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
