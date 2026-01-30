/**
 * API Service Module
 * 
 * This module provides a centralized Axios instance for making HTTP requests
 * to the backend API. Includes request/response interceptors for authentication
 * and error handling.
 * 
 * @module services/api
 */

import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '../types';

/**
 * Base URL for API requests
 * Loaded from environment variables
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create configured Axios instance
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Request interceptor
 * Adds authentication token to requests if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common error responses
 */
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
