/**
 * Vercel Serverless Function Entry Point
 * 
 * This file serves as the entry point for Vercel serverless functions.
 * It imports and exports the Express app configured for serverless deployment.
 * 
 * @module api/index
 */

import app from '../server/src/server';

// Export the Express app for Vercel serverless
export default app;
