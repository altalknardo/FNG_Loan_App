import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { WifiOff, Wifi, Cloud, CloudOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      // Show reconnected message if was previously offline
      if (wasOffline) {
        setShowReconnected(true);
        
        // Hide reconnected message after 3 seconds
        setTimeout(() => {
          setShowReconnected(false);
          setWasOffline(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Show reconnected message
  if (showReconnected) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-16 sm:top-20 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md sm:ml-auto"
        >
          <Alert className="bg-green-50 border-green-200 shadow-lg">
            <Wifi className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              <div className="flex items-center justify-between">
                <span>Back online!</span>
                <Cloud className="h-4 w-4 ml-2" />
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show offline banner
  if (!isOnline) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-16 sm:top-20 left-0 right-0 z-50"
        >
          <Alert className="bg-orange-600 border-0 text-white rounded-none shadow-lg">
            <WifiOff className="h-4 w-4 text-white" />
            <AlertDescription className="text-white text-sm">
              <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4" />
                  <div>
                    <p className="font-medium">You're offline</p>
                    <p className="text-xs text-white/80 mt-0.5">
                      Some features may be unavailable. Data will sync when you're back online.
                    </p>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}

// Component for showing offline status in specific areas
export function OfflineStatus() {
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

  if (isOnline) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs">
      <WifiOff className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
}

// Hook to check online status
export function useOnlineStatus() {
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

  return isOnline;
}
