import express from "express";
import {
  authMiddleware,
  requireRole,
  requireVerifiedEmail,
} from "../middlewares/auth.middleware";
import { syncFirebaseUser } from "../controllers/auth.controller";

// Extend Express Request interface to include firebaseUser
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: { uid: string; email: string };
    }
  }
}

const router = express.Router();
const authRoutes = () => {
  router.post("/auth/sync", authMiddleware, async (req, res) => {
    const { uid, email } = req.user!;
    if (!uid || !email) {
      res.status(400).json({ error: "User UID or email is missing." });
      return;
    }
    req.firebaseUser = { uid, email };
    await syncFirebaseUser(req, res);
  });
};
export default authRoutes;
