import express from "express";
import * as organizationController from "../controllers/organization.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, organizationController.createOrganization);

router.get("/me", authMiddleware, organizationController.getMyOrganization);

export default router;
