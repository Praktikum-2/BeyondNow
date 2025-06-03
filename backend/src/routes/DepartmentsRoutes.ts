import { Router } from "express";
import { getDepartments } from "../controllers/DepartmentsController";

const router = Router();

router.get("/getAll", getDepartments);
//router.post("/", addDepartment);

export default router;
