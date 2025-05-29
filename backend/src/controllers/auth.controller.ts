import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as userService from "../services/user.service";

/**
 * Controller to synchronize Firebase user with the local database.
 * Expects `req.firebaseUser` to be populated by `verifyFirebaseToken` middleware.
 */
export const syncFirebaseUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.firebaseUser) {
    // This should ideally be caught by the middleware, but as a safeguard:
    return res
      .status(401)
      .send({ message: "Unauthorized: No user data from token." });
  }

  const { uid, email } = req.firebaseUser;

  if (!uid) {
    return res
      .status(400)
      .send({ message: "Bad Request: UID missing from token." });
  }

  // Email might be undefined if user signed up with phone number, etc.
  // The userService.findOrCreateUserByFirebase handles the check for email presence.

  try {
    const dbUser = await userService.findOrCreateUserByFirebase(uid, email);
    return res
      .status(200)
      .json({ message: "User synchronized successfully", user: dbUser });
  } catch (error: any) {
    console.error("Error syncing Firebase user:", error);
    // Check if it's the specific error from the service for missing email
    if (error.message === "Email is required to create or find a user.") {
      return res.status(400).send({ message: error.message });
    }
    return res
      .status(500)
      .send({ message: "Internal Server Error: Could not sync user." });
  }
};
