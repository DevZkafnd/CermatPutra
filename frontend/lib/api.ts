// API Client menggunakan Axios
// Saya menggunakan ini untuk komunikasi dengan backend

import axios, { AxiosInstance, AxiosError } from 'axios';

// Ambil base URL dari environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Inisialisasi axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage jika ada
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, redirect ke login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
