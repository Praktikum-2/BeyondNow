import { Request, Response } from "express";
import { createNewEmployee, getAllEmployees } from "../models/EmployeesModels";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await createNewEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Error creating employee" });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
};
