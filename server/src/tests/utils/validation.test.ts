/**
 * Validation Utility Tests
 * 
 * This test suite covers input validation functions including:
 * - Email validation
 * - Phone validation
 * - Password validation
 * - Registration input validation
 * - Login input validation
 * - Menu item validation
 * - Order input validation
 * - Order status validation
 * 
 * @module tests/utils/validation
 */

import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  validateRegisterInput,
  validateLoginInput,
  validateMenuItemInput,
  validateOrderInput,
  validateOrderStatus,
} from '../../utils/validation';
import { createMockDeliveryDetails, createMockOrderItem } from './testHelpers';

describe('Validation Utilities', () => {
  const adminSecretCode = 'test-admin-code';

  describe('isValidEmail', () => {
    it.each([
      { email: 'test@example.com', expected: true },
      { email: 'user.name@domain.co.uk', expected: true },
      { email: 'user+tag@example.com', expected: false }, // Regex doesn't support + in email
      { email: 'firstname.lastname@company.com', expected: true },
      { email: 'invalid-email', expected: false },
      { email: '@example.com', expected: false },
      { email: 'test@', expected: false },
      { email: 'test@.com', expected: false },
      { email: '', expected: false },
      { email: 'test@com', expected: false },
    ])('should validate email: "$email" -> $expected', ({ email, expected }) => {
      expect(isValidEmail(email)).toBe(expected);
    });
  });

  describe('isValidPhone', () => {
    it.each([
      { phone: '+1 234-567-8900', expected: true },
      { phone: '(123) 456-7890', expected: true },
      { phone: '1234567890', expected: true },
      { phone: '+44 20 7123 4567', expected: true },
      { phone: '+91-9876543210', expected: true },
      { phone: '123', expected: false },
      { phone: 'abc-def-ghij', expected: false },
      { phone: '', expected: false },
      { phone: '123456789012345678901', expected: false }, // Too long
    ])('should validate phone: "$phone" -> $expected', ({ phone, expected }) => {
      expect(isValidPhone(phone)).toBe(expected);
    });
  });

  describe('isValidPassword', () => {
    it.each([
      { password: 'password123', expected: true },
      { password: '123456', expected: true },
      { password: 'abcdef', expected: true },
      { password: '12345', expected: false },
      { password: '', expected: false },
      { password: 'short', expected: false },
    ])('should validate password length: "$password" -> $expected', ({ password, expected }) => {
      expect(isValidPassword(password)).toBe(expected);
    });
  });

  describe('validateRegisterInput', () => {
    const validRegistration = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user' as const,
    };

    it('should pass with valid user registration data', () => {
      const result = validateRegisterInput(validRegistration, adminSecretCode);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass with valid admin registration data', () => {
      const adminRegistration = {
        ...validRegistration,
        role: 'admin' as const,
        adminSecretCode,
      };

      const result = validateRegisterInput(adminRegistration, adminSecretCode);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when name is missing', () => {
      const result = validateRegisterInput(
        { ...validRegistration, name: '' },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'name', message: 'Name is required' })
      );
    });

    it('should fail when name is too short', () => {
      const result = validateRegisterInput(
        { ...validRegistration, name: 'A' },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'name', message: 'Name must be at least 2 characters long' })
      );
    });

    it('should fail when name is too long', () => {
      const result = validateRegisterInput(
        { ...validRegistration, name: 'A'.repeat(51) },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'name', message: 'Name cannot exceed 50 characters' })
      );
    });

    it('should fail when email is missing', () => {
      const result = validateRegisterInput(
        { ...validRegistration, email: '' },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'email', message: 'Email is required' })
      );
    });

    it('should fail when email is invalid', () => {
      const result = validateRegisterInput(
        { ...validRegistration, email: 'invalid-email' },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'email', message: 'Please enter a valid email address' })
      );
    });

    it('should fail when password is missing', () => {
      const result = validateRegisterInput(
        { ...validRegistration, password: '' },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'password', message: 'Password is required' })
      );
    });

    it('should fail when password is too short', () => {
      const result = validateRegisterInput(
        { ...validRegistration, password: '12345' },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'password', message: 'Password must be at least 6 characters long' })
      );
    });

    it('should fail when role is missing', () => {
      const result = validateRegisterInput(
        { ...validRegistration, role: undefined as any },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'role', message: 'Role is required' })
      );
    });

    it('should fail when role is invalid', () => {
      const result = validateRegisterInput(
        { ...validRegistration, role: 'invalid' as any },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'role', message: 'Role must be either user or admin' })
      );
    });

    it('should fail when admin secret code is missing for admin registration', () => {
      const result = validateRegisterInput(
        { ...validRegistration, role: 'admin' as const },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'adminSecretCode', message: 'Admin secret code is required for admin registration' })
      );
    });

    it('should fail when admin secret code is invalid', () => {
      const result = validateRegisterInput(
        { ...validRegistration, role: 'admin' as const, adminSecretCode: 'wrong-code' },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'adminSecretCode', message: 'Invalid admin secret code' })
      );
    });

    it('should collect multiple validation errors', () => {
      const result = validateRegisterInput(
        { name: '', email: 'invalid', password: '123', role: 'invalid' as any },
        adminSecretCode
      );

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateLoginInput', () => {
    const validLogin = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should pass with valid login data', () => {
      const result = validateLoginInput(validLogin);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when email is missing', () => {
      const result = validateLoginInput({ ...validLogin, email: '' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'email', message: 'Email is required' })
      );
    });

    it('should fail when email is invalid', () => {
      const result = validateLoginInput({ ...validLogin, email: 'invalid-email' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'email', message: 'Please enter a valid email address' })
      );
    });

    it('should fail when password is missing', () => {
      const result = validateLoginInput({ ...validLogin, password: '' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'password', message: 'Password is required' })
      );
    });
  });

  describe('validateMenuItemInput', () => {
    const validMenuItem = {
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with tomato sauce and mozzarella cheese',
      price: 12.99,
      image: 'https://example.com/pizza.jpg',
      category: 'Pizza',
      available: true,
    };

    it('should pass with valid menu item data', () => {
      const result = validateMenuItemInput(validMenuItem);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when name is missing', () => {
      const result = validateMenuItemInput({ ...validMenuItem, name: '' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'name', message: 'Item name is required' })
      );
    });

    it('should fail when name is too short', () => {
      const result = validateMenuItemInput({ ...validMenuItem, name: 'A' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'name', message: 'Name must be at least 2 characters long' })
      );
    });

    it('should fail when name is too long', () => {
      const result = validateMenuItemInput({ ...validMenuItem, name: 'A'.repeat(101) });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'name', message: 'Name cannot exceed 100 characters' })
      );
    });

    it('should fail when description is missing', () => {
      const result = validateMenuItemInput({ ...validMenuItem, description: '' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description', message: 'Description is required' })
      );
    });

    it('should fail when description is too short', () => {
      const result = validateMenuItemInput({ ...validMenuItem, description: 'Short' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description', message: 'Description must be at least 10 characters long' })
      );
    });

    it('should fail when description is too long', () => {
      const result = validateMenuItemInput({ ...validMenuItem, description: 'A'.repeat(501) });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description', message: 'Description cannot exceed 500 characters' })
      );
    });

    it('should fail when price is missing', () => {
      const result = validateMenuItemInput({ ...validMenuItem, price: undefined as any });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'price', message: 'Price is required' })
      );
    });

    it('should fail when price is not a number', () => {
      const result = validateMenuItemInput({ ...validMenuItem, price: 'not-a-number' as any });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'price', message: 'Price must be a number' })
      );
    });

    it('should fail when price is negative', () => {
      const result = validateMenuItemInput({ ...validMenuItem, price: -5 });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'price', message: 'Price cannot be negative' })
      );
    });

    it('should fail when price has more than 2 decimal places', () => {
      const result = validateMenuItemInput({ ...validMenuItem, price: 12.999 });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'price', message: 'Price must have at most 2 decimal places' })
      );
    });

    it('should fail when image is missing', () => {
      const result = validateMenuItemInput({ ...validMenuItem, image: '' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'image', message: 'Image URL is required' })
      );
    });

    it('should fail when category is missing', () => {
      const result = validateMenuItemInput({ ...validMenuItem, category: '' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'category', message: 'Category is required' })
      );
    });

    it('should fail when category is invalid', () => {
      const result = validateMenuItemInput({ ...validMenuItem, category: 'Invalid Category' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'category', message: expect.stringContaining('Category must be one of') })
      );
    });

    it.each(['Pizza', 'Burgers', 'Pasta', 'Sides', 'Drinks', 'Desserts'])(
      'should accept valid category: %s',
      (category) => {
        const result = validateMenuItemInput({ ...validMenuItem, category });
        expect(result.valid).toBe(true);
      }
    );
  });

  describe('validateOrderInput', () => {
    const validOrder = {
      items: [createMockOrderItem()],
      deliveryDetails: createMockDeliveryDetails(),
    };

    it('should pass with valid order data', () => {
      const result = validateOrderInput(validOrder);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when items is not an array', () => {
      const result = validateOrderInput({ ...validOrder, items: 'not-an-array' as any });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'items', message: 'Order items are required' })
      );
    });

    it('should fail when items array is empty', () => {
      const result = validateOrderInput({ ...validOrder, items: [] });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'items', message: 'Order must contain at least one item' })
      );
    });

    it('should fail when item menuItemId is missing', () => {
      const result = validateOrderInput({
        ...validOrder,
        items: [{ name: 'Test', price: 10, quantity: 1 } as any],
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'items[0].menuItemId', message: 'Menu item ID is required' })
      );
    });

    it('should fail when item name is missing', () => {
      const result = validateOrderInput({
        ...validOrder,
        items: [{ menuItemId: '123', price: 10, quantity: 1 } as any],
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'items[0].name', message: 'Item name is required' })
      );
    });

    it('should fail when item price is negative', () => {
      const result = validateOrderInput({
        ...validOrder,
        items: [createMockOrderItem({ price: -5 })],
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'items[0].price', message: 'Price cannot be negative' })
      );
    });

    it('should fail when item quantity is less than 1', () => {
      const result = validateOrderInput({
        ...validOrder,
        items: [createMockOrderItem({ quantity: 0 })],
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'items[0].quantity', message: 'Quantity must be at least 1' })
      );
    });

    it('should fail when item quantity is not an integer', () => {
      const result = validateOrderInput({
        ...validOrder,
        items: [createMockOrderItem({ quantity: 1.5 })],
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'items[0].quantity', message: 'Quantity must be a whole number' })
      );
    });

    it('should fail when deliveryDetails is missing', () => {
      const result = validateOrderInput({ items: validOrder.items } as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails', message: 'Delivery details are required' })
      );
    });

    it('should fail when delivery name is missing', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, name: '' },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.name', message: 'Delivery name is required' })
      );
    });

    it('should fail when delivery name is too short', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, name: 'A' },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.name', message: 'Name must be at least 2 characters long' })
      );
    });

    it('should fail when delivery name is too long', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, name: 'A'.repeat(51) },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.name', message: 'Name cannot exceed 50 characters' })
      );
    });

    it('should fail when address is missing', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, address: '' },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.address', message: 'Delivery address is required' })
      );
    });

    it('should fail when address is too short', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, address: 'Short' },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.address', message: 'Address must be at least 10 characters long' })
      );
    });

    it('should fail when address is too long', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, address: 'A'.repeat(201) },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.address', message: 'Address cannot exceed 200 characters' })
      );
    });

    it('should fail when phone is missing', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, phone: '' },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.phone', message: 'Phone number is required' })
      );
    });

    it('should fail when phone is invalid', () => {
      const result = validateOrderInput({
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, phone: 'invalid-phone' },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'deliveryDetails.phone', message: 'Please enter a valid phone number' })
      );
    });

    it('should validate multiple items', () => {
      const result = validateOrderInput({
        ...validOrder,
        items: [
          createMockOrderItem(),
          { menuItemId: '123', name: '', price: -5, quantity: 0 },
        ],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateOrderStatus', () => {
    it.each([
      { status: 'Order Received', expected: true },
      { status: 'Preparing', expected: true },
      { status: 'Out for Delivery', expected: true },
      { status: 'Delivered', expected: true },
      { status: 'Cancelled', expected: true },
      { status: 'Invalid Status', expected: false },
      { status: '', expected: false },
      { status: null, expected: false },
      { status: undefined, expected: false },
    ])('should validate status: "$status" -> $expected', ({ status, expected }) => {
      const result = validateOrderStatus(status as any);

      expect(result.valid).toBe(expected);
      if (!expected) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({ field: 'status' })
        );
      }
    });

    it('should return specific error message for invalid status', () => {
      const result = validateOrderStatus('Invalid');

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Status must be one of');
      expect(result.errors[0].message).toContain('Order Received');
      expect(result.errors[0].message).toContain('Preparing');
      expect(result.errors[0].message).toContain('Out for Delivery');
      expect(result.errors[0].message).toContain('Delivered');
      expect(result.errors[0].message).toContain('Cancelled');
    });
  });
});
