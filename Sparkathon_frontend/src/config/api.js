// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug logging (remove in production)
console.log('Environment Variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
});
console.log('Final API_BASE_URL:', API_BASE_URL);

export { API_BASE_URL };
