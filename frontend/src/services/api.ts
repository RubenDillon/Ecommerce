// src/services/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.242.64.6:8080/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('[API Response Error]', error.response?.status, error.message);
    
    if (error.response) {
      // Server responded with error
      const apiError = {
        message: error.response.data?.message || 'Error en la solicitud',
        status: error.response.status,
        details: error.response.data?.details || error.message,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'No se pudo conectar con el servidor',
        details: 'Verifique que el middleware esté ejecutándose en 10.242.64.6:8080',
      });
    } else {
      // Error setting up request
      return Promise.reject({
        message: 'Error al configurar la solicitud',
        details: error.message,
      });
    }
  }
);

export default apiClient;