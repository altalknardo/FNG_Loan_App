import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  isAuthenticated, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}

