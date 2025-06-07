import express from "express";
import * as metricsController from "../controllers/metrics.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// GET /api/metrics - pridobi metrike za prijavljeno uporabnikovo organizacijo
router.get("/", authMiddleware, metricsController.getMetrics);

export default router;
