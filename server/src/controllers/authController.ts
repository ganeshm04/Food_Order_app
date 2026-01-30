/**
 * Authentication Controller
 * 
 * This module handles user authentication operations including registration,
 * login, and retrieving current user information.
 * 
 * @module controllers/authController
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import User from '../models/User';
import { generateToken, JWTPayload } from '../utils/jwt';
import { validateRegisterInput, validateLoginInput } from '../utils/validation';
import { asyncHandler, ApiError } from '../middleware';

/**
 * Admin secret code from environment variables
 * Required for admin user registration
 */
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || '123456';

/**
 * Register a new user
 * POST /api/auth/register
 * 
 * @route POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, email, password, role, adminSecretCode } = req.body;

  // Validate input
  const validation = validateRegisterInput(
    { name, email, password, role, adminSecretCode },
    ADMIN_SECRET_CODE
  );

  if (!validation.valid) {
    throw new ApiError('Validation failed', 400, validation.errors.map(e => `${e.field}: ${e.message}`));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError('User already exists with this email', 409);
  }

  // Create new user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: role || 'user',
  });

  // Generate JWT token
  const tokenPayload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const token = generateToken(tokenPayload);

  // Return user data and token
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    },
    message: 'User registered successfully',
  });
});

/**
 * Login existing user
 * POST /api/auth/login
 * 
 * @route POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate input
  const validation = validateLoginInput({ email, password });

  if (!validation.valid) {
    throw new ApiError('Validation failed', 400, validation.errors.map(e => `${e.field}: ${e.message}`));
  }

  // Find user by email and include password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Compare passwords
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Generate JWT token
  const tokenPayload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const token = generateToken(tokenPayload);

  // Return user data and token
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    },
    message: 'Login successful',
  });
});

/**
 * Get current authenticated user
 * GET /api/auth/me
 * 
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError('Not authenticated', 401);
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});
