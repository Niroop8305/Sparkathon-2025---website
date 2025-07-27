// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sparkathon-2025-website-production.up.railway.app/api';

// Debug logging for troubleshooting
console.log('🔍 Debug - Environment Variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
});
console.log('🎯 Final API_BASE_URL:', API_BASE_URL);

// Validate the URL format
if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  console.error('❌ Invalid API URL format - missing protocol:', API_BASE_URL);
}

export { API_BASE_URL };
