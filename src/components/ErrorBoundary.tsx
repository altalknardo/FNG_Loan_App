import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Store error details
    this.setState({
      error,
      errorInfo
    });

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <BrandLogoCompact className="mx-auto mb-4" />
              
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              
              <h2 className="mb-2">Oops! Something Went Wrong</h2>
              <p className="text-sm text-gray-600">
                We're sorry for the inconvenience. An unexpected error occurred.
              </p>
            </div>

            <Alert className="bg-red-50 border-red-200 mb-6">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                {this.state.error?.message || "An unknown error occurred"}
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <Button onClick={this.handleReset} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Development Error Details */}
            {isDevelopment && this.state.error && (
              <details className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <summary className="cursor-pointer text-sm mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="space-y-3 mt-3">
                  <div>
                    <p className="text-xs mb-1">Error Message:</p>
                    <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                      {this.state.error.message}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs mb-1">Stack Trace:</p>
                    <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-48">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <p className="text-xs mb-1">Component Stack:</p>
                      <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Support Information */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-xs text-gray-600 mb-3">
                If this problem persists, please contact our support team:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-xs">
                <a 
                  href="mailto:support@fng.ng" 
                  className="text-blue-600 hover:underline"
                >
                  support@fng.ng
                </a>
                <span className="hidden sm:inline text-gray-400">•</span>
                <a 
                  href="tel:+2348001234567" 
                  className="text-blue-600 hover:underline"
                >
                  +234 800 123 4567
                </a>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
