import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as profileService from "../services/profile.service";

export const getProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.firebaseUser) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { uid } = req.firebaseUser;
        const userProfile = await profileService.getUserByUid(uid);
        const organization = await profileService.getOrganizationByUserUid(uid);

        if (!userProfile) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                name: userProfile.name,
                email: userProfile.email,
                organizationName: organization?.name ?? null,
            },
        });
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.firebaseUser) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { uid } = req.firebaseUser;
        const { name, organizationName } = req.body;

        // Če ni poslan noben od parametrov, vrni napako
        if (typeof name === "undefined" && typeof organizationName === "undefined") {
            res.status(400).json({ success: false, message: "No data provided for update" });
            return;
        }

        // Če je name podan, mora biti string
        if (typeof name !== "undefined" && typeof name !== "string") {
            res.status(400).json({ success: false, message: "Invalid name format" });
            return;
        }

        // Če je organizationName podan, mora biti string
        if (typeof organizationName !== "undefined" && typeof organizationName !== "string") {
            res.status(400).json({ success: false, message: "Invalid organizationName format" });
            return;
        }

        // Posodobi ime uporabnika, če je podano
        if (typeof name === "string") {
            await profileService.updateUserName(uid, name);
        }

        // Posodobi ime organizacije, če je podano
        if (typeof organizationName === "string") {
            await profileService.updateOrganizationNameByUserUid(uid, organizationName);
        }

        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error: any) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};