import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOrganization?: boolean;
  redirectIfAuthenticated?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresOrganization = false,
  redirectIfAuthenticated = false,
}) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (redirectIfAuthenticated && currentUser && userData) {
    if (userData.hasOrganization) {
      return <Navigate to='/dashboard' replace />;
    }
    return <Navigate to='/startup' replace />;
  }

  if (redirectIfAuthenticated && !currentUser) {
    return <>{children}</>;
  }

  if (!currentUser) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!userData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
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
