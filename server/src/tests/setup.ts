/**
 * Jest Test Setup
 * 
 * This file is executed before each test file.
 * It sets up the test environment, mocks, and database connections.
 * 
 * @module tests/setup
 */

import { config } from 'dotenv';

// Load environment variables from .env.test file if it exists
config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRE = '1h';
process.env.MONGODB_URI = 'mongodb://localhost:27017/food-delivery-test';
process.env.ADMIN_SECRET_CODE = 'test-admin-code';

// Mock console methods during tests to reduce noise
// but keep errors visible
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;

beforeAll(() => {
  // Silence console logs during tests
  console.log = jest.fn();
  console.info = jest.fn();
});

afterAll(() => {
  // Restore console methods
  console.log = originalConsoleLog;
  console.info = originalConsoleInfo;
});

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(async () => {
  // Clear all mocks
  jest.clearAllMocks();
});
