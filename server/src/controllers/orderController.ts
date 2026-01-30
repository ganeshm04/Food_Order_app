/**
 * Order Controller
 * 
 * This module handles order operations including creating orders,
 * retrieving orders, and updating order status.
 * 
 * @module controllers/orderController
 */

import { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types';
import Order from '../models/Order';
import MenuItem from '../models/MenuItem';
import { validateOrderInput, validateOrderStatus } from '../utils/validation';
import { asyncHandler, ApiError } from '../middleware';

/**
 * Create new order
 * POST /api/orders
 * 
 * @route POST /api/orders
 * @access Private (User)
 */
export const createOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError('Not authenticated', 401);
  }

  const { items, deliveryDetails } = req.body;

  // Validate input
  const validation = validateOrderInput({ items, deliveryDetails });

  if (!validation.valid) {
    throw new ApiError('Validation failed', 400, validation.errors.map(e => `${e.field}: ${e.message}`));
  }

  // Validate that all menu items exist and are available
  const menuItemIds = items.map((item: { menuItemId: string }) => item.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

  if (menuItems.length !== items.length) {
    throw new ApiError('One or more menu items not found', 400);
  }

  // Check if all items are available
  const unavailableItems = menuItems.filter(item => !item.available);
  if (unavailableItems.length > 0) {
    throw new ApiError(
      `Some items are not available: ${unavailableItems.map(i => i.name).join(', ')}`,
      400
    );
  }

  // Enrich items with current prices and names from database
  const enrichedItems = items.map((item: { menuItemId: string; quantity: number }) => {
    const menuItem = menuItems.find(mi => mi._id.toString() === item.menuItemId);
    return {
      menuItemId: item.menuItemId,
      name: menuItem?.name || '',
      price: menuItem?.price || 0,
      quantity: item.quantity,
    };
  });

  // Calculate total amount
  const totalAmount = enrichedItems.reduce((sum: number, item: any) => {
    return sum + item.price * item.quantity;
  }, 0);
  const roundedTotalAmount = Math.round(totalAmount * 100) / 100;

  // Ensure total amount is greater than 0
  if (roundedTotalAmount <= 0) {
    throw new ApiError('Order total must be greater than 0', 400);
  }

  // Create order
  const order = await Order.create({
    userId: req.user.userId,
    items: enrichedItems,
    totalAmount: roundedTotalAmount,
    deliveryDetails: {
      name: deliveryDetails.name.trim(),
      address: deliveryDetails.address.trim(),
      phone: deliveryDetails.phone.trim(),
    },
    status: 'Order Received',
  });

  // Populate user data for response
  const populatedOrder = await Order.findById(order._id).populate('userId', 'name email');

  res.status(201).json({
    success: true,
    data: populatedOrder,
    message: 'Order placed successfully',
  });
});

/**
 * Get all orders for authenticated user
 * GET /api/orders
 * 
 * @route GET /api/orders
 * @access Private (User)
 */
export const getUserOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError('Not authenticated', 401);
  }

  const orders = await Order.find({ userId: req.user.userId })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: orders,
    count: orders.length,
  });
});

/**
 * Get single order by ID
 * GET /api/orders/:id
 * 
 * Users can only access their own orders
 * Admins can access any order
 * 
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError('Not authenticated', 401);
  }

  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Check if user owns the order or is admin
  if (order.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new ApiError('Access denied', 403);
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * Get all orders (Admin only)
 * GET /api/orders/all
 * 
 * @route GET /api/orders/all
 * @access Private (Admin)
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Build query based on filters
  const query: Record<string, unknown> = {};
  
  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by date range if provided
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      (query.createdAt as Record<string, Date>).$gte = new Date(req.query.startDate as string);
    }
    if (req.query.endDate) {
      (query.createdAt as Record<string, Date>).$lte = new Date(req.query.endDate as string);
    }
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');

  res.status(200).json({
    success: true,
    data: orders,
    count: orders.length,
  });
});

/**
 * Update order status (Admin only)
 * PUT /api/orders/:id/status
 * 
 * @route PUT /api/orders/:id/status
 * @access Private (Admin)
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validation = validateOrderStatus(status);

  if (!validation.valid) {
    throw new ApiError('Validation failed', 400, validation.errors.map(e => `${e.field}: ${e.message}`));
  }

  // Check if order exists
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Prevent updates to delivered or cancelled orders
  if (order.status === 'Delivered' || order.status === 'Cancelled') {
    throw new ApiError(`Cannot update status of ${order.status.toLowerCase()} orders`, 400);
  }

  // Update order status
  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order status updated successfully',
  });
});

/**
 * Cancel order (User can only cancel their own orders)
 * PUT /api/orders/:id/cancel
 * 
 * @route PUT /api/orders/:id/cancel
 * @access Private (User)
 */
export const cancelOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError('Not authenticated', 401);
  }

  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.userId.toString() !== req.user.userId) {
    throw new ApiError('Access denied', 403);
  }

  // Can only cancel orders that are not yet delivered
  if (order.status === 'Delivered') {
    throw new ApiError('Cannot cancel delivered orders', 400);
  }

  if (order.status === 'Cancelled') {
    throw new ApiError('Order is already cancelled', 400);
  }

  // Update order status to cancelled
  order.status = 'Cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order cancelled successfully',
  });
});
