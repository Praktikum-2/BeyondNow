import { Router } from "express";
import { getDepartments } from "../controllers/DepartmentsController";
import { authMiddleware } from "../middlewares/auth.middleware"; // Tvoj auth middleware

const router = Router();

router.get("/getAll", authMiddleware, getDepartments);
//router.post("/", addDepartment);

export default router;
