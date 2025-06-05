import { Router } from "express";
import {
    addDepartment,
    deleteDepartment,
    getDepartments,
    updateDepartment,
} from "../controllers/DepartmentsController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/getAll", authMiddleware, getDepartments);

router.post("/", authMiddleware, addDepartment);

router.put("/:id", authMiddleware, updateDepartment);

router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
