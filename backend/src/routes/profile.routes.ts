import express from "express";
import * as profileController from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// GET /api/profile - pridobi profil uporabnika
router.get("/", authMiddleware, profileController.getProfile);

// PUT /api/profile - posodobi profil uporabnika
router.put("/", authMiddleware, profileController.updateProfile);

export default router;
