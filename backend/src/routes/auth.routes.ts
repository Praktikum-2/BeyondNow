import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { syncFirebaseUser } from "../controllers/auth.controller";
import prisma from "../db";

const router = express.Router();

router.post("/sync", authMiddleware, (req, res, next) => {
  Promise.resolve(syncFirebaseUser(req, res)).catch(next);
});

export default router;
