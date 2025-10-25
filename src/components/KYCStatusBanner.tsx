import { motion } from "motion/react";
import { Alert, AlertDescription } from "./ui/alert";
import { Clock, XCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface KYCStatusBannerProps {
  status: "not_submitted" | "pending" | "approved" | "rejected";
  isAdmin: boolean;
}

export function KYCStatusBanner({ status, isAdmin }: KYCStatusBannerProps) {
  if (isAdmin || status === "not_submitted" || status === "approved") {
    return null;
  }

  const configs = {
    pending: {
      icon: Clock,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      textColor: "text-orange-800",
      message: "Your KYC application is under review. You'll be notified once it's approved. Limited access until approval."
    },
    rejected: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
      message: "Your KYC application was rejected. Please contact support for assistance or resubmit your application."
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <motion.div 
      className="max-w-md mx-auto px-4 sm:px-6 pt-4 sm:pt-6"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <Alert className={`${config.bgColor} ${config.borderColor} shadow-sm`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </motion.div>
        <AlertDescription className={`${config.textColor} text-xs sm:text-sm`}>
          {config.message}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}