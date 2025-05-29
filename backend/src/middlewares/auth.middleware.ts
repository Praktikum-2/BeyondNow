import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import "../config/firebaseAdmin";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

/**
 * Firebase Authentication Middleware
 * Verifies the Firebase ID token from the Authorization header
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "No authorization header provided",
        code: "auth/no-token",
      });
      return;
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        error: "No token provided",
        code: "auth/no-token",
      });
      return;
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Add user info to request object
    req.user = decodedToken;

    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);

    // Handle specific Firebase Auth errors
    if (error.code === "auth/id-token-expired") {
      res.status(401).json({
        error: "Token expired",
        code: "auth/token-expired",
      });
      return;
    }

    if (error.code === "auth/id-token-revoked") {
      res.status(401).json({
        error: "Token revoked",
        code: "auth/token-revoked",
      });
      return;
    }

    if (error.code === "auth/invalid-id-token") {
      res.status(401).json({
        error: "Invalid token",
        code: "auth/invalid-token",
      });
      return;
    }

    // Generic auth error
    res.status(401).json({
      error: "Authentication failed",
      code: "auth/invalid-token",
    });
  }
};

/**
 * Optional middleware to check if user has specific claims/roles
 */
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "User not authenticated",
        code: "auth/not-authenticated",
      });
      return;
    }

    const userRoles = req.user.roles || [];

    if (!userRoles.includes(requiredRole)) {
      res.status(403).json({
        error: `Access denied. Required role: ${requiredRole}`,
        code: "auth/insufficient-permissions",
      });
      return;
    }

    next();
  };
};

/**
 * Optional middleware to check if user is verified
 */
export const requireVerifiedEmail = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: "User not authenticated",
      code: "auth/not-authenticated",
    });
    return;
  }

  if (!req.user.email_verified) {
    res.status(403).json({
      error: "Email verification required",
      code: "auth/email-not-verified",
    });
    return;
  }

  next();
};

export interface AuthenticatedRequest extends Request {
  firebaseUser?: {
    uid: string;
    email: string;
    // Add other properties if needed
  };
}

// Example usage in routes:
/*
import express from 'express';
import { authMiddleware, requireRole, requireVerifiedEmail } from './auth.middleware';

const router = express.Router();

// Protected route - requires authentication
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Protected route - requires admin role
router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Protected route - requires verified email
router.post('/sensitive-action', authMiddleware, requireVerifiedEmail, (req, res) => {
  res.json({ message: 'Action completed' });
});
*/
