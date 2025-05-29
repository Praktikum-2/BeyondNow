import { Request, Response } from "express";
import { createNewEmployee, getAllEmployees } from "../models/EmployeesModels";

export const createEmployee = (req: Request, res: Response) => {
  const zaposleni = createNewEmployee(req.body);

  console.log("zacetek kreiranje novega zaposlenega: ", req.body);
};

export const getEmployees = (req: Request, res: Response) => {
  try {
    const zaposleni = getAllEmployees();
    res.status(200).json(zaposleni);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Error fetching projects" });
  }
};
