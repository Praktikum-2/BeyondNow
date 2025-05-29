import { Request, Response } from "express";
import { createNewEmployee, getAllEmployees } from "../models/EmployeesModels";

export const createEmployee = async (req: Request, res: Response) => {
  const zaposleni = await createNewEmployee(req.body);

  console.log("zacetek kreiranje novega zaposlenega: ", req.body);
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const zaposleni = await getAllEmployees();
    res.status(200).json(zaposleni);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Error fetching projects" });
  }
};
