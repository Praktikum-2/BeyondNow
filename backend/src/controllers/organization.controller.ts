import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as organizationService from "../services/organization.service";

export const createOrganization = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {   // <-- tu Promise<void>
  try {
    if (!req.firebaseUser) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No user data from token.",
      });
      return;
    }

    const { uid } = req.firebaseUser;
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid or missing organization name.",
      });
      return;
    }

    const newOrg = await organizationService.createOrganization(uid, name);

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: newOrg,
    });
  } catch (error: any) {
    console.error("Error creating organization:", error);

    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Organization already exists for this user.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};
