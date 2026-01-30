/**
 * Order Service
 * 
 * This module provides functions for order operations
 * including creating, fetching, and updating orders.
 * 
 * @module services/orderService
 */

import api from './api';
import type { 
  Order, 
  CreateOrderRequest, 
  OrderStatus,
} from '../types';

/**
 * Create new order
 * @param data - Order data
 * @returns Promise with created order
 */
export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const response = await api.post<{ success: boolean; data?: Order; error?: string; details?: string[]; message?: string }>('/orders', data);

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to create order');
  }

  const order = response.data.data!;
  // Ensure the order has an id field for frontend use
  return {
    ...order,
    _id: order._id
  };
};

/**
 * Get all orders for authenticated user
 * @returns Promise with array of orders
 */
export const getUserOrders = async (): Promise<Order[]> => {
  const response = await api.get<{ success: boolean; data: Order[]; count: number }>('/orders');
  return response.data.data;
};

/**
 * Get single order by ID
 * @param id - Order ID
 * @returns Promise with order
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
  return response.data.data;
};

/**
 * Get all orders (Admin only)
 * @param status - Optional status filter
 * @returns Promise with array of orders
 */
export const getAllOrders = async (status?: OrderStatus): Promise<Order[]> => {
  const params = status ? { status } : {};
  const response = await api.get<{ success: boolean; data: Order[]; count: number }>('/orders/all', { params });
  return response.data.data;
};

/**
 * Update order status (Admin only)
 * @param id - Order ID
 * @param status - New status
 * @returns Promise with updated order
 */
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const response = await api.put<Order>(`/orders/${id}/status`, { status });
  return response.data;
};

/**
 * Cancel order
 * @param id - Order ID
 * @returns Promise with cancelled order
 */
export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await api.put<Order>(`/orders/${id}/cancel`);
  return response.data;
};
