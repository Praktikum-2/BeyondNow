import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as userService from "../services/user.service";

export const syncFirebaseUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user data from token.",
      });
    }

    const { uid, email, name: firebaseName } = req.firebaseUser;
    const { name: requestName } = req.body || {};

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: UID missing from token.",
      });
    }

    const finalName = requestName || firebaseName;
    const result = await userService.findOrCreateUserByFirebase(
      uid,
      email,
      finalName
    );

    const redirectTo = result.hasOrganization ? "/dashboard" : "/startup";

    return res.status(200).json({
      success: true,
      message: "User synchronized successfully",
      data: {
        user: {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.name,
          hasOrganization: result.hasOrganization,
        },
        organization: result.organization,
        redirectTo,
      },
    });
  } catch (error: any) {
    console.error("Error syncing Firebase user:", error);

    if (error.message.includes("Email is required")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes("account with this email already exists")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Could not sync user.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};
