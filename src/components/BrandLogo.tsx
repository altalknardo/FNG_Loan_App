import { motion } from "motion/react";

interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showFullName?: boolean;
  animated?: boolean;
  className?: string;
}

export function BrandLogo({ 
  size = "md", 
  showFullName = false, 
  animated = false,
  className = ""
}: BrandLogoProps) {
  const sizeClasses = {
    xs: {
      container: "p-2",
      text: "text-lg",
      fullName: "text-xs",
      spacing: "mt-1 space-y-0"
    },
    sm: {
      container: "p-3",
      text: "text-2xl",
      fullName: "text-sm",
      spacing: "mt-2 space-y-0.5"
    },
    md: {
      container: "p-4",
      text: "text-4xl",
      fullName: "text-base",
      spacing: "mt-3 space-y-0.5"
    },
    lg: {
      container: "p-6",
      text: "text-5xl",
      fullName: "text-lg",
      spacing: "mt-4 space-y-1"
    },
    xl: {
      container: "p-8",
      text: "text-6xl",
      fullName: "text-xl",
      spacing: "mt-6 space-y-1"
    }
  };

  const sizes = sizeClasses[size];

  const LogoContent = () => (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {/* Logo Container */}
      <div className="relative inline-block">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl" />
        
        {/* Main logo */}
        <div className={`relative inline-block bg-white rounded-2xl ${sizes.container} shadow-lg border-2 border-white/50`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-50" />
          <h1 
            className={`relative ${sizes.text} tracking-wider bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent`}
            style={{ 
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontWeight: 900,
              letterSpacing: '0.08em'
            }}
          >
            FNG
          </h1>
        </div>
      </div>

      {/* Full company name */}
      {showFullName && (
        <div className={`${sizes.spacing}`}>
          <p 
            className={`${sizes.fullName} text-gray-600 tracking-widest font-light`}
            style={{ letterSpacing: '0.2em' }}
          >
            FRESH
          </p>
          <p 
            className={`${sizes.fullName} text-gray-600 tracking-widest font-light`}
            style={{ letterSpacing: '0.2em' }}
          >
            NOBLE
          </p>
          <p 
            className={`${sizes.fullName} text-gray-600 tracking-widest font-light`}
            style={{ letterSpacing: '0.2em' }}
          >
            GRAND
          </p>
        </div>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
}

// Compact horizontal version for headers
export function BrandLogoCompact({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Compact logo */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg blur-md" />
        <div className="relative inline-block bg-white rounded-lg p-2 shadow-md border border-white/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg opacity-50" />
          <span 
            className="relative text-xl tracking-wider bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
            style={{ 
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontWeight: 900,
              letterSpacing: '0.08em'
            }}
          >
            FNG
          </span>
        </div>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span 
          className="text-sm tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          style={{ 
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            fontWeight: 700
          }}
        >
          Fresh Noble Grand
        </span>
        <span className="text-xs text-gray-500">Save daily, grow steadily</span>
      </div>
    </div>
  );
}
