import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SessionTimeoutHandlerProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export function SessionTimeoutHandler({ 
  isAuthenticated, 
  onLogout,
  timeoutMinutes = 30, // 30 minutes of inactivity
  warningMinutes = 5 // Show warning 5 minutes before timeout
}: SessionTimeoutHandlerProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

  const clearAllTimers = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const startCountdown = () => {
    setRemainingSeconds(warningMinutes * 60);
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    clearAllTimers();
    setShowWarning(false);
    
    // Save session timeout flag
    localStorage.setItem("sessionTimedOut", "true");
    localStorage.setItem("lastActivityTime", Date.now().toString());
    
    toast.error("Session expired due to inactivity");
    onLogout();
  };

  const handleContinueSession = () => {
    setShowWarning(false);
    clearAllTimers();
    resetTimeout();
    toast.success("Session extended");
  };

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    clearAllTimers();
    
    if (!isAuthenticated) return;

    // Set warning timeout
    warningTimeoutIdRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, warningMs);

    // Set logout timeout (as backup)
    timeoutIdRef.current = setTimeout(() => {
      handleTimeout();
    }, timeoutMs);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    // Initialize timeout
    resetTimeout();

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ];

    // Throttle activity tracking to avoid excessive resets
    let throttleTimeout: NodeJS.Timeout | null = null;
    
    const handleActivity = () => {
      // Only reset if user has been inactive for at least 1 minute
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      if (timeSinceLastActivity > 60000) { // 1 minute
        if (!throttleTimeout) {
          throttleTimeout = setTimeout(() => {
            resetTimeout();
            throttleTimeout = null;
          }, 1000); // Throttle to once per second
        }
      }
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check for activity in other tabs
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const lastActivity = parseInt(localStorage.getItem("lastActivityTime") || "0");
        const inactiveDuration = Date.now() - lastActivity;
        
        if (inactiveDuration > timeoutMs) {
          handleTimeout();
        } else {
          resetTimeout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Store activity time periodically
    const activityInterval = setInterval(() => {
      localStorage.setItem("lastActivityTime", lastActivityRef.current.toString());
    }, 10000); // Every 10 seconds

    // Cleanup
    return () => {
      clearAllTimers();
      if (throttleTimeout) clearTimeout(throttleTimeout);
      clearInterval(activityInterval);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, timeoutMs, warningMs]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showWarning || !isAuthenticated) return null;

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <DialogTitle>Session Expiring Soon</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Your session will expire due to inactivity
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Alert className="bg-orange-50 border-orange-200">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <span className="text-sm">Time remaining:</span>
              <span className="text-2xl tabular-nums ml-3">
                {formatTime(remainingSeconds)}
              </span>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-sm text-gray-600">
          <p className="mb-2">
            For your security, you'll be automatically logged out after {warningMinutes} minutes of inactivity.
          </p>
          <p>
            Click "Continue Session" to stay logged in.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleTimeout}
            className="w-full sm:w-auto"
          >
            Logout Now
          </Button>
          <Button
            onClick={handleContinueSession}
            className="w-full sm:w-auto"
          >
            Continue Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
