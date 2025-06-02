import { Request, Response } from "express";
import { getAllDepartments } from "../models/DepartmentsModels";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await getAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Error fetching departments" });
  }
};
