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
/*
export const addDepartment: RequestHandler = async (req, res) => {
  try {
    const { name, organization_id_fk, leader } = req.body;

    if (!name || !organization_id_fk) {
      res.status(400).json({ error: "Missing required fields: name or organization_id_fk" });
      return;  // samo return, brez vračanja
    }

    const newDepartment = await createDepartment({
      name,
      organization_id_fk,
      departmentLeader_id_fk: leader || null,
    });

    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ error: "Error creating department" });
  }
};
*/