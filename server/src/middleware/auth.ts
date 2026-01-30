/**
 * Authentication Middleware
 * 
 * This module provides Express middleware for authentication and authorization.
 * Includes JWT verification and role-based access control.
 * 
 * @module middleware/auth
 */

import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import type { AuthenticatedRequest } from '../types';
import UserModel from '../models/User';

/**
 * Middleware to verify JWT token and attach user to request
 * Must be used after this middleware to access req.user
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Find user in database
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found.',
      });
      return;
    }

    // Attach user to request object
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: 'Invalid token.',
      });
      return;
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication.',
    });
  }
};

/**
 * Middleware to restrict access to admin users only
 * Must be used after authenticate middleware
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Access denied. Please authenticate.',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.',
    });
    return;
  }

  next();
};
