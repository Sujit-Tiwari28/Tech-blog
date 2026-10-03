import api from './api.js';

const login = async ({ email, password }) => {
  try {
    console.log('🔐 Starting login process for:', email);

    // Validate inputs
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Make API request
    const response = await api.post('/auth/login', { email, password });

    // Validate response structure
    if (!response.data || !response.data.token) {
      const error = new Error('Invalid response structure: missing token');
      error.statusCode = 500;
      error.response = response;
      throw error;
    }

    if (!response.data.admin) {
      const error = new Error('Invalid response structure: missing admin data');
      error.statusCode = 500;
      error.response = response;
      throw error;
    }

    console.log('✅ Login successful for:', email);
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', {
      message: error.message,
      statusCode: error.statusCode || error.response?.status,
      data: error.response?.data,
    });

    // Re-throw with proper structure for error handling
    throw error;
  }
};

const authService = {
  login,
};

export default authService;
