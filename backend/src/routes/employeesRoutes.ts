import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  getEmployeeforGraph,
} from "../controllers/EmployeesController";

const employeeRoutes = Router();

// kreiranje projekta
employeeRoutes.post("/create", createEmployee);

// pridovivanje zaposlenih
employeeRoutes.get("/getAll", getEmployees);

employeeRoutes.get("/getGraph", getEmployeeforGraph);

export { employeeRoutes };
