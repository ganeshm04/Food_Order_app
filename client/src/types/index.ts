/**
 * Frontend Type Definitions
 * 
 * This module contains all TypeScript types and interfaces used in the frontend.
 * These types mirror the backend types for consistency.
 * 
 * @module types
 */

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
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateMenuItemRequest = Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>;
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
  _id: string;
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

export interface ApiError {
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
// Component Props Types
// ============================================

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface InputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
}

export interface OrderStatusProps {
  order: Order;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
}
