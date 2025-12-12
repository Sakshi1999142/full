import axios from 'axios';

// Normalize VITE_API_BASE_URL to avoid accidental trailing slashes or '/api' duplication
const rawApiBase = import.meta.env.VITE_API_BASE_URL || '';
const normalizedApiBase = rawApiBase.replace(/\/+$|\/api$/i, '').replace(/\/api\/$/i, '');
const axiosBaseURL = normalizedApiBase ? `${normalizedApiBase}/api` : '';

const axiosClient = axios.create({
  baseURL: axiosBaseURL,
  timeout: 20000,
});

// Attach token if available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
