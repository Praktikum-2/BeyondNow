import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface AuthenticatedRequest extends Request {
  firebaseUser?: {
    uid: string;
    email?: string;
    name?: string;
    email_verified?: boolean;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("=== AUTH MIDDLEWARE ===");

  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header present:", !!authHeader);

    if (!authHeader) {
      console.log("❌ No authorization header");
      res.status(401).json({
        error: "No authorization header provided",
        code: "auth/no-token",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("❌ No token in header");
      res.status(401).json({
        error: "No token provided",
        code: "auth/no-token",
      });
      return;
    }

    console.log("🔄 Verifying Firebase token...");
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Token verified. Decoded:", {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      email_verified: decodedToken.email_verified,
    });

    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      email_verified: decodedToken.email_verified,
    };

    next();
  } catch (error: any) {
    console.error("❌ Auth middleware error:", error);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

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

    res.status(401).json({
      error: "Authentication failed",
      code: "auth/invalid-token",
    });
  }
};
