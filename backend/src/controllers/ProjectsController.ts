import { Request, Response } from "express";
import {
  getAllProjects,
  createNewProject,
  getAllTeamMembers,
} from "../models/ProjectsModels";

//kreiranje projecta
export const createProject = async (req: Request, res: Response) => {
  //da vidim kaki project se bi rad ustvaril
  console.log(req.body);

  const project = await createNewProject(req.body);

  console.log("Creating project:", project);

  res.status(201).json({ message: "Project created successfully: ", project });
};

// pridobivanje projektov
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Error fetching projects" });
  }
};

export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId;

    const teamMembers = await getAllTeamMembers(projectId);
    res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ error: "Error fetching team members" });
  }
};
