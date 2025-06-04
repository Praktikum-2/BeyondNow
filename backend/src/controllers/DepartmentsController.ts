import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware"; // Uporabi svoj tip za req
import { createDepartment, getAllDepartmentsByOrganization } from "../models/DepartmentsModels";
import { getOrganizationByUserUid } from "../services/organization.service";

export const getDepartments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Preveri, če je uporabnik avtenticiran
    if (!req.firebaseUser) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { uid } = req.firebaseUser;

    // Pridobi organizacijo uporabnika
    const organization = await getOrganizationByUserUid(uid);

    if (!organization) {
      res.status(404).json({ success: false, message: "Organization not found" });
      return;
    }

    // Pridobi departmente za to organizacijo
    const departments = await getAllDepartmentsByOrganization(organization.organization_id);

    res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching departments"
    });
  }
};

export const addDepartment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Preveri, če je uporabnik avtenticiran
    if (!req.firebaseUser) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { uid } = req.firebaseUser;
    const { name, leader } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Missing required field: name"
      });
      return;
    }

    // Pridobi organizacijo uporabnika
    const organization = await getOrganizationByUserUid(uid);

    if (!organization) {
      res.status(404).json({
        success: false,
        message: "Organization not found"
      });
      return;
    }

    // Ustvari nov department z organization_id_fk iz uporabnikove organizacije
    const newDepartment = await createDepartment({
      name: name.trim(),
      organization_id_fk: organization.organization_id,
      departmentLeader_id_fk: leader?.trim() || null,
    });

    res.status(201).json({
      success: true,
      data: newDepartment
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      success: false,
      message: "Error creating department"
    });
  }
};
