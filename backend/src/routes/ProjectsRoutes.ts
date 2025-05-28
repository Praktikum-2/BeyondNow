import { Router } from "express";
import { createProject, getProjects } from "../controllers/ProjectsController";

const projectRoutes = Router();

// kreiranje projekta
projectRoutes.post("/createNew", createProject);

// pridobivanje projektov
projectRoutes.get("/getAll", getProjects);

export { projectRoutes };
