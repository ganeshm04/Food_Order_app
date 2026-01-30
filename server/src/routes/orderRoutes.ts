/**
 * Order Routes
 * 
 * This module defines routes for order operations.
 * 
 * @module routes/orderRoutes
 */

import { Router } from 'express';
import { orderController } from '../controllers';
import { authenticate, authorizeAdmin } from '../middleware';

const router = Router();

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private (User)
 */
router.post('/', authenticate, orderController.createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders for authenticated user
 * @access  Private (User)
 */
router.get('/', authenticate, orderController.getUserOrders);

/**
 * @route   GET /api/orders/all
 * @desc    Get all orders (Admin only)
 * @access  Private (Admin)
 */
router.get('/all', authenticate, authorizeAdmin, orderController.getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 */
router.get('/:id', authenticate, orderController.getOrderById);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/status', authenticate, authorizeAdmin, orderController.updateOrderStatus);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order (User only)
 * @access  Private (User)
 */
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

export default router;
