import { Request, Response } from "express";
import { getAllSkills } from "../models/SkillsModels";

export const getSkills = async (req: Request, res: Response) => {
  const skills = await getAllSkills();
  res.status(200).json(skills);
};
