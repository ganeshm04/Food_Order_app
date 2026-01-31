/**
 * Food Delivery Order Management System - Main Server File
 * 
 * This is the entry point for the Express.js backend server.
 * It initializes the application, connects to the database,
 * sets up middleware, and starts the HTTP server.
 * 
 * @module server
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
// Must be loaded before other imports that use process.env
dotenv.config();

// Import database connection
import { connectDatabase } from './config/database';

// Import routes
import routes from './routes';

// Import middleware
import { errorHandler, notFound } from './middleware';

// Import models and seed data utility
import MenuItem from './models/MenuItem';
import { sampleMenuItems } from './utils/seedData';

/**
 * Initialize Express application
 */
const app: Application = express();

/**
 * Server port from environment variables or default to 5000
 */
const PORT = process.env.PORT || 5000;

/**
 * Configure middleware
 */

// Enable CORS for all origins (configure for production)
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 * All routes are prefixed with /api
 */
app.use('/api', routes);

/**
 * Health check endpoint
 * Used to verify server is running
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Root endpoint
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Food Delivery Order Management API',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
app.use(notFound);

/**
 * Global error handler
 * Catches all errors and returns formatted response
 */
app.use(errorHandler);

/**
 * Seed database with sample menu items
 * Only runs if no menu items exist and SEED_DATABASE env is set
 */
const seedDatabase = async (): Promise<void> => {
  try {
    // Only seed if explicitly enabled via environment variable
    if (process.env.SEED_DATABASE !== 'true') {
      return;
    }

    const count = await MenuItem.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding database with sample menu items...');
      await MenuItem.insertMany(sampleMenuItems);
      console.log('✅ Database seeded successfully');
    } else {
      console.log('ℹ️ Database already contains menu items, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

/**
 * Start server
 * Connects to database and starts listening for requests
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Seed database with sample data
    await seedDatabase();
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api`);
      console.log(`💚 Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server (only if not in Vercel serverless environment)
if (process.env.VERCEL !== '1') {
  startServer();
}

// Export app for Vercel serverless functions
export default app;
