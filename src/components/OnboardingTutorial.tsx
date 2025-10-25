import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { 
  Home, 
  HandCoins, 
  Wallet, 
  Headphones, 
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BrandLogoCompact } from "./BrandLogo";

interface OnboardingTutorialProps {
  isAdmin?: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTutorial({ isAdmin = false, onComplete, onSkip }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const userSteps = [
    {
      icon: Sparkles,
      title: "Welcome to FNG!",
      description: "Your personal loan and savings platform",
      content: [
        "Manage loans with flexible repayment",
        "Save daily and build your financial future",
        "Track all your transactions in one place",
        "24/7 customer support always available"
      ],
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: Home,
      title: "Dashboard Overview",
      description: "Your financial hub",
      content: [
        "View your current loan status and balance",
        "See your total contributions and streak",
        "Quick access to apply for loans",
        "Track recent transactions at a glance"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: HandCoins,
      title: "Apply for Loans",
      description: "Three loan types available",
      content: [
        "Choose from SME, Business, or Jumbo loans",
        "Flexible loan amounts to suit your needs",
        "Easy application process with quick approval",
        "Convenient weekly repayment schedule"
      ],
      gradient: "from-pink-500 to-red-500"
    },
    {
      icon: Wallet,
      title: "Daily Contributions",
      description: "Build your savings habit",
      content: [
        "Make daily savings contributions",
        "Track your contribution streak",
        "Withdraw anytime you need",
        "Earn rewards for consistency"
      ],
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "KYC Verification",
      description: "Secure your account",
      content: [
        "Complete KYC to access all features",
        "Upload government-issued ID",
        "Add guarantor information",
        "Get approved within 24-48 hours"
      ],
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: User,
      title: "Profile & Settings",
      description: "Manage your account",
      content: [
        "Update personal information",
        "Add payment methods",
        "Configure notification preferences",
        "Access help and support"
      ],
      gradient: "from-yellow-500 to-green-500"
    }
  ];

  const adminSteps = [
    {
      icon: Sparkles,
      title: "Welcome, Admin!",
      description: "Powerful tools to manage FNG",
      content: [
        "Complete admin dashboard with analytics",
        "Approve loans, KYC, and withdrawals",
        "Manage customer accounts",
        "Generate comprehensive reports"
      ],
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      icon: TrendingUp,
      title: "Revenue Analytics",
      description: "Track financial performance",
      content: [
        "Monitor monthly service charges",
        "Track loan interest revenue",
        "View insurance fee collections",
        "Analyze revenue trends over time"
      ],
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      icon: Shield,
      title: "Approval Workflows",
      description: "Manage customer requests",
      content: [
        "Review and approve loan applications",
        "Verify KYC submissions",
        "Process withdrawal requests",
        "Handle deposit refund claims"
      ],
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Efficient admin tools",
      content: [
        "Bulk approve multiple requests",
        "Real-time activity monitoring",
        "Customer account management",
        "Data export and reporting"
      ],
      gradient: "from-pink-600 to-red-600"
    }
  ];

  const steps = isAdmin ? adminSteps : userSteps;
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Mark onboarding as completed
    localStorage.setItem(
      isAdmin ? "adminOnboardingCompleted" : "userOnboardingCompleted",
      "true"
    );
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(
      isAdmin ? "adminOnboardingSkipped" : "userOnboardingSkipped",
      "true"
    );
    onSkip();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-xl p-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Accessibility - Visually Hidden */}
        <DialogTitle className="sr-only">
          {currentStepData.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {currentStepData.description}
        </DialogDescription>

        {/* Close/Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 z-10 rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Skip tutorial"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <BrandLogoCompact />
            <span className="text-xs text-gray-500">
              {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {/* Icon Header */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <Icon className="h-10 w-10 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-center mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                {currentStepData.description}
              </p>

              {/* Content List */}
              <div className="space-y-3 mb-8">
                {currentStepData.content.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button onClick={handleNext} className="flex-1">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="flex-1 bg-green-600 hover:bg-green-700">
              Get Started
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Step Indicators */}
        <div className="px-6 pb-4 flex justify-center gap-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentStep ? 1 : -1);
                setCurrentStep(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to check if onboarding should be shown
export function useOnboarding(isAdmin: boolean = false) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const storageKey = isAdmin ? "adminOnboardingCompleted" : "userOnboardingCompleted";
    const skipKey = isAdmin ? "adminOnboardingSkipped" : "userOnboardingSkipped";
    
    const completed = localStorage.getItem(storageKey);
    const skipped = localStorage.getItem(skipKey);
    
    // Show onboarding if neither completed nor skipped
    if (!completed && !skipped) {
      setShouldShowOnboarding(true);
    }
  }, [isAdmin]);

  const resetOnboarding = () => {
    const storageKey = isAdmin ? "adminOnboardingCompleted" : "userOnboardingCompleted";
    const skipKey = isAdmin ? "adminOnboardingSkipped" : "userOnboardingSkipped";
    
    localStorage.removeItem(storageKey);
    localStorage.removeItem(skipKey);
    setShouldShowOnboarding(true);
  };

  return {
    shouldShowOnboarding,
    setShouldShowOnboarding,
    resetOnboarding
  };
}
