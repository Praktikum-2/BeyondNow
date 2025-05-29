import { Router } from "express";
import {
  getEmployees,
  createEmployee,
} from "../controllers/EmployeesController";

const employeeRoutes = Router();

// kreiranje projekta
employeeRoutes.post("/createNew", createEmployee);

// pridovivanje zaposlenih
employeeRoutes.post("/getAll", getEmployees);
