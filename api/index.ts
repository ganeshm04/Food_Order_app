/**
 * Vercel Serverless Function Entry Point
 * 
 * This file serves as the entry point for Vercel serverless functions.
 * It imports the Express app and wraps it for serverless deployment.
 * 
 * @module api/index
 */

import app from '../server/src/server';

// Export the Express app directly for Vercel serverless
// Vercel will handle the request/response wrapping
export default app;
