/**
 * Validation Utilities
 * 
 * This module provides TypeScript-based validation functions for user input.
 * Replaces Zod with pure TypeScript validation for better control.
 * 
 * @module utils/validation
 */

import { ValidationResult, ValidationError, UserRole, OrderStatus } from '../types';

/**
 * Validates an email address format
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number format
 * @param phone - Phone number to validate
 * @returns boolean indicating if phone is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns boolean indicating if password meets requirements
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates user registration input
 * @param data - Registration data to validate
 * @param adminSecretCode - Secret code required for admin registration
 * @returns ValidationResult with valid status and any errors
 */
export const validateRegisterInput = (
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    adminSecretCode?: string;
  },
  adminSecretCode: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (data.name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Validate password
  if (!data.password || data.password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!isValidPassword(data.password)) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  // Validate role
  if (!data.role) {
    errors.push({ field: 'role', message: 'Role is required' });
  } else if (!['user', 'admin'].includes(data.role)) {
    errors.push({ field: 'role', message: 'Role must be either user or admin' });
  }

  // Validate admin secret code for admin registration
  if (data.role === 'admin') {
    if (!data.adminSecretCode || data.adminSecretCode.trim().length === 0) {
      errors.push({ field: 'adminSecretCode', message: 'Admin secret code is required for admin registration' });
    } else if (data.adminSecretCode !== adminSecretCode) {
      errors.push({ field: 'adminSecretCode', message: 'Invalid admin secret code' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates login input
 * @param data - Login data to validate
 * @returns ValidationResult with valid status and any errors
 */
export const validateLoginInput = (data: {
  email?: string;
  password?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Validate password
  if (!data.password || data.password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates menu item creation/update input
 * @param data - Menu item data to validate
 * @returns ValidationResult with valid status and any errors
 */
export const validateMenuItemInput = (data: {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  available?: boolean;
}): ValidationResult => {
  const errors: ValidationError[] = [];
  const validCategories = ['Pizza', 'Burgers', 'Pasta', 'Sides', 'Drinks', 'Desserts'];

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Item name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name cannot exceed 100 characters' });
  }

  // Validate description
  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long' });
  } else if (data.description.trim().length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  // Validate price
  if (data.price === undefined || data.price === null) {
    errors.push({ field: 'price', message: 'Price is required' });
  } else if (typeof data.price !== 'number') {
    errors.push({ field: 'price', message: 'Price must be a number' });
  } else if (data.price < 0) {
    errors.push({ field: 'price', message: 'Price cannot be negative' });
  } else if (!/^\d+(\.\d{1,2})?$/.test(data.price.toString())) {
    errors.push({ field: 'price', message: 'Price must have at most 2 decimal places' });
  }

  // Validate image
  if (!data.image || data.image.trim().length === 0) {
    errors.push({ field: 'image', message: 'Image URL is required' });
  }

  // Validate category
  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!validCategories.includes(data.category)) {
    errors.push({ field: 'category', message: `Category must be one of: ${validCategories.join(', ')}` });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates order creation input
 * @param data - Order data to validate
 * @returns ValidationResult with valid status and any errors
 */
export const validateOrderInput = (data: {
  items?: Array<{ menuItemId: string; name: string; price: number; quantity: number }>;
  deliveryDetails?: { name: string; address: string; phone: string };
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate items
  if (!data.items || !Array.isArray(data.items)) {
    errors.push({ field: 'items', message: 'Order items are required' });
  } else if (data.items.length === 0) {
    errors.push({ field: 'items', message: 'Order must contain at least one item' });
  } else {
    data.items.forEach((item, index) => {
      if (!item.menuItemId) {
        errors.push({ field: `items[${index}].menuItemId`, message: 'Menu item ID is required' });
      }
      if (!item.name) {
        errors.push({ field: `items[${index}].name`, message: 'Item name is required' });
      }
      if (item.price === undefined || item.price === null) {
        errors.push({ field: `items[${index}].price`, message: 'Item price is required' });
      } else if (item.price < 0) {
        errors.push({ field: `items[${index}].price`, message: 'Price cannot be negative' });
      }
      if (item.quantity === undefined || item.quantity === null) {
        errors.push({ field: `items[${index}].quantity`, message: 'Quantity is required' });
      } else if (item.quantity < 1) {
        errors.push({ field: `items[${index}].quantity`, message: 'Quantity must be at least 1' });
      } else if (!Number.isInteger(item.quantity)) {
        errors.push({ field: `items[${index}].quantity`, message: 'Quantity must be a whole number' });
      }
    });
  }

  // Validate delivery details
  if (!data.deliveryDetails) {
    errors.push({ field: 'deliveryDetails', message: 'Delivery details are required' });
  } else {
    // Validate name
    if (!data.deliveryDetails.name || data.deliveryDetails.name.trim().length === 0) {
      errors.push({ field: 'deliveryDetails.name', message: 'Delivery name is required' });
    } else if (data.deliveryDetails.name.trim().length < 2) {
      errors.push({ field: 'deliveryDetails.name', message: 'Name must be at least 2 characters long' });
    } else if (data.deliveryDetails.name.trim().length > 50) {
      errors.push({ field: 'deliveryDetails.name', message: 'Name cannot exceed 50 characters' });
    }

    // Validate address
    if (!data.deliveryDetails.address || data.deliveryDetails.address.trim().length === 0) {
      errors.push({ field: 'deliveryDetails.address', message: 'Delivery address is required' });
    } else if (data.deliveryDetails.address.trim().length < 10) {
      errors.push({ field: 'deliveryDetails.address', message: 'Address must be at least 10 characters long' });
    } else if (data.deliveryDetails.address.trim().length > 200) {
      errors.push({ field: 'deliveryDetails.address', message: 'Address cannot exceed 200 characters' });
    }

    // Validate phone
    if (!data.deliveryDetails.phone || data.deliveryDetails.phone.trim().length === 0) {
      errors.push({ field: 'deliveryDetails.phone', message: 'Phone number is required' });
    } else if (!isValidPhone(data.deliveryDetails.phone)) {
      errors.push({ field: 'deliveryDetails.phone', message: 'Please enter a valid phone number' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates order status update
 * @param status - Status to validate
 * @returns ValidationResult with valid status and any errors
 */
export const validateOrderStatus = (status: string): ValidationResult => {
  const errors: ValidationError[] = [];
  const validStatuses: OrderStatus[] = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!status) {
    errors.push({ field: 'status', message: 'Status is required' });
  } else if (!validStatuses.includes(status as OrderStatus)) {
    errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
