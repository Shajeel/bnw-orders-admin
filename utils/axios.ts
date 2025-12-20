import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ApiError } from '@/types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true, // Important: Allow cookies to be sent with requests
});

// Helper function to get token from multiple sources
const getToken = (): string | null => {
  // Try to get from cookie first
  let token = Cookies.get('admin_token');

  // If not in cookie, try localStorage as fallback (in case cookie failed)
  if (!token && typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token || null;
      }
    } catch (error) {
      console.error('Error reading token from localStorage:', error);
    }
  }

  return token || null;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Log error responses in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response.status,
          message: error.response.data?.message,
          data: error.response.data,
        });
      }

      // Handle 401 - Unauthorized
      if (error.response.status === 401) {
        console.warn('401 Unauthorized - Clearing session and redirecting to login');

        // Clear both cookie and localStorage
        Cookies.remove('admin_token');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');

          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }

      // Handle 403 - Forbidden
      if (error.response.status === 403) {
        console.error('Access forbidden - User does not have required permissions');
      }

      // Return structured error
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        errors: error.response.data?.errors,
        status: error.response.status,
      });
    }

    // Network error
    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    }

    // Other errors
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      status: 0,
    });
  }
);

export default apiClient;
