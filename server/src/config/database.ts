/**
 * Database Configuration Module
 * 
 * This module handles MongoDB connection setup and configuration.
 * It provides a centralized way to connect to the database with proper
 * error handling and connection event listeners.
 * 
 * @module config/database
 */

import mongoose from 'mongoose';

/**
 * MongoDB connection URI from environment variables
 * Falls back to local MongoDB instance if not provided
 */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

/**
 * Establishes connection to MongoDB database
 * 
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} If connection fails
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // Configure mongoose connection options
    const options = {
      // These options are no longer needed in Mongoose 6+, but kept for clarity
      // autoIndex: true, // Build indexes automatically
    };

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);

    console.log('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    // Exit process with failure code
    process.exit(1);
  }
};

/**
 * Closes the MongoDB connection
 * Useful for graceful shutdown and testing
 * 
 * @returns {Promise<void>}
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

export default connectDatabase;
