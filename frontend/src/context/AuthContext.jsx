import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService.js';
import { setAuthToken } from '../services/api.js';

const AuthContext = createContext();

const isTokenExpired = (storedToken) => {
  try {
    const payload = JSON.parse(atob(storedToken.split('.')[1]));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    console.log('🔧 AuthContext initialized with token:', storedToken ? 'present' : 'missing');
    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminEmail');
      console.warn('⚠️ Stored login session expired; signing in again is required');
      return null;
    }
    return storedToken;
  });

  const [adminEmail, setAdminEmail] = useState(() => {
    const storedEmail = localStorage.getItem('adminEmail');
    return storedEmail;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update auth header when token changes
  useEffect(() => {
    console.log('🔧 Token changed:', token ? 'present' : 'missing');
    setAuthToken(token);

    if (token) {
      localStorage.setItem('token', token);
      console.log('💾 Token saved to localStorage');
    } else {
      localStorage.removeItem('token');
      console.log('🗑️ Token removed from localStorage');
    }
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setAdminEmail(null);
      setError('Your login session expired. Please sign in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Persist admin email to localStorage
  useEffect(() => {
    if (adminEmail) {
      localStorage.setItem('adminEmail', adminEmail);
      console.log('💾 Admin email saved to localStorage:', adminEmail);
    } else {
      localStorage.removeItem('adminEmail');
      console.log('🗑️ Admin email removed from localStorage');
    }
  }, [adminEmail]);

  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext.login called');
      setLoading(true);
      setError(null);

      // Call auth service
      const response = await authService.login(credentials);

      // Validate response
      if (!response?.token || !response?.admin) {
        throw new Error('Invalid login response structure');
      }

      // Update state
      console.log('✅ Setting token and admin email');
      // Navigation can mount the dashboard before the token state effect runs.
      setAuthToken(response.token);
      setToken(response.token);
      setAdminEmail(response.admin.email);

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      console.error('❌ AuthContext.login error:', errorMessage);

      setError(errorMessage);
      setLoading(false);

      // Re-throw with axios error structure for component handling
      throw {
        response: {
          data: {
            message: errorMessage,
          },
          status: err.response?.status || 500,
        },
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logout called');
    setToken(null);
    setAdminEmail(null);
    setError(null);
  };

  const value = useMemo(
    () => ({
      token,
      adminEmail,
      loading,
      error,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, adminEmail, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
