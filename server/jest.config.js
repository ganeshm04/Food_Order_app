/**
 * Jest Configuration for Food Delivery Server
 * 
 * This configuration sets up Jest for testing the Express.js backend.
 * It includes settings for TypeScript, test environment, and coverage.
 * 
 * @module jest.config
 */

module.exports = {
  // Use ts-jest for TypeScript files
  preset: 'ts-jest',

  // Set the test environment to Node.js
  testEnvironment: 'node',

  // Root directory for tests
  roots: ['<rootDir>/src'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/tests/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Transform TypeScript files
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Setup files to run after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**',
    '!src/server.ts',
    '!src/config/database.ts',
    '!src/utils/seedData.ts',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Coverage reports
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Maximum workers
  maxWorkers: '50%',

  // Test timeout (10 seconds)
  testTimeout: 10000,

  // Force exit after all tests complete
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true,
};
