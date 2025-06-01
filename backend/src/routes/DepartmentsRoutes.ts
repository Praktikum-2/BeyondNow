import { Router } from "express";
import { getDepartments } from "../controllers/DepartmentsController";

const router = Router();

router.get("/getAll", getDepartments);

export default router;
