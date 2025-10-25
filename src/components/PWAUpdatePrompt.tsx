import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Download, X, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) return;

    // Listen for service worker updates
    const checkForUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;

        setRegistration(reg);

        // Check for waiting service worker
        if (reg.waiting) {
          setShowPrompt(true);
        }

        // Listen for new service worker installing
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              setShowPrompt(true);
            }
          });
        });

        // Listen for controller change (when new SW takes over)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Reload the page to use the new service worker
          window.location.reload();
        });

      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    checkForUpdates();

    // Check for updates every 5 minutes
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then(reg => {
        reg?.update();
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    if (!registration || !registration.waiting) {
      toast.error("No update available");
      return;
    }

    setIsUpdating(true);

    // Tell the service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Show loading toast
    toast.loading("Updating app...", { id: "update-toast" });

    // The page will reload automatically when the new SW takes over
    setTimeout(() => {
      // Fallback reload if controllerchange doesn't trigger
      window.location.reload();
    }, 3000);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Store dismissal to avoid showing again for 24 hours
    const dismissedUntil = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem("updatePromptDismissedUntil", dismissedUntil.toString());
    
    toast.info("You can update later from the menu");
  };

  // Check if user dismissed recently
  useEffect(() => {
    const dismissedUntil = localStorage.getItem("updatePromptDismissedUntil");
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      setShowPrompt(false);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md sm:ml-auto">
      <Alert className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-sm mb-1">Update Available!</h4>
                <AlertDescription className="text-white/90 text-xs">
                  A new version of FNG is ready. Update now for the latest features and improvements.
                </AlertDescription>
              </div>
              
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-white text-blue-600 hover:bg-white/90 h-8 text-xs"
              >
                {isUpdating ? (
                  <>
                    <div className="h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-2" />
                    Update Now
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 h-8 text-xs"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}

// Hook to manually check for updates
export function useCheckForUpdates() {
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    if (!('serviceWorker' in navigator)) {
      toast.error("Service Worker not supported");
      return false;
    }

    setIsChecking(true);

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (!registration) {
        toast.info("No service worker registered");
        setIsChecking(false);
        return false;
      }

      await registration.update();
      
      // Check if update is available
      if (registration.waiting) {
        toast.success("Update available! Please refresh to update.");
        setIsChecking(false);
        return true;
      } else {
        toast.success("You're using the latest version");
        setIsChecking(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      toast.error("Failed to check for updates");
      setIsChecking(false);
      return false;
    }
  };

  return { checkForUpdates, isChecking };
}
