import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { syncFirebaseUser } from "../controllers/auth.controller";
import prisma from "../db"; // Make sure this path is correct

const router = express.Router();

// Test database connection
router.get("/test-db", async (req, res) => {
  try {
    console.log("🔄 Testing database connection...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection successful:", result);
    res.json({ message: "Database connection successful", result });
  } catch (error: any) {
    console.error("❌ Database connection failed:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Sync Firebase user with database
router.post("/auth/sync", authMiddleware, (req, res, next) => {
  Promise.resolve(syncFirebaseUser(req, res)).catch(next);
});

export default router;
