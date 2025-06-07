import { Request, Response } from "express";
import {
  createNewRole,
  getAllRoles,
  getRolesByProject,
  getRolesByEmployee,
  updateRole,
  deleteRole,
} from "../models/role.model";

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await createNewRole(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: "Error creating role" });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Error fetching roles" });
  }
};

export const getRolesByProjectId = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const roles = await getRolesByProject(projectId);
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles by project:", error);
    res.status(500).json({ error: "Error fetching roles by project" });
  }
};

export const getRolesByEmployeeId = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.employeeId;
    const roles = await getRolesByEmployee(employeeId);
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles by employee:", error);
    res.status(500).json({ error: "Error fetching roles by employee" });
  }
};

export const updateRoleById = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.roleId;
    const updatedRole = await updateRole(roleId, req.body);
    res.status(200).json({ success: true, data: updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Error updating role" });
  }
};

export const deleteRoleById = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.roleId;
    await deleteRole(roleId);
    res
      .status(200)
      .json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ error: "Error deleting role" });
  }
};
