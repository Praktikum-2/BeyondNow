import { UserModel } from "../models/user.model";
import { User, Organization } from "@prisma/client";

type UserWithOrganization = User & {
  organization?: Organization | null;
};

type UserSyncResult = {
  user: UserWithOrganization;
  hasOrganization: boolean;
  organization: Organization | null;
};

export const findOrCreateUserByFirebase = async (
  uid: string,
  email: string | undefined,
  name?: string
): Promise<UserSyncResult> => {
  try {
    let user = await UserModel.findByUid(uid);

    if (user) {
      // Update email if it has changed
      if (email && user.email !== email) {
        console.log("Updating user email...");
        user = await UserModel.updateEmail(uid, email);
        console.log("User email updated");
      }

      // Check organization status
      const hasOrganization = !!user.organization;

      return {
        user,
        hasOrganization,
        organization: user.organization || null,
      };
    }

    // User doesn't exist, create new user
    if (!email) {
      throw new Error(
        "Email is required to create a user account. Please ensure your login method provides an email address."
      );
    }

    user = await UserModel.create({
      uid,
      email,
      name,
    });

    // New users don't have organizations
    return {
      user,
      hasOrganization: false,
      organization: null,
    };
  } catch (error: any) {
    console.error("Error in findOrCreateUserByFirebase:", error);

    if (error.code === "P2002") {
      throw new Error("An account with this email already exists.");
    }

    throw new Error("Could not save user to database: " + error.message);
  }
};
