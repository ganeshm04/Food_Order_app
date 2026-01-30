/**
 * Authentication Context
 * 
 * This module provides React context for authentication state management.
 * Includes user state, login/logout functions, and authentication status.
 * 
 * @module context/AuthContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authService } from '../services';

/**
 * Authentication context state interface
 */
interface AuthContextState {
  /** Current authenticated user or null */
  user: User | null;
  /** Whether authentication state is being loaded */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether current user is admin */
  isAdmin: boolean;
  /** Login function */
  login: (email: string, password: string) => Promise<void>;
  /** Register function */
  register: (name: string, email: string, password: string, role: 'user' | 'admin', adminSecretCode?: string) => Promise<void>;
  /** Logout function */
  logout: () => Promise<void>;
  /** Update user state */
  setUser: (user: User | null) => void;
}

/**
 * Create authentication context with default values
 */
const AuthContext = createContext<AuthContextState | undefined>(undefined);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * Wraps the application to provide authentication context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check for stored user on mount
   */
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  /**
   * Login handler
   * @param email - User email
   * @param password - User password
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register handler
   * @param name - User name
   * @param email - User email
   * @param password - User password
   * @param role - User role
   * @param adminSecretCode - Admin secret code (required for admin registration)
   */
  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin',
    adminSecretCode?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
        adminSecretCode,
      });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Derived state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Context value
  const value: AuthContextState = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 * 
 * @returns Authentication context state
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
