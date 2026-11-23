import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('volunteer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only clear if on protected page
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/volunteer') ||
        currentPath.startsWith('/ngo') ||
        currentPath.startsWith('/admin')
      ) {
        localStorage.removeItem('volunteer_token');
        localStorage.removeItem('volunteer_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
