import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campushub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize all error responses into a single readable message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response)
      return Promise.reject(new Error('Cannot reach server. Please check your connection.'));

    // Token expired or invalid → clear session and redirect to login
    if (error.response.status === 401) {
      const wasLoggedIn = !!localStorage.getItem('campushub_token');
      localStorage.removeItem('campushub_token');
      localStorage.removeItem('campushub_user');
      // Only redirect if user was actually logged in (avoid redirect loop on login page)
      if (wasLoggedIn && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    const message = error.response.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
