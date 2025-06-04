import { Router } from "express";
import { addDepartment, getDepartments } from "../controllers/DepartmentsController";
import { authMiddleware } from "../middlewares/auth.middleware"; // Tvoj auth middleware

const router = Router();

router.get("/getAll", authMiddleware, getDepartments);
router.post("/", authMiddleware,addDepartment);

export default router;
