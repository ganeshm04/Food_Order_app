/**
 * Authentication Service
 * 
 * This module provides functions for authentication operations
 * including login, register, and user management.
 * 
 * @module services/authService
 */

import api from './api';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ApiResponse 
} from '../types';

/**
 * Register a new user
 * @param data - Registration data
 * @returns Promise with user and token
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<{ user: User; token: string }>('/auth/register', data);
  
  // Store token and user in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data;
};

/**
 * Login existing user
 * @param data - Login credentials
 * @returns Promise with user and token
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  
  // The actual response is wrapped in ApiResponse<AuthResponse>
  const authData = response.data.data;
  
  // Store token and user in localStorage
  localStorage.setItem('token', authData.token);
  localStorage.setItem('user', JSON.stringify(authData.user));
  
  return authData;
};

/**
 * Get current authenticated user
 * @returns Promise with user data
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ user: User }>('/auth/me');
  return response.data.user;
};

/**
 * Logout user
 * Clears localStorage and makes logout API call
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    // Always clear localStorage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Get stored user from localStorage
 * @returns User object or null
 */
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Check if current user is admin
 * @returns boolean
 */
export const isAdmin = (): boolean => {
  const user = getStoredUser();
  return user?.role === 'admin';
};
