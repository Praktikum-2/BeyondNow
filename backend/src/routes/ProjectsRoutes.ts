import { Router } from "express";
import {
  createProject,
  getProjects,
  getTeamMembers,
} from "../controllers/ProjectsController";

const projectRoutes = Router();

// kreiranje projekta
projectRoutes.post("/create", createProject);

// pridobivanje projektov
projectRoutes.get("/getAll", getProjects);

projectRoutes.get("/teamMembers/:projectId", getTeamMembers);

export { projectRoutes };
