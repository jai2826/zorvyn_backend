import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}) => {
  const { isAuthenticated, role, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};