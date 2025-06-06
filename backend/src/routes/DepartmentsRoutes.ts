import { Router } from "express";
import {
    addDepartment,
    deleteDepartment,
    getDepartmentDetails,
    getDepartments,
    getDepartmentWithEmployees,
    updateDepartment
} from "../controllers/DepartmentsController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/getAll", authMiddleware, getDepartments);

router.post("/", authMiddleware, addDepartment);

router.put("/:id", authMiddleware, updateDepartment);

router.delete("/:id", authMiddleware, deleteDepartment);

router.get('/:id', authMiddleware, getDepartmentDetails);

router.get('/:id/employees', authMiddleware, getDepartmentWithEmployees);

export default router;
