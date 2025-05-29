import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as userService from "../services/user.service";

export const syncFirebaseUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("=== SYNC USER ENDPOINT HIT ===");
  console.log("Headers:", req.headers);
  console.log("Firebase User:", req.firebaseUser);

  if (!req.firebaseUser) {
    console.log("❌ No firebaseUser in request");
    return res
      .status(401)
      .json({ message: "Unauthorized: No user data from token." });
  }

  const { uid, email, name } = req.firebaseUser;
  console.log("Extracted data:", { uid, email, name });

  if (!uid) {
    console.log("❌ No UID in firebaseUser");
    return res
      .status(400)
      .json({ message: "Bad Request: UID missing from token." });
  }

  try {
    console.log("🔄 Calling userService.findOrCreateUserByFirebase...");
    const dbUser = await userService.findOrCreateUserByFirebase(
      uid,
      email,
      name
    );
    console.log("✅ User sync successful:", dbUser);

    return res
      .status(200)
      .json({ message: "User synchronized successfully", user: dbUser });
  } catch (error: any) {
    console.error("❌ Error syncing Firebase user:", error);
    console.error("Error stack:", error.stack);

    if (error.message.includes("Email is required")) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Internal Server Error: Could not sync user.",
      error: error.message,
    });
  }
};
