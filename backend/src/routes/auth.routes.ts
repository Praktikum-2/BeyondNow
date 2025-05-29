import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { syncFirebaseUser } from "../controllers/auth.controller";
import prisma from "../db";

const router = express.Router();

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

router.post("/auth/sync", authMiddleware, (req, res, next) => {
  Promise.resolve(syncFirebaseUser(req, res)).catch(next);
});

export default router;
