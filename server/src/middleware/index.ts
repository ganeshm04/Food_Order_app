/**
 * Middleware Index
 * 
 * This module exports all Express middleware for easy importing.
 * Centralizes middleware access throughout the application.
 * 
 * @module middleware
 */

export { authenticate, authorizeAdmin } from './auth';
export { errorHandler, notFound, asyncHandler, ApiError } from './errorHandler';
