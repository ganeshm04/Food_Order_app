/**
 * Menu Service
 * 
 * This module provides functions for menu item operations
 * including fetching, creating, updating, and deleting menu items.
 * 
 * @module services/menuService
 */

import api from './api';
import type { 
  MenuItem, 
  CreateMenuItemRequest, 
  UpdateMenuItemRequest 
} from '../types';

/**
 * Get all menu items
 * @param category - Optional category filter
 * @param available - Optional availability filter
 * @returns Promise with array of menu items
 */
export const getAllMenuItems = async (
  category?: string,
  available?: boolean
): Promise<MenuItem[]> => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (available !== undefined) params.append('available', String(available));
  
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get<MenuItem[]>(`/menu${query}`);
  return response.data;
};

/**
 * Get single menu item by ID
 * @param id - Menu item ID
 * @returns Promise with menu item
 */
export const getMenuItemById = async (id: string): Promise<MenuItem> => {
  const response = await api.get<MenuItem>(`/menu/${id}`);
  return response.data;
};

/**
 * Get all menu categories
 * @returns Promise with array of category names
 */
export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/menu/categories');
  return response.data;
};

/**
 * Create new menu item (Admin only)
 * @param data - Menu item data
 * @returns Promise with created menu item
 */
export const createMenuItem = async (
  data: CreateMenuItemRequest
): Promise<MenuItem> => {
  const response = await api.post<MenuItem>('/menu', data);
  return response.data;
};

/**
 * Update menu item (Admin only)
 * @param id - Menu item ID
 * @param data - Updated menu item data
 * @returns Promise with updated menu item
 */
export const updateMenuItem = async (
  id: string,
  data: UpdateMenuItemRequest
): Promise<MenuItem> => {
  const response = await api.put<MenuItem>(`/menu/${id}`, data);
  return response.data;
};

/**
 * Delete menu item (Admin only)
 * @param id - Menu item ID
 * @returns Promise with success message
 */
export const deleteMenuItem = async (id: string): Promise<void> => {
  await api.delete(`/menu/${id}`);
};
