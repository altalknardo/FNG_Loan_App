import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

