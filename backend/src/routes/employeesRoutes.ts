import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  getEmployeeforGraph,
  getEmployeeforGraphDepartment,
  getEmployeeforGraphSkills,
} from "../controllers/EmployeesController";

const employeeRoutes = Router();

// kreiranje projekta
employeeRoutes.post("/create", createEmployee);

// pridovivanje zaposlenih
employeeRoutes.get("/getAll", getEmployees);

employeeRoutes.get("/getGraph", getEmployeeforGraph);

employeeRoutes.get("/getGraph/:department_id", getEmployeeforGraphDepartment);

employeeRoutes.get("/getGraph/skills/:skills_id", getEmployeeforGraphSkills);

export { employeeRoutes };
