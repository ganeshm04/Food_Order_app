/**
 * JWT Utility Module
 * 
 * This module provides utility functions for JWT token generation and verification.
 * Used for authentication throughout the application.
 * 
 * @module utils/jwt
 */

import jwt from 'jsonwebtoken';

/**
 * JWT Payload interface for token generation
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

/**
 * Decoded JWT Token interface
 */
export interface DecodedToken {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

/**
 * Generate a JWT token for a user
 * 
 * @param payload - The payload containing user information
 * @returns The signed JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

/**
 * Verify and decode a JWT token
 * 
 * @param token - The JWT token to verify
 * @returns The decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): DecodedToken => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret) as DecodedToken;
};

/**
 * Decode a JWT token without verification
 * Useful for debugging or extracting information from expired tokens
 * 
 * @param token - The JWT token to decode
 * @returns The decoded token payload or null if invalid
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch {
    return null;
  }
};
