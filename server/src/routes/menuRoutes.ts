/**
 * Menu Routes
 * 
 * This module defines routes for menu item operations.
 * 
 * @module routes/menuRoutes
 */

import { Router } from 'express';
import { menuController } from '../controllers';
import { authenticate, authorizeAdmin } from '../middleware';

const router = Router();

/**
 * @route   GET /api/menu
 * @desc    Get all menu items
 * @access  Public
 */
router.get('/', menuController.getAllMenuItems);

/**
 * @route   GET /api/menu/categories
 * @desc    Get all menu categories
 * @access  Public
 */
router.get('/categories', menuController.getCategories);

/**
 * @route   GET /api/menu/:id
 * @desc    Get single menu item by ID
 * @access  Public
 */
router.get('/:id', menuController.getMenuItemById);

/**
 * @route   POST /api/menu
 * @desc    Create new menu item
 * @access  Private (Admin)
 */
router.post('/', authenticate, authorizeAdmin, menuController.createMenuItem);

/**
 * @route   PUT /api/menu/:id
 * @desc    Update menu item
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, authorizeAdmin, menuController.updateMenuItem);

/**
 * @route   DELETE /api/menu/:id
 * @desc    Delete menu item
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, authorizeAdmin, menuController.deleteMenuItem);

export default router;
