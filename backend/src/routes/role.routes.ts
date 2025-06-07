import { Router } from "express";
import {
  getRoles,
  createRole,
  getRolesByProjectId,
  getRolesByEmployeeId,
  updateRoleById,
  deleteRoleById,
} from "../controllers/role.controller";

const roleRoutes = Router();

// assign employee to project (new role)
roleRoutes.post("/create", createRole);

// get all roles
roleRoutes.get("/getAll", getRoles);

// get roles by project ID
roleRoutes.get("/project/:projectId", getRolesByProjectId);

// get roles by employee ID
roleRoutes.get("/employee/:employeeId", getRolesByEmployeeId);

// update role (change role or allocation)
roleRoutes.put("/update/:roleId", updateRoleById);

// delete role (remove employee from project)
roleRoutes.delete("/delete/:roleId", deleteRoleById);

export { roleRoutes };
