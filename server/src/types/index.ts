/**
 * Server-Side Type Definitions
 * 
 * This module contains all TypeScript types and interfaces used in the backend.
 * These types mirror the shared types but are defined here to avoid import issues.
 * 
 * @module types
 */

import { Request } from 'express';

// ============================================
// User Types
// ============================================

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  adminSecretCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// Menu Item Types
// ============================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateMenuItemRequest = Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMenuItemRequest = Partial<CreateMenuItemRequest>;

// ============================================
// Order Types
// ============================================

export type OrderStatus = 
  | 'Order Received' 
  | 'Preparing' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryDetails: DeliveryDetails;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  deliveryDetails: DeliveryDetails;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string[];
}

// ============================================
// Validation Types
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ============================================
// Express Extended Types
// ============================================

/**
 * User data attached to authenticated requests
 */
export interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Extended Express Request interface with user property
 * Used for authenticated routes
 */
export interface AuthenticatedRequest extends Request {
  user?: RequestUser;
}
