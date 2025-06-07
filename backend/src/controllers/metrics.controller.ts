import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as metricsService from "../services/metrics.service";
import * as organizationService from "../services/organization.service";

export const getMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.firebaseUser) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return; // Pomembno: return, da ne gremo naprej
        }

        const { uid } = req.firebaseUser;

        // Pridobi organizacijo uporabnika
        const organization = await organizationService.getOrganizationByUserUid(uid);

        if (!organization) {
            res.status(404).json({ success: false, message: "Organization not found" });
            return;
        }

        // Pridobi metrike za organizacijo
        const metrics = await metricsService.getOrganizationMetrics(organization.organization_id); // popravek na organization_id

        res.status(200).json({
            success: true,
            data: {
                employeesCount: metrics.employeesCount,
                departmentsCount: metrics.departmentsCount,
                projectsCount: metrics.projectsCount,
            },
        });
    } catch (error: any) {
        console.error("Error fetching metrics:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

