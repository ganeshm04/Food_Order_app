/**
 * Authentication Routes
 * 
 * This module defines routes for authentication operations.
 * 
 * @module routes/authRoutes
 */

import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate } from '../middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticate, (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
