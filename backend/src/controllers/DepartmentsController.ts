import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  createDepartment,
  deleteDepartmentById,
  getAllDepartmentsByOrganization,
  getDepartmentById,
  getDepartmentEmployees,
  getOrganizationByUserUid,
  updateDepartmentById
} from "../models/DepartmentsModels";

export const getDepartmentWithEmployees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get basic department info
    const department = await getDepartmentById(id);
    if (!department) {
      res.status(404).json({ success: false, message: "Department not found" });
      return;
    }

    // Get employees for this department
    const employees = await getDepartmentEmployees(id);

    res.status(200).json({
      success: true,
      data: {
        name: department.name,
        leader: department.Developer_Department_departmentLeader_id_fkToDeveloper || null,
        employees: employees.map(emp => ({
          employee_id: emp.employee_id,
          ime: emp.ime,
          priimek: emp.priimek,
          email: emp.email,
          role: emp.Role.length > 0 ? emp.Role[0].employeeRole : "No role",
          skills: emp.EmployeeSkill.map(es => es.Skills?.skill).filter(Boolean)
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching department with employees:", error);
    res.status(500).json({ success: false, message: "Error fetching department details" });
  }
};

export const getDepartments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.firebaseUser) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { uid } = req.firebaseUser;
    const organization = await getOrganizationByUserUid(uid);
    if (!organization) {
      res.status(404).json({ success: false, message: "Organization not found" });
      return;
    }

    const departments = await getAllDepartmentsByOrganization(organization.organization_id);

    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ success: false, message: "Error fetching departments" });
  }
};


export const getDepartmentDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const department = await getDepartmentById(id);
    if (!department) {
      res.status(404).json({ success: false, message: "Department not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        name: department.name,
        leader: department.Developer_Department_departmentLeader_id_fkToDeveloper || null,
        employees: department.Employee_Employee_department_id_fkToDepartment || [],
      },
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ success: false, message: "Error fetching department" });
  }
};


export const addDepartment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.firebaseUser) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { uid } = req.firebaseUser;
    const { name, leader } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Missing required field: name" });
      return;
    }

    const organization = await getOrganizationByUserUid(uid);
    if (!organization) {
      res.status(404).json({ success: false, message: "Organization not found" });
      return;
    }

    const newDepartment = await createDepartment({
      name: name.trim(),
      organization_id_fk: organization.organization_id,
      departmentLeader_id_fk: leader?.trim() || null,
    });

    res.status(201).json({ success: true, data: newDepartment });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ success: false, message: "Error creating department" });
  }
};

export const updateDepartment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const departmentId = req.params.id;
    const { name, leader } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Missing required field: name" });
      return;
    }

    const updatedDepartment = await updateDepartmentById(departmentId, {
      name: name.trim(),
      departmentLeader_id_fk: leader?.trim() || null,
    });

    res.status(200).json({ success: true, data: updatedDepartment });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ success: false, message: "Error updating department" });
  }
};


export const deleteDepartment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    await deleteDepartmentById(id);

    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ success: false, message: "Error deleting department" });
  }
};
