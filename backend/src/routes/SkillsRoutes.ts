import { Router } from "express";
import { getSkills } from "../controllers/SkillsController";

const SkillsRoutes = Router();

SkillsRoutes.get("/getAll", getSkills);

export { SkillsRoutes };
