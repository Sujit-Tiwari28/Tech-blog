import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token, adminEmail } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', {
    isAuthenticated,
    hasToken: !!token,
    adminEmail,
    requestedPath: location.pathname,
  });

  if (!isAuthenticated) {
    console.warn('⚠️ Access denied: User not authenticated');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('✅ Access granted to:', location.pathname);
  return children;
};

export default ProtectedRoute;
