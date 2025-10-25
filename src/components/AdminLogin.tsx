import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { BrandLogo } from "./BrandLogo";
import { Shield, Lock, Mail, AlertCircle, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface Props {
  onLogin: (email: string) => void;
  onBack: () => void;
}

export function AdminLogin({ onLogin, onBack }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved credentials on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("savedAdminUsername");
    const savedPassword = localStorage.getItem("savedAdminPassword");
    const savedRemember = localStorage.getItem("rememberAdminMe");

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
      // Demo admin credentials
      const demoAdmins = [
        { email: "admin@fng.com", phone: "09012345678", password: "admin123", status: "active" },
        { email: "superadmin@fng.com", phone: "09087654321", password: "super123", status: "active" }
      ];

      // Get registered admins from settings
      const registeredAdmins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
      const allAdmins = [...demoAdmins, ...registeredAdmins];

      const validAdmin = allAdmins.find(
        u => (u.email === username || u.phone === username) && u.password === password
      );

      // Check if admin is active
      if (validAdmin && validAdmin.status === "inactive") {
        setError("This admin account has been deactivated. Contact super admin.");
        setIsLoading(false);
        return;
      }

      if (validAdmin) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem("savedAdminUsername", username);
          localStorage.setItem("savedAdminPassword", password);
          localStorage.setItem("rememberAdminMe", "true");
        } else {
          localStorage.removeItem("savedAdminUsername");
          localStorage.removeItem("savedAdminPassword");
          localStorage.removeItem("rememberAdminMe");
        }

        // Save current admin role and permissions
        localStorage.setItem("currentAdminRole", validAdmin.role || "superadmin");
        localStorage.setItem("currentAdminEmail", validAdmin.email);
        if (validAdmin.permissions) {
          localStorage.setItem("currentAdminPermissions", JSON.stringify(validAdmin.permissions));
        } else {
          localStorage.removeItem("currentAdminPermissions");
        }

        toast.success("Admin login successful!");
        onLogin(username);
      } else {
        setError("Invalid admin credentials. Please check your email/phone and password.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const inputIcon = isValidEmail(username) ? Mail : Phone;
  const InputIcon = inputIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 flex items-center justify-center px-4 py-8 relative overflow-hidden">
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border border-orange-200">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                <span className="text-orange-900">Administrator Portal</span>
              </div>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Admin Email or Phone</Label>
              <div className="relative group">
                <InputIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Email or phone number"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-orange-600 focus:ring-orange-600"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-orange-600 focus:ring-orange-600"
                  disabled={isLoading}
                />
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
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
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
              className="w-full h-11 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>



          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                <Shield className="h-3 w-3" />
                <span>Secure admin access - All activities are logged</span>
              </div>
              <button
                onClick={onBack}
                className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
                type="button"
              >
                ← Back to main site
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
