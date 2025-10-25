import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, WifiOff, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

type ConnectionType = "online" | "offline" | "slow" | "unstable";

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function ConnectionStatus({ showDetails = false, className = "" }: ConnectionStatusProps) {
  const [connectionType, setConnectionType] = useState<ConnectionType>("online");
  const [isVisible, setIsVisible] = useState(false);
  const [speed, setSpeed] = useState<number | null>(null);
  const [lastOnline, setLastOnline] = useState<Date>(new Date());

  // Check connection status
  useEffect(() => {
    const updateConnectionStatus = () => {
      if (!navigator.onLine) {
        setConnectionType("offline");
        setIsVisible(true);
        return;
      }

      // Check connection speed using navigator.connection if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection?.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setConnectionType("slow");
          setIsVisible(true);
        } else if (effectiveType === '3g' && connection.downlink < 1) {
          setConnectionType("unstable");
          setIsVisible(true);
        } else {
          setConnectionType("online");
          setLastOnline(new Date());
          // Hide status after good connection is restored
          setTimeout(() => setIsVisible(false), 3000);
        }
      } else {
        setConnectionType("online");
        setLastOnline(new Date());
        setTimeout(() => setIsVisible(false), 3000);
      }
    };

    // Initial check
    updateConnectionStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Check connection periodically
    const interval = setInterval(() => {
      if (navigator.onLine) {
        // Simple connection test
        fetch('/manifest.json', { 
          method: 'HEAD',
          cache: 'no-cache',
          mode: 'no-cors'
        })
        .then(() => {
          if (connectionType === "offline") {
            updateConnectionStatus();
          }
        })
        .catch(() => {
          if (connectionType !== "offline") {
            setConnectionType("offline");
            setIsVisible(true);
          }
        });
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
      clearInterval(interval);
    };
  }, [connectionType]);

  // Measure connection speed
  useEffect(() => {
    if (connectionType === "online") {
      const measureSpeed = async () => {
        try {
          const startTime = Date.now();
          await fetch('/manifest.json?' + Math.random(), { cache: 'no-cache' });
          const endTime = Date.now();
          const duration = endTime - startTime;
          setSpeed(duration);
        } catch (error) {
          setSpeed(null);
        }
      };

      measureSpeed();
    }
  }, [connectionType]);

  const getStatusConfig = () => {
    switch (connectionType) {
      case "offline":
        return {
          icon: <WifiOff className="h-5 w-5 text-red-600" />,
          text: "No Connection",
          description: "You're currently offline. Some features may not work.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800"
        };
      case "slow":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          text: "Slow Connection",
          description: "Your connection is slow. Some features may be limited.",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800"
        };
      case "unstable":
        return {
          icon: <Zap className="h-5 w-5 text-orange-600" />,
          text: "Unstable Connection",
          description: "Your connection is unstable. Please check your network.",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800"
        };
      default:
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: "Connected",
          description: "Your connection is stable and fast.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800"
        };
    }
  };

  const config = getStatusConfig();

  const retry = () => {
    window.location.reload();
  };

  if (!isVisible && connectionType === "online") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-sm w-full mx-4 ${className}`}
      >
        <Card className={`${config.bgColor} ${config.borderColor} border shadow-lg`}>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-sm ${config.textColor}`}>
                  {config.text}
                </h4>
                <p className={`text-xs mt-1 ${config.textColor} opacity-90`}>
                  {config.description}
                </p>
                
                {showDetails && (
                  <div className="mt-2 space-y-1">
                    {speed && connectionType === "online" && (
                      <p className={`text-xs ${config.textColor} opacity-75`}>
                        Response time: {speed}ms
                      </p>
                    )}
                    {connectionType === "offline" && (
                      <p className={`text-xs ${config.textColor} opacity-75`}>
                        Last online: {lastOnline.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {connectionType === "offline" && (
                <Button
                  onClick={retry}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                >
                  Retry
                </Button>
              )}
              
              <button
                onClick={() => setIsVisible(false)}
                className={`flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors ${config.textColor}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Simple indicator for header
export function ConnectionIndicator({ className = "" }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`} 
      />
      {!isOnline && (
        <span className="text-xs text-red-600 font-medium">Offline</span>
      )}
    </div>
  );
}