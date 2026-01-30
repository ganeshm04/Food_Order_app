/**
 * Test Helpers
 * 
 * This module provides utility functions and mock data for testing.
 * It includes helper functions for creating test data and mocking dependencies.
 * 
 * @module tests/utils/testHelpers
 */

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

// ============================================
// Mock Data Factories
// ============================================

/**
 * Creates a mock MongoDB ObjectId
 */
export const createMockObjectId = (): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId();
};

/**
 * Creates a mock user for testing
 */
export const createMockUser = (overrides: Partial<any> = {}) => ({
  _id: createMockObjectId(),
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword123',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Creates a mock admin user for testing
 */
export const createMockAdmin = (overrides: Partial<any> = {}) =>
  createMockUser({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    ...overrides,
  });

/**
 * Creates a mock menu item for testing
 */
export const createMockMenuItem = (overrides: Partial<any> = {}) => ({
  _id: createMockObjectId(),
  name: 'Test Pizza',
  description: 'A delicious test pizza with cheese and toppings',
  price: 12.99,
  image: 'https://example.com/pizza.jpg',
  category: 'Pizza',
  available: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Creates a mock order item for testing
 */
export const createMockOrderItem = (overrides: Partial<any> = {}) => ({
  menuItemId: createMockObjectId().toString(),
  name: 'Test Pizza',
  price: 12.99,
  quantity: 2,
  ...overrides,
});

/**
 * Creates mock delivery details for testing
 */
export const createMockDeliveryDetails = (overrides: Partial<any> = {}) => ({
  name: 'John Doe',
  address: '123 Test Street, Test City, 12345',
  phone: '+1 234-567-8900',
  ...overrides,
});

/**
 * Creates a mock order for testing
 */
export const createMockOrder = (overrides: Partial<any> = {}) => {
  const userId = createMockObjectId();
  const items = [createMockOrderItem()];
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    _id: createMockObjectId(),
    userId,
    items,
    totalAmount,
    deliveryDetails: createMockDeliveryDetails(),
    status: 'Order Received',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

// ============================================
// JWT Token Helpers
// ============================================

/**
 * Generates a valid JWT token for testing
 */
export const generateTestToken = (userId: string, role: string = 'user'): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'test-jwt-secret',
    { expiresIn: '1h' }
  );
};

/**
 * Generates an expired JWT token for testing
 */
export const generateExpiredToken = (userId: string, role: string = 'user'): string => {
  return jwt.sign(
    { userId, role, exp: Math.floor(Date.now() / 1000) - 3600 },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );
};

/**
 * Generates an invalid JWT token for testing
 */
export const generateInvalidToken = (): string => {
  return 'invalid.token.here';
};

// ============================================
// Express Mock Helpers
// ============================================

/**
 * Creates a mock Express request object
 */
export const createMockRequest = (overrides: Partial<any> = {}): any => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: undefined,
  ...overrides,
});

/**
 * Creates a mock Express response object
 */
export const createMockResponse = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Creates a mock next function
 */
export const createMockNext = (): any => jest.fn();

// ============================================
// Validation Test Helpers
// ============================================

/**
 * Creates test cases for required field validation
 */
export const createRequiredFieldTests = (
  fieldName: string,
  validValue: any,
  testFn: (value: any) => any
) => {
  return [
    {
      description: `should fail when ${fieldName} is undefined`,
      value: undefined,
      expectedValid: false,
    },
    {
      description: `should fail when ${fieldName} is null`,
      value: null,
      expectedValid: false,
    },
    {
      description: `should fail when ${fieldName} is empty string`,
      value: '',
      expectedValid: false,
    },
    {
      description: `should pass when ${fieldName} is valid`,
      value: validValue,
      expectedValid: true,
    },
  ];
};

// ============================================
// Async Test Helpers
// ============================================

/**
 * Helper to test async functions that should throw errors
 */
export const expectAsyncToThrow = async (
  fn: () => Promise<any>,
  expectedErrorMessage?: string
) => {
  try {
    await fn();
    fail('Expected function to throw an error');
  } catch (error: any) {
    if (expectedErrorMessage) {
      expect(error.message).toContain(expectedErrorMessage);
    }
  }
};

/**
 * Helper to wait for a specified duration
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
