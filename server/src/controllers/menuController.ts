/**
 * Menu Controller
 * 
 * This module handles menu item operations including CRUD operations
 * for food items in the restaurant menu.
 * 
 * @module controllers/menuController
 */

import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';
import { validateMenuItemInput } from '../utils/validation';
import { asyncHandler, ApiError } from '../middleware';

/**
 * Get all menu items
 * GET /api/menu
 * 
 * Supports filtering by category and availability
 * 
 * @route GET /api/menu
 * @access Public
 */
export const getAllMenuItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Build query based on filters
  const query: any = {};
  
  // Filter by category if provided
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Filter by availability (default to only available items for public)
  if (req.query.available === 'false') {
    query.available = false;
  } else if (req.query.available === 'all') {
    // Don't filter by availability
  } else {
    query.available = true;
  }

  // Fetch menu items
  const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

  // Return just the array, not wrapped in an object
  res.status(200).json(menuItems);
});

/**
 * Get single menu item by ID
 * GET /api/menu/:id
 * 
 * @route GET /api/menu/:id
 * @access Public
 */
export const getMenuItemById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const menuItem = await MenuItem.findById(id);

  if (!menuItem) {
    throw new ApiError('Menu item not found', 404);
  }

  res.status(200).json({
    success: true,
    data: menuItem,
  });
});

/**
 * Create new menu item (Admin only)
 * POST /api/menu
 * 
 * @route POST /api/menu
 * @access Private (Admin)
 */
export const createMenuItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, image, category, available } = req.body;

  // Validate input
  const validation = validateMenuItemInput({
    name,
    description,
    price,
    image,
    category,
    available,
  });

  if (!validation.valid) {
    throw new ApiError('Validation failed', 400, validation.errors.map(e => `${e.field}: ${e.message}`));
  }

  // Create menu item
  const menuItem = await MenuItem.create({
    name: name.trim(),
    description: description.trim(),
    price,
    image: image.trim(),
    category,
    available: available !== undefined ? available : true,
  });

  res.status(201).json({
    success: true,
    data: menuItem,
    message: 'Menu item created successfully',
  });
});

/**
 * Update menu item (Admin only)
 * PUT /api/menu/:id
 * 
 * @route PUT /api/menu/:id
 * @access Private (Admin)
 */
export const updateMenuItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, price, image, category, available } = req.body;

  // Check if menu item exists
  const existingItem = await MenuItem.findById(id);
  if (!existingItem) {
    throw new ApiError('Menu item not found', 404);
  }

  // Validate input if any fields are provided
  if (name || description || price !== undefined || image || category) {
    const validation = validateMenuItemInput({
      name: name || existingItem.name,
      description: description || existingItem.description,
      price: price !== undefined ? price : existingItem.price,
      image: image || existingItem.image,
      category: category || existingItem.category,
      available: available !== undefined ? available : existingItem.available,
    });

    if (!validation.valid) {
      throw new ApiError('Validation failed', 400, validation.errors.map(e => `${e.field}: ${e.message}`));
    }
  }

  // Update menu item
  const updatedItem = await MenuItem.findByIdAndUpdate(
    id,
    {
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      ...(price !== undefined && { price }),
      ...(image && { image: image.trim() }),
      ...(category && { category }),
      ...(available !== undefined && { available }),
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedItem,
    message: 'Menu item updated successfully',
  });
});

/**
 * Delete menu item (Admin only)
 * DELETE /api/menu/:id
 * 
 * @route DELETE /api/menu/:id
 * @access Private (Admin)
 */
export const deleteMenuItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Check if menu item exists
  const menuItem = await MenuItem.findById(id);
  if (!menuItem) {
    throw new ApiError('Menu item not found', 404);
  }

  // Delete menu item
  await MenuItem.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Menu item deleted successfully',
  });
});

/**
 * Get all menu categories
 * GET /api/menu/categories/all
 * 
 * @route GET /api/menu/categories/all
 * @access Public
 */
export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await MenuItem.distinct('category');

  // Return just the array, not wrapped in an object
  res.status(200).json(categories);
});
