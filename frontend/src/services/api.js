import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false, // Don't send cookies
});

// Let restored sessions authorize requests made by the initial protected page.
const savedToken = localStorage.getItem('token');
if (savedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
}

// Request interceptor for logging and debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Network error or timeout
    if (!error.response) {
      console.error('❌ Network Error:', {
        message: error.message,
        code: error.code,
      });
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        originalError: error,
      });
    }

    // Server responded with error status
    console.error(`❌ API Error: ${error.response.status} ${error.config.method?.toUpperCase()} ${error.config.url}`, {
      status: error.response.status,
      data: error.response.data,
    });

    if (error.response.status === 401 && !error.config.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminEmail');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log('🔐 Auth Token Set');
  } else {
    delete api.defaults.headers.common.Authorization;
    console.log('🔓 Auth Token Removed');
  }
};

export default api;
