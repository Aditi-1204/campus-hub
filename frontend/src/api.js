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
    // No response at all = network failure / server down
    if (!error.response)
      return Promise.reject(new Error('Cannot reach server. Please check your connection.'));

    const { status, data } = error.response;
    const backendMessage = data?.message || null;

    // 401 on login/register pages = wrong credentials, NOT expired session
    // Only auto-logout if user was already logged in and is on a protected page
    if (status === 401) {
      const isAuthPage = window.location.pathname.includes('/login');
      const wasLoggedIn = !!localStorage.getItem('campushub_token');

      if (!isAuthPage && wasLoggedIn) {
        // Expired session on a protected page → logout and redirect
        localStorage.removeItem('campushub_token');
        localStorage.removeItem('campushub_user');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }

      // On login page → pass backend message through directly
      return Promise.reject(new Error(backendMessage || 'Invalid credentials'));
    }

    // All other errors → use backend message if available
    if (backendMessage) return Promise.reject(new Error(backendMessage));
    if (status === 500) return Promise.reject(new Error('Something went wrong. Please try again.'));
    if (status === 404) return Promise.reject(new Error('Resource not found.'));
    if (status === 403) return Promise.reject(new Error('Access denied.'));

    return Promise.reject(new Error(backendMessage || 'Something went wrong. Please try again.'));
  }
);

export default api;
