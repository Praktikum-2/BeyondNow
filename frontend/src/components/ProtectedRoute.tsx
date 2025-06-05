import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOrganization?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresOrganization = false,
}) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!userData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (requiresOrganization && !userData.hasOrganization) {
    return <Navigate to='/startup' replace />;
  }

  if (location.pathname === "/startup" && userData.hasOrganization) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
};
