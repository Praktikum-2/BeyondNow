import { Router } from "express";
import {
  createProject,
  getProjects,
  getTeamMembers,
  getProjectManager,
} from "../controllers/ProjectsController";

const projectRoutes = Router();

// kreiranje projekta
projectRoutes.post("/create", createProject);

// pridobivanje projektov
projectRoutes.get("/getAll", getProjects);

projectRoutes.get("/teamMembers/:projectId", getTeamMembers);

projectRoutes.get("/projectManager/:managerId", getProjectManager);

export { projectRoutes };
