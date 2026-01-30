/**
 * Error Handling Middleware
 * 
 * This module provides centralized error handling for the Express application.
 * Catches all errors and returns consistent error responses.
 * 
 * @module middleware/errorHandler
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Custom API Error class
 * Extends Error with status code and additional details
 */
export class ApiError extends Error {
  statusCode: number;
  details?: string[];

  constructor(message: string, statusCode: number = 500, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: string;
  details?: string[];
  stack?: string;
}

/**
 * Global error handling middleware
 * Catches all errors and returns formatted error response
 * 
 * @param err - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: string[] | undefined;

  // Handle specific error types
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    details = Object.values((err as any).errors).map((e: any) => e.message);
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate entry';
    const field = Object.keys((err as any).keyValue)[0];
    details = [`${field} already exists`];
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: message,
  };

  // Add details if available
  if (details && details.length > 0) {
    errorResponse.details = details;
  }

  // Add stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Log error for debugging
  console.error(`[Error] ${statusCode}: ${message}`, {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack,
  });

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found middleware
 * Handles requests to undefined routes
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors automatically
 * Eliminates need for try-catch in every route
 * 
 * @param fn - Async function to wrap
 * @returns Wrapped function that catches errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
