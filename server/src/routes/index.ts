/**
 * Routes Index
 * 
 * This module exports all route modules for easy importing.
 * Centralizes route access throughout the application.
 * 
 * @module routes
 */

import { Router } from 'express';
import authRoutes from './authRoutes';
import menuRoutes from './menuRoutes';
import orderRoutes from './orderRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);

export default router;
