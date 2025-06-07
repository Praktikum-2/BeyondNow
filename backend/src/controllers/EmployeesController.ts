import { Request, Response } from "express";
import {
  createNewEmployee,
  getAllEmployees,
  getAllEmployeeforGraphDepartment,
  getAllEmployeeforGraphSkills,
} from "../models/EmployeesModels";

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

export const getEmployeeforGraph = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
};

export const getEmployeeforGraphDepartment = async (
  req: Request,
  res: Response
) => {
  try {
    const department_id = req.params.department_id;
    const employees = await getAllEmployeeforGraphDepartment(department_id);
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
};

export const getEmployeeforGraphSkills = async (
  req: Request,
  res: Response
) => {
  try {
    const skillsParam = req.params.skills_id;
    const skillsArray = skillsParam.split(",");
    const employees = await getAllEmployeeforGraphSkills(skillsArray);
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
};
